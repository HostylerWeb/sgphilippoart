import type { Locale } from "@/i18n/config";
import { cookies } from "@/i18n/legal/cookies";
import { legalNotice } from "@/i18n/legal/legal-notice";
import { privacy } from "@/i18n/legal/privacy";
import { resolveLegalPage } from "@/i18n/legal/resolve";
import { returns } from "@/i18n/legal/returns";
import { shipping } from "@/i18n/legal/shipping";
import { terms } from "@/i18n/legal/terms";
import type {
  LegalPageContent,
  LegalPageSlug,
  LegalPageVars,
  LocalizedLegalPage,
} from "@/i18n/legal/types";

function pickLegalPage(page: LocalizedLegalPage, locale: Locale): LegalPageContent {
  if (locale === "nl" && page.nl) return page.nl;
  if (locale === "fr") return page.fr;
  return page.en;
}

const PAGES = {
  privacy,
  terms,
  cookies,
  shipping,
  returns,
  legalNotice,
} as const;

export function getLegalPage(
  slug: LegalPageSlug,
  locale: Locale,
  vars: LegalPageVars,
  options?: { excludeSectionIds?: string[] },
): LegalPageContent {
  const raw = pickLegalPage(PAGES[slug], locale);
  const resolved = resolveLegalPage(raw, vars);

  if (!options?.excludeSectionIds?.length) {
    return resolved;
  }

  return {
    ...resolved,
    sections: resolved.sections.filter(
      (section) => !section.id || !options.excludeSectionIds?.includes(section.id),
    ),
  };
}

export const LEGAL_PAGE_PATHS: Record<LegalPageSlug, string> = {
  privacy: "/privacy",
  terms: "/terms",
  cookies: "/cookies",
  shipping: "/shipping",
  returns: "/returns",
  legalNotice: "/legal",
};
