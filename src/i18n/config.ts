export const LOCALES = ["en", "fr", "nl"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_COOKIE = "spa_locale";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

/** BCP 47 tag for date/number formatting in admin and storefront. */
export function getIntlLocale(locale: Locale): string {
  switch (locale) {
    case "fr":
      return "fr-FR";
    case "nl":
      return "nl-NL";
    default:
      return "en-US";
  }
}
