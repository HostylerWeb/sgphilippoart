import type { Metadata } from "next";
import { AuthPageShell } from "@/components/layout/AuthPageShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";
import { getDictionary, getLocale } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const t = getDictionary(await getLocale()).auth;
  return {
    title: `${t.forgotTitle} — SG Philippo Art`,
    robots: { index: false },
  };
}

export default async function ForgotPasswordPage() {
  const dict = getDictionary(await getLocale());
  const t = dict.auth;

  return (
    <StorefrontShell>
      <AuthPageShell eyebrow={dict.account.eyebrow} title={t.forgotTitle} description={t.forgotDescription}>
        <ForgotPasswordForm />
      </AuthPageShell>
    </StorefrontShell>
  );
}
