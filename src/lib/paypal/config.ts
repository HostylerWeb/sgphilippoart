export type PayPalMode = "sandbox" | "live";

export function getPayPalMode(): PayPalMode {
  const raw = process.env.PAYPAL_MODE?.trim().toLowerCase();
  return raw === "live" ? "live" : "sandbox";
}

export function getPayPalApiBase(): string {
  return getPayPalMode() === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export function isPayPalConfigured(): boolean {
  return Boolean(
    process.env.PAYPAL_CLIENT_ID?.trim() &&
      process.env.PAYPAL_CLIENT_SECRET?.trim(),
  );
}

/** Server/API: prefer secret-backed `PAYPAL_CLIENT_ID` so it stays paired with `PAYPAL_CLIENT_SECRET`. */
export function getPayPalClientId(): string | null {
  return (
    process.env.PAYPAL_CLIENT_ID?.trim() ||
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() ||
    null
  );
}

/** Browser PayPal JS SDK (build-time `NEXT_PUBLIC_*`). */
export function getPayPalPublicClientId(): string | null {
  return process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() || null;
}

/** PayPal JS SDK host (sandbox credentials still use www.paypal.com/sdk/js). */
export const PAYPAL_SDK_BASE_URL = "https://www.paypal.com/sdk/js";

export function getPayPalClientSecret(): string | null {
  return process.env.PAYPAL_CLIENT_SECRET?.trim() || null;
}

export function getPayPalWebhookId(): string | null {
  return process.env.PAYPAL_WEBHOOK_ID?.trim() || null;
}

/** PayPal JS SDK `environment` (use `NEXT_PUBLIC_PAYPAL_MODE` in the browser bundle). */
export function getPayPalScriptEnvironment(): "sandbox" | "production" {
  const raw =
    process.env.NEXT_PUBLIC_PAYPAL_MODE?.trim().toLowerCase() ||
    process.env.PAYPAL_MODE?.trim().toLowerCase();
  return raw === "live" ? "production" : "sandbox";
}
