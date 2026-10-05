import type { hero_tiles } from "@/generated/prisma/client";

/** Mistaken empty “collection” — not a shop category; story lives on /about. */
export const LEGACY_ARTIST_COLLECTION_SLUG = "the-artist";

/** Optional DB category for long artist copy (not shown in shop nav). */
export const ARTIST_STORY_CATEGORY_SLUGS = ["sgphilippoart"] as const;

export function normalizeCollectionSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

export function heroTileCollectionSlug(
  tile: Pick<hero_tiles, "link_url">,
): string | null {
  const match = tile.link_url.trim().match(/\/collections\/([^/?#]+)/i);
  return match ? normalizeCollectionSlug(decodeURIComponent(match[1])) : null;
}

export function isArtistStoryCategorySlug(slug: string): boolean {
  const normalized = normalizeCollectionSlug(slug);
  if (normalized === LEGACY_ARTIST_COLLECTION_SLUG) {
    return true;
  }
  return ARTIST_STORY_CATEGORY_SLUGS.some((candidate) => candidate === normalized);
}

export function isShopCollectionSlug(slug: string): boolean {
  return !isArtistStoryCategorySlug(slug);
}

export function isArtistHeroTile(tile: Pick<hero_tiles, "link_url">): boolean {
  const slug = heroTileCollectionSlug(tile);
  return slug ? isArtistStoryCategorySlug(slug) : false;
}

/** Hero tile used for the artist portrait (collection story or About link). */
export function isArtistPortraitHeroTile(
  tile: Pick<hero_tiles, "link_url">,
): boolean {
  if (isArtistHeroTile(tile)) {
    return true;
  }
  const path = tile.link_url.trim().toLowerCase().split("?")[0].split("#")[0];
  return path === "/about";
}

export function parseStoryParagraphs(text: string): string[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\n/g, " ").trim())
    .filter(Boolean);
}

/** First few paragraphs for the homepage (full text stays on collection / about). */
export function excerptStoryParagraphs(text: string, maxParagraphs = 5): string[] {
  return parseStoryParagraphs(text).slice(0, maxParagraphs);
}
