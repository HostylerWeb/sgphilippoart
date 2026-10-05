import type { Metadata } from "next";
import { AboutArtistPage } from "@/components/about/AboutArtistPage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getArtistPortrait } from "@/lib/artist-portrait";
import { getAboutPageContent } from "@/lib/cms/about-page";
import { parseStoryParagraphs } from "@/lib/home-artist-spotlight";
import { localizeCategoryEntity } from "@/lib/i18n/localize";
import {
  getArtistStoryCategory,
  getRandomAvailableProducts,
  getWishlistedProductIds,
} from "@/lib/queries";
import { buildPageMetadata } from "@/lib/seo";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getAboutPageContent(locale);
  return buildPageMetadata({
    title: `${t.title} — SG Philippo Art`,
    description: t.description,
    path: "/about",
  });
}

export default async function AboutPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const [copy, portrait, artistCategory, settings, sampleWorks, wishlistedIds] =
    await Promise.all([
      getAboutPageContent(locale),
      getArtistPortrait(),
      getArtistStoryCategory(),
      getStoreSettings(locale),
      getRandomAvailableProducts(4, locale),
      getWishlistedProductIds(),
    ]);

  const localizedArtist = artistCategory
    ? localizeCategoryEntity(artistCategory, locale)
    : null;

  const storyParagraphs =
    localizedArtist?.description?.trim()
      ? parseStoryParagraphs(localizedArtist.description)
      : [copy.p1, copy.p2].filter(Boolean);

  return (
    <StorefrontShell>
      <AboutArtistPage
        copy={copy}
        portrait={portrait}
        storyParagraphs={storyParagraphs}
        storyTitle={localizedArtist?.name}
        commissionEnabled={settings.commissionEnabled}
        sampleWorks={sampleWorks}
        currency={settings}
        wishlistedIds={wishlistedIds}
        worksEyebrow={dict.pages.about.worksEyebrow}
        worksTitle={dict.pages.about.worksTitle}
        viewAllWorks={dict.home.viewAllWorks}
        soldLabel={dict.product.sold}
        badgeLabels={dict.product}
      />
    </StorefrontShell>
  );
}
