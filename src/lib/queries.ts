import { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { mapProductToCard } from "@/lib/product-mapper";
import { getPriceRange, type PriceRangeSlug } from "@/lib/price-ranges";
import type { Locale } from "@/i18n/config";
import type { ProductCardData } from "@/components/product/ProductCard";

const PRODUCTS_PER_PAGE = 12;

export async function getSiteSettings(): Promise<Record<string, string>> {
  const rows = await db.site_settings.findMany();
  return Object.fromEntries(rows.map((row) => [row.key, row.value]));
}

export async function getCategories() {
  return db.categories.findMany({
    where: { show_in_nav: true },
    orderBy: { sort_order: "asc" },
    select: { name: true, slug: true, translations: true },
  });
}

export async function getHomepageCategories() {
  return db.categories.findMany({
    where: { show_on_homepage: true },
    orderBy: { sort_order: "asc" },
    select: { name: true, slug: true, translations: true },
  });
}

export async function getTrustItems() {
  return db.trust_items.findMany({
    where: { is_active: true },
    orderBy: { sort_order: "asc" },
  });
}

export async function getAllCategories() {
  return db.categories.findMany({
    orderBy: { sort_order: "asc" },
  });
}

export async function getCategoriesWithCounts() {
  return db.categories.findMany({
    orderBy: { sort_order: "asc" },
    include: {
      _count: {
        select: {
          products: {
            where: { status: { in: ["published", "sold"] } },
          },
        },
      },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return db.categories.findUnique({ where: { slug } });
}

export async function getHeroTiles() {
  return db.hero_tiles.findMany({
    where: { is_active: true },
    orderBy: { sort_order: "asc" },
  });
}

export async function getNewArrivals(
  limit = 4,
  locale: Locale = "en",
): Promise<ProductCardData[]> {
  const products = await db.products.findMany({
    where: { status: { in: ["published", "sold"] } },
    orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
    take: limit,
    include: { images: { orderBy: { sort_order: "asc" } } },
  });

  return products.map((product) => mapProductToCard(product, locale));
}

export async function getTestimonials() {
  return db.testimonials.findMany({
    where: { is_published: true },
    orderBy: { sort_order: "asc" },
  });
}

export type CollectionFilters = {
  type?: "original" | "print";
  price?: PriceRangeSlug;
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
};

export async function getProductsForCollection(
  categorySlug: string | null,
  filters: CollectionFilters = {},
  locale: Locale = "en",
) {
  const page = Math.max(1, filters.page ?? 1);
  const where: Prisma.productsWhereInput = {
    status: { in: ["published", "sold"] },
  };

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  if (filters.type) {
    where.product_type = filters.type;
  }

  const priceRange = getPriceRange(filters.price);
  if (priceRange) {
    where.price = {
      gte: priceRange.min,
      ...(priceRange.max < 999999 ? { lte: priceRange.max } : {}),
    };
  }

  let orderBy: Prisma.productsOrderByWithRelationInput = { created_at: "desc" };
  if (filters.sort === "price-asc") orderBy = { price: "asc" };
  if (filters.sort === "price-desc") orderBy = { price: "desc" };

  const [total, products] = await Promise.all([
    db.products.count({ where }),
    db.products.findMany({
      where,
      orderBy,
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
      include: { images: { orderBy: { sort_order: "asc" } } },
    }),
  ]);

  return {
    products: products.map((product) => mapProductToCard(product, locale)),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)),
    perPage: PRODUCTS_PER_PAGE,
  };
}

export async function getProductBySlug(slug: string) {
  return db.products.findFirst({
    where: { slug, status: { in: ["published", "sold"] } },
    include: {
      images: { orderBy: { sort_order: "asc" } },
      category: true,
    },
  });
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 4,
  locale: Locale = "en",
) {
  const products = await db.products.findMany({
    where: {
      id: { not: productId },
      status: "published",
      ...(categoryId ? { category_id: categoryId } : {}),
    },
    take: limit,
    orderBy: { sort_order: "asc" },
    include: { images: { orderBy: { sort_order: "asc" } } },
  });

  return products.map((product) => mapProductToCard(product, locale));
}

export async function searchProducts(
  query: string,
  locale: Locale = "en",
  limit?: number,
) {
  const trimmed = query.trim();
  if (!trimmed) return { total: 0, products: [] as ProductCardData[] };

  const where: Prisma.productsWhereInput = {
    status: { in: ["published", "sold"] },
    OR: [
      { title: { contains: trimmed, mode: "insensitive" } },
      { description: { contains: trimmed, mode: "insensitive" } },
      { medium: { contains: trimmed, mode: "insensitive" } },
    ],
  };

  const [total, products] = await Promise.all([
    db.products.count({ where }),
    db.products.findMany({
      where,
      orderBy: { sort_order: "asc" },
      ...(limit ? { take: limit } : {}),
      include: { images: { orderBy: { sort_order: "asc" } } },
    }),
  ]);

  return {
    total,
    products: products.map((product) => mapProductToCard(product, locale)),
  };
}

export async function getAllProductSlugs() {
  return db.products.findMany({
    where: { status: { in: ["published", "sold"] } },
    select: { slug: true, updated_at: true },
  });
}

export async function getWishlistedProductIds(): Promise<Set<string>> {
  const session = await auth();
  if (!session?.user?.id) return new Set();

  const rows = await db.wishlists.findMany({
    where: { user_id: session.user.id },
    select: { product_id: true },
  });

  return new Set(rows.map((row) => row.product_id));
}

export async function getWishlistProducts(userId: string, locale: Locale = "en") {
  const rows = await db.wishlists.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
    include: {
      product: {
        include: { images: { orderBy: { sort_order: "asc" } } },
      },
    },
  });

  return rows
    .filter((row) => row.product.status !== "archived")
    .map((row) => mapProductToCard(row.product, locale));
}

export async function getOrdersForUser(userId: string, email: string) {
  return db.orders.findMany({
    where: {
      OR: [{ user_id: userId }, { customer_email: email }],
    },
    orderBy: { created_at: "desc" },
  });
}

export async function getOrderByNumber(orderNumber: string) {
  return db.orders.findUnique({
    where: { order_number: orderNumber },
    include: {
      items: {
        include: {
          product: {
            include: {
              images: { orderBy: { sort_order: "asc" }, take: 1 },
            },
          },
        },
      },
    },
  });
}

export async function getAllCategorySlugs() {
  return db.categories.findMany({
    select: { slug: true, updated_at: true },
  });
}
