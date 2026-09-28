import Link from "next/link";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./ProductsFilter.module.css";

type ProductsFilterProps = {
  query: string;
  status: string;
  labels: Dictionary["admin"]["productFilter"] & {
    filter: string;
    clear: string;
  };
};

const STATUSES = ["", "draft", "published", "sold", "archived"] as const;

const STATUS_LABEL_KEYS: Record<
  string,
  keyof Dictionary["admin"]["productFilter"]
> = {
  draft: "statusDraft",
  published: "statusPublished",
  sold: "statusSold",
  archived: "statusArchived",
};

export function ProductsFilter({ query, status, labels }: ProductsFilterProps) {
  return (
    <form className={styles.form} method="get">
      <input
        name="q"
        type="search"
        placeholder={labels.searchPlaceholder}
        defaultValue={query}
        className={styles.search}
      />
      <select name="status" defaultValue={status} className={styles.select}>
        <option value="">{labels.allStatuses}</option>
        {STATUSES.filter(Boolean).map((value) => (
          <option key={value} value={value}>
            {labels[STATUS_LABEL_KEYS[value]]}
          </option>
        ))}
      </select>
      <button type="submit" className={styles.submit}>
        {labels.filter}
      </button>
      {(query || status) && (
        <Link href="/admin/products" className={styles.clear}>
          {labels.clear}
        </Link>
      )}
    </form>
  );
}
