import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { db } from "@/lib/db";
import type { AboutPageContent, AboutPageFormValues } from "@/lib/validations/about-page";

export const CMS_ABOUT_SETTING_KEY = "cms_about";

export type AboutPageCopy = AboutPageContent;

function defaultsForLocale(locale: Locale): AboutPageContent {
  return getDictionary(locale).pages.about;
}

export async function getAboutPageContent(locale: Locale): Promise<AboutPageCopy> {
  const defaults = defaultsForLocale(locale);
  const row = await db.site_settings.findUnique({ where: { key: CMS_ABOUT_SETTING_KEY } });
  if (!row?.value) {
    return defaults;
  }

  try {
    const parsed = JSON.parse(row.value) as Partial<AboutPageFormValues>;
    const override =
      locale === "en" || locale === "fr" ? parsed[locale] : undefined;
    if (!override) return defaults;
    return { ...defaults, ...override };
  } catch {
    return defaults;
  }
}

export async function getAboutPageFormValues(): Promise<AboutPageFormValues> {
  const row = await db.site_settings.findUnique({ where: { key: CMS_ABOUT_SETTING_KEY } });
  const enDefault = defaultsForLocale("en");
  const frDefault = defaultsForLocale("fr");

  if (!row?.value) {
    return { en: enDefault, fr: frDefault };
  }

  try {
    const parsed = JSON.parse(row.value) as Partial<AboutPageFormValues>;
    return {
      en: { ...enDefault, ...parsed.en },
      fr: { ...frDefault, ...parsed.fr },
    };
  } catch {
    return { en: enDefault, fr: frDefault };
  }
}
