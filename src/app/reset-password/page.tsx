import type { Metadata } from "next";
import Link from "next/link";
import { AuthPageShell } from "@/components/layout/AuthPageShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";
import { getDictionary, getLocale } from "@/i18n";
import styles from "@/components/forms/Form.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale()).auth;
  return {
    title: `${t.resetTitle} — SG Philippo Art`,
    robots: { index: false },
  };
}

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.auth;
  const { token } = await searchParams;

  return (
    <StorefrontShell>
      <AuthPageShell eyebrow={dict.account.eyebrow} title={t.resetTitle} description={t.resetDescription}>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <div className={styles.error}>
            {t.resetInvalidLink}{" "}
            <Link href="/forgot-password" className={styles.link}>
              {t.requestNewLink}
            </Link>
          </div>
        )}
      </AuthPageShell>
    </StorefrontShell>
  );
}
