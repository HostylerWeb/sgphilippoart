import {
  getDutchTranslations,
  getEnglishTranslations,
  getFrenchTranslations,
} from "@/lib/i18n/content";

export function hasLegacyFrenchTranslations(
  translations: unknown,
  fields: readonly string[],
): boolean {
  const fr = getFrenchTranslations({ translations });
  return fields.some((field) => Boolean(fr[field]?.trim()));
}

/**
 * Maps DB entity → admin form: primary (FR) fields + EN/NL translation inputs.
 * Supports legacy rows where English lived in main columns and French in `translations.fr`.
 */
export function resolveAdminEntityFields(
  entity: Record<string, unknown> & { translations?: unknown },
  translatableFields: readonly string[],
): {
  primary: Record<string, string>;
  en: Record<string, string>;
  nl: Record<string, string>;
} {
  const legacyFr = hasLegacyFrenchTranslations(
    entity.translations,
    translatableFields,
  );
  const frStored = getFrenchTranslations(entity);
  const enStored = getEnglishTranslations(entity);
  const nlStored = getDutchTranslations(entity);

  const primary: Record<string, string> = {};
  const en: Record<string, string> = {};
  const nl: Record<string, string> = {};

  for (const field of translatableFields) {
    const mainVal = String(entity[field] ?? "").trim();
    const frVal = frStored[field]?.trim() ?? "";
    const enVal = enStored[field]?.trim() ?? "";
    const nlVal = nlStored[field]?.trim() ?? "";

    if (legacyFr && frVal) {
      primary[field] = frVal;
      if (enVal) en[field] = enVal;
      else if (mainVal) en[field] = mainVal;
    } else {
      primary[field] = mainVal;
      if (enVal) en[field] = enVal;
    }

    if (nlVal) nl[field] = nlVal;
  }

  return { primary, en, nl };
}
