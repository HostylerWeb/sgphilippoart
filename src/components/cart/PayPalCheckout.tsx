"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FUNDING,
  PayPalButtons,
  PayPalScriptProvider,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { PayPalApplePayButton } from "@/components/cart/PayPalApplePayButton";
import { PayPalGooglePayButton } from "@/components/cart/PayPalGooglePayButton";
import { usePayPalShopOrder } from "@/components/cart/usePayPalShopOrder";
import {
  getPayPalScriptEnvironment,
  PAYPAL_SDK_BASE_URL,
} from "@/lib/paypal/config";
import { getApplePayButtonLocale } from "@/lib/paypal/apple-pay-locale";
import { getPayPalSdkLocale } from "@/lib/paypal/locale";
import type { Locale } from "@/i18n/config";
import styles from "./PayPalCheckout.module.css";

export type CheckoutPayload = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  countryCode: string;
  notes?: string;
};

type PayPalCheckoutProps = {
  clientId: string;
  currencyCode: string;
  buyerCountryCode: string;
  siteLocale: Locale;
  merchantDisplayName: string;
  getPayload: () => CheckoutPayload | null;
  onPaid: (orderNumber: string) => void;
  onError: (message: string) => void;
  processingLabel: string;
  loadingLabel: string;
};

function PayPalCheckoutInner({
  currencyCode,
  buyerCountryCode,
  siteLocale,
  merchantDisplayName,
  getPayload,
  onPaid,
  onError,
  processingLabel,
}: Omit<PayPalCheckoutProps, "clientId" | "loadingLabel">) {
  const {
    processing,
    setProcessing,
    ensureShopOrder,
    createPayPalOrderId,
    capturePayPalOrder,
    releasePendingShopOrder,
    runWithProcessing,
  } = usePayPalShopOrder({
    getPayload,
    buyerCountryCode,
    onError,
  });

  async function createPayPalOrder(): Promise<string> {
    return runWithProcessing(async () => {
      const shopOrder = await ensureShopOrder();
      const paypalOrderId = await createPayPalOrderId(shopOrder.orderId);
      setProcessing(false);
      return paypalOrderId;
    });
  }

  async function capturePayPalOrderFromButtons(data: { orderID?: string }) {
    setProcessing(true);
    try {
      if (!data.orderID) {
        throw new Error("Missing order context.");
      }
      const shopOrder = await ensureShopOrder();
      const orderNumber = await capturePayPalOrder(
        shopOrder.orderId,
        data.orderID,
      );
      onPaid(orderNumber);
    } catch (error) {
      await releasePendingShopOrder();
      const message =
        error instanceof Error ? error.message : "Payment capture failed.";
      onError(message);
    } finally {
      setProcessing(false);
    }
  }

  const applePayLocale = getApplePayButtonLocale(siteLocale);

  const payPalButtonStyle = {
    layout: "vertical" as const,
    shape: "rect" as const,
    height: 48,
    tagline: false,
  };

  const payPalButtonEvents = {
    disabled: processing,
    createOrder: createPayPalOrder,
    onApprove: capturePayPalOrderFromButtons,
    onCancel: () => {
      void releasePendingShopOrder();
      setProcessing(false);
    },
    onError: () => {
      void releasePendingShopOrder();
      setProcessing(false);
      onError("PayPal encountered an error. Please try again.");
    },
  };

  return (
    <div className={styles.wrap}>
      {processing && <p className={styles.processing}>{processingLabel}</p>}
      <div className={styles.wallets}>
        <PayPalApplePayButton
          currencyCode={currencyCode}
          merchantDisplayName={merchantDisplayName}
          applePayLocale={applePayLocale}
          disabled={processing}
          ensureShopOrder={ensureShopOrder}
          createPayPalOrderId={createPayPalOrderId}
          capturePayPalOrder={capturePayPalOrder}
          onPaid={onPaid}
          onError={onError}
          setProcessing={setProcessing}
          releasePendingShopOrder={releasePendingShopOrder}
        />
        <PayPalGooglePayButton
          currencyCode={currencyCode}
          disabled={processing}
          ensureShopOrder={ensureShopOrder}
          createPayPalOrderId={createPayPalOrderId}
          capturePayPalOrder={capturePayPalOrder}
          onPaid={onPaid}
          onError={onError}
          setProcessing={setProcessing}
          releasePendingShopOrder={releasePendingShopOrder}
        />
      </div>
      <div className={styles.payButtonSlot}>
        <PayPalButtons
          {...payPalButtonEvents}
          fundingSource={FUNDING.PAYPAL}
          style={{ ...payPalButtonStyle, color: "blue" }}
        />
      </div>
      <div className={styles.payButtonSlot}>
        <PayPalButtons
          {...payPalButtonEvents}
          fundingSource={FUNDING.CARD}
          style={{ ...payPalButtonStyle, color: "gold" }}
        />
      </div>
    </div>
  );
}

export function PayPalCheckout({
  clientId,
  currencyCode,
  buyerCountryCode,
  siteLocale,
  merchantDisplayName,
  getPayload,
  onPaid,
  onError,
  processingLabel,
  loadingLabel,
}: PayPalCheckoutProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const buyerCountry = buyerCountryCode.trim().toUpperCase();

  const scriptOptions: ReactPayPalScriptOptions = useMemo(() => {
    const environment = getPayPalScriptEnvironment();
    const options: ReactPayPalScriptOptions = {
      clientId,
      environment,
      sdkBaseUrl: PAYPAL_SDK_BASE_URL,
      currency: currencyCode,
      intent: "capture",
      components: "buttons,applepay,googlepay",
      disableFunding: "venmo",
      locale: getPayPalSdkLocale(siteLocale),
    };
    if (environment === "sandbox" && buyerCountry) {
      options.buyerCountry = buyerCountry;
    }
    return options;
  }, [buyerCountry, clientId, currencyCode, siteLocale]);

  if (!mounted) {
    return (
      <div className={styles.wrap} aria-busy="true">
        <p className={styles.processing}>{loadingLabel}</p>
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      key={`${clientId}-${buyerCountry}-${currencyCode}`}
      options={scriptOptions}
    >
      <PayPalCheckoutInner
        currencyCode={currencyCode}
        buyerCountryCode={buyerCountryCode}
        siteLocale={siteLocale}
        merchantDisplayName={merchantDisplayName}
        getPayload={getPayload}
        onPaid={onPaid}
        onError={onError}
        processingLabel={processingLabel}
      />
    </PayPalScriptProvider>
  );
}
