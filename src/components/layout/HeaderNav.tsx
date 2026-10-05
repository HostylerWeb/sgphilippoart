"use client";

import { useEffect, useState } from "react";
import { useIsClient } from "@/hooks/use-is-client";
import { createPortal } from "react-dom";
import Link from "next/link";
import { StoreImage } from "@/components/ui/StoreImage";
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
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuRevealed, setMenuRevealed] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const mounted = useIsClient();

  const scrollLocked = menuMounted || cartOpen;

  useEffect(() => {
    const body = document.body;
    const scrollKey = "data-scroll-lock-y";

    if (!scrollLocked) {
      const savedY = body.getAttribute(scrollKey);
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.width = "";
      body.style.maxWidth = "";
      body.style.overflow = "";
      body.removeAttribute("data-scroll-lock");
      body.removeAttribute(scrollKey);
      if (savedY) {
        window.scrollTo(0, Number.parseInt(savedY, 10));
      }
      return;
    }

    const scrollY = window.scrollY;
    const lockedWidth = document.documentElement.clientWidth;
    body.setAttribute(scrollKey, String(scrollY));
    body.setAttribute("data-scroll-lock", "");
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.width = `${lockedWidth}px`;
    body.style.maxWidth = `${lockedWidth}px`;
    body.style.overflow = "hidden";

    return () => {
      const savedY = body.getAttribute(scrollKey);
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.width = "";
      body.style.maxWidth = "";
      body.style.overflow = "";
      body.removeAttribute("data-scroll-lock");
      body.removeAttribute(scrollKey);
      if (savedY) {
        window.scrollTo(0, Number.parseInt(savedY, 10));
      }
    };
  }, [scrollLocked]);

  useEffect(() => {
    if (menuOpen) {
      setMenuMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setMenuRevealed(true));
      });
      return () => cancelAnimationFrame(frame);
    }
    setMenuRevealed(false);
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen && menuMounted && !menuRevealed) {
      const timeout = window.setTimeout(() => setMenuMounted(false), 700);
      return () => window.clearTimeout(timeout);
    }
  }, [menuOpen, menuMounted, menuRevealed]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleMenuPanelTransitionEnd(
    event: React.TransitionEvent<HTMLDivElement>,
  ) {
    if (event.propertyName !== "transform" || menuOpen || menuRevealed) {
      return;
    }
    setMenuMounted(false);
  }

  const accountLabel = user ? dict.header.account : dict.header.login;

  const mobileMenu =
    mounted &&
    menuMounted &&
    createPortal(
      <div className={styles.mobileMenuRoot} aria-hidden={!menuMounted}>
        <div
          className={`${styles.mobileOverlay} ${menuRevealed ? styles.mobileOverlayVisible : ""}`}
          onClick={closeMenu}
          aria-hidden={!menuRevealed}
        />
        <div
          className={`${styles.mobilePanel} ${menuRevealed ? styles.mobilePanelVisible : ""}`}
          role="dialog"
          aria-modal="true"
          aria-label={dict.header.shop}
          onTransitionEnd={handleMenuPanelTransitionEnd}
        >
          <Link
            href="/"
            className={styles.mobilePanelBrand}
            onClick={closeMenu}
            aria-label={dict.meta.siteName}
          >
            <StoreImage
              src="/images/sgplogo.png"
              alt=""
              width={2056}
              height={765}
              className={styles.mobilePanelLogo}
              aria-hidden
            />
          </Link>
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
                onClick={closeMenu}
              >
                {category.name}
              </Link>
            ))}
          </nav>

          <div className={styles.mobilePanelHead}>
            <span className="eyebrow">{dict.header.studio}</span>
          </div>
          <nav className={styles.mobileLinks}>
            <Link href="/about" onClick={closeMenu}>
              {dict.footer.about}
            </Link>
            {commissionEnabled && (
              <Link href="/commissions" onClick={closeMenu}>
                {dict.footer.commissions}
              </Link>
            )}
            <Link href="/contact" onClick={closeMenu}>
              {dict.footer.contact}
            </Link>
          </nav>

          <div className={styles.mobilePanelHead}>
            <span className="eyebrow">{dict.header.support}</span>
          </div>
          <nav className={styles.mobileLinks}>
            <Link href="/shipping" onClick={closeMenu}>
              {dict.footer.shipping}
            </Link>
            <Link href="/returns" onClick={closeMenu}>
              {dict.footer.returns}
            </Link>
            <Link href="/faq" onClick={closeMenu}>
              {dict.footer.faq}
            </Link>
          </nav>
        </div>
      </div>,
      document.body,
    );

  return (
    <header className={styles.header}>
      <div className="wrap">
        <div className={styles.topnav}>
          <Link
            href="/"
            className={styles.logo}
            onClick={() => setMenuOpen(false)}
            aria-label={dict.meta.siteName}
          >
            <StoreImage
              src="/images/sgplogo.png"
              alt={dict.meta.siteName}
              width={2056}
              height={765}
              className={styles.logoImage}
              priority
            />
          </Link>

          <div className={styles.topActions}>
            <div className={styles.desktopOnly}>
              <LanguageToggle
                locale={locale}
                compact
                ariaLabel={dict.aria.language}
              />
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

          <button
            type="button"
            className={styles.menuButton}
            aria-label={menuOpen ? dict.header.menuClose : dict.header.menuOpen}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={styles.menuIcon} data-open={menuOpen} />
          </button>
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
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="9" cy="20" r="1.5" />
      <circle cx="18" cy="20" r="1.5" />
      <path d="M2 3h2.5l2.4 12.2a2 2 0 0 0 2 1.6h9.2a2 2 0 0 0 2-1.6L21 7H6.5" />
    </svg>
  );
}
