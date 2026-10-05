import { resolveAdminEntityFields } from "@/lib/i18n/admin-content";
import { TRANSLATION_FIELD_SETS } from "@/lib/i18n/localize";

type FieldSetKey = keyof typeof TRANSLATION_FIELD_SETS;

export function adminEntityTranslationProps<T extends Record<string, unknown>>(
  entity: T,
  fieldSet: FieldSetKey,
): {
  entity: T;
  translationValuesEn: Record<string, string>;
  translationValuesNl: Record<string, string>;
} {
  const fields = TRANSLATION_FIELD_SETS[fieldSet];
  const { primary, en, nl } = resolveAdminEntityFields(entity, fields);
  const merged = { ...entity, ...primary } as T;
  return {
    entity: merged,
    translationValuesEn: en,
    translationValuesNl: nl,
  };
}
