"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { Prisma } from "@/generated/prisma/client";
import { parseFrenchTranslationsForm } from "@/lib/i18n/content";
import { TRANSLATION_FIELD_SETS } from "@/lib/i18n/localize";
import { trustItemFormSchema } from "@/lib/validations/trust-item";

type ActionState = { error?: string };

function parseTrustItemForm(formData: FormData) {
  return trustItemFormSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    icon: formData.get("icon"),
    sort_order: formData.get("sort_order") ?? 0,
    is_active: formData.get("is_active") === "on",
  });
}

export async function createTrustItemAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin("/admin/trust-items/new");
  const parsed = parseTrustItemForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid trust item data." };
  }

  const translations = parseFrenchTranslationsForm(
    formData,
    [...TRANSLATION_FIELD_SETS.trust],
  );

  const item = await db.trust_items.create({
    data: {
      ...parsed.data,
      translations: translations === undefined ? Prisma.DbNull : translations,
    },
  });
  revalidatePath("/");
  redirect(`/admin/trust-items/${item.id}/edit`);
}

export async function updateTrustItemAction(
  id: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin(`/admin/trust-items/${id}/edit`);
  const parsed = parseTrustItemForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid trust item data." };
  }

  const translations = parseFrenchTranslationsForm(
    formData,
    [...TRANSLATION_FIELD_SETS.trust],
  );

  await db.trust_items.update({
    where: { id },
    data: {
      ...parsed.data,
      translations: translations === undefined ? Prisma.DbNull : translations,
    },
  });
  revalidatePath("/");
  return {};
}

export async function deleteTrustItemAction(id: string) {
  await requireAdmin("/admin/trust-items");
  await db.trust_items.delete({ where: { id } });
  revalidatePath("/");
  redirect("/admin/trust-items");
}
