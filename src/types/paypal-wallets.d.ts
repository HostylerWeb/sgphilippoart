declare class ApplePaySession {
  static STATUS_SUCCESS: number;
  static STATUS_FAILURE: number;
  static canMakePayments: () => boolean;
  static supportsVersion: (version: number) => boolean;
  constructor(
    version: number,
    request: {
      countryCode: string;
      currencyCode: string;
      merchantCapabilities: string[];
      supportedNetworks: string[];
      total: { label: string; amount: string; type: string };
    },
  );
  onvalidatemerchant: ((event: { validationURL: string }) => void) | null;
  onpaymentauthorized:
    | ((event: {
        payment: {
          token: unknown;
          billingContact?: unknown;
          shippingContact?: unknown;
        };
      }) => void)
    | null;
  oncancel: (() => void) | null;
  completeMerchantValidation: (merchantSession: unknown) => void;
  completePayment: (status: number) => void;
  abort: () => void;
  begin: () => void;
}

declare namespace google.payments.api {
  type Environment = "TEST" | "PRODUCTION";
  type TransactionState = "SUCCESS" | "ERROR";

  interface PaymentData {
    paymentMethodData: unknown;
  }

  interface PaymentAuthorizationResult {
    transactionState: TransactionState;
    error?: {
      intent: string;
      message: string;
    };
  }

  class PaymentsClient {
    constructor(options: {
      environment: Environment;
      paymentDataCallbacks?: {
        onPaymentAuthorized: (
          paymentData: PaymentData,
        ) => Promise<PaymentAuthorizationResult>;
      };
    });
    isReadyToPay: (request: unknown) => Promise<{ result: boolean }>;
    createButton: (options: {
      onClick: () => void;
      allowedPaymentMethods?: unknown[];
    }) => HTMLElement;
    loadPaymentData: (request: unknown) => Promise<PaymentData>;
  }
}

declare global {
  interface Window {
    ApplePaySession?: typeof ApplePaySession;
    google?: {
      payments?: {
        api: typeof google.payments.api;
      };
    };
  }
}

export {};
