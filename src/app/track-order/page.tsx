import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { TrackOrderForm } from "@/components/forms/TrackOrderForm";
import { buildPageMetadata } from "@/lib/seo";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale());
  const t = dict.pages.trackOrder;
  return buildPageMetadata({
    title: `${t.title} — SG Philippo Art`,
    description: t.description,
    path: "/track-order",
  });
}

export default async function TrackOrderPage() {
  const locale = await getLocale();
  const [settings, dict] = await Promise.all([getStoreSettings(locale), getDictionary(locale)]);
  const t = dict.pages.trackOrder;

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
          <aside className={styles.help}>
            <div className={styles.helpCard}>
              <span className={styles.helpNumber}>01</span>
              <h2>{t.helpOrderTitle}</h2>
              <p>{t.helpOrderBody}</p>
            </div>
            <div className={styles.helpCard}>
              <span className={styles.helpNumber}>02</span>
              <h2>{t.helpEmailTitle}</h2>
              <p>{t.helpEmailBody}</p>
            </div>
            <div className={styles.helpCard}>
              <span className={styles.helpNumber}>03</span>
              <h2>{t.helpSupportTitle}</h2>
              <p>{formatSupport(t.helpSupportBody, settings.contactEmail)}</p>
            </div>
          </aside>

          <div className={styles.formWrap}>
            <TrackOrderForm labels={t} currency={settings} />
          </div>
        </div>
      </ContentPage>
    </StorefrontShell>
  );
}

function formatSupport(template: string, email: string) {
  return template.replace("{email}", email);
}
