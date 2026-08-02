import type { StoreSettings } from "@/lib/settings";
import { calculateShippingCost, shippingCostLabel } from "@/lib/shipping";

export function formatPrice(
  amount: number | string,
  settings?: Pick<StoreSettings, "currencyCode" | "currencyLocale">,
): string {
  const value = typeof amount === "string" ? Number(amount) : amount;
  const currency = settings?.currencyCode ?? "USD";
  const locale = settings?.currencyLocale ?? "en-US";

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function productBadgeLabel(
  productType: "original" | "print",
  editionSize?: number | null,
  labels?: { print: string; original: string; printEdition: string },
): string {
  if (productType === "print" && editionSize) {
    return labels?.printEdition.replace("{size}", String(editionSize)) ?? `Print · Ed. ${editionSize}`;
  }
  if (labels) {
    return productType === "print" ? labels.print : labels.original;
  }
  return productType === "print" ? "Print" : "Original";
}

export function shippingSummary(
  settings: StoreSettings,
  countryCode?: string | null,
): string {
  if (settings.shippingMode === "by_country" && !countryCode) {
    return settings.shippingLabel;
  }

  const shippingCost = calculateShippingCost(settings, 0, countryCode);

  if (settings.shippingMode === "free_worldwide" || shippingCost === 0) {
    return settings.shippingLabel || "Free worldwide shipping";
  }

  return shippingCostLabel(settings, shippingCost, (amount) =>
    formatPrice(amount, settings),
  );
}
