import styles from "./AuthPageShell.module.css";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function AuthPageShell({ eyebrow, title, description, children }: AuthPageShellProps) {
  return (
    <section className={styles.section}>
      <div className="wrap">
        <div className={styles.card}>
          <span className="eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {description && <p className={styles.description}>{description}</p>}
          <div className={styles.body}>{children}</div>
        </div>
      </div>
    </section>
  );
}
