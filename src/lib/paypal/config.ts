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

export function getPayPalClientId(): string | null {
  return (
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.trim() ||
    process.env.PAYPAL_CLIENT_ID?.trim() ||
    null
  );
}

/** Passed to PayPal JS SDK (`sandbox` → www.sandbox.paypal.com/sdk/js). */
export function getPayPalScriptEnvironment(): "sandbox" | "production" {
  const raw =
    process.env.NEXT_PUBLIC_PAYPAL_MODE?.trim().toLowerCase() ||
    process.env.PAYPAL_MODE?.trim().toLowerCase();
  return raw === "live" ? "production" : "sandbox";
}

export function getPayPalClientSecret(): string | null {
  return process.env.PAYPAL_CLIENT_SECRET?.trim() || null;
}

export function getPayPalWebhookId(): string | null {
  return process.env.PAYPAL_WEBHOOK_ID?.trim() || null;
}
