import type { MetadataRoute } from "next";
import { getAllProductSlugs, getAllCategories } from "@/lib/queries";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    getAllProductSlugs(),
    getAllCategories(),
  ]);

  const staticPages = [
    "",
    "/collections",
    "/about",
    "/shipping",
    "/returns",
    "/faq",
    "/contact",
    "/commissions",
    "/privacy",
    "/terms",
    "/cookies",
    "/legal",
    "/track-order",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...categories.map((category) => ({
      url: `${siteUrl}/collections/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: product.updated_at,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
  ];
}
