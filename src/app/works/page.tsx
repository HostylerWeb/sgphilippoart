import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CollectionFilters } from "@/components/collection/CollectionFilters";
import { Pagination } from "@/components/collection/Pagination";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { PriceRangeSlug } from "@/lib/price-ranges";
import { getProductsForCollection, getWishlistedProductIds } from "@/lib/queries";
import { getStoreSettings } from "@/lib/settings";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "@/i18n";
import styles from "../collections/[slug]/page.module.css";

export const revalidate = 60;

type PageProps = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  return buildPageMetadata({
    title: dict.collections.allWorksTitle,
    description: dict.collections.allWorksDescription,
    path: "/works",
  });
}

export default async function WorksPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.collections;

  const filters = {
    type: query.type as "original" | "print" | undefined,
    price: query.price as PriceRangeSlug | undefined,
    sort: (query.sort as "newest" | "price-asc" | "price-desc") ?? "newest",
    page: query.page ? Number(query.page) : 1,
  };

  const [settings, result, wishlistedIds] = await Promise.all([
    getStoreSettings(locale),
    getProductsForCollection(null, filters, locale),
    getWishlistedProductIds(),
  ]);

  const basePath = "/works";

  return (
    <StorefrontShell>
      <section className={styles.catalog}>
        <div className="wrap">
          <Breadcrumbs
            ariaLabel={dict.aria.breadcrumb}
            items={[
              { label: dict.breadcrumbs.home, href: "/" },
              { label: t.allWorksTitle },
            ]}
          />

          <header className={styles.header}>
            <span className="eyebrow">{t.allWorksEyebrow}</span>
            <h1 className={styles.title}>{t.allWorksTitle}</h1>
            <p className={styles.description}>{t.allWorksDescription}</p>
          </header>

          <div className={styles.layout}>
            <aside>
              <CollectionFilters
                basePath={basePath}
                total={result.total}
                settings={settings}
                labels={dict.filters}
                current={{ type: filters.type, price: filters.price, sort: filters.sort }}
                variant="sidebar"
              />
            </aside>

            <div className={styles.main}>
              <div className={styles.resultsHead}>
                <p className={styles.resultsTitle}>{t.allWorksTitle}</p>
                <p className={styles.resultsCount}>
                  {result.total} {result.total === 1 ? dict.filters.work : dict.filters.works}
                </p>
              </div>

              <ProductGrid
                products={result.products}
                currency={settings}
                wishlistedIds={wishlistedIds}
                soldLabel={dict.product.sold}
                emptyMessage={t.emptyGrid}
                badgeLabels={dict.product}
              />

              <Pagination
                basePath={basePath}
                page={result.page}
                pageCount={result.pageCount}
                searchParams={query}
                labels={dict.filters}
                ariaLabel={dict.aria.pagination}
              />
            </div>
          </div>
        </div>
      </section>
    </StorefrontShell>
  );
}
