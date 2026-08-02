import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContentPage } from "@/components/layout/ContentPage";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { CommissionForm } from "@/components/forms/CommissionForm";
import { buildPageMetadata } from "@/lib/seo";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const dict = getDictionary(await getLocale());
  const t = dict.pages.commissions;
  return buildPageMetadata({
    title: `${t.title} — SG Philippo Art`,
    description: t.description,
    path: "/commissions",
  });
}

export default async function CommissionsPage() {
  const locale = await getLocale();
  const [dict, settings] = await Promise.all([
    getDictionary(locale),
    getStoreSettings(locale),
  ]);
  const t = dict.pages.commissions;

  if (!settings.commissionEnabled) {
    redirect("/contact");
  }

  const steps = [t.step1, t.step2, t.step3, t.step4];

  return (
    <StorefrontShell>
      <ContentPage
        hero
        eyebrow={t.eyebrow}
        title={t.title}
        description={t.description}
        variant="wide"
      >
        <div className={styles.layout}>
          <div className={styles.intro}>
            <h2>{t.howItWorks}</h2>
            <ol className={styles.steps}>
              {steps.map((step, index) => (
                <li key={step}>
                  <span className={styles.stepNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className={styles.note}>
              <strong>{t.timelineNote}</strong> {t.timelineValue}
            </div>
          </div>
          <div className={styles.formWrap}>
            <h2>{t.formTitle}</h2>
            <CommissionForm />
          </div>
        </div>
      </ContentPage>
    </StorefrontShell>
  );
}
