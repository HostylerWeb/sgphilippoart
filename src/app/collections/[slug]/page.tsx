import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CollectionFilters } from "@/components/collection/CollectionFilters";
import { Pagination } from "@/components/collection/Pagination";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { PriceRangeSlug } from "@/lib/price-ranges";
import {
  getCategoryBySlug,
  getProductsForCollection,
  getWishlistedProductIds,
} from "@/lib/queries";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";
import { localizeCategoryEntity } from "@/lib/i18n/localize";
import styles from "./page.module.css";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Collection not found" };

  return {
    title: `${category.name} — SG Philippo Art`,
    description:
      category.description ??
      `Browse ${category.name} from SG Philippo Art — original paintings and fine art prints.`,
  };
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const category = await getCategoryBySlug(slug);

  if (!category) notFound();

  const locale = await getLocale();
  const dict = getDictionary(locale);

  const filters = {
    type: query.type as "original" | "print" | undefined,
    price: query.price as PriceRangeSlug | undefined,
    sort: (query.sort as "newest" | "price-asc" | "price-desc") ?? "newest",
    page: query.page ? Number(query.page) : 1,
  };

  const [settings, result, wishlistedIds] = await Promise.all([
    getStoreSettings(locale),
    getProductsForCollection(slug, filters, locale),
    getWishlistedProductIds(),
  ]);

  const basePath = `/collections/${slug}`;
  const localizedCategory = localizeCategoryEntity(category, locale);
  const categoryName = localizedCategory.name;

  return (
    <StorefrontShell activeSlug={slug}>
      <section className={styles.catalog}>
        <div className="wrap">
          <Breadcrumbs
            items={[
              { label: dict.breadcrumbs.home, href: "/" },
              { label: dict.breadcrumbs.collections, href: "/collections" },
              { label: categoryName },
            ]}
          />

          <header className={styles.header}>
            <span className="eyebrow">{dict.collections.collectionEyebrow}</span>
            <h1 className={styles.title}>{categoryName}</h1>
            {(localizedCategory.description ?? category.description) && (
              <p className={styles.description}>
                {localizedCategory.description ?? category.description}
              </p>
            )}
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
                <p className={styles.resultsTitle}>{categoryName}</p>
                <p className={styles.resultsCount}>
                  {result.total} {result.total === 1 ? dict.filters.work : dict.filters.works}
                </p>
              </div>

              <ProductGrid
                products={result.products}
                currency={settings}
                wishlistedIds={wishlistedIds}
                soldLabel={dict.product.sold}
              />

              <Pagination
                basePath={basePath}
                page={result.page}
                pageCount={result.pageCount}
                searchParams={query}
                labels={dict.filters}
              />
            </div>
          </div>
        </div>
      </section>
    </StorefrontShell>
  );
}
