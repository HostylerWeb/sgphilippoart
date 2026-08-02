import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { UnsubscribeForm } from "@/components/forms/UnsubscribeForm";
import { MessagePanel } from "@/components/ui/MessagePanel";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "@/i18n";
import { db } from "@/lib/db";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale());
  const t = dict.pages.newsletterUnsubscribe;
  return buildPageMetadata({
    title: `${t.title} — SG Philippo Art`,
    description: t.description,
    path: "/newsletter/unsubscribe",
    noIndex: true,
  });
}

type PageProps = {
  searchParams: Promise<{ token?: string }>;
};

export default async function NewsletterUnsubscribePage({ searchParams }: PageProps) {
  const dict = getDictionary(await getLocale());
  const t = dict.pages.newsletterUnsubscribe;
  const { token } = await searchParams;

  const subscriber = token
    ? await db.newsletter_subscribers.findUnique({ where: { unsubscribe_token: token } })
    : null;

  return (
    <StorefrontShell>
      <ContentPage hero eyebrow={t.eyebrow} title={t.title} description={t.description}>
        {!token ? (
          <MessagePanel
            title={t.invalidTitle}
            description={t.invalid}
            tone="error"
            actionLabel={t.backHome}
            actionHref="/"
          />
        ) : subscriber?.unsubscribed_at ? (
          <MessagePanel
            title={t.successTitle}
            description={t.success}
            tone="success"
            actionLabel={t.backHome}
            actionHref="/"
          />
        ) : (
          <div className={styles.formWrap}>
            <UnsubscribeForm token={token} labels={t} />
          </div>
        )}
      </ContentPage>
    </StorefrontShell>
  );
}
