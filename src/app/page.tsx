import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { ConciergeBanner } from "@/components/home/ConciergeBanner";
import { HomeHero } from "@/components/home/HomeHero";
import { PillsSection } from "@/components/home/PillsSection";
import { ProductSection } from "@/components/home/ProductSection";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustStrip } from "@/components/home/TrustStrip";
import {
  getArtistStoryCategory,
  getHeroTiles,
  getHomepageCategories,
  getNewArrivals,
  getTestimonials,
  getTrustItems,
  getWishlistedProductIds,
} from "@/lib/queries";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";
import {
  localizeCategoryEntity,
  localizeHeroTile,
  localizeTestimonial,
  localizeTrustItem,
} from "@/lib/i18n/localize";
import {
  excerptStoryParagraphs,
  isArtistPortraitHeroTile,
  isArtistStoryCategorySlug,
} from "@/lib/home-artist-spotlight";

export const revalidate = 60;

export default async function HomePage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const [
    settings,
    heroTiles,
    artistCategory,
    categories,
    products,
    trustItems,
    testimonials,
    wishlistedIds,
  ] = await Promise.all([
    getStoreSettings(locale),
    getHeroTiles(),
    getArtistStoryCategory(),
    getHomepageCategories(),
    getNewArrivals(4, locale),
    getTrustItems(),
    getTestimonials(),
    getWishlistedProductIds(),
  ]);

  const localizedHeroTiles = heroTiles.map((tile) => localizeHeroTile(tile, locale));
  const artistHeroTile = heroTiles.find(isArtistPortraitHeroTile);
  const gridTiles = localizedHeroTiles.filter((tile) => {
    const raw = heroTiles.find((row) => row.id === tile.id);
    return raw ? !isArtistPortraitHeroTile(raw) : true;
  });

  const localizedArtistCategory = artistCategory
    ? localizeCategoryEntity(artistCategory, locale)
    : null;
  const artistParagraphs =
    localizedArtistCategory?.description
      ? excerptStoryParagraphs(localizedArtistCategory.description)
      : [];
  const artistSpotlight =
    artistHeroTile && artistParagraphs.length > 0
      ? {
          eyebrow: dict.home.artistSpotlightEyebrow,
          title: dict.meta.siteName,
          paragraphs: artistParagraphs,
          imageUrl: artistHeroTile.image_url,
          imageAlt:
            localizeHeroTile(artistHeroTile, locale).image_alt ??
            artistHeroTile.image_alt ??
            localizedArtistCategory?.name ??
            "Artist portrait",
          ctaLabel: dict.home.artistSpotlightCta,
          ctaHref: "/about",
        }
      : null;

  const categoryPills = categories
    .filter((category) => !isArtistStoryCategorySlug(category.slug))
    .map((category) => ({
      label: localizeCategoryEntity(category, locale).name,
      href: `/collections/${category.slug}`,
    }));

  return (
    <StorefrontShell>
      <HomeHero
        spotlight={artistSpotlight}
        gridTiles={gridTiles}
        gridAriaLabel={dict.aria.featuredCollections}
      />
      {categoryPills.length > 0 && (
        <PillsSection
          eyebrow={dict.home.browseEyebrow}
          title={dict.home.browseTitle}
          items={categoryPills}
        />
      )}
      <ProductSection
        products={products}
        currency={settings}
        wishlistedIds={wishlistedIds}
        labels={dict.home}
        soldLabel={dict.product.sold}
        badgeLabels={dict.product}
      />
      <TrustStrip items={trustItems.map((item) => localizeTrustItem(item, locale))} />
      <Testimonials
        testimonials={testimonials.map((item) => localizeTestimonial(item, locale))}
        labels={dict.home}
      />
      <ConciergeBanner
        eyebrow={settings.conciergeEyebrow}
        title={settings.conciergeTitle}
        body={settings.conciergeBody}
        cta={settings.conciergeCta}
      />
    </StorefrontShell>
  );
}
