import type { Locale } from "@/i18n/config";

export type ContentTranslations = {
  fr?: Record<string, string>;
};

export function parseContentTranslations(value: unknown): ContentTranslations {
  if (!value || typeof value !== "object") return {};
  return value as ContentTranslations;
}

export function getFrenchTranslations(entity: {
  translations?: unknown;
}): Record<string, string> {
  return parseContentTranslations(entity.translations).fr ?? {};
}

export function getLocalizedField(
  entity: { translations?: unknown },
  field: string,
  locale: Locale,
  fallback: string | null | undefined,
): string {
  const base = fallback ?? "";
  if (locale !== "fr") return base;

  const translated = getFrenchTranslations(entity)[field];
  return translated?.trim() ? translated : base;
}

export function parseFrenchTranslationsForm(
  formData: FormData,
  fields: string[],
): ContentTranslations | undefined {
  const fr: Record<string, string> = {};

  for (const field of fields) {
    const value = String(formData.get(`translation_fr_${field}`) ?? "").trim();
    if (value) fr[field] = value;
  }

  if (Object.keys(fr).length === 0) return undefined;
  return { fr };
}

export function localizedSettingValue(
  values: Record<string, string | undefined>,
  key: string,
  locale: Locale,
  fallback: string,
): string {
  if (locale !== "fr") return fallback;
  const french = values[`${key}_fr`]?.trim();
  return french || fallback;
}
