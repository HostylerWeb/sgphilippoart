"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { resetPassword } from "@/actions/forms";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "@/components/forms/Form.module.css";

export function ResetPasswordForm({ token }: { token: string }) {
  const { dict } = useI18n();
  const t = dict.auth;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("token", token);

    startTransition(async () => {
      const result = await resetPassword(formData);
      if (result.errors) {
        setError(
          result.errors.confirmPassword?.[0] ??
            result.errors.password?.[0] ??
            dict.validation.invalidDetails,
        );
        return;
      }
      if (!result.success) {
        setError(result.message ?? dict.validation.resetInvalid);
        return;
      }
      setMessage(result.message ?? t.passwordUpdated);
      router.push("/login");
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        {t.resetPassword}
        <input type="password" name="password" required autoComplete="new-password" />
      </label>
      <label>
        {t.confirmPassword}
        <input type="password" name="confirmPassword" required autoComplete="new-password" />
      </label>
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}
      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? t.savingPassword : t.resetPassword}
      </button>
      <Link href="/login" className={styles.link}>
        {t.backToSignIn}
      </Link>
    </form>
  );
}
