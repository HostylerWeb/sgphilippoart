"use client";

import { useState, useTransition } from "react";
import { submitContactForm } from "@/actions/forms";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "@/components/forms/Form.module.css";

type ContactFormProps = {
  artworkSlug?: string;
  defaultMessage?: string;
};

export function ContactForm({ artworkSlug, defaultMessage }: ContactFormProps) {
  const { dict } = useI18n();
  const t = dict.forms.contact;
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setMessage(null);
    setError(null);
    const form = event.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const result = await submitContactForm(formData);
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
      {artworkSlug && <input type="hidden" name="artworkSlug" value={artworkSlug} />}
      <label>
        {t.name}
        <input type="text" name="name" required />
        {errors.name?.[0] && <span className={styles.fieldError}>{errors.name[0]}</span>}
      </label>
      <label>
        {t.email}
        <input type="email" name="email" required />
        {errors.email?.[0] && <span className={styles.fieldError}>{errors.email[0]}</span>}
      </label>
      {artworkSlug && (
        <label>
          {t.artwork}
          <input type="text" value={artworkSlug} readOnly />
        </label>
      )}
      <label>
        {t.subject}
        <input type="text" name="subject" />
      </label>
      <label>
        {t.message}
        <textarea name="message" rows={6} required defaultValue={defaultMessage} />
        {errors.message?.[0] && <span className={styles.fieldError}>{errors.message[0]}</span>}
      </label>
      {message && <p className={styles.success}>{message}</p>}
      {error && <p className={styles.error}>{error}</p>}
      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? t.sending : t.send}
      </button>
    </form>
  );
}
