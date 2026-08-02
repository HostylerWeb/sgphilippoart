"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/actions/forms";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "@/components/forms/Form.module.css";

type RegisterFormProps = {
  callbackUrl?: string;
  embedded?: boolean;
  onRegistered?: (message: string) => void;
};

export function RegisterForm({
  callbackUrl = "/account",
  embedded = false,
  onRegistered,
}: RegisterFormProps) {
  const { dict } = useI18n();
  const t = dict.auth;
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setMessage(null);
    setError(null);

    const formData = new FormData(event.currentTarget);
    startTransition(async () => {
      const result = await registerUser(formData);
      if (result.errors) {
        setErrors(result.errors);
        return;
      }
      if (!result.success) {
        setError(result.message ?? "Could not create account.");
        return;
      }

      const successMessage = result.message ?? t.accountCreated;
      if (embedded && onRegistered) {
        onRegistered(successMessage);
        return;
      }

      setMessage(successMessage);
      const loginHref = callbackUrl
        ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
        : "/login";
      router.push(loginHref);
    });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label>
        {t.name}
        <input type="text" name="name" required autoComplete="name" />
        {errors.name?.[0] && <span className={styles.fieldError}>{errors.name[0]}</span>}
      </label>
      <label>
        {t.email}
        <input type="email" name="email" required autoComplete="email" />
        {errors.email?.[0] && <span className={styles.fieldError}>{errors.email[0]}</span>}
      </label>
      <label>
        {t.password}
        <input type="password" name="password" required autoComplete="new-password" />
        {errors.password?.[0] && <span className={styles.fieldError}>{errors.password[0]}</span>}
      </label>
      <label>
        {t.confirmPassword}
        <input type="password" name="confirmPassword" required autoComplete="new-password" />
        {errors.confirmPassword?.[0] && (
          <span className={styles.fieldError}>{errors.confirmPassword[0]}</span>
        )}
      </label>
      {error && <p className={styles.error}>{error}</p>}
      {message && <p className={styles.success}>{message}</p>}
      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? t.signingUp : t.signUp}
      </button>
      {!embedded && (
        <div className={styles.linkRow}>
          <Link
            href={
              callbackUrl
                ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : "/login"
            }
            className={styles.link}
          >
            {t.haveAccount} {t.signIn}
          </Link>
        </div>
      )}
    </form>
  );
}
