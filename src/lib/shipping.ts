import type { StoreSettings } from "@/lib/settings";

export type ShippingCountryRates = {
  defaultRate: number;
  countries: Array<{ code: string; rate: number }>;
};

const EMPTY_RATES: ShippingCountryRates = {
  defaultRate: 0,
  countries: [],
};

export function parseShippingCountryRates(raw?: string | null): ShippingCountryRates {
  if (!raw?.trim()) return EMPTY_RATES;

  try {
    const parsed = JSON.parse(raw) as Partial<ShippingCountryRates>;
    return {
      defaultRate: Number(parsed.defaultRate) || 0,
      countries: Array.isArray(parsed.countries)
        ? parsed.countries
            .filter((row) => row && typeof row.code === "string")
            .map((row) => ({
              code: row.code.toUpperCase(),
              rate: Math.max(0, Number(row.rate) || 0),
            }))
        : [],
    };
  } catch {
    return EMPTY_RATES;
  }
}

export function serializeShippingCountryRates(rates: ShippingCountryRates): string {
  return JSON.stringify({
    defaultRate: Math.max(0, rates.defaultRate),
    countries: rates.countries
      .filter((row) => row.code.trim())
      .map((row) => ({
        code: row.code.toUpperCase(),
        rate: Math.max(0, row.rate),
      })),
  });
}

export function calculateShippingCost(
  settings: Pick<
    StoreSettings,
    | "shippingMode"
    | "shippingFlatRate"
    | "freeShippingThreshold"
    | "shippingCountryRates"
  >,
  subtotal: number,
  countryCode?: string | null,
): number {
  if (
    settings.shippingMode === "free_worldwide" ||
    (settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold)
  ) {
    return 0;
  }

  if (settings.shippingMode === "flat_rate") {
    return settings.shippingFlatRate;
  }

  if (settings.shippingMode === "by_country") {
    const code = countryCode?.toUpperCase();
    if (code) {
      const match = settings.shippingCountryRates.countries.find(
        (row) => row.code === code,
      );
      if (match) return match.rate;
    }
    return settings.shippingCountryRates.defaultRate;
  }

  return 0;
}

export function shippingCostLabel(
  settings: Pick<StoreSettings, "shippingMode" | "shippingLabel">,
  shippingCost: number,
  formatPrice: (amount: number) => string,
): string {
  if (settings.shippingMode === "free_worldwide" || shippingCost === 0) {
    return settings.shippingLabel;
  }
  if (settings.shippingMode === "flat_rate") {
    return `${settings.shippingLabel}: ${formatPrice(shippingCost)}`;
  }
  return `${settings.shippingLabel}: ${formatPrice(shippingCost)}`;
}
