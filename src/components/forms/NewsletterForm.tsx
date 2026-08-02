"use client";

import { useState, useTransition } from "react";
import { subscribeNewsletter } from "@/actions/forms";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "./NewsletterForm.module.css";

type NewsletterFormProps = {
  variant?: "default" | "footer";
};

export function NewsletterForm({ variant = "default" }: NewsletterFormProps) {
  const { dict } = useI18n();
  const t = dict.newsletter;
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isFooter = variant === "footer";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await subscribeNewsletter(formData);
      if (result.errors?.email?.[0]) {
        setError(result.errors.email[0]);
        return;
      }
      if (result.success) {
        setMessage(result.message ?? "Subscribed.");
        form.reset();
      } else if (result.message) {
        setError(result.message);
      }
    });
  }

  return (
    <div className={isFooter ? styles.footerWrap : undefined}>
      <form
        className={isFooter ? styles.footerForm : styles.form}
        onSubmit={handleSubmit}
      >
        <input
          type="email"
          name="email"
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          required
          className={isFooter ? styles.footerInput : undefined}
        />
        <button type="submit" disabled={isPending} className={isFooter ? styles.footerButton : undefined}>
          {isPending ? t.submitting : t.submit}
        </button>
      </form>
      {message && (
        <p className={isFooter ? styles.footerNote : styles.note}>{message}</p>
      )}
      {error && (
        <p className={isFooter ? styles.footerError : styles.error}>{error}</p>
      )}
    </div>
  );
}
