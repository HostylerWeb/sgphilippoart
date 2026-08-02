import Link from "next/link";
import styles from "./ProductsFilter.module.css";

type ProductsFilterProps = {
  query: string;
  status: string;
};

const STATUSES = ["", "draft", "published", "sold", "archived"] as const;

export function ProductsFilter({ query, status }: ProductsFilterProps) {
  return (
    <form className={styles.form} method="get">
      <input
        name="q"
        type="search"
        placeholder="Search title or slug…"
        defaultValue={query}
        className={styles.search}
      />
      <select name="status" defaultValue={status} className={styles.select}>
        <option value="">All statuses</option>
        {STATUSES.filter(Boolean).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>
      <button type="submit" className={styles.submit}>
        Filter
      </button>
      {(query || status) && (
        <Link href="/admin/products" className={styles.clear}>
          Clear
        </Link>
      )}
    </form>
  );
}
