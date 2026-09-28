import { getDictionary, getLocale } from "@/i18n";

export async function getAdminLabels() {
  const locale = await getLocale();
  return getDictionary(locale).admin;
}
