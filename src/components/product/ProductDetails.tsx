import Link from "next/link";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import {
  formatPrice,
  productBadgeLabel,
  shippingSummary,
} from "@/lib/format";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { StoreSettings } from "@/lib/settings";
import styles from "./ProductDetails.module.css";

type ProductDetailsProps = {
  product: {
    id: string;
    title: string;
    slug: string;
    price: string;
    product_type: "original" | "print";
    edition_size: number | null;
    stock_quantity: number | null;
    status: string;
    artist_name: string;
    artist_location: string;
    medium: string | null;
    dimensions: string | null;
    description: string | null;
  };
  settings: StoreSettings;
  labels: Dictionary["product"];
};

export function ProductDetails({ product, settings, labels }: ProductDetailsProps) {
  const isSold = product.status === "sold";
  const isPrint = product.product_type === "print";
  const outOfStock = isPrint && (product.stock_quantity ?? 0) <= 0;

  const badge = isSold
    ? labels.sold
    : product.product_type === "print" && product.edition_size
      ? labels.printEdition.replace("{size}", String(product.edition_size))
      : isPrint
        ? labels.print
        : labels.original;

  return (
    <div className={styles.details}>
      <span className={styles.badge}>{badge}</span>
      <h1>&ldquo;{product.title}&rdquo;</h1>
      <p className={styles.price}>{formatPrice(product.price, settings)}</p>
      <p className={styles.artist}>
        {product.artist_name}, {product.artist_location}
      </p>
      <p className={styles.meta}>
        {[product.medium, product.dimensions].filter(Boolean).join(" · ")}
      </p>

      {product.description && <p className={styles.description}>{product.description}</p>}

      <ul className={styles.notes}>
        <li>{shippingSummary(settings)}</li>
        <li>{settings.returnsPolicySummary}</li>
        {product.product_type === "original" && <li>{labels.certificate}</li>}
        {isPrint && product.stock_quantity !== null && !outOfStock && (
          <li>{labels.stockAvailable.replace("{count}", String(product.stock_quantity))}</li>
        )}
        {settings.taxEnabled && (
          <li>
            {settings.taxLabel}: {settings.taxRate}%
            {settings.taxInclusive ? ` ${labels.taxIncluded}` : ""}
          </li>
        )}
      </ul>

      {isSold || outOfStock ? (
        <p className={styles.unavailable}>
          {isSold ? labels.soldOriginal : labels.outOfStock}
        </p>
      ) : (
        <div className={styles.actions}>
          <AddToCartButton productId={product.id} />
          <Link
            href={`/contact?work=${encodeURIComponent(product.slug)}`}
            className={styles.secondaryBtn}
          >
            {settings.paymentMode === "inquiry" ? labels.inquireInstead : labels.contactPurchase}
          </Link>
        </div>
      )}
    </div>
  );
}
