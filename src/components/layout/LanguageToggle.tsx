"use client";

import { setLocaleAction } from "@/actions/locale";
import { LOCALES, type Locale } from "@/i18n/config";
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
      {LOCALES.map((code) => (
        <button
          key={code}
          type="button"
          className={locale === code ? styles.active : undefined}
          onClick={() => select(code)}
          aria-pressed={locale === code}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
