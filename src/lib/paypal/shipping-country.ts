import { resolveCountryCode } from "@/lib/european-countries";

type ShippingAddressJson = {
  country?: string | null;
  country_code?: string | null;
};

export function shippingCountryCodeFromOrder(
  shippingAddress: unknown,
): string {
  const address = shippingAddress as ShippingAddressJson | null;
  const raw =
    address?.country_code?.trim() ||
    resolveCountryCode(address?.country ?? undefined);
  return raw.toUpperCase();
}
