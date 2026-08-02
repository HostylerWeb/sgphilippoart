import { ProductCard, type ProductCardData } from "@/components/product/ProductCard";
import type { StoreSettings } from "@/lib/settings";
import styles from "./ProductGrid.module.css";

type ProductGridProps = {
  products: ProductCardData[];
  currency?: Pick<StoreSettings, "currencyCode" | "currencyLocale">;
  emptyMessage?: string;
  wishlistedIds?: Set<string>;
  soldLabel?: string;
};

export function ProductGrid({
  products,
  currency,
  emptyMessage = "No works match your filters.",
  wishlistedIds,
  soldLabel,
}: ProductGridProps) {
  if (products.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
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
        />
      ))}
    </div>
  );
}
