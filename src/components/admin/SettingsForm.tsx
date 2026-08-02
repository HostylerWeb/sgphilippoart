"use client";

import { useActionState, useState } from "react";
import { updateSettingsAction } from "@/actions/admin/settings";
import { ShippingRulesEditor } from "@/components/admin/ShippingRulesEditor";
import formStyles from "@/components/forms/Form.module.css";
import { parseShippingCountryRates } from "@/lib/shipping";
import { SETTINGS_FIELDS, type SettingsFormValues } from "@/lib/validations/settings";
import styles from "./SettingsForm.module.css";

type SettingsFormProps = {
  values: SettingsFormValues;
};

export function SettingsForm({ values }: SettingsFormProps) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, {});
  const [shippingMode, setShippingMode] = useState(String(values.shipping_mode));
  const countryRates = parseShippingCountryRates(values.shipping_country_rates);

  return (
    <form action={formAction} className={`${formStyles.form} ${styles.form}`}>
      {state.error && <p className={formStyles.error}>{state.error}</p>}
      {state.success && <p className={formStyles.success}>{state.success}</p>}

      {SETTINGS_FIELDS.map((section) => (
        <section key={section.section} className={styles.section}>
          <h2>{section.section}</h2>
          <div className={styles.grid}>
            {section.fields.map((field) => {
              const value = values[field.key];
              const isTextarea = field.type === "textarea";
              const isSelect = field.type === "select";

              return (
                <label
                  key={field.key}
                  className={isTextarea ? styles.fullWidth : undefined}
                >
                  {field.label}
                  {isTextarea ? (
                    <textarea
                      name={field.key}
                      rows={field.key.includes("body") || field.key.includes("description") ? 4 : 3}
                      defaultValue={String(value)}
                    />
                  ) : isSelect ? (
                    <select
                      name={field.key}
                      defaultValue={String(value)}
                      onChange={
                        field.key === "shipping_mode"
                          ? (event) => setShippingMode(event.target.value)
                          : undefined
                      }
                    >
                      {field.options?.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      name={field.key}
                      type={field.type ?? "text"}
                      defaultValue={String(value)}
                      step={field.type === "number" ? "any" : undefined}
                    />
                  )}
                </label>
              );
            })}

            {section.section === "Shipping & fees" && (
              <ShippingRulesEditor
                initialRates={countryRates}
                shippingMode={shippingMode}
              />
            )}
          </div>
        </section>
      ))}

      <button type="submit" className={formStyles.submit} disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
