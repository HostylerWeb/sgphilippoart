import type { Locale } from "@/i18n/config";
import { getCmsNlField } from "@/i18n/cms-nl";

export type ContentLocale = "fr" | "nl";

export type ContentTranslations = {
  fr?: Record<string, string>;
  nl?: Record<string, string>;
};

export function parseContentTranslations(value: unknown): ContentTranslations {
  if (!value || typeof value !== "object") return {};
  return value as ContentTranslations;
}

export function getLocaleTranslations(
  entity: { translations?: unknown },
  locale: ContentLocale,
): Record<string, string> {
  return parseContentTranslations(entity.translations)[locale] ?? {};
}

export function getFrenchTranslations(entity: {
  translations?: unknown;
}): Record<string, string> {
  return getLocaleTranslations(entity, "fr");
}

export function getDutchTranslations(entity: {
  translations?: unknown;
}): Record<string, string> {
  return getLocaleTranslations(entity, "nl");
}

export function getLocalizedField(
  entity: { translations?: unknown },
  field: string,
  locale: Locale,
  fallback: string | null | undefined,
  cmsScope?: string,
): string {
  const base = fallback ?? "";
  if (locale === "en") return base;

  const translations = parseContentTranslations(entity.translations);

  if (locale === "fr") {
    const french = translations.fr?.[field]?.trim();
    return french || base;
  }

  const dutchFromDb = translations.nl?.[field]?.trim();
  if (dutchFromDb) return dutchFromDb;

  if (cmsScope) {
    const dutchFromCms = getCmsNlField(cmsScope, field);
    if (dutchFromCms) return dutchFromCms;
  }

  const frenchFallback = translations.fr?.[field]?.trim();
  if (frenchFallback) return frenchFallback;

  return base;
}

function readTranslationFields(
  formData: FormData,
  fields: string[],
  contentLocale: ContentLocale,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const field of fields) {
    const value = String(formData.get(`translation_${contentLocale}_${field}`) ?? "").trim();
    if (value) out[field] = value;
  }
  return out;
}

export function parseContentTranslationsForm(
  formData: FormData,
  fields: string[],
): ContentTranslations | undefined {
  const fr = readTranslationFields(formData, fields, "fr");
  const nl = readTranslationFields(formData, fields, "nl");
  const out: ContentTranslations = {};
  if (Object.keys(fr).length > 0) out.fr = fr;
  if (Object.keys(nl).length > 0) out.nl = nl;
  return Object.keys(out).length > 0 ? out : undefined;
}

/** @deprecated Use parseContentTranslationsForm */
export function parseFrenchTranslationsForm(
  formData: FormData,
  fields: string[],
): ContentTranslations | undefined {
  return parseContentTranslationsForm(formData, fields);
}

export function mergeContentTranslationsFromForm(
  existing: unknown,
  formData: FormData,
  fields: string[],
): ContentTranslations | undefined {
  const incoming = parseContentTranslationsForm(formData, fields);
  if (!incoming) return undefined;

  const prev = parseContentTranslations(existing);
  const merged: ContentTranslations = {
    fr: incoming.fr ?? prev.fr,
    nl: incoming.nl ?? prev.nl,
  };

  if (!merged.fr && !merged.nl) return undefined;
  return merged;
}

export function localizedSettingValue(
  values: Record<string, string | undefined>,
  key: string,
  locale: Locale,
  fallback: string,
): string {
  if (locale === "fr") {
    const french = values[`${key}_fr`]?.trim();
    return french || fallback;
  }
  if (locale === "nl") {
    const dutch = values[`${key}_nl`]?.trim();
    return dutch || fallback;
  }
  return fallback;
}
