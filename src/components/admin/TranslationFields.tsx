import styles from "./TranslationFields.module.css";

export type TranslationFieldConfig = {
  name: string;
  label: string;
  type?: "text" | "textarea";
  rows?: number;
};

type TranslationFieldsProps = {
  title?: string;
  hint?: string;
  fields: TranslationFieldConfig[];
  values?: Record<string, string | undefined>;
};

export function TranslationFields({
  title = "French (FR) translation",
  hint = "Optional. When filled in, French visitors see these instead of the English fields above.",
  fields,
  values = {},
}: TranslationFieldsProps) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{title}</legend>
      {hint && <p className={styles.hint}>{hint}</p>}
      <div className={styles.grid}>
        {fields.map((field) => (
          <label
            key={field.name}
            className={field.type === "textarea" ? styles.fullWidth : undefined}
          >
            {field.label}
            {field.type === "textarea" ? (
              <textarea
                name={`translation_fr_${field.name}`}
                rows={field.rows ?? 4}
                defaultValue={values[field.name] ?? ""}
              />
            ) : (
              <input
                name={`translation_fr_${field.name}`}
                defaultValue={values[field.name] ?? ""}
              />
            )}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
