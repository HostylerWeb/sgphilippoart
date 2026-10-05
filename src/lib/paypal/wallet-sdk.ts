export type PayPalApplePayConfig = {
  isEligible: boolean;
  countryCode: string;
  merchantCapabilities: string[];
  supportedNetworks: string[];
};

export type PayPalApplePayClient = {
  config: () => Promise<PayPalApplePayConfig>;
  validateMerchant: (params: {
    validationUrl: string;
    displayName?: string;
  }) => Promise<{ merchantSession: unknown }>;
  confirmOrder: (params: {
    orderId: string;
    token: unknown;
    billingContact?: unknown;
    shippingContact?: unknown;
  }) => Promise<unknown>;
};

export type PayPalGooglePayConfig = {
  allowedPaymentMethods: unknown[];
  merchantInfo: unknown;
  apiVersion?: number;
  apiVersionMinor?: number;
};

export type PayPalGooglePayClient = {
  config: () => Promise<PayPalGooglePayConfig>;
  confirmOrder: (params: {
    orderId: string;
    paymentMethodData: unknown;
    shippingAddress?: unknown;
  }) => Promise<{ status: string }>;
  initiatePayerAction: (params: { orderId: string }) => Promise<unknown>;
};

type PayPalWalletNamespace = {
  Applepay?: () => PayPalApplePayClient;
  Googlepay?: () => PayPalGooglePayClient;
};

export function getPayPalWalletSdk(): PayPalWalletNamespace | null {
  const paypal = (window as Window & { paypal?: PayPalWalletNamespace }).paypal;
  return paypal ?? null;
}

export type GooglePayPaymentData = {
  paymentMethodData: unknown;
};

export type GooglePayAuthorizationResult = {
  transactionState: "SUCCESS" | "ERROR";
  error?: {
    intent: string;
    message: string;
  };
};

export type GooglePaymentsClient = {
  isReadyToPay: (request: unknown) => Promise<{ result: boolean }>;
  createButton: (options: {
    onClick: () => void;
    allowedPaymentMethods?: unknown[];
    buttonColor?: "default" | "black" | "white";
    buttonType?: "buy" | "long" | "short" | "pay" | "checkout" | "order";
    buttonSizeMode?: "static" | "fill";
  }) => HTMLElement;
  loadPaymentData: (request: unknown) => Promise<GooglePayPaymentData>;
};

export function createGooglePaymentsClient(options: {
  environment: "TEST" | "PRODUCTION";
  paymentDataCallbacks?: {
    onPaymentAuthorized: (
      paymentData: GooglePayPaymentData,
    ) => Promise<GooglePayAuthorizationResult>;
  };
}): GooglePaymentsClient {
  const api = (
    window as Window & {
      google?: { payments?: { api: { PaymentsClient: new (o: unknown) => GooglePaymentsClient } } };
    }
  ).google?.payments?.api;
  if (!api) {
    throw new Error("Google Pay SDK is not loaded.");
  }
  return new api.PaymentsClient(options);
}
