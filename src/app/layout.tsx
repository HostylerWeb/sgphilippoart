import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { organizationJsonLd, websiteJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { getStoreSettings } from "@/lib/settings";
import { getLocale } from "@/i18n";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = buildPageMetadata({
  title: "SG Philippo Art — Original Paintings & Prints",
  description:
    "Original oil paintings and fine art prints by SG Philippo Art. Hand-painted, shipped worldwide.",
  path: "/",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSettings();
  const locale = await getLocale();
  const orgJsonLd = organizationJsonLd(settings);
  const siteJsonLd = websiteJsonLd(settings);

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body className={inter.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
