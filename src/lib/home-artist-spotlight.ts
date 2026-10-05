import type { hero_tiles } from "@/generated/prisma/client";

/** Category slugs used for the artist story (admin may use either). */
export const ARTIST_STORY_CATEGORY_SLUGS = ["the-artist", "sgphilippoart"] as const;

export const ARTIST_HOME_CATEGORY_SLUG = ARTIST_STORY_CATEGORY_SLUGS[0];

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
  return ARTIST_STORY_CATEGORY_SLUGS.some((candidate) => candidate === normalized);
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
