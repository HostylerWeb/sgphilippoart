import type { ReactNode } from "react";
import styles from "./TrustStrip.module.css";

export type TrustItemData = {
  id: string;
  title: string;
  body: string;
  icon: string;
};

type TrustStripProps = {
  items: TrustItemData[];
};

const ICONS: Record<string, ReactNode> = {
  shield: (
    <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="#7A2331" strokeWidth="1.3">
      <path d="M12 2 4 5v6c0 5 3.4 8.7 8 11 4.6-2.3 8-6 8-11V5l-8-3Z" />
    </svg>
  ),
  truck: (
    <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="#7A2331" strokeWidth="1.3">
      <rect x="1" y="3" width="15" height="13" />
      <path d="M16 8h4l3 3v5h-7" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  ),
  return: (
    <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="#7A2331" strokeWidth="1.3">
      <path d="M7 6 3 10l4 4" />
      <path d="M3 10h11a5 5 0 0 1 0 10H9" />
    </svg>
  ),
  star: (
    <svg className={styles.trustIcon} viewBox="0 0 24 24" fill="none" stroke="#7A2331" strokeWidth="1.3">
      <path d="M12 17.3 5.8 21l1.2-7-5-4.9 6.9-1L12 2l3.1 6.1 6.9 1-5 4.9 1.2 7Z" />
    </svg>
  ),
};

export function TrustStrip({ items }: TrustStripProps) {
  if (items.length === 0) return null;

  return (
    <section className={styles.trust}>
      <div className={`wrap ${styles.trustGrid}`}>
        {items.map((item) => (
          <div key={item.id} className={styles.trustItem}>
            <div className={styles.trustIconWrap}>
              {ICONS[item.icon] ?? ICONS.shield}
            </div>
            <div className={styles.trustCopy}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
