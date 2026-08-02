"use client";

import { useI18n } from "@/components/layout/I18nProvider";
import styles from "./StatusBadge.module.css";

type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const { dict } = useI18n();
  const labels = dict.status as Record<string, string | undefined>;
  const label = labels[status] ?? status.replace(/_/g, " ");

  return <span className={`${styles.badge} ${styles[status] ?? ""}`}>{label}</span>;
}
