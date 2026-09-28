"use client";

import { useState } from "react";
import { useI18n } from "@/components/layout/I18nProvider";
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
  const { dict, locale } = useI18n();
  const f = dict.admin.forms.shipping;
  const countryLocale = locale === "fr" ? "fr" : "en";

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
        {f.defaultRate}
        <input
          type="number"
          min="0"
          step="0.01"
          value={rates.defaultRate}
          onChange={(event) => updateDefaultRate(Number(event.target.value))}
        />
      </label>

      <div className={styles.tableHead}>
        <span>{f.country}</span>
        <span>{f.shippingFee}</span>
        <span />
      </div>

      {rates.countries.map((row, index) => (
        <div key={`${row.code}-${index}`} className={styles.row}>
          <select
            value={row.code}
            onChange={(event) => updateCountryRate(index, "code", event.target.value)}
          >
            <option value="">{f.selectCountry}</option>
            {sortCountriesByLocale(countryLocale).map((country) => (
              <option key={country.code} value={country.code}>
                {country.name[countryLocale]}
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
            {f.remove}
          </button>
        </div>
      ))}

      <button type="button" className={styles.addBtn} onClick={addCountry}>
        {f.addCountryRate}
      </button>

      <p className={styles.hint}>{f.hint}</p>
    </div>
  );
}
