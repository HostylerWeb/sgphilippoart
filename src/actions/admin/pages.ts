"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { CMS_ABOUT_SETTING_KEY } from "@/lib/cms/about-page";
import { db } from "@/lib/db";
import { aboutPageFormSchema } from "@/lib/validations/about-page";

type ActionState = {
  error?: string;
  success?: string;
};

function parseAboutForm(formData: FormData) {
  const locales = ["en", "fr"] as const;
  const fields = aboutPageFormSchema.shape.en.keyof().options;

  const values = Object.fromEntries(
    locales.map((locale) => [
      locale,
      Object.fromEntries(fields.map((field) => [field, formData.get(`${locale}_${field}`)])),
    ]),
  );

  return aboutPageFormSchema.safeParse(values);
}

export async function updateAboutPageAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin("/admin/pages/about");

  const parsed = parseAboutForm(formData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid page content." };
  }

  await db.site_settings.upsert({
    where: { key: CMS_ABOUT_SETTING_KEY },
    create: { key: CMS_ABOUT_SETTING_KEY, value: JSON.stringify(parsed.data) },
    update: { value: JSON.stringify(parsed.data) },
  });

  revalidatePath("/about");
  revalidatePath("/admin/pages/about");

  return { success: "About page saved." };
}
