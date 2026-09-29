"use client";

import { useActionState, useState } from "react";
import { updateSettingsAction } from "@/actions/admin/settings";
import { ShippingRulesEditor } from "@/components/admin/ShippingRulesEditor";
import { useI18n } from "@/components/layout/I18nProvider";
import formStyles from "@/components/forms/Form.module.css";
import { SOCIAL_PLATFORMS } from "@/lib/social-links";
import { SETTINGS_FIELD_GROUPS } from "@/lib/settings-field-groups";
import { parseShippingCountryRates } from "@/lib/shipping";
import type { SettingsFormValues } from "@/lib/validations/settings";
import styles from "./SettingsForm.module.css";

type SettingsFormProps = {
  values: SettingsFormValues;
};

export function SettingsForm({ values }: SettingsFormProps) {
  const { dict } = useI18n();
  const f = dict.admin.forms.settings;
  const sf = dict.admin.forms.settingsForm;
  const saving = dict.admin.common.saving;

  const [state, formAction, pending] = useActionState(updateSettingsAction, {});
  const [shippingMode, setShippingMode] = useState(String(values.shipping_mode));
  const countryRates = parseShippingCountryRates(values.shipping_country_rates);

  function fieldLabel(key: keyof SettingsFormValues): string {
    const fields = sf.fields as Record<string, string>;
    const social = sf.socialFields as Record<string, string>;
    return fields[key] ?? social[key] ?? key;
  }

  function optionLabel(fieldKey: keyof SettingsFormValues, value: string): string {
    const options = sf.selectOptions as Record<string, string>;
    return options[`${fieldKey}_${value}`] ?? value;
  }

  return (
    <form action={formAction} className={`${formStyles.form} ${styles.form}`}>
      {state.error && <p className={formStyles.error}>{state.error}</p>}
      {state.success && <p className={formStyles.success}>{state.success}</p>}

      {SETTINGS_FIELD_GROUPS.map((section) => {
        if (section.sectionKey === "social") {
          return (
            <section key={section.sectionKey} className={styles.section}>
              <h2>{sf.sectionTitles[section.sectionKey]}</h2>
              <div className={styles.grid}>
                {SOCIAL_PLATFORMS.map((platform) => (
                  <label key={platform.settingKey}>
                    {fieldLabel(platform.settingKey as keyof SettingsFormValues)}
                    <input
                      name={platform.settingKey}
                      type="url"
                      defaultValue={String(values[platform.settingKey as keyof SettingsFormValues] ?? "")}
                    />
                  </label>
                ))}
              </div>
            </section>
          );
        }

        return (
          <section key={section.sectionKey} className={styles.section}>
            <h2>{sf.sectionTitles[section.sectionKey]}</h2>
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
                    {fieldLabel(field.key)}
                    {isTextarea ? (
                      <textarea
                        name={field.key}
                        rows={
                          field.key.includes("body") || field.key.includes("description") ? 4 : 3
                        }
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
                        {field.optionValues?.map((option) => (
                          <option key={option} value={option}>
                            {optionLabel(field.key, option)}
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

              {section.sectionKey === "shippingFees" && (
                <ShippingRulesEditor
                  initialRates={countryRates}
                  shippingMode={shippingMode}
                />
              )}
            </div>
          </section>
        );
      })}

      <button type="submit" className={formStyles.submit} disabled={pending}>
        {pending ? saving : f.saveSettings}
      </button>
    </form>
  );
}
