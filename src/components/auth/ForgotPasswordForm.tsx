"use client";

import { useState, useTransition } from "react";
import { requestPasswordReset } from "@/actions/forms";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "@/components/forms/Form.module.css";

export function ForgotPasswordForm() {
  const { dict } = useI18n();
  const t = dict.auth;
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await requestPasswordReset(formData);
      setMessage(result.message ?? t.resetSuccess);
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        {t.email}
        <input type="email" name="email" required />
      </label>
      {message && <p className={styles.success}>{message}</p>}
      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? t.sendingReset : t.sendReset}
      </button>
    </form>
  );
}
