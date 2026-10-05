import type { Locale } from "@/i18n/config";

/** Locale for the `<apple-pay-button>` web component. */
export function getApplePayButtonLocale(locale: Locale): string {
  switch (locale) {
    case "fr":
      return "fr-FR";
    case "nl":
      return "nl-NL";
    default:
      return "en-US";
  }
}
