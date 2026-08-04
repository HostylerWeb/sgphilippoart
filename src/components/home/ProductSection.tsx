import Link from "next/link";
import { ProductCard, type ProductCardData } from "@/components/product/ProductCard";
import type { StoreSettings } from "@/lib/settings";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./ProductSection.module.css";

type ProductSectionProps = {
  products: ProductCardData[];
  currency?: Pick<StoreSettings, "currencyCode" | "currencyLocale">;
  wishlistedIds?: Set<string>;
  labels: Dictionary["home"];
  soldLabel: string;
  badgeLabels: Pick<Dictionary["product"], "original" | "print" | "printEdition">;
};

export function ProductSection({
  products,
  currency,
  wishlistedIds,
  labels,
  soldLabel,
  badgeLabels,
}: ProductSectionProps) {
  return (
    <section className={styles.section}>
      <div className="wrap">
        <div className={styles.sectionHead}>
          <div>
            <span className="eyebrow">{labels.newArrivalsEyebrow}</span>
            <h2>{labels.newArrivalsTitle}</h2>
          </div>
          <Link href="/collections/new-arrivals" className={styles.sectionHeadLink}>
            {labels.viewAllWorks}
          </Link>
        </div>
        <div
          className={styles.productScroller}
          tabIndex={0}
          role="region"
          aria-label={labels.newArrivalsTitle}
        >
          <div className={styles.productGrid}>
            {products.map((product) => (
              <div key={product.slug} className={styles.productSlide}>
                <ProductCard
                  product={product}
                  currency={currency}
                  isWishlisted={wishlistedIds?.has(product.id)}
                  imageSizes="(max-width: 600px) calc(100vw - 72px), (max-width: 980px) 50vw, 25vw"
                  soldLabel={soldLabel}
                  badgeLabels={badgeLabels}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
