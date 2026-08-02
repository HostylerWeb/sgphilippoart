import { NextResponse } from "next/server";
import { getDictionary, getLocale } from "@/i18n";
import { formatPrice } from "@/lib/format";
import { enforceRateLimit } from "@/lib/rate-limit";
import { searchProducts } from "@/lib/queries";
import { getStoreSettings } from "@/lib/settings";

const PREVIEW_LIMIT = 6;
const MIN_QUERY_LENGTH = 2;

export async function GET(request: Request) {
  const limited = await enforceRateLimit("search-api", 60, 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim() ?? "";

  if (query.length < MIN_QUERY_LENGTH) {
    return NextResponse.json({
      query,
      total: 0,
      results: [],
      needsMoreCharacters: query.length > 0,
    });
  }

  const locale = await getLocale();
  const [settings, { total, products }] = await Promise.all([
    getStoreSettings(locale),
    searchProducts(query, locale, PREVIEW_LIMIT),
  ]);

  const dict = getDictionary(locale);

  return NextResponse.json({
    query,
    total,
    results: products.map((product) => ({
      slug: product.slug,
      title: product.title,
      imageUrl: product.image_url,
      imageAlt: product.image_alt,
      price: formatPrice(product.price, settings),
      isSold: product.is_sold ?? false,
    })),
    labels: {
      resultCount: dict.search.resultCount,
      resultCountPlural: dict.search.resultCountPlural,
      noResults: dict.search.noResults,
    },
  });
}
