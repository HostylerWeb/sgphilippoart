import styles from "./ContentPage.module.css";

type ContentPageProps = {
  title: string;
  eyebrow?: string;
  description?: string;
  variant?: "default" | "narrow" | "wide";
  hero?: boolean;
  children: React.ReactNode;
};

export function ContentPage({
  title,
  eyebrow,
  description,
  variant = "default",
  hero = false,
  children,
}: ContentPageProps) {
  const widthClass =
    variant === "narrow"
      ? styles.innerNarrow
      : variant === "wide"
        ? styles.innerWide
        : styles.inner;

  const header = (
    <header className={styles.header}>
      {eyebrow && <span className={`eyebrow ${styles.eyebrow}`}>{eyebrow}</span>}
      <h1 className={styles.title}>{title}</h1>
      {description && <p className={styles.description}>{description}</p>}
    </header>
  );

  if (hero) {
    return (
      <div className={styles.page}>
        <section className={styles.hero}>
          <div className={`wrap ${widthClass}`}>{header}</div>
        </section>
        <section className={styles.section}>
          <div className={`wrap ${widthClass}`}>
            <div className={styles.body}>{children}</div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <div className={`wrap ${widthClass}`}>
        {header}
        <div className={styles.body}>{children}</div>
      </div>
    </section>
  );
}
