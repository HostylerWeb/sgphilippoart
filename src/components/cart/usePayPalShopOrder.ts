"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  abandonPayPalCheckoutOrder,
  preparePayPalCheckout,
} from "@/actions/cart";
import type { CheckoutPayload } from "@/components/cart/PayPalCheckout";

export type PreparedShopOrder = {
  orderId: string;
  orderNumber: string;
  total: string;
  currencyCode: string;
};

type UsePayPalShopOrderOptions = {
  getPayload: () => CheckoutPayload | null;
  buyerCountryCode: string;
  onError: (message: string) => void;
};

export function usePayPalShopOrder({
  getPayload,
  buyerCountryCode,
  onError,
}: UsePayPalShopOrderOptions) {
  const shopOrderRef = useRef<PreparedShopOrder | null>(null);
  const [processing, setProcessing] = useState(false);

  const releasePendingShopOrder = useCallback(async () => {
    const pending = shopOrderRef.current;
    shopOrderRef.current = null;
    if (pending) {
      await abandonPayPalCheckoutOrder(pending.orderId);
    }
  }, []);

  useEffect(() => {
    void releasePendingShopOrder();
  }, [buyerCountryCode, releasePendingShopOrder]);

  const ensureShopOrder = useCallback(async (): Promise<PreparedShopOrder> => {
    if (shopOrderRef.current) {
      return shopOrderRef.current;
    }

    const payload = getPayload();
    if (!payload) {
      throw new Error("Please complete all required fields.");
    }

    const prepared = await preparePayPalCheckout(payload);
    if (
      !prepared.success ||
      !prepared.orderId ||
      !prepared.orderNumber ||
      !prepared.total ||
      !prepared.currencyCode
    ) {
      throw new Error(prepared.message ?? "Could not prepare checkout.");
    }

    const order: PreparedShopOrder = {
      orderId: prepared.orderId,
      orderNumber: prepared.orderNumber,
      total: prepared.total,
      currencyCode: prepared.currencyCode,
    };
    shopOrderRef.current = order;
    return order;
  }, [getPayload]);

  const createPayPalOrderId = useCallback(
    async (shopOrderId: string): Promise<string> => {
      const response = await fetch("/api/paypal/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: shopOrderId }),
      });
      const data = (await response.json()) as { id?: string; error?: string };
      if (!response.ok || !data.id) {
        throw new Error(data.error ?? "Could not start PayPal checkout.");
      }
      return data.id;
    },
    [],
  );

  const capturePayPalOrder = useCallback(
    async (shopOrderId: string, paypalOrderId: string): Promise<string> => {
      const response = await fetch("/api/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: shopOrderId,
          paypalOrderId,
        }),
      });
      const raw = await response.text();
      let result: { orderNumber?: string; error?: string } = {};
      if (raw) {
        try {
          result = JSON.parse(raw) as { orderNumber?: string; error?: string };
        } catch {
          throw new Error(
            response.ok
              ? "Payment response was invalid."
              : "Payment could not be completed. Please try again.",
          );
        }
      }
      if (!response.ok || !result.orderNumber) {
        throw new Error(result.error ?? "Payment capture failed.");
      }
      shopOrderRef.current = null;
      return result.orderNumber;
    },
    [],
  );

  const runWithProcessing = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      setProcessing(true);
      try {
        return await fn();
      } catch (error) {
        await releasePendingShopOrder();
        const message =
          error instanceof Error ? error.message : "Payment failed.";
        onError(message);
        throw error;
      } finally {
        setProcessing(false);
      }
    },
    [onError, releasePendingShopOrder],
  );

  return {
    processing,
    setProcessing,
    ensureShopOrder,
    createPayPalOrderId,
    capturePayPalOrder,
    releasePendingShopOrder,
    runWithProcessing,
  };
}
