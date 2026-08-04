"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { removeFromCart, updateCartItemQuantity } from "@/actions/cart";
import { useI18n } from "@/components/layout/I18nProvider";
import { formatPrice } from "@/lib/format";
import type { CartLineItem } from "@/lib/cart";
import type { StoreSettings } from "@/lib/settings";
import styles from "./CartItemRow.module.css";

type CartItemRowProps = {
  item: CartLineItem;
  settings: Pick<StoreSettings, "currencyCode" | "currencyLocale">;
  labels?: { quantity: string; remove: string; lineTotal: string };
};

export function CartItemRow({ item, settings, labels }: CartItemRowProps) {
  const router = useRouter();
  const { dict } = useI18n();
  const [isPending, startTransition] = useTransition();
  const isOriginal = item.product.product_type === "original";
  const rowLabels = labels ?? dict.cart;

  function updateQuantity(next: number) {
    startTransition(async () => {
      await updateCartItemQuantity(item.id, next);
      router.refresh();
    });
  }

  function handleRemove() {
    startTransition(async () => {
      await removeFromCart(item.id);
      router.refresh();
    });
  }

  return (
    <article className={styles.row}>
      <div className={styles.main}>
        <Link href={`/products/${item.product.slug}`} className={styles.image}>
          {item.product.image_url && (
            <Image
              src={item.product.image_url}
              alt={item.product.image_alt ?? item.product.title}
              fill
              sizes="(max-width: 600px) 88px, 110px"
              className={styles.img}
            />
          )}
        </Link>
        <div className={styles.details}>
          <Link href={`/products/${item.product.slug}`} className={styles.title}>
            &ldquo;{item.product.title}&rdquo;
          </Link>
          <p className={styles.unitPrice}>{formatPrice(item.product.price, settings)}</p>
          <div className={styles.controls}>
            {isOriginal ? (
              <span className={styles.qty}>
                {rowLabels.quantity}: 1
              </span>
            ) : (
              <div className={styles.qtyControls}>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => updateQuantity(item.quantity - 1)}
                  aria-label={dict.aria.decreaseQuantity}
                >
                  −
                </button>
                <span aria-live="polite">{item.quantity}</span>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => updateQuantity(item.quantity + 1)}
                  aria-label={dict.aria.increaseQuantity}
                >
                  +
                </button>
              </div>
            )}
            <button
              type="button"
              className={styles.remove}
              disabled={isPending}
              onClick={handleRemove}
            >
              {rowLabels.remove}
            </button>
          </div>
        </div>
      </div>
      <div className={styles.lineTotal}>
        <span className={styles.lineTotalLabel}>{rowLabels.lineTotal}</span>
        <span className={styles.lineTotalValue}>
          {formatPrice(Number(item.product.price) * item.quantity, settings)}
        </span>
      </div>
    </article>
  );
}
