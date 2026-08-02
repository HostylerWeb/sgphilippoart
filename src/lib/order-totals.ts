import type { StoreSettings } from "@/lib/settings";
import { calculateShippingCost } from "@/lib/shipping";

export type OrderTotals = {
  subtotal: number;
  shippingCost: number;
  tax: number;
  handlingFee: number;
  total: number;
};

export function calculateOrderTotals(
  subtotal: number,
  settings: Pick<
    StoreSettings,
    | "taxEnabled"
    | "taxRate"
    | "taxInclusive"
    | "shippingMode"
    | "shippingFlatRate"
    | "freeShippingThreshold"
    | "shippingCountryRates"
    | "handlingFee"
  >,
  countryCode?: string | null,
): OrderTotals {
  const shippingCost = calculateShippingCost(settings, subtotal, countryCode);

  const handlingFee = settings.handlingFee;
  const taxableAmount = settings.taxInclusive ? subtotal : subtotal + shippingCost + handlingFee;
  const tax = settings.taxEnabled ? (taxableAmount * settings.taxRate) / 100 : 0;

  const total = settings.taxInclusive
    ? subtotal + shippingCost + handlingFee
    : subtotal + shippingCost + handlingFee + tax;

  return {
    subtotal,
    shippingCost,
    tax,
    handlingFee,
    total,
  };
}
