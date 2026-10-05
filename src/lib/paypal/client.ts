import {
  getPayPalApiBase,
  getPayPalClientId,
  getPayPalClientSecret,
} from "@/lib/paypal/config";

type AccessTokenResponse = {
  access_token: string;
  expires_in: number;
};

let cachedToken: { value: string; expiresAt: number } | null = null;

export async function getPayPalAccessToken(): Promise<string> {
  const clientId = getPayPalClientId();
  const clientSecret = getPayPalClientSecret();
  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured");
  }

  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt > now + 30_000) {
    return cachedToken.value;
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64",
  );
  const response = await fetch(`${getPayPalApiBase()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`PayPal auth failed: ${response.status} ${text}`);
  }

  const data = (await response.json()) as AccessTokenResponse;
  cachedToken = {
    value: data.access_token,
    expiresAt: now + data.expires_in * 1000,
  };
  return data.access_token;
}

export class PayPalApiError extends Error {
  readonly status: number;
  readonly issue?: string;

  constructor(message: string, status: number, issue?: string) {
    super(message);
    this.name = "PayPalApiError";
    this.status = status;
    this.issue = issue;
  }
}

function parsePayPalErrorIssue(text: string): string | undefined {
  try {
    const body = JSON.parse(text) as {
      details?: Array<{ issue?: string }>;
    };
    return body.details?.[0]?.issue;
  } catch {
    return undefined;
  }
}

export async function paypalApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await getPayPalAccessToken();
  const response = await fetch(`${getPayPalApiBase()}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await response.text();
  let json: T = {} as T;
  if (text) {
    try {
      json = JSON.parse(text) as T;
    } catch {
      if (!response.ok) {
        throw new PayPalApiError(
          `PayPal API ${path} failed: ${response.status}`,
          response.status,
        );
      }
    }
  }

  if (!response.ok) {
    const issue = parsePayPalErrorIssue(text);
    throw new PayPalApiError(
      `PayPal API ${path} failed: ${response.status} ${text.slice(0, 500)}`,
      response.status,
      issue,
    );
  }

  return json;
}

export type PayPalCreateOrderInput = {
  shopOrderId: string;
  orderNumber: string;
  currencyCode: string;
  buyerCountryCode: string;
  subtotal: string;
  shipping: string;
  tax: string;
  handling: string;
  total: string;
};

export type PayPalOrderCreateResult = {
  id: string;
  status: string;
};

function payPalAmountBreakdown(
  currencyCode: string,
  parts: { subtotal: string; shipping: string; tax: string; handling: string },
) {
  const breakdown: Record<string, { currency_code: string; value: string }> = {
    item_total: { currency_code: currencyCode, value: parts.subtotal },
    shipping: { currency_code: currencyCode, value: parts.shipping },
    tax_total: { currency_code: currencyCode, value: parts.tax },
  };
  if (parseFloat(parts.handling) > 0) {
    breakdown.handling = { currency_code: currencyCode, value: parts.handling };
  }
  return breakdown;
}

function payPalOrderTotal(parts: {
  subtotal: string;
  shipping: string;
  tax: string;
  handling: string;
}): string {
  const sum =
    parseFloat(parts.subtotal) +
    parseFloat(parts.shipping) +
    parseFloat(parts.tax) +
    parseFloat(parts.handling);
  return sum.toFixed(2);
}

export async function createPayPalCheckoutOrder(
  input: PayPalCreateOrderInput,
): Promise<PayPalOrderCreateResult> {
  const parts = {
    subtotal: input.subtotal,
    shipping: input.shipping,
    tax: input.tax,
    handling: input.handling,
  };
  const total = payPalOrderTotal(parts);

  return paypalApi<PayPalOrderCreateResult>("/v2/checkout/orders", {
    method: "POST",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: input.shopOrderId,
          custom_id: input.orderNumber,
          amount: {
            currency_code: input.currencyCode,
            value: total,
            breakdown: payPalAmountBreakdown(input.currencyCode, parts),
          },
        },
      ],
      payer: {
        address: {
          country_code: input.buyerCountryCode,
        },
      },
      application_context: {
        brand_name: process.env.SMTP_FROM_NAME?.trim() || "SG Philippo Art",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
      },
    }),
  });
}

export type PayPalCaptureResult = {
  id: string;
  status: string;
  purchase_units?: Array<{
    reference_id?: string;
    custom_id?: string;
    payments?: {
      captures?: Array<{ id: string; status: string; amount?: { value: string } }>;
    };
  }>;
};

export async function capturePayPalOrder(
  paypalOrderId: string,
): Promise<PayPalCaptureResult> {
  return paypalApi<PayPalCaptureResult>(
    `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
    { method: "POST", body: "{}" },
  );
}

export async function verifyPayPalWebhookSignature(
  headers: Headers,
  event: unknown,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim();
  if (!webhookId) {
    return false;
  }

  const transmissionId = headers.get("paypal-transmission-id");
  const transmissionTime = headers.get("paypal-transmission-time");
  const certUrl = headers.get("paypal-cert-url");
  const authAlgo = headers.get("paypal-auth-algo");
  const transmissionSig = headers.get("paypal-transmission-sig");

  if (
    !transmissionId ||
    !transmissionTime ||
    !certUrl ||
    !authAlgo ||
    !transmissionSig
  ) {
    return false;
  }

  const result = await paypalApi<{ verification_status: string }>(
    "/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: event,
      }),
    },
  );

  return result.verification_status === "SUCCESS";
}
