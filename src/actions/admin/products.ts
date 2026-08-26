"use server";

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { Prisma } from "@/generated/prisma/client";
import { parseFrenchTranslationsForm } from "@/lib/i18n/content";
import { TRANSLATION_FIELD_SETS } from "@/lib/i18n/localize";
import { prepareUploadJpeg } from "@/lib/upload";
import { productFormSchema } from "@/lib/validations/product";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");

type ActionState = {
  error?: string;
};

function optionalNumber(value: number | "" | undefined): number | null {
  if (value === "" || value === undefined) return null;
  return value;
}

function parseProductForm(formData: FormData) {
  const editionSize = formData.get("edition_size");
  const stockQuantity = formData.get("stock_quantity");

  return productFormSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || slugify(String(formData.get("title") ?? "")),
    description: formData.get("description") || undefined,
    price: formData.get("price"),
    product_type: formData.get("product_type"),
    status: formData.get("status"),
    medium: formData.get("medium") || undefined,
    dimensions: formData.get("dimensions") || undefined,
    edition_size: editionSize === "" || editionSize === null ? undefined : editionSize,
    stock_quantity: stockQuantity === "" || stockQuantity === null ? undefined : stockQuantity,
    category_id: formData.get("category_id") || undefined,
    is_featured: formData.get("is_featured") === "on",
    meta_title: formData.get("meta_title") || undefined,
    meta_description: formData.get("meta_description") || undefined,
  });
}

async function saveUploadedImages(
  formData: FormData,
): Promise<{ urls: string[] } | { error: string }> {
  const files = formData.getAll("images").filter((item): item is File => item instanceof File && item.size > 0);
  if (files.length === 0) return { urls: [] };

  await mkdir(UPLOAD_DIR, { recursive: true });

  const urls: string[] = [];
  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const prepared = await prepareUploadJpeg(buffer, file.name, file.type);
    if (!prepared.ok) {
      return { error: prepared.error };
    }

    const filename = `${randomUUID()}.jpg`;
    await writeFile(path.join(UPLOAD_DIR, filename), prepared.jpeg);
    urls.push(`/uploads/products/${filename}`);
  }

  return { urls };
}

export async function createProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin("/admin/products/new");
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product data." };
  }

  const data = parsed.data;
  const existing = await db.products.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { error: "A product with this slug already exists." };
  }

  const uploadResult = await saveUploadedImages(formData);
  if ("error" in uploadResult) {
    return { error: uploadResult.error };
  }

  const translations = parseFrenchTranslationsForm(
    formData,
    [...TRANSLATION_FIELD_SETS.product],
  );

  const product = await db.products.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description,
      price: data.price,
      product_type: data.product_type,
      status: data.status,
      medium: data.medium,
      dimensions: data.dimensions,
      edition_size: data.product_type === "print" ? optionalNumber(data.edition_size) : null,
      stock_quantity: data.product_type === "print" ? optionalNumber(data.stock_quantity) ?? 0 : null,
      category_id: data.category_id || null,
      is_featured: Boolean(data.is_featured),
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      translations: translations === undefined ? Prisma.DbNull : translations,
      images: {
        create: uploadResult.urls.map((url, index) => ({
          url,
          alt_text: data.title,
          sort_order: index,
          is_primary: index === 0,
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath(`/products/${product.slug}`);
  redirect(`/admin/products/${product.id}/edit`);
}

export async function updateProductAction(
  productId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin(`/admin/products/${productId}/edit`);
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid product data." };
  }

  const data = parsed.data;
  const existing = await db.products.findFirst({
    where: { slug: data.slug, NOT: { id: productId } },
  });
  if (existing) {
    return { error: "A product with this slug already exists." };
  }

  const uploadResult = await saveUploadedImages(formData);
  if ("error" in uploadResult) {
    return { error: uploadResult.error };
  }

  const translations = parseFrenchTranslationsForm(
    formData,
    [...TRANSLATION_FIELD_SETS.product],
  );
  const current = await db.products.findUnique({
    where: { id: productId },
    include: { images: { orderBy: { sort_order: "asc" } } },
  });
  if (!current) {
    return { error: "Product not found." };
  }

  await db.$transaction(async (tx) => {
    await tx.products.update({
      where: { id: productId },
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        price: data.price,
        product_type: data.product_type,
        status: data.status,
        medium: data.medium,
        dimensions: data.dimensions,
        edition_size: data.product_type === "print" ? optionalNumber(data.edition_size) : null,
        stock_quantity: data.product_type === "print" ? optionalNumber(data.stock_quantity) ?? 0 : null,
        category_id: data.category_id || null,
        is_featured: Boolean(data.is_featured),
        meta_title: data.meta_title,
        meta_description: data.meta_description,
        translations: translations === undefined ? Prisma.DbNull : translations,
      },
    });

    if (uploadResult.urls.length > 0) {
      const startOrder = current.images.length;
      await tx.product_images.createMany({
        data: uploadResult.urls.map((url, index) => ({
          product_id: productId,
          url,
          alt_text: data.title,
          sort_order: startOrder + index,
          is_primary: current.images.length === 0 && index === 0,
        })),
      });
    }
  });

  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath(`/products/${data.slug}`);
  return {};
}

export async function deleteProductAction(productId: string) {
  await requireAdmin("/admin/products");
  const product = await db.products.findUnique({ where: { id: productId } });
  if (!product) return;

  await db.products.delete({ where: { id: productId } });
  revalidatePath("/");
  revalidatePath("/collections");
  redirect("/admin/products");
}
