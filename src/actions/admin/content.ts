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
import { getSafeImageExtension, validateImageUpload } from "@/lib/upload";
import { categoryFormSchema, heroTileFormSchema } from "@/lib/validations/content";

type ActionState = { error?: string };

const HERO_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "hero");

async function saveHeroImage(formData: FormData) {
  const file = formData.get("image");
  if (!(file instanceof File) || file.size === 0) return null;

  const validationError = validateImageUpload(file);
  if (validationError) {
    throw new Error(validationError);
  }

  await mkdir(HERO_UPLOAD_DIR, { recursive: true });
  const extension = getSafeImageExtension(file.name) ?? ".jpg";
  const filename = `${randomUUID()}${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(HERO_UPLOAD_DIR, filename), buffer);
  return `/uploads/hero/${filename}`;
}

export async function createCategoryAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin("/admin/collections/new");
  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug") || slugify(String(formData.get("name") ?? "")),
    description: formData.get("description") || undefined,
    sort_order: formData.get("sort_order") ?? 0,
    show_on_homepage: formData.get("show_on_homepage") === "on",
    show_in_nav: formData.get("show_in_nav") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid collection data." };
  }

  const existing = await db.categories.findUnique({ where: { slug: parsed.data.slug } });
  if (existing) return { error: "A collection with this slug already exists." };

  const translations = parseFrenchTranslationsForm(
    formData,
    [...TRANSLATION_FIELD_SETS.category],
  );

  const category = await db.categories.create({
    data: {
      ...parsed.data,
      translations: translations === undefined ? Prisma.DbNull : translations,
    },
  });
  revalidatePath("/");
  revalidatePath("/collections");
  redirect(`/admin/collections/${category.id}/edit`);
}

export async function updateCategoryAction(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin(`/admin/collections/${id}/edit`);
  const parsed = categoryFormSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description") || undefined,
    sort_order: formData.get("sort_order") ?? 0,
    show_on_homepage: formData.get("show_on_homepage") === "on",
    show_in_nav: formData.get("show_in_nav") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid collection data." };
  }

  const existing = await db.categories.findFirst({
    where: { slug: parsed.data.slug, NOT: { id } },
  });
  if (existing) return { error: "A collection with this slug already exists." };

  const translations = parseFrenchTranslationsForm(
    formData,
    [...TRANSLATION_FIELD_SETS.category],
  );

  await db.categories.update({
    where: { id },
    data: {
      ...parsed.data,
      translations: translations === undefined ? Prisma.DbNull : translations,
    },
  });
  revalidatePath("/");
  revalidatePath("/collections");
  return {};
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin("/admin/collections");
  await db.categories.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/collections");
  redirect("/admin/collections");
}

export async function createHeroTileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin("/admin/hero-tiles/new");
  const imageUrl = await saveHeroImage(formData);
  if (!imageUrl) return { error: "Hero image is required." };

  const parsed = heroTileFormSchema.safeParse({
    eyebrow: formData.get("eyebrow"),
    title: formData.get("title"),
    link_text: formData.get("link_text"),
    link_url: formData.get("link_url"),
    image_alt: formData.get("image_alt") || undefined,
    sort_order: formData.get("sort_order") ?? 0,
    is_active: formData.get("is_active") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid hero tile data." };
  }

  const translations = parseFrenchTranslationsForm(formData, [...TRANSLATION_FIELD_SETS.hero]);

  const tile = await db.hero_tiles.create({
    data: {
      ...parsed.data,
      image_url: imageUrl,
      translations: translations === undefined ? Prisma.DbNull : translations,
    },
  });
  revalidatePath("/");
  redirect(`/admin/hero-tiles/${tile.id}/edit`);
}

export async function updateHeroTileAction(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin(`/admin/hero-tiles/${id}/edit`);
  const imageUrl = await saveHeroImage(formData);
  const parsed = heroTileFormSchema.safeParse({
    eyebrow: formData.get("eyebrow"),
    title: formData.get("title"),
    link_text: formData.get("link_text"),
    link_url: formData.get("link_url"),
    image_alt: formData.get("image_alt") || undefined,
    sort_order: formData.get("sort_order") ?? 0,
    is_active: formData.get("is_active") === "on",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid hero tile data." };
  }

  const translations = parseFrenchTranslationsForm(formData, [...TRANSLATION_FIELD_SETS.hero]);

  await db.hero_tiles.update({
    where: { id },
    data: {
      ...parsed.data,
      translations: translations === undefined ? Prisma.DbNull : translations,
      ...(imageUrl ? { image_url: imageUrl } : {}),
    },
  });
  revalidatePath("/");
  return {};
}

export async function deleteHeroTileAction(id: string) {
  await requireAdmin("/admin/hero-tiles");
  await db.hero_tiles.delete({ where: { id } });
  revalidatePath("/");
  redirect("/admin/hero-tiles");
}
