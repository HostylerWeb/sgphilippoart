import Link from "next/link";
import styles from "./NavCard.module.css";

type NavCardProps = {
  href: string;
  title: string;
  description: string;
};

export function NavCard({ href, title, description }: NavCardProps) {
  return (
    <Link href={href} className={styles.card}>
      <strong>{title}</strong>
      <span>{description}</span>
    </Link>
  );
}
