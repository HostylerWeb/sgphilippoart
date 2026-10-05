import { db } from "@/lib/db";
import {
  ARTIST_STORY_CATEGORY_NAME,
  ARTIST_STORY_DESCRIPTION_EN,
  ARTIST_STORY_TRANSLATIONS,
} from "@/lib/artist-story-defaults";
import { LEGACY_ARTIST_COLLECTION_SLUG } from "@/lib/home-artist-spotlight";

/**
 * Restores the hidden artist story row (not shown in shop nav).
 * Safe to run on every deploy — upserts by slug.
 */
async function main() {
  await db.categories.upsert({
    where: { slug: LEGACY_ARTIST_COLLECTION_SLUG },
    create: {
      name: ARTIST_STORY_CATEGORY_NAME,
      slug: LEGACY_ARTIST_COLLECTION_SLUG,
      description: ARTIST_STORY_DESCRIPTION_EN,
      translations: ARTIST_STORY_TRANSLATIONS,
      sort_order: 0,
      show_on_homepage: false,
      show_in_nav: false,
    },
    update: {
      name: ARTIST_STORY_CATEGORY_NAME,
      description: ARTIST_STORY_DESCRIPTION_EN,
      translations: ARTIST_STORY_TRANSLATIONS,
      show_on_homepage: false,
      show_in_nav: false,
    },
  });

  console.log(`Upserted artist story category: ${LEGACY_ARTIST_COLLECTION_SLUG}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
