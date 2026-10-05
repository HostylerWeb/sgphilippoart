export const LOCALES = ["en", "fr", "nl"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALE_COOKIE = "spa_locale";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

/** Map an Accept-Language header to a supported locale. Unknown languages use the site default. */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return DEFAULT_LOCALE;

  const ranked = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const q = qParam ? Number(qParam.trim().slice(2)) : 1;
      return { tag: tag.toLowerCase(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((entry) => entry.tag)
    .sort((a, b) => b.q - a.q);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (base === "fr" || base === "nl" || base === "en") return base;
  }

  return DEFAULT_LOCALE;
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
