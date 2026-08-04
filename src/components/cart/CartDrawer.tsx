"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./CartDrawer.module.css";

export type CartDrawerItem = {
  id: string;
  quantity: number;
  slug: string;
  title: string;
  imageUrl: string;
  imageAlt: string | null;
  lineTotal: string;
};

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
  items: CartDrawerItem[];
  subtotal: string;
  dict: Dictionary["cart"];
  closeLabel: string;
  checkoutHref: string;
};

export function CartDrawer({
  open,
  onClose,
  items,
  subtotal,
  dict,
  closeLabel,
  checkoutHref,
}: CartDrawerProps) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={`${styles.drawer} ${styles.drawerOpen}`} aria-label={dict.title}>
        <div className={styles.head}>
          <h2>{dict.title}</h2>
          <button type="button" className={styles.close} onClick={onClose} aria-label={closeLabel}>
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>{dict.emptyTitle}</p>
            <Link href="/collections" className={styles.browse} onClick={onClose}>
              {dict.browse}
            </Link>
          </div>
        ) : (
          <>
            <ul className={styles.items}>
              {items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <Link
                    href={`/products/${item.slug}`}
                    className={styles.thumb}
                    onClick={onClose}
                  >
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt ?? item.title}
                      fill
                      sizes="72px"
                    />
                  </Link>
                  <div className={styles.meta}>
                    <Link
                      href={`/products/${item.slug}`}
                      className={styles.title}
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                    <span className={styles.qty}>
                      {dict.quantity}: {item.quantity}
                    </span>
                    <span className={styles.price}>{item.lineTotal}</span>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.footer}>
              <div className={styles.subtotal}>
                <span>{dict.subtotal}</span>
                <strong>{subtotal}</strong>
              </div>
              <Link href="/cart" className={styles.cartLink} onClick={onClose}>
                {dict.title}
              </Link>
              <Link href={checkoutHref} className={styles.checkout} onClick={onClose}>
                {dict.checkout}
              </Link>
            </div>
          </>
        )}
      </aside>
    </>,
    document.body,
  );
}
