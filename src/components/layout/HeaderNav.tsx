"use client";

import { useEffect, useState } from "react";
import { useIsClient } from "@/hooks/use-is-client";
import { createPortal } from "react-dom";
import Link from "next/link";
import { CartDrawer, type CartDrawerItem } from "@/components/cart/CartDrawer";
import { SearchModal } from "@/components/search/SearchModal";
import { LanguageToggle } from "@/components/layout/LanguageToggle";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./Header.module.css";

type Category = {
  name: string;
  slug: string;
};

type HeaderNavProps = {
  categories: Category[];
  activeSlug?: string;
  cartCount?: number;
  cartItems?: CartDrawerItem[];
  cartSubtotal?: string;
  user?: { name?: string | null; email?: string | null } | null;
  locale: Locale;
  dict: Dictionary;
  commissionEnabled?: boolean;
};

export function HeaderNav({
  categories,
  activeSlug,
  cartCount = 0,
  cartItems = [],
  cartSubtotal = "",
  user,
  locale,
  dict,
  commissionEnabled = true,
}: HeaderNavProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const mounted = useIsClient();

  useEffect(() => {
    document.body.style.overflow = menuOpen || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, cartOpen]);

  const accountLabel = user ? dict.header.account : dict.header.login;

  const mobileMenu =
    mounted &&
    menuOpen &&
    createPortal(
      <>
        <div
          className={`${styles.mobileOverlay} ${styles.mobileOverlayOpen}`}
          onClick={() => setMenuOpen(false)}
        />
        <div className={`${styles.mobilePanel} ${styles.mobilePanelOpen}`}>
          <div className={styles.mobilePanelHead}>
            <span className="eyebrow">{dict.header.shop}</span>
            <LanguageToggle locale={locale} compact ariaLabel={dict.aria.language} />
          </div>
          <nav className={styles.mobileLinks}>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/collections/${category.slug}`}
                className={category.slug === activeSlug ? styles.mobileActive : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className={styles.mobilePanelHead}>
            <span className="eyebrow">{dict.header.studio}</span>
          </div>
          <nav className={styles.mobileLinks}>
            <Link href="/about" onClick={() => setMenuOpen(false)}>
              {dict.footer.about}
            </Link>
            {commissionEnabled && (
              <Link href="/commissions" onClick={() => setMenuOpen(false)}>
                {dict.footer.commissions}
              </Link>
            )}
            <Link href="/contact" onClick={() => setMenuOpen(false)}>
              {dict.footer.contact}
            </Link>
          </nav>

          <div className={styles.mobilePanelHead}>
            <span className="eyebrow">{dict.header.support}</span>
          </div>
          <nav className={styles.mobileLinks}>
            <Link href="/shipping" onClick={() => setMenuOpen(false)}>
              {dict.footer.shipping}
            </Link>
            <Link href="/returns" onClick={() => setMenuOpen(false)}>
              {dict.footer.returns}
            </Link>
            <Link href="/faq" onClick={() => setMenuOpen(false)}>
              {dict.footer.faq}
            </Link>
          </nav>
        </div>
      </>,
      document.body,
    );

  return (
    <header className={styles.header}>
      <div className="wrap">
        <div className={styles.topnav}>
          <button
            type="button"
            className={styles.menuButton}
            aria-label={menuOpen ? dict.header.menuClose : dict.header.menuOpen}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.menuIcon} data-open={menuOpen} />
          </button>

          <Link href="/" className={styles.logo} onClick={() => setMenuOpen(false)}>
            SG PHILIPPO ART
          </Link>

          <div className={styles.topActions}>
            <div className={styles.desktopOnly}>
              <LanguageToggle locale={locale} ariaLabel={dict.aria.language} />
            </div>
            <SearchModal labels={dict.search} onNavigate={() => setMenuOpen(false)} />
            <Link
              href={user ? "/account" : "/login"}
              className={`${styles.iconButton} ${styles.accountButton}`}
              onClick={() => setMenuOpen(false)}
            >
              <UserIcon />
              <span className={styles.accountLabel}>{accountLabel}</span>
            </Link>
            <button
              type="button"
              className={styles.iconButton}
              aria-label={dict.header.cart}
              onClick={() => {
                setMenuOpen(false);
                setCartOpen(true);
              }}
            >
              <CartIcon />
              {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
            </button>
          </div>
        </div>

        <nav className={styles.catnav} aria-label={dict.aria.collections}>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/collections/${category.slug}`}
              className={category.slug === activeSlug ? styles.active : undefined}
            >
              {category.name}
            </Link>
          ))}
        </nav>
      </div>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        subtotal={cartSubtotal}
        dict={dict.cart}
        closeLabel={dict.aria.close}
        checkoutHref={user ? "/checkout" : "/login?callbackUrl=%2Fcheckout"}
      />

      {mobileMenu}
    </header>
  );
}

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M20 21a8 8 0 1 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}
