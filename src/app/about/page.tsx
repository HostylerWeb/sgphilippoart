import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getAboutPageContent } from "@/lib/cms/about-page";
import { buildPageMetadata } from "@/lib/seo";
import { getLocale } from "@/i18n";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getAboutPageContent(locale);
  return buildPageMetadata({
    title: `${t.title} — SG Philippo Art`,
    description: t.description,
    path: "/about",
  });
}

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getAboutPageContent(locale);

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
          <section className={styles.introCard}>
            <p>{t.p1}</p>
            <p>{t.p2}</p>
          </section>

          <section className={styles.card}>
            <span className={styles.cardNumber}>01</span>
            <h2>{t.h2}</h2>
            <p>{t.p3}</p>
          </section>

          <section className={styles.card} id="process">
            <span className={styles.cardNumber}>02</span>
            <h2>{t.processTitle}</h2>
            <p>{t.processP1}</p>
            <p>{t.processP2}</p>
          </section>

          <aside className={styles.ctaCard}>
            <span className="eyebrow">{t.ctaEyebrow}</span>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaBody}</p>
            <div className={styles.ctaLinks}>
              <Link href="/collections" className={styles.primary}>
                {t.ctaCollections}
              </Link>
              <Link href="/commissions" className={styles.secondary}>
                {t.ctaCommissions}
              </Link>
            </div>
          </aside>
        </div>
      </ContentPage>
    </StorefrontShell>
  );
}
