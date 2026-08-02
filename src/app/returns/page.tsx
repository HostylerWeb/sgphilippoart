import type { Metadata } from "next";
import { LegalPageView } from "@/components/legal/LegalPageView";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getLegalPage } from "@/i18n/legal";
import { getLocale } from "@/i18n";
import { buildLegalPageVars } from "@/lib/legal-vars";
import { buildPageMetadata } from "@/lib/seo";
import { getStoreSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const settings = await getStoreSettings(locale);
  const content = getLegalPage("returns", locale, buildLegalPageVars(settings));

  return buildPageMetadata({
    title: `${content.title} — ${settings.siteName}`,
    description: content.description,
    path: "/returns",
  });
}

export default async function ReturnsPage() {
  const locale = await getLocale();
  const settings = await getStoreSettings(locale);
  const content = getLegalPage("returns", locale, buildLegalPageVars(settings));

  return (
    <StorefrontShell>
      <LegalPageView content={content} slug="returns" />
    </StorefrontShell>
  );
}
