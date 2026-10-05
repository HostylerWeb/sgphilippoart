import type { Locale } from "@/i18n/config";

/** PayPal JS SDK locale (`en_US`, `fr_FR`, …). */
export function getPayPalSdkLocale(locale: Locale): string {
  switch (locale) {
    case "fr":
      return "fr_FR";
    case "nl":
      return "nl_NL";
    default:
      return "en_US";
  }
}
