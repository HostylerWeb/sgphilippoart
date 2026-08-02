"use client";

import { useState } from "react";
import Link from "next/link";
import { useIsClient } from "@/hooks/use-is-client";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./CookieConsent.module.css";

const CONSENT_COOKIE = "spa_cookie_consent";

type CookieConsentProps = {
  labels: Dictionary["cookies"];
};

function hasConsentChoice(): boolean {
  return document.cookie.includes(`${CONSENT_COOKIE}=`);
}

export function CookieConsent({ labels }: CookieConsentProps) {
  const isClient = useIsClient();
  const [dismissed, setDismissed] = useState(false);
  const visible = isClient && !hasConsentChoice() && !dismissed;

  function setConsent(value: "accepted" | "rejected") {
    const maxAge = 60 * 60 * 24 * 365;
    document.cookie = `${CONSENT_COOKIE}=${value}; path=/; max-age=${maxAge}; samesite=lax`;
    setDismissed(true);
  }

  if (!visible) return null;

  return (
    <div className={styles.cookieBanner} role="dialog" aria-live="polite" aria-label={labels.title}>
      <div className={styles.inner}>
        <div className={styles.copy}>
          <strong>{labels.title}</strong>
          <p>{labels.body}</p>
        </div>
        <div className={styles.actions}>
          <Link href="/cookies" className={styles.link}>
            {labels.learnMore}
          </Link>
          <button type="button" className={styles.reject} onClick={() => setConsent("rejected")}>
            {labels.reject}
          </button>
          <button type="button" className={styles.accept} onClick={() => setConsent("accepted")}>
            {labels.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
