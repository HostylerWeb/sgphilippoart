"use client";

import { useRef, useState } from "react";
import {
  PayPalButtons,
  PayPalScriptProvider,
  type ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";
import { preparePayPalCheckout } from "@/actions/cart";
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
  environment: "sandbox" | "production";
  currencyCode: string;
  getPayload: () => CheckoutPayload | null;
  onPaid: (orderNumber: string) => void;
  onError: (message: string) => void;
  processingLabel: string;
};

export function PayPalCheckout({
  clientId,
  environment,
  currencyCode,
  getPayload,
  onPaid,
  onError,
  processingLabel,
}: PayPalCheckoutProps) {
  const shopOrderRef = useRef<{ orderId: string; orderNumber: string } | null>(
    null,
  );
  const [processing, setProcessing] = useState(false);

  const scriptOptions: ReactPayPalScriptOptions = {
    clientId,
    environment,
    currency: currencyCode,
    intent: "capture",
    components: "buttons",
    disableFunding: "venmo,paylater",
  };

  async function ensureShopOrder() {
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

  return (
    <PayPalScriptProvider options={scriptOptions}>
      <div className={styles.wrap}>
        {processing && <p className={styles.processing}>{processingLabel}</p>}
        <PayPalButtons
          fundingSource="paypal"
          style={{ layout: "vertical", shape: "rect", label: "paypal" }}
          disabled={processing}
          createOrder={async () => {
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
              setProcessing(false);
              const message =
                error instanceof Error ? error.message : "PayPal checkout failed.";
              onError(message);
              throw error;
            }
          }}
          onApprove={async (data) => {
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
          }}
          onCancel={() => {
            setProcessing(false);
          }}
          onError={() => {
            setProcessing(false);
            onError("PayPal encountered an error. Please try again.");
          }}
        />
        <PayPalButtons
          fundingSource="card"
          style={{ layout: "vertical", shape: "rect", label: "pay" }}
          disabled={processing}
          createOrder={async () => {
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
                throw new Error(data.error ?? "Could not start card checkout.");
              }
              return data.id;
            } catch (error) {
              setProcessing(false);
              const message =
                error instanceof Error ? error.message : "Card checkout failed.";
              onError(message);
              throw error;
            }
          }}
          onApprove={async (data) => {
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
          }}
          onCancel={() => setProcessing(false)}
          onError={() => {
            setProcessing(false);
            onError("Card payment encountered an error. Please try again.");
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
