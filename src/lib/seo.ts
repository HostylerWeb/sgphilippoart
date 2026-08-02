import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function buildPageMetadata(options: {
  title: string;
  description?: string;
  path: string;
  noIndex?: boolean;
}): Metadata {
  const path = options.path.startsWith("/") ? options.path : `/${options.path}`;

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
    },
  };
}
