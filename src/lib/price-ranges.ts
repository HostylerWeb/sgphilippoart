export const PRICE_RANGES = [
  { label: "Under $500", slug: "under-500", min: 0, max: 500 },
  { label: "$500 – $1,000", slug: "500-1000", min: 500, max: 1000 },
  { label: "$1,000 – $2,000", slug: "1000-2000", min: 1000, max: 2000 },
  { label: "$2,000 – $5,000", slug: "2000-5000", min: 2000, max: 5000 },
] as const;

export type PriceRangeSlug = (typeof PRICE_RANGES)[number]["slug"];

export function getPriceRange(slug: string | undefined) {
  return PRICE_RANGES.find((range) => range.slug === slug);
}
