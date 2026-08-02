"use client";

import { useRouter } from "next/navigation";
import styles from "./FilterSelect.module.css";

type FilterSelectOption = {
  value: string;
  label: string;
  href: string;
};

type FilterSelectProps = {
  id: string;
  value: string;
  options: FilterSelectOption[];
  ariaLabel: string;
};

export function FilterSelect({
  id,
  value,
  options,
  ariaLabel,
}: FilterSelectProps) {
  const router = useRouter();

  return (
    <div className={styles.wrap}>
      <select
        id={id}
        className={styles.select}
        value={value}
        aria-label={ariaLabel}
        onChange={(event) => {
          const option = options.find((item) => item.value === event.target.value);
          if (option) router.push(option.href);
        }}
      >
        {options.map((option) => (
          <option key={option.value || "all"} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className={styles.chevron} aria-hidden>
        ▾
      </span>
    </div>
  );
}
