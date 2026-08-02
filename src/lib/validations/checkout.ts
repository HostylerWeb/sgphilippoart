import { getCountryName, type LocaleKey } from "@/lib/european-countries";
import { checkoutSchema } from "@/lib/validations/messages";
import type { z } from "zod";
import { getDictionary } from "@/i18n";

export type CheckoutValues = z.infer<ReturnType<typeof checkoutSchema>>;

export function parseCheckoutInput(
  input: unknown,
  locale: LocaleKey,
):
  | { success: true; data: CheckoutValues & { country: string } }
  | { success: false; message: string } {
  const parsed = checkoutSchema(locale).safeParse(input);
  if (!parsed.success) {
    const v = getDictionary(locale).validation;
    const message = parsed.error.issues[0]?.message ?? v.checkoutInvalid;
    return { success: false, message };
  }

  return {
    success: true,
    data: {
      ...parsed.data,
      country: getCountryName(parsed.data.countryCode, locale),
    },
  };
}
