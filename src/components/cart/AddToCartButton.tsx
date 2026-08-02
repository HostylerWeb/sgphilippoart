"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/actions/cart";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "./AddToCartButton.module.css";

type AddToCartButtonProps = {
  productId: string;
  label?: string;
  className?: string;
};

export function AddToCartButton({
  productId,
  label,
  className,
}: AddToCartButtonProps) {
  const { dict } = useI18n();
  const t = dict.product;
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setMessage(null);
    startTransition(async () => {
      const result = await addToCart(productId);
      if (result.success) {
        router.refresh();
      } else {
        setMessage(result.message ?? t.addError);
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={className ?? styles.button}
      >
        {isPending ? t.adding : (label ?? t.addToCart)}
      </button>
      {message && <p className={styles.error}>{message}</p>}
    </div>
  );
}
