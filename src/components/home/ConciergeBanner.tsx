import Link from "next/link";
import styles from "./ConciergeBanner.module.css";

type ConciergeBannerProps = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
};

export function ConciergeBanner({ eyebrow, title, body, cta }: ConciergeBannerProps) {
  return (
    <section className={styles.concierge}>
      <div className="wrap">
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        <p>{body}</p>
        <Link href="/commissions" className={styles.btnLight}>
          {cta}
        </Link>
      </div>
    </section>
  );
}
