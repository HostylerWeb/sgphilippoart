import Link from "next/link";
import { FilterSelect } from "@/components/collection/FilterSelect";
import { formatPrice } from "@/lib/format";
import { formatMessage } from "@/i18n";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { StoreSettings } from "@/lib/settings";
import { PRICE_RANGES } from "@/lib/price-ranges";
import styles from "./CollectionFilters.module.css";

type CollectionFiltersProps = {
  basePath: string;
  total: number;
  settings: Pick<StoreSettings, "currencyCode" | "currencyLocale">;
  labels: Dictionary["filters"];
  current: {
    type?: string;
    price?: string;
    sort?: string;
  };
  variant?: "toolbar" | "sidebar";
};

export function CollectionFilters({
  basePath,
  total,
  settings,
  labels,
  current,
  variant = "toolbar",
}: CollectionFiltersProps) {
  function buildUrl(overrides: Record<string, string | undefined>) {
    const params = new URLSearchParams();
    const next = { ...current, ...overrides };

    if (next.type) params.set("type", next.type);
    if (next.price) params.set("price", next.price);
    if (next.sort && next.sort !== "newest") params.set("sort", next.sort);

    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  }

  const hasActiveFilters = Boolean(
    current.type || current.price || (current.sort && current.sort !== "newest"),
  );
  const sortValue = current.sort ?? "newest";

  const priceOptions = [
    { value: "", label: labels.allPrices, href: buildUrl({ price: undefined }) },
    ...PRICE_RANGES.map((range) => ({
      value: range.slug,
      label:
        range.min === 0
          ? formatMessage(labels.under, { price: formatPrice(range.max, settings) })
          : formatMessage(labels.range, {
              min: formatPrice(range.min, settings),
              max: formatPrice(range.max, settings),
            }),
      href: buildUrl({ price: range.slug }),
    })),
  ];

  const sortOptions = [
    { value: "newest", label: labels.sortNewest, href: buildUrl({ sort: "newest" }) },
    { value: "price-asc", label: labels.sortPriceAsc, href: buildUrl({ sort: "price-asc" }) },
    { value: "price-desc", label: labels.sortPriceDesc, href: buildUrl({ sort: "price-desc" }) },
  ];

  return (
    <div className={variant === "sidebar" ? styles.sidebar : styles.toolbar}>
      {variant === "toolbar" && (
        <div className={styles.topRow}>
          <p className={styles.count}>
            {total} {total === 1 ? labels.work : labels.works}
          </p>
          <div className={styles.topActions}>
            {hasActiveFilters && (
              <Link href={basePath} className={styles.clear}>
                {labels.clear}
              </Link>
            )}
            <div className={styles.sortField}>
              <label htmlFor="collection-sort">{labels.sort}</label>
              <FilterSelect
                id="collection-sort"
                value={sortValue}
                ariaLabel={labels.sort}
                options={sortOptions}
              />
            </div>
          </div>
        </div>
      )}

      <div className={variant === "sidebar" ? styles.sidebarPanel : styles.panel}>
        {variant === "sidebar" && (
          <div className={styles.sidebarHead}>
            <span className={styles.sidebarTitle}>{labels.refine}</span>
            {hasActiveFilters && (
              <Link href={basePath} className={styles.clear}>
                {labels.clear}
              </Link>
            )}
          </div>
        )}
        <div className={styles.filterGroup}>
          <span className={styles.label}>{labels.type}</span>
          <div className={styles.segmented} role="group" aria-label={labels.type}>
            <Link
              href={buildUrl({ type: undefined })}
              className={!current.type ? styles.segmentActive : undefined}
              aria-current={!current.type ? "page" : undefined}
            >
              {labels.typeAll}
            </Link>
            <Link
              href={buildUrl({ type: "original" })}
              className={current.type === "original" ? styles.segmentActive : undefined}
              aria-current={current.type === "original" ? "page" : undefined}
            >
              {labels.typeOriginals}
            </Link>
            <Link
              href={buildUrl({ type: "print" })}
              className={current.type === "print" ? styles.segmentActive : undefined}
              aria-current={current.type === "print" ? "page" : undefined}
            >
              {labels.typePrints}
            </Link>
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.label} htmlFor="collection-price">
            {labels.price}
          </label>
          <FilterSelect
            id="collection-price"
            value={current.price ?? ""}
            ariaLabel={labels.price}
            options={priceOptions}
          />
        </div>

        {variant === "sidebar" && (
          <div className={styles.filterGroup}>
            <label className={styles.label} htmlFor="collection-sort-sidebar">
              {labels.sort}
            </label>
            <FilterSelect
              id="collection-sort-sidebar"
              value={sortValue}
              ariaLabel={labels.sort}
              options={sortOptions}
            />
          </div>
        )}
      </div>
    </div>
  );
}
