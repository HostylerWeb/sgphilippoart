"use client";

import { useState } from "react";
import styles from "./TranslationFields.module.css";

export type TranslationFieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea";
  rows?: number;
};

export type AutoTranslateConfig = {
  /** Maps translation field name → French primary input `name` in the same form. */
  sourceFields: Record<string, string>;
};

type TranslationFieldsProps = {
  title: string;
  hint?: string;
  locale: "en" | "nl";
  fields: TranslationFieldConfig[];
  values?: Record<string, string | undefined>;
  autoTranslate?: AutoTranslateConfig;
  autoTranslateLabel?: string;
  autoTranslatingLabel?: string;
};

export function TranslationFields({
  title,
  hint,
  locale,
  fields,
  values = {},
  autoTranslate,
  autoTranslateLabel = "Auto-translate from French",
  autoTranslatingLabel = "Translating…",
}: TranslationFieldsProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAutoTranslate(trigger: HTMLButtonElement) {
    if (!autoTranslate || busy) return;
    setError(null);

    const form =
      trigger.closest("form") ??
      trigger.closest("fieldset")?.closest("form") ??
      document.querySelector("form[data-admin-product-form]");
    if (!form || !(form instanceof HTMLFormElement)) {
      setError("Could not find the product form.");
      return;
    }

    const payload: Record<string, string> = {};
    for (const field of fields) {
      const sourceName = autoTranslate.sourceFields[field.name];
      if (!sourceName) continue;
      const sourceEl = form.elements.namedItem(sourceName);
      if (
        sourceEl instanceof HTMLInputElement ||
        sourceEl instanceof HTMLTextAreaElement
      ) {
        const value = sourceEl.value.trim();
        if (value) payload[field.name] = value;
      }
    }

    if (Object.keys(payload).length === 0) {
      setError("Fill in the French fields above first.");
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/admin/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetLocale: locale, fields: payload }),
      });
      const data = (await response.json()) as {
        translated?: Record<string, string>;
        error?: string;
      };
      if (!response.ok || !data.translated) {
        throw new Error(data.error ?? "Translation failed.");
      }

      for (const field of fields) {
        const translated = data.translated[field.name];
        if (translated === undefined) continue;
        const targetName = `translation_${locale}_${field.name}`;
        const targetEl = form.elements.namedItem(targetName);
        if (
          targetEl instanceof HTMLInputElement ||
          targetEl instanceof HTMLTextAreaElement
        ) {
          targetEl.value = translated;
          targetEl.dispatchEvent(new Event("input", { bubbles: true }));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Translation failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>
        <span className={styles.legendTitle}>{title}</span>
        {autoTranslate && (
          <button
            type="button"
            className={styles.autoTranslateBtn}
            onClick={(event) => void handleAutoTranslate(event.currentTarget)}
            disabled={busy}
          >
            {busy ? autoTranslatingLabel : autoTranslateLabel}
          </button>
        )}
      </legend>
      {hint && <p className={styles.hint}>{hint}</p>}
      {error && (
        <p className={styles.autoTranslateError} role="alert">
          {error}
        </p>
      )}
      <div className={styles.grid}>
        {fields.map((field) => (
          <label
            key={field.name}
            className={field.type === "textarea" ? styles.fullWidth : undefined}
          >
            {field.label}
            {field.type === "textarea" ? (
              <textarea
                name={`translation_${locale}_${field.name}`}
                rows={field.rows ?? 4}
                defaultValue={values[field.name] ?? ""}
              />
            ) : (
              <input
                name={`translation_${locale}_${field.name}`}
                defaultValue={values[field.name] ?? ""}
              />
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
