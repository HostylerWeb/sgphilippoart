"use client";

import { setLocaleAction } from "@/actions/locale";
import type { Locale } from "@/i18n/config";
import styles from "./LanguageToggle.module.css";

type LanguageToggleProps = {
  locale: Locale;
  compact?: boolean;
  ariaLabel: string;
};

export function LanguageToggle({ locale, compact = false, ariaLabel }: LanguageToggleProps) {
  async function select(next: Locale) {
    if (next === locale) return;
    await setLocaleAction(next);
  }

  return (
    <div
      className={`${styles.toggle} ${compact ? styles.compact : ""}`}
      role="group"
      aria-label={ariaLabel}
    >
      <button
        type="button"
        className={locale === "en" ? styles.active : undefined}
        onClick={() => select("en")}
        aria-pressed={locale === "en"}
      >
        EN
      </button>
      <button
        type="button"
        className={locale === "fr" ? styles.active : undefined}
        onClick={() => select("fr")}
        aria-pressed={locale === "fr"}
      >
        FR
      </button>
    </div>
  );
}
