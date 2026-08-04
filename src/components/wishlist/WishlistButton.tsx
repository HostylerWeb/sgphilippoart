"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleWishlist } from "@/actions/wishlist";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "./WishlistButton.module.css";

type WishlistButtonProps = {
  productId: string;
  initialSaved?: boolean;
  className?: string;
};

export function WishlistButton({
  productId,
  initialSaved = false,
  className,
}: WishlistButtonProps) {
  const router = useRouter();
  const { dict } = useI18n();
  const [saved, setSaved] = useState(initialSaved);
  const [isPending, startTransition] = useTransition();

  function handleClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    startTransition(async () => {
      const result = await toggleWishlist(productId);
      if (result.requiresLogin) {
        router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (result.success) {
        setSaved(!!result.saved);
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${className ?? ""} ${saved ? styles.saved : ""}`}
      onClick={handleClick}
      disabled={isPending}
      aria-label={saved ? dict.aria.removeFromWishlist : dict.aria.addToWishlist}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6">
        <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
      </svg>
    </button>
  );
}
