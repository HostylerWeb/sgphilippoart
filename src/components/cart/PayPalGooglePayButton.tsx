"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { getPayPalScriptEnvironment } from "@/lib/paypal/config";
import {
  createGooglePaymentsClient,
  getPayPalWalletSdk,
  type GooglePayAuthorizationResult,
  type GooglePayPaymentData,
} from "@/lib/paypal/wallet-sdk";
import type { PreparedShopOrder } from "@/components/cart/usePayPalShopOrder";
import styles from "./PayPalCheckout.module.css";

const GOOGLE_PAY_SDK = "https://pay.google.com/gp/p/js/pay.js";

type PayPalGooglePayButtonProps = {
  currencyCode: string;
  disabled: boolean;
  ensureShopOrder: () => Promise<PreparedShopOrder>;
  createPayPalOrderId: (shopOrderId: string) => Promise<string>;
  capturePayPalOrder: (shopOrderId: string, paypalOrderId: string) => Promise<string>;
  onPaid: (orderNumber: string) => void;
  onError: (message: string) => void;
  setProcessing: (value: boolean) => void;
  releasePendingShopOrder: () => Promise<void>;
};

export function PayPalGooglePayButton({
  currencyCode,
  disabled,
  ensureShopOrder,
  createPayPalOrderId,
  capturePayPalOrder,
  onPaid,
  onError,
  setProcessing,
  releasePendingShopOrder,
}: PayPalGooglePayButtonProps) {
  const [{ isResolved }] = usePayPalScriptReducer();
  const containerRef = useRef<HTMLDivElement>(null);
  const [googleSdkReady, setGoogleSdkReady] = useState(false);
  const shopOrderRef = useRef<PreparedShopOrder | null>(null);

  useEffect(() => {
    if (!isResolved || !googleSdkReady || !containerRef.current) return;
    const walletSdk = getPayPalWalletSdk();
    if (!window.google?.payments?.api || !walletSdk?.Googlepay) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const googlepay = walletSdk.Googlepay();
    const environment =
      getPayPalScriptEnvironment() === "sandbox" ? "TEST" : "PRODUCTION";

    let paymentsClient: ReturnType<typeof createGooglePaymentsClient> | null =
      null;

    const onPaymentAuthorized = async (
      paymentData: GooglePayPaymentData,
    ): Promise<GooglePayAuthorizationResult> => {
      try {
        const shopOrder =
          shopOrderRef.current ?? (await ensureShopOrder());
        const paypalOrderId = await createPayPalOrderId(shopOrder.orderId);

        const confirmOrderResponse = await googlepay.confirmOrder({
          orderId: paypalOrderId,
          paymentMethodData: paymentData.paymentMethodData,
        });

        if (confirmOrderResponse.status === "PAYER_ACTION_REQUIRED") {
          await googlepay.initiatePayerAction({ orderId: paypalOrderId });
        }

        if (
          confirmOrderResponse.status === "APPROVED" ||
          confirmOrderResponse.status === "PAYER_ACTION_REQUIRED"
        ) {
          const orderNumber = await capturePayPalOrder(
            shopOrder.orderId,
            paypalOrderId,
          );
          onPaid(orderNumber);
          return { transactionState: "SUCCESS" };
        }

        await releasePendingShopOrder();
        return {
          transactionState: "ERROR",
          error: {
            intent: "PAYMENT_AUTHORIZATION",
            message: "TRANSACTION FAILED",
          },
        };
      } catch (error) {
        await releasePendingShopOrder();
        const message =
          error instanceof Error ? error.message : "Google Pay failed.";
        onError(message);
        return {
          transactionState: "ERROR",
          error: {
            intent: "PAYMENT_AUTHORIZATION",
            message,
          },
        };
      } finally {
        shopOrderRef.current = null;
        setProcessing(false);
      }
    };

    paymentsClient = createGooglePaymentsClient({
      environment,
      paymentDataCallbacks: {
        onPaymentAuthorized,
      },
    });

    let cancelled = false;

    void googlepay
      .config()
      .then(async (googlePayConfig) => {
        if (cancelled || !paymentsClient) return;

        const isReadyToPay = await paymentsClient.isReadyToPay({
          apiVersion: googlePayConfig.apiVersion ?? 2,
          apiVersionMinor: googlePayConfig.apiVersionMinor ?? 0,
          allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
        });

        if (!isReadyToPay.result || cancelled || !containerRef.current) return;

        const button = paymentsClient.createButton({
          buttonColor: "black",
          buttonType: "long",
          buttonSizeMode: "fill",
          onClick: () => {
            if (disabled) return;
            void (async () => {
              setProcessing(true);
              try {
                const shopOrder = await ensureShopOrder();
                shopOrderRef.current = shopOrder;

                const paymentDataRequest = {
                  apiVersion: googlePayConfig.apiVersion ?? 2,
                  apiVersionMinor: googlePayConfig.apiVersionMinor ?? 0,
                  allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
                  merchantInfo: googlePayConfig.merchantInfo,
                  callbackIntents: ["PAYMENT_AUTHORIZATION"],
                  transactionInfo: {
                    currencyCode: shopOrder.currencyCode || currencyCode,
                    totalPriceStatus: "FINAL",
                    totalPrice: shopOrder.total,
                  },
                };

                await paymentsClient!.loadPaymentData(paymentDataRequest);
              } catch (error) {
                shopOrderRef.current = null;
                await releasePendingShopOrder();
                setProcessing(false);
                if (
                  error &&
                  typeof error === "object" &&
                  "statusCode" in error &&
                  (error as { statusCode?: string }).statusCode === "CANCELED"
                ) {
                  return;
                }
                const message =
                  error instanceof Error
                    ? error.message
                    : "Google Pay failed.";
                onError(message);
              }
            })();
          },
          allowedPaymentMethods: googlePayConfig.allowedPaymentMethods,
        });

        containerRef.current.appendChild(button);
      })
      .catch(() => {
        /* Not eligible */
      });

    return () => {
      cancelled = true;
      container.innerHTML = "";
    };
  }, [
    isResolved,
    googleSdkReady,
    currencyCode,
    disabled,
    ensureShopOrder,
    createPayPalOrderId,
    capturePayPalOrder,
    onPaid,
    onError,
    setProcessing,
    releasePendingShopOrder,
  ]);

  return (
    <>
      <Script
        src={GOOGLE_PAY_SDK}
        strategy="lazyOnload"
        onLoad={() => setGoogleSdkReady(true)}
      />
      <div
        ref={containerRef}
        className={`${styles.walletButton} ${styles.googlePayButton}`}
      />
    </>
  );
}
