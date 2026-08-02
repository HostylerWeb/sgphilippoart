import Link from "next/link";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getDictionary, getLocale } from "@/i18n";
import styles from "./not-found.module.css";

export default async function NotFound() {
  const dict = getDictionary(await getLocale());
  const t = dict.notFound;

  return (
    <StorefrontShell>
      <section className={styles.section}>
        <div className={`wrap ${styles.inner}`}>
          <div className={styles.card}>
            <span className="eyebrow">404</span>
            <h1>{t.title}</h1>
            <p>{t.body}</p>
            <div className={styles.actions}>
              <Link href="/" className={styles.primary}>
                {t.home}
              </Link>
              <Link href="/collections" className={styles.secondary}>
                {t.collections}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </StorefrontShell>
  );
}
