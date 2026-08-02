import type { ProductCardData } from "@/components/product/ProductCard";
import type { Locale } from "@/i18n/config";
import { localizeProduct } from "@/lib/i18n/localize";

type ProductWithImages = {
  id: string;
  slug: string;
  title: string;
  price: { toString(): string };
  product_type: "original" | "print";
  edition_size: number | null;
  artist_name: string;
  artist_location: string;
  medium: string | null;
  dimensions: string | null;
  status: "draft" | "published" | "sold" | "archived";
  translations?: unknown;
  images: Array<{
    url: string;
    alt_text: string | null;
    is_primary: boolean;
    sort_order: number;
  }>;
};

export function mapProductToCard(
  product: ProductWithImages,
  locale: Locale = "en",
): ProductCardData {
  const localized = localizeProduct(product, locale);
  const primary =
    product.images.find((image) => image.is_primary) ?? product.images[0];

  return {
    id: product.id,
    slug: product.slug,
    title: localized.title,
    price: product.price.toString(),
    product_type: product.product_type,
    edition_size: product.edition_size,
    artist_name: product.artist_name,
    artist_location: product.artist_location,
    medium: localized.medium,
    dimensions: product.dimensions,
    image_url: primary?.url ?? "",
    image_alt: primary?.alt_text,
    is_sold: product.status === "sold",
  };
}
