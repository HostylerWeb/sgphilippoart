import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

export type InventoryError =
  | { code: "not_available"; title: string }
  | { code: "insufficient_stock"; title: string; count: number }
  | { code: "already_reserved"; title: string };

export function localizeInventoryError(locale: Locale, error: InventoryError): string {
  const v = getDictionary(locale).validation;

  switch (error.code) {
    case "not_available":
      return v.artworkNoLongerAvailable.replace("{title}", error.title);
    case "insufficient_stock":
      return v.insufficientStock
        .replace("{title}", error.title)
        .replace("{count}", String(error.count));
    case "already_reserved":
      return v.artworkReserved.replace("{title}", error.title);
  }
}
