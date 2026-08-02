import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { FaqAccordion } from "@/components/faq/FaqAccordion";
import { getStoreSettings } from "@/lib/settings";
import { formatMessage, getDictionary, getLocale } from "@/i18n";
import { buildPageMetadata } from "@/lib/seo";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.pages.faq;
  return buildPageMetadata({
    title: `${t.title} — SG Philippo Art`,
    description: t.description,
    path: "/faq",
  });
}

export default async function FaqPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.pages.faq;
  const settings = await getStoreSettings(locale);

  const items = [
    { question: t.q1, answer: t.a1 },
    {
      question: t.q2,
      answer: formatMessage(t.a2, { shipping: settings.shippingLabel }),
    },
    { question: t.q3, answer: t.a3 },
    { question: t.q4, answer: t.a4 },
    { question: t.q5, answer: t.a5 },
    {
      question: t.q6,
      answer: formatMessage(t.a6, { currency: settings.currencyCode }),
    },
    {
      question: t.q7,
      answer: formatMessage(t.a7, { returnsSummary: settings.returnsPolicySummary }),
    },
  ];

  return (
    <StorefrontShell>
      <ContentPage
        hero
        variant="wide"
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
      >
        <div className={styles.layout}>
          <FaqAccordion items={items} />

          <aside className={styles.help}>
            <span className="eyebrow">{t.helpEyebrow}</span>
            <h2>{t.helpTitle}</h2>
            <p>{t.helpBody}</p>
            <div className={styles.helpLinks}>
              <Link href="/contact">{t.helpContact}</Link>
              <Link href="/shipping">{t.helpShipping}</Link>
              <Link href="/returns">{t.helpReturns}</Link>
            </div>
          </aside>
        </div>
      </ContentPage>
    </StorefrontShell>
  );
}
