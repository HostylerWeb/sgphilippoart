"use server";

import path from "node:path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminFeedback } from "@/lib/admin-feedback";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { slugify } from "@/lib/slug";
import { Prisma } from "@/generated/prisma/client";
import { parseFrenchTranslationsForm } from "@/lib/i18n/content";
import { TRANSLATION_FIELD_SETS } from "@/lib/i18n/localize";
import { saveUploadedImageFile, saveUploadedVideoFile } from "@/lib/media-storage";
import {
  ADMIN_PRODUCT_NOTICES,
  adminProductsListUrl,
} from "@/lib/admin-product-notices";
import { productFormSchema } from "@/lib/validations/product";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "products");
const VIDEO_UPLOAD_DIR = path.join(UPLOAD_DIR, "videos");

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

function getFile(formData: FormData, name: string): File | null {
  const value = formData.get(name);
  if (value instanceof File && value.size > 0) return value;
  return null;
}

function getFiles(formData: FormData, name: string): File[] {
  return formData
    .getAll(name)
    .filter((item): item is File => item instanceof File && item.size > 0);
}

async function saveImageFile(file: File): Promise<{ url: string } | { error: string }> {
  return saveUploadedImageFile(file, UPLOAD_DIR, "/uploads/products");
}

async function saveVideoFile(file: File): Promise<{ url: string } | { error: string }> {
  return saveUploadedVideoFile(file, VIDEO_UPLOAD_DIR, "/uploads/products/videos");
}

function parseVideoUrlField(formData: FormData): string | null {
  const raw = String(formData.get("video_url") ?? "").trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

type MediaUploadSuccess = {
  mainUrl: string | null;
  galleryUrls: string[];
  videoUrl: string | null | undefined;
  removeVideo: boolean;
};

async function processProductMedia(
  formData: FormData,
): Promise<MediaUploadSuccess | { error: string }> {
  const removeVideo = formData.get("remove_video") === "on";
  const mainFile = getFile(formData, "main_image");
  const galleryFiles = getFiles(formData, "gallery_images");
  const videoFile = getFile(formData, "video");
  const videoUrlField = parseVideoUrlField(formData);

  let mainUrl: string | null = null;
  if (mainFile) {
    const saved = await saveImageFile(mainFile);
    if ("error" in saved) return { error: saved.error };
    mainUrl = saved.url;
  }

  const galleryUrls: string[] = [];
  for (const file of galleryFiles) {
    const saved = await saveImageFile(file);
    if ("error" in saved) return { error: saved.error };
    galleryUrls.push(saved.url);
  }

  let videoUrl: string | null | undefined = undefined;
  if (removeVideo) {
    videoUrl = null;
  } else if (videoFile) {
    const saved = await saveVideoFile(videoFile);
    if ("error" in saved) return { error: saved.error };
    videoUrl = saved.url;
  } else if (videoUrlField) {
    videoUrl = videoUrlField;
  }

  return { mainUrl, galleryUrls, videoUrl, removeVideo };
}

export async function createProductAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin("/admin/products/new");
  const feedback = await getAdminFeedback();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? feedback.productInvalid };
  }

  const data = parsed.data;
  const existing = await db.products.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { error: feedback.productSlugExists };
  }

  const mediaResult = await processProductMedia(formData);
  if ("error" in mediaResult) {
    return { error: mediaResult.error };
  }
  const media = mediaResult;

  const translations = parseFrenchTranslationsForm(
    formData,
    [...TRANSLATION_FIELD_SETS.product],
  );

  const imagesToCreate: Array<{
    url: string;
    alt_text: string;
    sort_order: number;
    is_primary: boolean;
  }> = [];

  if (media.mainUrl) {
    imagesToCreate.push({
      url: media.mainUrl,
      alt_text: data.title,
      sort_order: 0,
      is_primary: true,
    });
  }

  media.galleryUrls.forEach((url, index) => {
    imagesToCreate.push({
      url,
      alt_text: data.title,
      sort_order: imagesToCreate.length + index,
      is_primary: imagesToCreate.length === 0 && index === 0,
    });
  });

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
      video_url: media.videoUrl ?? null,
      translations: translations === undefined ? Prisma.DbNull : translations,
      images: {
        create: imagesToCreate,
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath(`/products/${product.slug}`);
  redirect(adminProductsListUrl(ADMIN_PRODUCT_NOTICES.created));
}

export async function updateProductAction(
  productId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin(`/admin/products/${productId}/edit`);
  const feedback = await getAdminFeedback();
  const parsed = parseProductForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? feedback.productInvalid };
  }

  const data = parsed.data;
  const existing = await db.products.findFirst({
    where: { slug: data.slug, NOT: { id: productId } },
  });
  if (existing) {
    return { error: feedback.productSlugExists };
  }

  const mediaResult = await processProductMedia(formData);
  if ("error" in mediaResult) {
    return { error: mediaResult.error };
  }
  const media = mediaResult;

  const translations = parseFrenchTranslationsForm(
    formData,
    [...TRANSLATION_FIELD_SETS.product],
  );
  const current = await db.products.findUnique({
    where: { id: productId },
    include: { images: { orderBy: { sort_order: "asc" } } },
  });
  if (!current) {
    return { error: feedback.productNotFound };
  }

  await db.$transaction(async (tx) => {
    const productUpdate: Prisma.productsUpdateInput = {
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
      category: data.category_id
        ? { connect: { id: data.category_id } }
        : { disconnect: true },
      is_featured: Boolean(data.is_featured),
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      translations: translations === undefined ? Prisma.DbNull : translations,
    };

    if (media.videoUrl !== undefined) {
      productUpdate.video_url = media.videoUrl;
    }

    await tx.products.update({
      where: { id: productId },
      data: productUpdate,
    });

    if (media.mainUrl) {
      await tx.product_images.updateMany({
        where: { product_id: productId },
        data: { is_primary: false },
      });
      await tx.product_images.create({
        data: {
          product_id: productId,
          url: media.mainUrl,
          alt_text: data.title,
          sort_order: 0,
          is_primary: true,
        },
      });
    }

    if (media.galleryUrls.length > 0) {
      const startOrder =
        current.images.length > 0
          ? Math.max(...current.images.map((image) => image.sort_order)) + 1
          : media.mainUrl
            ? 1
            : 0;
      await tx.product_images.createMany({
        data: media.galleryUrls.map((url, index) => ({
          product_id: productId,
          url,
          alt_text: data.title,
          sort_order: startOrder + index,
          is_primary: current.images.length === 0 && !media.mainUrl && index === 0,
        })),
      });
    }
  });

  revalidatePath("/");
  revalidatePath("/collections");
  revalidatePath(`/products/${data.slug}`);
  redirect(adminProductsListUrl(ADMIN_PRODUCT_NOTICES.updated));
}

export async function deleteProductAction(productId: string) {
  await requireAdmin("/admin/products");
  const product = await db.products.findUnique({ where: { id: productId } });
  if (!product) return;

  await db.products.delete({ where: { id: productId } });
  revalidatePath("/");
  revalidatePath("/collections");
  redirect(adminProductsListUrl(ADMIN_PRODUCT_NOTICES.deleted));
}
