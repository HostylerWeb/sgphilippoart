import { getSocialUrls, type SocialSettings } from "@/lib/social-links";
import type { StoreSettings } from "@/lib/settings";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function organizationJsonLd(
  settings: Pick<StoreSettings, "siteName" | "contactEmail"> & SocialSettings,
) {
  const sameAs = getSocialUrls(settings);

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.siteName,
    url: siteUrl,
    email: settings.contactEmail,
    sameAs: sameAs.length > 0 ? sameAs : undefined,
  };
}

export function websiteJsonLd(settings: { siteName: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName,
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: {
  title: string;
  slug: string;
  description: string | null;
  price: string;
  imageUrl: string;
  status: string;
  medium: string | null;
}, settings: { currencyCode: string; siteName: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description ?? product.title,
    image: product.imageUrl.startsWith("http")
      ? product.imageUrl
      : `${siteUrl}${product.imageUrl}`,
    brand: {
      "@type": "Brand",
      name: settings.siteName,
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: settings.currencyCode,
      price: product.price,
      availability:
        product.status === "sold"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
    },
    material: product.medium ?? undefined,
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; href?: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.href ? `${siteUrl}${item.href}` : undefined,
    })),
  };
}
