import { isArtistPortraitHeroTile } from "@/lib/home-artist-spotlight";
import { getHeroTiles } from "@/lib/queries";

export type ArtistPortrait = {
  imageUrl: string;
  imageAlt: string;
};

export async function getArtistPortrait(): Promise<ArtistPortrait | null> {
  const tiles = await getHeroTiles();
  const tile = tiles.find(isArtistPortraitHeroTile);
  if (!tile?.image_url) {
    return null;
  }

  return {
    imageUrl: tile.image_url,
    imageAlt: tile.image_alt?.trim() || "Artist portrait",
  };
}
