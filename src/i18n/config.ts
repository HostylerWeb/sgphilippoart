export const LOCALES = ["en", "fr"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_COOKIE = "spa_locale";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}
