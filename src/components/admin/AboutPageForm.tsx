"use client";

import { useActionState } from "react";
import { updateAboutPageAction } from "@/actions/admin/pages";
import { useI18n } from "@/components/layout/I18nProvider";
import formStyles from "@/components/forms/Form.module.css";
import type { AboutPageFormValues } from "@/lib/validations/about-page";
import styles from "./AboutPageForm.module.css";

type AboutPageFormProps = {
  values: AboutPageFormValues;
};

const FIELD_GROUPS: Array<{
  titleKey: "hero" | "intro" | "statement" | "process" | "cta";
  fields: Array<keyof AboutPageFormValues["en"]>;
}> = [
  {
    titleKey: "hero",
    fields: ["eyebrow", "title", "description"],
  },
  {
    titleKey: "intro",
    fields: ["p1", "p2"],
  },
  {
    titleKey: "statement",
    fields: ["h2", "p3"],
  },
  {
    titleKey: "process",
    fields: ["processTitle", "processP1", "processP2"],
  },
  {
    titleKey: "cta",
    fields: ["ctaEyebrow", "ctaTitle", "ctaBody", "ctaCollections", "ctaCommissions"],
  },
];

export function AboutPageForm({ values }: AboutPageFormProps) {
  const { dict } = useI18n();
  const labels = dict.admin.forms.aboutPage;
  const saving = dict.admin.common.saving;
  const [state, formAction, pending] = useActionState(updateAboutPageAction, {});

  return (
    <form action={formAction} className={`${formStyles.form} ${styles.form}`}>
      {state.error && <p className={formStyles.error}>{state.error}</p>}
      {state.success && <p className={formStyles.success}>{state.success}</p>}

      <div className={styles.columns}>
        {(["en", "fr"] as const).map((locale) => (
          <div key={locale} className={styles.localeColumn}>
            <h2 className={styles.localeTitle}>
              {locale === "en" ? labels.englishColumn : labels.frenchColumn}
            </h2>
            {FIELD_GROUPS.map((group) => (
              <section key={group.titleKey} className={styles.section}>
                <h3>{labels.groups[group.titleKey]}</h3>
                <div className={styles.fields}>
                  {group.fields.map((field) => (
                    <label key={field}>
                      {labels.fields[field]}
                      {field === "description" ||
                      field.startsWith("p") ||
                      field.endsWith("Body") ||
                      field === "processP1" ||
                      field === "processP2" ? (
                        <textarea
                          name={`${locale}_${field}`}
                          rows={field === "description" ? 3 : 4}
                          defaultValue={values[locale][field]}
                          required
                        />
                      ) : (
                        <input
                          name={`${locale}_${field}`}
                          defaultValue={values[locale][field]}
                          required
                        />
                      )}
                    </label>
                  ))}
                </div>
              </section>
            ))}
          </div>
        ))}
      </div>

      <button type="submit" className={formStyles.submit} disabled={pending}>
        {pending ? saving : labels.save}
      </button>
    </form>
  );
}
