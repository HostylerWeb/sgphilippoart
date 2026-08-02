import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { AuthPageShell } from "@/components/layout/AuthPageShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getDictionary, getLocale } from "@/i18n";

export const metadata: Metadata = {
  title: "Sign in — SG Philippo Art",
  robots: { index: false },
};

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string; tab?: string }>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const { callbackUrl, tab } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale).auth;
  const resolvedCallbackUrl = callbackUrl ?? "/account";
  const checkoutFlow = resolvedCallbackUrl.startsWith("/checkout");
  const initialTab = tab === "register" ? "register" : "login";
  const showGoogle = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

  return (
    <StorefrontShell>
      <AuthPageShell
        eyebrow={t.pageEyebrow}
        title={checkoutFlow ? t.checkoutTitle : t.loginTitle}
        description={checkoutFlow ? t.checkoutSubtitle : undefined}
      >
        <Suspense fallback={null}>
          <AuthPanel
            callbackUrl={resolvedCallbackUrl}
            showGoogle={showGoogle}
            initialTab={initialTab}
            checkoutFlow={checkoutFlow}
          />
        </Suspense>
      </AuthPageShell>
    </StorefrontShell>
  );
}
