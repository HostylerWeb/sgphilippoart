"use client";

import { useState, useTransition } from "react";
import { submitCommissionForm } from "@/actions/forms";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "@/components/forms/Form.module.css";

export function CommissionForm() {
  const { dict } = useI18n();
  const t = dict.forms.commission;
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const budgetOptions = [
    { value: "", label: t.budgetPlaceholder },
    { value: t.budgetUnder500, label: t.budgetUnder500 },
    { value: t.budget500to1000, label: t.budget500to1000 },
    { value: t.budget1000to2500, label: t.budget1000to2500 },
    { value: t.budget2500plus, label: t.budget2500plus },
  ];

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setMessage(null);
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await submitCommissionForm(formData);
      if (result.errors) {
        setErrors(result.errors);
        return;
      }
      if (!result.success) {
        setError(result.message ?? null);
        return;
      }
      if (result.success) {
        setMessage(result.message ?? t.success);
        form.reset();
      }
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} style={{ maxWidth: "100%" }}>
      <label>
        {t.name}
        <input type="text" name="name" required />
      </label>
      <label>
        {t.email}
        <input type="email" name="email" required />
      </label>
      <label>
        {t.phone}
        <input type="tel" name="phone" />
      </label>
      <label>
        {t.budget}
        <select name="budgetRange" defaultValue="">
          {budgetOptions.map((option) => (
            <option key={option.value || "empty"} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t.description}
        <textarea name="description" rows={6} required />
        {errors.description?.[0] && (
          <span className={styles.fieldError}>{errors.description[0]}</span>
        )}
      </label>
      <label>
        {t.referenceUrl}
        <input type="url" name="referenceUrl" placeholder="https://" />
      </label>
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? t.submitting : t.submit}
      </button>
    </form>
  );
}
