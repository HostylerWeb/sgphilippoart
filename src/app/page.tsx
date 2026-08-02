import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { ConciergeBanner } from "@/components/home/ConciergeBanner";
import { HeroGrid } from "@/components/home/HeroGrid";
import { PillsSection } from "@/components/home/PillsSection";
import { ProductSection } from "@/components/home/ProductSection";
import { Testimonials } from "@/components/home/Testimonials";
import { TrustStrip } from "@/components/home/TrustStrip";
import {
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

export const revalidate = 60;

export default async function HomePage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const [settings, heroTiles, categories, products, trustItems, testimonials, wishlistedIds] =
    await Promise.all([
      getStoreSettings(locale),
      getHeroTiles(),
      getHomepageCategories(),
      getNewArrivals(4, locale),
      getTrustItems(),
      getTestimonials(),
      getWishlistedProductIds(),
    ]);

  const categoryPills = categories.map((category) => ({
    label: localizeCategoryEntity(category, locale).name,
    href: `/collections/${category.slug}`,
  }));

  return (
    <StorefrontShell>
      <HeroGrid tiles={heroTiles.map((tile) => localizeHeroTile(tile, locale))} />
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
