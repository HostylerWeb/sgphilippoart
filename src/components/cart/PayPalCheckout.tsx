"use client";

import { useEffect, useRef, useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { PAYPAL_SDK_BASE_URL } from "@/lib/paypal/config";
import {
  abandonPayPalCheckoutOrder,
  preparePayPalCheckout,
} from "@/actions/cart";
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
  getPayload: () => CheckoutPayload | null;
  onPaid: (orderNumber: string) => void;
  onError: (message: string) => void;
  processingLabel: string;
  loadingLabel: string;
};

export function PayPalCheckout({
  clientId,
  currencyCode,
  getPayload,
  onPaid,
  onError,
  processingLabel,
  loadingLabel,
}: PayPalCheckoutProps) {
  const [mounted, setMounted] = useState(false);
  const shopOrderRef = useRef<{ orderId: string; orderNumber: string } | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scriptOptions: ReactPayPalScriptOptions = {
    clientId,
    sdkBaseUrl: PAYPAL_SDK_BASE_URL,
    currency: currencyCode,
    intent: "capture",
    components: "buttons",
    disableFunding: "venmo",
  };

  async function releasePendingShopOrder() {
    const pending = shopOrderRef.current;
    shopOrderRef.current = null;
    if (pending) {
      await abandonPayPalCheckoutOrder(pending.orderId);
    }
  }

  async function ensureShopOrder() {
    if (shopOrderRef.current) {
      return shopOrderRef.current;
    }

    const payload = getPayload();
    if (!payload) {
      throw new Error("Please complete all required fields.");
    }

    const prepared = await preparePayPalCheckout(payload);
    if (!prepared.success || !prepared.orderId || !prepared.orderNumber) {
      throw new Error(prepared.message ?? "Could not prepare checkout.");
    }

    shopOrderRef.current = {
      orderId: prepared.orderId,
      orderNumber: prepared.orderNumber,
    };
    return shopOrderRef.current;
  }

  async function createPayPalOrder(): Promise<string> {
    setProcessing(true);
    try {
      const shopOrder = await ensureShopOrder();
      const response = await fetch("/api/paypal/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: shopOrder.orderId }),
      });
      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !data.id) {
        throw new Error(data.error ?? "Could not start PayPal checkout.");
      }
      return data.id;
    } catch (error) {
      await releasePendingShopOrder();
      setProcessing(false);
      const message =
        error instanceof Error ? error.message : "PayPal checkout failed.";
      onError(message);
      throw error;
    }
  }

  async function capturePayPalOrder(data: { orderID?: string }) {
    try {
      const shopOrder = shopOrderRef.current;
      if (!shopOrder || !data.orderID) {
        throw new Error("Missing order context.");
      }
      const response = await fetch("/api/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: shopOrder.orderId,
          paypalOrderId: data.orderID,
        }),
      });
      const result = (await response.json()) as {
        orderNumber?: string;
        error?: string;
      };
      if (!response.ok || !result.orderNumber) {
        throw new Error(result.error ?? "Payment capture failed.");
      }
      onPaid(result.orderNumber);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Payment capture failed.";
      onError(message);
    } finally {
      setProcessing(false);
    }
  }

  if (!mounted) {
    return <div className={styles.wrap} aria-busy="true" />;
  }

  return (
    <PayPalScriptProvider options={scriptOptions}>
      <div className={styles.wrap}>
        {processing && <p className={styles.processing}>{processingLabel}</p>}
        <PayPalButtons
          style={{ layout: "vertical", shape: "rect" }}
          disabled={processing}
          createOrder={createPayPalOrder}
          onApprove={capturePayPalOrder}
          onCancel={() => {
            void releasePendingShopOrder();
            setProcessing(false);
          }}
          onError={() => {
            void releasePendingShopOrder();
            setProcessing(false);
            onError("PayPal encountered an error. Please try again.");
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
