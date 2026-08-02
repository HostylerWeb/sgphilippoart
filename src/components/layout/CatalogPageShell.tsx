import styles from "./CatalogPage.module.css";

type CatalogPageShellProps = {
  eyebrow?: string;
  title: string;
  description?: string | null;
  children: React.ReactNode;
};

export function CatalogPageShell({
  eyebrow,
  title,
  description,
  children,
}: CatalogPageShellProps) {
  return (
    <section className={styles.section}>
      <div className="wrap">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1 className={styles.title}>{title}</h1>
        {description && <p className={styles.description}>{description}</p>}
        {children}
      </div>
    </section>
  );
}
