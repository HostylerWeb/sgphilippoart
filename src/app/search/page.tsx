import Link from "next/link";
import type { Metadata } from "next";
import { CatalogPageShell } from "@/components/layout/CatalogPageShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { ProductGrid } from "@/components/product/ProductGrid";
import { searchProducts, getWishlistedProductIds } from "@/lib/queries";
import { getStoreSettings } from "@/lib/settings";
import { formatMessage, getDictionary, getLocale } from "@/i18n";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.collections;
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return buildPageMetadata({
    title: query
      ? `${formatMessage(t.searchTitleQuery, { query })} — SG Philippo Art`
      : `${t.searchTitle} — SG Philippo Art`,
    description: query ? undefined : t.searchEmpty,
    path: "/search",
    noIndex: true,
  });
}

export default async function SearchPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.collections;
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const [settings, searchResult, wishlistedIds] = await Promise.all([
    getStoreSettings(locale),
    searchProducts(query, locale),
    getWishlistedProductIds(),
  ]);

  const products = searchResult.products;

  const description = query
    ? searchResult.total === 1
      ? formatMessage(t.searchCount, { count: searchResult.total })
      : formatMessage(t.searchCountPlural, { count: searchResult.total })
    : t.searchEmpty;

  return (
    <StorefrontShell>
      <CatalogPageShell
        eyebrow={t.searchEyebrow}
        title={query ? formatMessage(t.searchTitleQuery, { query }) : t.searchTitle}
        description={description}
      >
        {!query ? (
          <div className={styles.empty}>
            <p>{t.searchHint}</p>
            <div className={styles.links}>
              <Link href="/collections" className={styles.primary}>
                {t.browseCollections}
              </Link>
              <Link href="/collections/new-arrivals" className={styles.secondary}>
                {t.browseNewArrivals}
              </Link>
            </div>
          </div>
        ) : (
          <ProductGrid
            products={products}
            currency={settings}
            wishlistedIds={wishlistedIds}
            emptyMessage={formatMessage(t.searchNoResults, { query })}
            soldLabel={dict.product.sold}
          />
        )}
      </CatalogPageShell>
    </StorefrontShell>
  );
}
