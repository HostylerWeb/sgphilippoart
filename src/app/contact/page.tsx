import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildPageMetadata } from "@/lib/seo";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale());
  const t = dict.pages.contact;
  return buildPageMetadata({
    title: `${t.title} — SG Philippo Art`,
    description: t.description,
    path: "/contact",
  });
}

type PageProps = {
  searchParams: Promise<{ work?: string }>;
};

export default async function ContactPage({ searchParams }: PageProps) {
  const locale = await getLocale();
  const [settings, dict] = await Promise.all([getStoreSettings(locale), getDictionary(locale)]);
  const { work } = await searchParams;
  const t = dict.pages.contact;

  return (
    <StorefrontShell>
      <ContentPage hero eyebrow={t.eyebrow} title={t.title} description={t.description} variant="wide">
        <div className={styles.layout}>
          <div className={styles.info}>
            <div className={styles.card}>
              <span className="eyebrow">{t.emailLabel}</span>
              <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>
            </div>
            <div className={styles.card}>
              <span className="eyebrow">{t.hoursLabel}</span>
              <p>{t.hoursValue}</p>
            </div>
            <div className={styles.card}>
              <span className="eyebrow">{t.responseLabel}</span>
              <p>{t.responseValue}</p>
            </div>
          </div>
          <div className={styles.formWrap}>
            <ContactForm
              artworkSlug={work}
              defaultMessage={
                work ? dict.forms.contact.defaultMessage.replace("{work}", work) : undefined
              }
            />
          </div>
        </div>
      </ContentPage>
    </StorefrontShell>
  );
}
