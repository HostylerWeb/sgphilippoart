import Link from "next/link";
import { formatMessage } from "@/i18n";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./Pagination.module.css";

type PaginationProps = {
  basePath: string;
  page: number;
  pageCount: number;
  searchParams: Record<string, string | undefined>;
  labels: Dictionary["filters"];
  ariaLabel: string;
};

export function Pagination({
  basePath,
  page,
  pageCount,
  searchParams,
  labels,
  ariaLabel,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  function pageUrl(targetPage: number) {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    if (targetPage > 1) params.set("page", String(targetPage));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  return (
    <nav className={styles.pagination} aria-label={ariaLabel}>
      {page > 1 ? (
        <Link href={pageUrl(page - 1)} className={styles.pageBtn}>
          {labels.previous}
        </Link>
      ) : (
        <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>{labels.previous}</span>
      )}
      <span className={styles.pageInfo}>
        {formatMessage(labels.page, { page, total: pageCount })}
      </span>
      {page < pageCount ? (
        <Link href={pageUrl(page + 1)} className={styles.pageBtn}>
          {labels.next}
        </Link>
      ) : (
        <span className={`${styles.pageBtn} ${styles.pageBtnDisabled}`}>{labels.next}</span>
      )}
    </nav>
  );
}
