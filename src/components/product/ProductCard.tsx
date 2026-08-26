import Link from "next/link";
import { StoreImage } from "@/components/ui/StoreImage";
import { WishlistButton } from "@/components/wishlist/WishlistButton";
import { formatPrice, productBadgeLabel } from "@/lib/format";
import type { StoreSettings } from "@/lib/settings";
import styles from "./ProductCard.module.css";

export type ProductCardData = {
  id: string;
  slug: string;
  title: string;
  price: string | number;
  product_type: "original" | "print";
  edition_size: number | null;
  artist_name: string;
  artist_location: string;
  medium: string | null;
  dimensions: string | null;
  image_url: string;
  image_alt: string | null;
  is_sold?: boolean;
};

type BadgeLabels = {
  original: string;
  print: string;
  printEdition: string;
};

type ProductCardProps = {
  product: ProductCardData;
  currency?: Pick<StoreSettings, "currencyCode" | "currencyLocale">;
  isWishlisted?: boolean;
  imageSizes?: string;
  soldLabel?: string;
  badgeLabels?: BadgeLabels;
};

export function ProductCard({
  product,
  currency,
  isWishlisted,
  imageSizes = "(max-width: 600px) 50vw, (max-width: 980px) 50vw, 25vw",
  soldLabel,
  badgeLabels,
}: ProductCardProps) {
  const meta = [product.medium, product.dimensions].filter(Boolean).join(" · ");

  return (
    <Link href={`/products/${product.slug}`} className={styles.product}>
      <div className={styles.productImg}>
        <StoreImage
          src={product.image_url}
          alt={product.image_alt ?? product.title}
          fill
          sizes={imageSizes}
          className={styles.image}
        />
        <span className={styles.productBadge}>
          {product.is_sold
            ? soldLabel
            : productBadgeLabel(product.product_type, product.edition_size, badgeLabels)}
        </span>
        <WishlistButton
          productId={product.id}
          initialSaved={isWishlisted}
          className={styles.productWish}
        />
      </div>
      <div className={styles.productPrice}>{formatPrice(product.price, currency)}</div>
      <div className={styles.productTitle}>&ldquo;{product.title}&rdquo;</div>
      <div className={styles.productArtist}>
        {product.artist_name}, {product.artist_location}
      </div>
      <div className={styles.productMeta}>{meta}</div>
    </Link>
  );
}
