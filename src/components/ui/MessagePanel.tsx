import Link from "next/link";
import styles from "./MessagePanel.module.css";

type MessagePanelProps = {
  title: string;
  description?: string;
  tone?: "default" | "success" | "error";
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
};

export function MessagePanel({
  title,
  description,
  tone = "default",
  actionLabel,
  actionHref,
  children,
}: MessagePanelProps) {
  return (
    <div className={`${styles.panel} ${styles[tone]}`}>
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
      {children}
      {actionLabel && actionHref && (
        <Link href={actionHref} className={styles.action}>
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
