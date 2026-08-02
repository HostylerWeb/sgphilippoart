import Link from "next/link";
import { LegalDocument } from "@/components/legal/LegalDocument";
import { getDictionary, getLocale } from "@/i18n";
import { LEGAL_PAGE_PATHS } from "@/i18n/legal";
import type { LegalPageContent, LegalPageSlug } from "@/i18n/legal/types";
import styles from "./LegalPageView.module.css";

const RELATED_SLUGS: LegalPageSlug[] = [
  "privacy",
  "terms",
  "cookies",
  "shipping",
  "returns",
  "legalNotice",
];

const NAV_LABEL_KEYS: Record<
  LegalPageSlug,
  "privacy" | "terms" | "cookies" | "shipping" | "returns" | "legalNotice"
> = {
  privacy: "privacy",
  terms: "terms",
  cookies: "cookies",
  shipping: "shipping",
  returns: "returns",
  legalNotice: "legalNotice",
};

type LegalPageViewProps = {
  content: LegalPageContent;
  slug: LegalPageSlug;
};

export async function LegalPageView({ content, slug }: LegalPageViewProps) {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const labels = dict.legal;
  const footer = dict.footer;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={`wrap ${styles.heroInner}`}>
          <span className={`eyebrow ${styles.eyebrow}`}>{content.eyebrow}</span>
          <h1 className={styles.title}>{content.title}</h1>
          <p className={styles.description}>{content.description}</p>
          <p className={styles.updated}>{content.lastUpdated}</p>
        </div>
      </header>

      <div className={`wrap ${styles.layout}`}>
        <aside className={styles.sidebar} aria-label={labels.onThisPage}>
          <nav className={styles.toc}>
            <p className={styles.sidebarLabel}>{labels.onThisPage}</p>
            <ul className={styles.tocList}>
              {content.sections.map((section, index) => {
                const anchor = section.id ?? `section-${index + 1}`;
                return (
                  <li key={anchor}>
                    <a href={`#${anchor}`} className={styles.tocLink}>
                      {section.title}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <nav className={styles.related} aria-label={labels.relatedPolicies}>
            <p className={styles.sidebarLabel}>{labels.relatedPolicies}</p>
            <ul className={styles.relatedList}>
              {RELATED_SLUGS.filter((item) => item !== slug).map((item) => (
                <li key={item}>
                  <Link href={LEGAL_PAGE_PATHS[item]} className={styles.relatedLink}>
                    {footer[NAV_LABEL_KEYS[item]]}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <LegalDocument content={content} />
      </div>
    </div>
  );
}
