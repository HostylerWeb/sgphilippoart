import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductGrid } from "@/components/product/ProductGrid";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/json-ld";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { buildPageMetadata } from "@/lib/seo";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";
import { localizeCategoryEntity, localizeProduct } from "@/lib/i18n/localize";
import styles from "./page.module.css";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const product = await getProductBySlug(slug);
  if (!product) return { title: dict.meta.artworkNotFound };

  const localized = localizeProduct(product, locale);
  const title =
    localized.meta_title ?? `"${localized.title}" by ${product.artist_name}`;
  const description =
    localized.meta_description ??
    localized.description?.slice(0, 160) ??
    `${localized.title} — ${localized.medium ?? dict.product.originalArtwork} by ${product.artist_name}`;

  const primary = product.images.find((image) => image.is_primary) ?? product.images[0];

  return {
    ...buildPageMetadata({
      title: `${title} — SG Philippo Art`,
      description,
      path: `/products/${slug}`,
    }),
    openGraph: {
      title: product.title,
      description,
      images: primary ? [{ url: primary.url }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const localized = localizeProduct(product, locale);
  const localizedCategory = product.category
    ? localizeCategoryEntity(product.category, locale)
    : null;

  const settings = await getStoreSettings(locale);
  const related = await getRelatedProducts(product.id, product.category_id, 4, locale);

  const primary = product.images.find((image) => image.is_primary) ?? product.images[0];

  const jsonLd = productJsonLd(
    {
      title: localized.title,
      slug: product.slug,
      description: localized.description,
      price: product.price.toString(),
      imageUrl: primary?.url ?? "",
      status: product.status,
      medium: localized.medium,
    },
    settings,
  );

  const breadcrumbs = breadcrumbJsonLd([
    { name: dict.product.home, href: "/" },
    ...(localizedCategory
      ? [{ name: localizedCategory.name, href: `/collections/${product.category!.slug}` }]
      : []),
    { name: localized.title },
  ]);

  return (
    <StorefrontShell activeSlug={product.category?.slug}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <section className={styles.section}>
        <div className="wrap">
          <Breadcrumbs
            ariaLabel={dict.aria.breadcrumb}
            items={[
              { label: dict.product.home, href: "/" },
              ...(localizedCategory
                ? [
                    { label: dict.product.collections, href: "/collections" },
                    {
                      label: localizedCategory.name,
                      href: `/collections/${product.category!.slug}`,
                    },
                  ]
                : []),
              { label: localized.title },
            ]}
          />
          <div className={styles.layout}>
            <ProductGallery images={product.images} title={localized.title} />
            <ProductDetails
              product={{
                id: product.id,
                title: localized.title,
                slug: product.slug,
                price: product.price.toString(),
                product_type: product.product_type,
                edition_size: product.edition_size,
                stock_quantity: product.stock_quantity,
                status: product.status,
                artist_name: product.artist_name,
                artist_location: product.artist_location,
                medium: localized.medium,
                dimensions: product.dimensions,
                description: localized.description,
              }}
              settings={settings}
              labels={dict.product}
            />
          </div>
          {related.length > 0 && (
            <div className={styles.related}>
              <h2>{dict.product.related}</h2>
              <ProductGrid
                products={related}
                currency={settings}
                soldLabel={dict.product.sold}
                badgeLabels={dict.product}
              />
            </div>
          )}
        </div>
      </section>
    </StorefrontShell>
  );
}
