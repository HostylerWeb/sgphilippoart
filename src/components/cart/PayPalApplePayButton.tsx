"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { usePayPalScriptReducer } from "@paypal/react-paypal-js";
import type { PreparedShopOrder } from "@/components/cart/usePayPalShopOrder";
import {
  getPayPalWalletSdk,
  type PayPalApplePayConfig,
} from "@/lib/paypal/wallet-sdk";
import styles from "./PayPalCheckout.module.css";

const APPLE_PAY_SDK = "https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js";

type PayPalApplePayButtonProps = {
  currencyCode: string;
  merchantDisplayName: string;
  applePayLocale: string;
  disabled: boolean;
  ensureShopOrder: () => Promise<PreparedShopOrder>;
  createPayPalOrderId: (shopOrderId: string) => Promise<string>;
  capturePayPalOrder: (shopOrderId: string, paypalOrderId: string) => Promise<string>;
  onPaid: (orderNumber: string) => void;
  onError: (message: string) => void;
  setProcessing: (value: boolean) => void;
  releasePendingShopOrder: () => Promise<void>;
};

export function PayPalApplePayButton({
  currencyCode,
  merchantDisplayName,
  applePayLocale,
  disabled,
  ensureShopOrder,
  createPayPalOrderId,
  capturePayPalOrder,
  onPaid,
  onError,
  setProcessing,
  releasePendingShopOrder,
}: PayPalApplePayButtonProps) {
  const [{ isResolved }] = usePayPalScriptReducer();
  const containerRef = useRef<HTMLDivElement>(null);
  const configRef = useRef<PayPalApplePayConfig | null>(null);
  const [appleSdkReady, setAppleSdkReady] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!isResolved || !appleSdkReady) return;
    if (!window.ApplePaySession?.canMakePayments?.()) return;
    const walletSdk = getPayPalWalletSdk();
    if (!walletSdk?.Applepay) return;

    let cancelled = false;
    const applepay = walletSdk.Applepay();

    applepay
      .config()
      .then((applepayConfig) => {
        if (cancelled || !applepayConfig.isEligible) return;
        configRef.current = applepayConfig;
        setShowButton(true);
      })
      .catch(() => {
        /* Not eligible on this device / domain */
      });

    return () => {
      cancelled = true;
    };
  }, [isResolved, appleSdkReady]);

  useEffect(() => {
    if (!showButton || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = `<apple-pay-button buttonstyle="black" type="plain" locale="${applePayLocale}"></apple-pay-button>`;

    const button = container.querySelector("apple-pay-button");
    if (!button) return;

    const onClick = () => {
      if (disabled) return;
      const applepayConfig = configRef.current;
      const ApplePaySession = window.ApplePaySession;
      const applepay = getPayPalWalletSdk()?.Applepay?.();
      if (!applepayConfig || !ApplePaySession || !applepay) return;
      if (!ApplePaySession.supportsVersion(4)) return;

      void (async () => {
        setProcessing(true);
        try {
          const shopOrder = await ensureShopOrder();
          const paymentRequest = {
            countryCode: applepayConfig.countryCode,
            merchantCapabilities: applepayConfig.merchantCapabilities,
            supportedNetworks: applepayConfig.supportedNetworks,
            currencyCode: shopOrder.currencyCode || currencyCode,
            total: {
              label: merchantDisplayName,
              type: "final",
              amount: shopOrder.total,
            },
          };

          const session = new ApplePaySession(4, paymentRequest);

          session.onvalidatemerchant = (event) => {
            applepay
              .validateMerchant({
                validationUrl: event.validationURL,
                displayName: merchantDisplayName,
              })
              .then((validateResult) => {
                session.completeMerchantValidation(validateResult.merchantSession);
              })
              .catch(() => {
                session.abort();
              });
          };

          session.onpaymentauthorized = (event) => {
            void (async () => {
              try {
                const paypalOrderId = await createPayPalOrderId(shopOrder.orderId);
                await applepay.confirmOrder({
                  orderId: paypalOrderId,
                  token: event.payment.token,
                  billingContact: event.payment.billingContact,
                });
                session.completePayment(ApplePaySession.STATUS_SUCCESS);
                const orderNumber = await capturePayPalOrder(
                  shopOrder.orderId,
                  paypalOrderId,
                );
                onPaid(orderNumber);
              } catch (error) {
                session.completePayment(ApplePaySession.STATUS_FAILURE);
                await releasePendingShopOrder();
                const message =
                  error instanceof Error ? error.message : "Apple Pay failed.";
                onError(message);
              } finally {
                setProcessing(false);
              }
            })();
          };

          session.oncancel = () => {
            void releasePendingShopOrder();
            setProcessing(false);
          };

          session.begin();
        } catch (error) {
          await releasePendingShopOrder();
          setProcessing(false);
          const message =
            error instanceof Error ? error.message : "Apple Pay failed.";
          onError(message);
        }
      })();
    };

    button.addEventListener("click", onClick);
    return () => button.removeEventListener("click", onClick);
  }, [
    showButton,
    disabled,
    applePayLocale,
    currencyCode,
    merchantDisplayName,
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
        src={APPLE_PAY_SDK}
        strategy="lazyOnload"
        onLoad={() => setAppleSdkReady(true)}
      />
      <div
        ref={containerRef}
        className={styles.walletButton}
        aria-hidden={disabled || !showButton}
      />
    </>
  );
}
