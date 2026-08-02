"use client";

import { useState } from "react";
import {
  type ShippingCountryRates,
  serializeShippingCountryRates,
} from "@/lib/shipping";
import { sortCountriesByLocale } from "@/lib/european-countries";
import styles from "./ShippingRulesEditor.module.css";

type ShippingRulesEditorProps = {
  initialRates: ShippingCountryRates;
  shippingMode: string;
};

export function ShippingRulesEditor({
  initialRates,
  shippingMode,
}: ShippingRulesEditorProps) {
  const [rates, setRates] = useState<ShippingCountryRates>(initialRates);

  if (shippingMode !== "by_country") {
    return (
      <input
        type="hidden"
        name="shipping_country_rates"
        value={serializeShippingCountryRates(initialRates)}
      />
    );
  }

  function updateDefaultRate(value: number) {
    setRates((current) => ({ ...current, defaultRate: value }));
  }

  function updateCountryRate(index: number, field: "code" | "rate", value: string) {
    setRates((current) => ({
      ...current,
      countries: current.countries.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: field === "rate" ? Math.max(0, Number(value) || 0) : value.toUpperCase(),
            }
          : row,
      ),
    }));
  }

  function addCountry() {
    setRates((current) => ({
      ...current,
      countries: [...current.countries, { code: "", rate: current.defaultRate }],
    }));
  }

  function removeCountry(index: number) {
    setRates((current) => ({
      ...current,
      countries: current.countries.filter((_, i) => i !== index),
    }));
  }

  return (
    <div className={styles.wrap}>
      <input
        type="hidden"
        name="shipping_country_rates"
        value={serializeShippingCountryRates(rates)}
      />

      <label className={styles.defaultRate}>
        Default rate (all other countries)
        <input
          type="number"
          min="0"
          step="0.01"
          value={rates.defaultRate}
          onChange={(event) => updateDefaultRate(Number(event.target.value))}
        />
      </label>

      <div className={styles.tableHead}>
        <span>Country</span>
        <span>Shipping fee</span>
        <span />
      </div>

      {rates.countries.map((row, index) => (
        <div key={`${row.code}-${index}`} className={styles.row}>
          <select
            value={row.code}
            onChange={(event) => updateCountryRate(index, "code", event.target.value)}
          >
            <option value="">Select country</option>
            {sortCountriesByLocale("en").map((country) => (
              <option key={country.code} value={country.code}>
                {country.name.en}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="0"
            step="0.01"
            value={row.rate}
            onChange={(event) => updateCountryRate(index, "rate", event.target.value)}
          />
          <button type="button" onClick={() => removeCountry(index)}>
            Remove
          </button>
        </div>
      ))}

      <button type="button" className={styles.addBtn} onClick={addCountry}>
        Add country rate
      </button>

      <p className={styles.hint}>
        Set a fee per country. Orders use the matching country rate, or the default rate if none is set.
        Free shipping threshold (if configured) still applies to all modes.
      </p>
    </div>
  );
}
