import { cookies, headers } from "next/headers";
import {
  LOCALE_COOKIE,
  type Locale,
  isLocale,
  localeFromAcceptLanguage,
} from "@/i18n/config";
import { en, type Dictionary } from "@/i18n/dictionaries/en";
import { fr } from "@/i18n/dictionaries/fr";
import { nl } from "@/i18n/dictionaries/nl";
import { formatMessage } from "@/i18n/format-message";
import { localizeCategoryEntity } from "@/lib/i18n/localize";

export { formatMessage };

const dictionaries = { en, fr, nl };

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  if (value && isLocale(value)) return value;

  const headerStore = await headers();
  return localeFromAcceptLanguage(headerStore.get("accept-language"));
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}

export function translateCategory(
  slug: string,
  name: string,
  locale: Locale,
  translations?: unknown,
): string {
  if (translations) {
    return localizeCategoryEntity({ slug, name, translations }, locale).name;
  }

  const dict = getDictionary(locale);
  const key = slug as keyof typeof dict.categories;
  return dict.categories[key] ?? name;
}
