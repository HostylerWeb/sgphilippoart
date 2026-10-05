import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Default share image (Facebook, X, WhatsApp, etc.) — 1200×630 recommended. */
export const DEFAULT_OG_IMAGE_PATH = "/images/ogimage.webp";

export const FAVICON_PATH = "/favicon.webp";

export function buildPageMetadata(options: {
  title: string;
  description?: string;
  path: string;
  noIndex?: boolean;
  image?: string;
}): Metadata {
  const path = options.path.startsWith("/") ? options.path : `/${options.path}`;
  const imagePath = options.image ?? DEFAULT_OG_IMAGE_PATH;
  const imageUrl = imagePath.startsWith("http")
    ? imagePath
    : `${siteUrl}${imagePath.startsWith("/") ? imagePath : `/${imagePath}`}`;
  const ogImage = {
    url: imageUrl,
    secureUrl: imageUrl.startsWith("https://") ? imageUrl : undefined,
    width: 1200,
    height: 630,
    alt: process.env.NEXT_PUBLIC_SITE_NAME ?? "SG Philippo Art",
    type: "image/webp",
  };

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
      title: options.title,
      description: options.description,
      url: `${siteUrl}${path}`,
      siteName: process.env.NEXT_PUBLIC_SITE_NAME ?? "SG Philippo Art",
      type: "website",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: options.title,
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
