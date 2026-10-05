import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Default share image (Facebook, X, WhatsApp, etc.) — 1200×630 recommended. */
export const DEFAULT_OG_IMAGE_PATH = "/images/ogimage.webp";

export const FAVICON_PATH = "/favicon.webp";

export function resolvePublicAssetUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${siteUrl}${path}`;
}

function openGraphImageMime(pathOrUrl: string): string | undefined {
  const path = pathOrUrl.split("?")[0].toLowerCase();
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  return undefined;
}

export function buildPageMetadata(options: {
  title: string;
  description?: string;
  path: string;
  noIndex?: boolean;
  image?: string;
  imageAlt?: string;
  /** Shorter title for link previews (defaults to `title`). */
  openGraphTitle?: string;
  openGraphType?: "website" | "article";
}): Metadata {
  const path = options.path.startsWith("/") ? options.path : `/${options.path}`;
  const imagePath = options.image ?? DEFAULT_OG_IMAGE_PATH;
  const imageUrl = resolvePublicAssetUrl(imagePath);
  const imageMime = openGraphImageMime(imagePath);
  const isDefaultOg = !options.image || imagePath === DEFAULT_OG_IMAGE_PATH;
  const ogImage = {
    url: imageUrl,
    secureUrl: imageUrl.startsWith("https://") ? imageUrl : undefined,
    width: isDefaultOg ? 1200 : undefined,
    height: isDefaultOg ? 630 : undefined,
    alt: options.imageAlt ?? process.env.NEXT_PUBLIC_SITE_NAME ?? "SG Philippo Art",
    type: imageMime,
  };
  const shareTitle = options.openGraphTitle ?? options.title;

  return {
    metadataBase: new URL(siteUrl),
    title: options.title,
    description: options.description,
    alternates: {
      canonical: path,
      languages: {
        en: `${path}?lang=en`,
        fr: `${path}?lang=fr`,
        "x-default": path,
      },
    },
    robots: options.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: shareTitle,
      description: options.description,
      url: `${siteUrl}${path}`,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "SG Philippo Art",
      type: options.openGraphType ?? "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: options.description,
      images: [imageUrl],
    },
    icons: {
      icon: [{ url: FAVICON_PATH, type: "image/webp" }],
      shortcut: FAVICON_PATH,
      apple: FAVICON_PATH,
    },
  };
}
