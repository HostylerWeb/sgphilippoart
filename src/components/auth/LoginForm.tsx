"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, googleSignInAction } from "@/actions/auth";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "@/components/forms/Form.module.css";

type LoginFormProps = {
  callbackUrl?: string;
  showGoogle?: boolean;
  embedded?: boolean;
};

export function LoginForm({
  callbackUrl = "/account",
  showGoogle,
  embedded = false,
}: LoginFormProps) {
  const { dict } = useI18n();
  const t = dict.auth;
  const [state, formAction, isPending] = useActionState(loginAction, {});
  const registerHref = callbackUrl
    ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/register";

  return (
    <div>
      <form className={styles.form} action={formAction}>
        <input type="hidden" name="callbackUrl" value={callbackUrl} />
        <label>
          {t.email}
          <input type="email" name="email" required autoComplete="email" />
        </label>
        <label>
          {t.password}
          <input type="password" name="password" required autoComplete="current-password" />
        </label>
        {state.error && <p className={styles.error}>{state.error}</p>}
        <button type="submit" className={styles.submit} disabled={isPending}>
          {isPending ? t.signingIn : t.signIn}
        </button>
      </form>

      <p className={styles.linkRow}>
        <Link href="/forgot-password" className={styles.link}>
          {t.forgotPassword}
        </Link>
        {!embedded && (
          <Link href={registerHref} className={styles.link}>
            {t.createAccount}
          </Link>
        )}
      </p>

      {showGoogle && (
        <>
          <div className={styles.divider} style={{ margin: "24px 0" }}>
            {t.or}
          </div>
          <form action={googleSignInAction}>
            <input type="hidden" name="callbackUrl" value={callbackUrl} />
            <button type="submit" className={styles.oauthBtn}>
              {t.google}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
