import type { Metadata } from "next";
import Link from "next/link";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { CatalogPageShell } from "@/components/layout/CatalogPageShell";
import { getCategoriesWithCounts } from "@/lib/queries";
import { getStoreSettings } from "@/lib/settings";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "@/i18n";
import { localizeCategoryEntity } from "@/lib/i18n/localize";
import styles from "./page.module.css";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = getDictionary(locale).meta;
  return buildPageMetadata({
    title: meta.collectionsTitle,
    description: meta.collectionsDescription,
    path: "/collections",
  });
}

export default async function CollectionsIndexPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.collections;

  const [categories, settings] = await Promise.all([
    getCategoriesWithCounts(),
    getStoreSettings(locale),
  ]);

  return (
    <StorefrontShell>
      <CatalogPageShell
        eyebrow={t.browseEyebrow}
        title={t.allTitle}
        description={t.allDescription}
      >
        <div className={styles.grid}>
          {categories.map((category) => {
            const localized = localizeCategoryEntity(category, locale);
            return (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className={styles.card}
            >
              <div className={styles.cardTop}>
                <strong className={styles.cardName}>
                  {localized.name}
                </strong>
                <span className={styles.cardCount}>
                  {category._count.products}{" "}
                  {category._count.products === 1 ? t.work : t.works}
                </span>
              </div>
              {localized.description && (
                <p className={styles.cardDescription}>{localized.description}</p>
              )}
              <span className={styles.cardLink}>{t.viewCollection}</span>
            </Link>
          );
          })}
        </div>
        <p className={styles.footer}>
          {t.pricesShown} {settings.currencyCode}. {settings.shippingLabel}.
        </p>
      </CatalogPageShell>
    </StorefrontShell>
  );
}
