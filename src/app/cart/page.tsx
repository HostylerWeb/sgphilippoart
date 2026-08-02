import type { Metadata } from "next";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { CartItemRow } from "@/components/cart/CartItemRow";
import { CatalogPageShell } from "@/components/layout/CatalogPageShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { calculateOrderTotals, getCart } from "@/lib/cart";
import { getCartContext } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { getStoreSettings } from "@/lib/settings";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "@/i18n";
import styles from "./page.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Your Cart — SG Philippo Art",
  path: "/cart",
  noIndex: true,
});

export default async function CartPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.cart;

  const cartCtx = await getCartContext();
  const [settings, cart] = await Promise.all([
    getStoreSettings(locale),
    getCart(cartCtx, locale),
  ]);

  const totals = calculateOrderTotals(cart.subtotal, settings);
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <StorefrontShell>
      <CatalogPageShell eyebrow={t.eyebrow} title={t.title}>
        {cart.items.length === 0 ? (
          <EmptyState
            title={t.emptyTitle}
            description={t.emptyDescription}
            actionLabel={t.browse}
            actionHref="/collections"
          />
        ) : (
          <div className={styles.layout}>
            <div className={styles.itemsPanel}>
              <div className={styles.itemsHeader}>
                <span>{t.itemsCount.replace("{count}", String(itemCount))}</span>
                <span>{t.lineTotal}</span>
              </div>
              <div className={styles.items}>
                {cart.items.map((item) => (
                  <CartItemRow key={item.id} item={item} settings={settings} labels={t} />
                ))}
              </div>
              <Link href="/collections" className={styles.continueLink}>
                ← {t.continue}
              </Link>
            </div>

            <aside className={styles.summary}>
              <h2 className={styles.summaryTitle}>{t.total}</h2>
              <div className={styles.summaryRow}>
                <span>{t.subtotal}</span>
                <span>{formatPrice(totals.subtotal, settings)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>{t.shipping}</span>
                <span>
                  {settings.shippingMode === "by_country"
                    ? t.shippingAtCheckout
                    : totals.shippingCost > 0
                      ? formatPrice(totals.shippingCost, settings)
                      : t.freeShipping}
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
                  <span>{settings.taxLabel || t.tax}</span>
                  <span>{formatPrice(totals.tax, settings)}</span>
                </div>
              )}
              <div className={`${styles.summaryRow} ${styles.total}`}>
                <span>{t.total}</span>
                <span>{formatPrice(totals.total, settings)}</span>
              </div>
              <Link href="/checkout" className={styles.checkoutBtn}>
                {t.checkout}
              </Link>
              <p className={styles.inquiryNote}>{t.inquiryNote}</p>
            </aside>
          </div>
        )}
      </CatalogPageShell>
    </StorefrontShell>
  );
}
