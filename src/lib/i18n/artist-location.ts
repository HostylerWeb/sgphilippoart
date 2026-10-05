import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

/** Canonical English value stored on products (`artist_location` column). */
export const ARTIST_LOCATION_BELGIUM_LUXEMBOURG_EN = "Belgium & Luxembourg";

export function localizeArtistLocation(location: string, locale: Locale): string {
  if (locale === "en") return location;
  const en = getDictionary("en");
  const dict = getDictionary(locale);
  if (location === en.product.artistLocationBelgiumLuxembourg) {
    return dict.product.artistLocationBelgiumLuxembourg;
  }
  return location;
}
