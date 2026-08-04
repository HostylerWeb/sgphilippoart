import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { organizationJsonLd, websiteJsonLd } from "@/lib/json-ld";
import { buildPageMetadata } from "@/lib/seo";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = getDictionary(locale).meta;
  return buildPageMetadata({
    title: meta.homeTitle,
    description: meta.homeDescription,
    path: "/",
  });
}

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
