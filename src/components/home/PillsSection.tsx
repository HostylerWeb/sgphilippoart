import Link from "next/link";
import styles from "./PillsSection.module.css";

type PillItem = {
  label: string;
  href: string;
};

type PillsSectionProps = {
  eyebrow: string;
  title: string;
  items: PillItem[];
  variant?: "default" | "price-band";
};

export function PillsSection({
  eyebrow,
  title,
  items,
  variant = "default",
}: PillsSectionProps) {
  return (
    <section className={variant === "price-band" ? styles.priceBand : styles.sectionTight}>
      <div className="wrap pills-head">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className={styles.heading}>{title}</h2>
      </div>
      <div className={`wrap ${styles.pills}`}>
        {items.map((item) => (
          <Link key={item.href} href={item.href} className={styles.pill}>
            {item.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
