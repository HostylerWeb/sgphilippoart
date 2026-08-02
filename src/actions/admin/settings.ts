"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { settingsFormSchema } from "@/lib/validations/settings";

type ActionState = {
  error?: string;
  success?: string;
};

export async function updateSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin("/admin/settings");

  const values = Object.fromEntries(
    settingsFormSchema.keyof().options.map((key) => [key, formData.get(key)]),
  );

  const parsed = settingsFormSchema.safeParse(values);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid settings." };
  }

  await db.$transaction(
    Object.entries(parsed.data).map(([key, value]) =>
      db.site_settings.upsert({
        where: { key },
        create: { key, value: String(value ?? "") },
        update: { value: String(value ?? "") },
      }),
    ),
  );

  revalidatePath("/", "layout");

  return { success: "Settings saved. Changes are live on the storefront." };
}
