import { ProductCard, type ProductCardData } from "@/components/product/ProductCard";
import type { StoreSettings } from "@/lib/settings";
import styles from "./ProductGrid.module.css";

type BadgeLabels = {
  original: string;
  print: string;
  printEdition: string;
};

type ProductGridProps = {
  products: ProductCardData[];
  currency?: Pick<StoreSettings, "currencyCode" | "currencyLocale">;
  emptyMessage?: string;
  wishlistedIds?: Set<string>;
  soldLabel?: string;
  badgeLabels?: BadgeLabels;
};

export function ProductGrid({
  products,
  currency,
  emptyMessage,
  wishlistedIds,
  soldLabel,
  badgeLabels,
}: ProductGridProps) {
  if (products.length === 0) {
    return emptyMessage ? <p className={styles.empty}>{emptyMessage}</p> : null;
  }

  return (
    <div className={styles.productGrid}>
      {products.map((product) => (
        <ProductCard
          key={product.slug}
          product={product}
          currency={currency}
          isWishlisted={wishlistedIds?.has(product.id)}
          soldLabel={soldLabel}
          badgeLabels={badgeLabels}
        />
      ))}
    </div>
  );
}
