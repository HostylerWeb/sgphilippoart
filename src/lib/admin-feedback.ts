import { getDictionary, getLocale } from "@/i18n";

export async function getAdminFeedback() {
  const locale = await getLocale();
  return getDictionary(locale).admin.feedback;
}
