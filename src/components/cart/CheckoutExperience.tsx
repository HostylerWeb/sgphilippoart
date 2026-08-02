"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { CheckoutForm, type CheckoutDefaults } from "@/components/cart/CheckoutForm";
import { calculateOrderTotals } from "@/lib/order-totals";
import { formatPrice } from "@/lib/format";
import { resolveCountryCode } from "@/lib/european-countries";
import type { StoreSettings } from "@/lib/settings";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "@/app/checkout/page.module.css";

type CheckoutItem = {
  id: string;
  quantity: number;
  title: string;
  imageUrl: string | null;
  imageAlt: string | null;
  lineTotal: string;
};

type SerializableSettings = Pick<
  StoreSettings,
  | "currencyCode"
  | "currencyLocale"
  | "taxEnabled"
  | "taxRate"
  | "taxLabel"
  | "taxInclusive"
  | "shippingMode"
  | "shippingFlatRate"
  | "shippingLabel"
  | "shippingCountryRates"
  | "freeShippingThreshold"
  | "handlingFee"
  | "handlingFeeLabel"
>;

type CheckoutExperienceProps = {
  items: CheckoutItem[];
  subtotal: number;
  settings: SerializableSettings;
  defaults?: CheckoutDefaults;
  dict: Dictionary;
};

export function CheckoutExperience({
  items,
  subtotal,
  settings,
  defaults,
  dict,
}: CheckoutExperienceProps) {
  const t = dict.checkout;
  const cartLabels = dict.cart;
  const [countryCode, setCountryCode] = useState(() =>
    resolveCountryCode(defaults?.country),
  );

  const totals = useMemo(
    () => calculateOrderTotals(subtotal, settings as StoreSettings, countryCode),
    [subtotal, settings, countryCode],
  );

  return (
    <div className={styles.layout}>
      <div className={styles.formPanel}>
        <CheckoutForm
          defaults={defaults}
          onCountryChange={setCountryCode}
        />
      </div>

      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>{t.orderSummary}</h2>
        <ul className={styles.itemList}>
          {items.map((item) => (
            <li key={item.id} className={styles.item}>
              <div className={styles.thumb}>
                {item.imageUrl && (
                  <Image
                    src={item.imageUrl}
                    alt={item.imageAlt ?? item.title}
                    fill
                    sizes="64px"
                    className={styles.thumbImg}
                  />
                )}
              </div>
              <div className={styles.itemMeta}>
                <span className={styles.itemTitle}>&ldquo;{item.title}&rdquo;</span>
                <span className={styles.itemQty}>
                  {cartLabels.quantity}: {item.quantity}
                </span>
              </div>
              <span className={styles.itemPrice}>{item.lineTotal}</span>
            </li>
          ))}
        </ul>

        <div className={styles.summaryRow}>
          <span>{t.subtotal}</span>
          <span>{formatPrice(totals.subtotal, settings)}</span>
        </div>
        <div className={styles.summaryRow}>
          <span>{t.shipping}</span>
          <span>
            {totals.shippingCost > 0
              ? formatPrice(totals.shippingCost, settings)
              : cartLabels.freeShipping}
          </span>
        </div>
        {totals.handlingFee > 0 && (
          <div className={styles.summaryRow}>
            <span>{settings.handlingFeeLabel}</span>
            <span>{formatPrice(totals.handlingFee, settings)}</span>
          </div>
        )}
        {totals.tax > 0 && (
          <div className={styles.summaryRow}>
            <span>{settings.taxLabel || cartLabels.tax}</span>
            <span>{formatPrice(totals.tax, settings)}</span>
          </div>
        )}
        <div className={`${styles.summaryRow} ${styles.total}`}>
          <span>{t.estimatedTotal}</span>
          <span>{formatPrice(totals.total, settings)}</span>
        </div>

        <Link href="/cart" className={styles.backLink}>
          ← {t.backToCart}
        </Link>
      </aside>
    </div>
  );
}
