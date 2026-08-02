"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/i18n";
import { accountSettingsSchemaForLocale } from "@/lib/validations/profile";

type ActionState = {
  error?: string;
  success?: string;
  name?: string;
};

export async function updateAccountSettingsAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = await getLocale();
  const m = getDictionary(locale).validation;
  const session = await auth();
  if (!session?.user?.id) {
    return { error: m.mustSignIn };
  }

  const parsed = accountSettingsSchemaForLocale(locale).safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    addressLine1: formData.get("addressLine1"),
    addressLine2: formData.get("addressLine2") || undefined,
    city: formData.get("city"),
    state: formData.get("state") || undefined,
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? m.invalidDetails };
  }

  const data = parsed.data;

  await db.users.update({
    where: { id: session.user.id },
    data: {
      name: data.name.trim(),
      phone: data.phone.trim(),
      shipping_address: {
        line1: data.addressLine1.trim(),
        line2: data.addressLine2?.trim() || null,
        city: data.city.trim(),
        state: data.state?.trim() || null,
        postal_code: data.postalCode.trim(),
        country: data.country.trim(),
      },
    },
  });

  revalidatePath("/account", "layout");

  return {
    success: m.profileSaved,
    name: data.name.trim(),
  };
}
