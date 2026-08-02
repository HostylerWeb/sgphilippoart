"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { parseFrenchTranslationsForm } from "@/lib/i18n/content";
import { TRANSLATION_FIELD_SETS } from "@/lib/i18n/localize";
import { testimonialFormSchema } from "@/lib/validations/testimonial";

type ActionState = { error?: string };

function parseTestimonialForm(formData: FormData) {
  return testimonialFormSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    author_name: formData.get("author_name"),
    author_image_url: formData.get("author_image_url") || "",
    rating: formData.get("rating"),
    sort_order: formData.get("sort_order") ?? 0,
    is_verified: formData.get("is_verified") === "on",
    is_published: formData.get("is_published") === "on",
  });
}

export async function createTestimonialAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin("/admin/testimonials/new");
  const parsed = parseTestimonialForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid review data." };
  }

  const translations = parseFrenchTranslationsForm(
    formData,
    [...TRANSLATION_FIELD_SETS.testimonial],
  );

  const item = await db.testimonials.create({
    data: {
      ...parsed.data,
      author_image_url: parsed.data.author_image_url?.trim() || null,
      translations: translations === undefined ? Prisma.DbNull : translations,
    },
  });
  revalidatePath("/");
  redirect(`/admin/testimonials/${item.id}/edit`);
}

export async function updateTestimonialAction(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin(`/admin/testimonials/${id}/edit`);
  const parsed = parseTestimonialForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid review data." };
  }

  const translations = parseFrenchTranslationsForm(
    formData,
    [...TRANSLATION_FIELD_SETS.testimonial],
  );

  await db.testimonials.update({
    where: { id },
    data: {
      ...parsed.data,
      author_image_url: parsed.data.author_image_url?.trim() || null,
      translations: translations === undefined ? Prisma.DbNull : translations,
    },
  });
  revalidatePath("/");
  return {};
}

export async function deleteTestimonialAction(id: string) {
  await requireAdmin("/admin/testimonials");
  await db.testimonials.delete({ where: { id } });
  revalidatePath("/");
  redirect("/admin/testimonials");
}
