"use client";

import { useActionState } from "react";
import {
  createTrustItemAction,
  deleteTrustItemAction,
  updateTrustItemAction,
} from "@/actions/admin/trust-items";
import { TranslationFields } from "@/components/admin/TranslationFields";
import { useI18n } from "@/components/layout/I18nProvider";
import formStyles from "@/components/forms/Form.module.css";
import styles from "./ContentForms.module.css";
import productStyles from "./ProductForm.module.css";

const ICON_OPTIONS = ["shield", "truck", "return", "star", "heart", "globe"] as const;

type TrustItemFormProps = {
  item?: {
    id: string;
    title: string;
    body: string;
    icon: string;
    sort_order: number;
    is_active: boolean;
    translationValuesEn?: Record<string, string>;
    translationValuesNl?: Record<string, string>;
  };
};

export function TrustItemForm({ item }: TrustItemFormProps) {
  const { dict } = useI18n();
  const f = dict.admin.forms.trustItem;
  const p = dict.admin.forms.product;
  const saving = dict.admin.common.saving;

  const action = item ? updateTrustItemAction.bind(null, item.id) : createTrustItemAction;
  const [state, formAction, pending] = useActionState(action, {});

  const translationFields = [
    { name: "title", label: f.title },
    { name: "body", label: f.body, type: "textarea" as const, rows: 3 },
  ];
  const autoTranslateSources = { title: "title", body: "body" };

  return (
    <form action={formAction} className={`${formStyles.form} ${styles.form}`}>
      {state.error && <p className={formStyles.error}>{state.error}</p>}

      <section className={productStyles.localeBlock}>
        <h2 className={productStyles.localeHeading}>{p.frenchPrimary}</h2>
        <p className={productStyles.localeHint}>{p.frenchPrimaryHint}</p>

        <label>
          {f.title}
          <input name="title" defaultValue={item?.title} required />
        </label>

        <label>
          {f.body}
          <textarea name="body" rows={3} defaultValue={item?.body} required />
        </label>
      </section>

      <TranslationFields
        locale="en"
        title={p.englishTranslations}
        hint={p.translationHintEn}
        fields={translationFields}
        values={item?.translationValuesEn}
        autoTranslate={{ sourceFields: autoTranslateSources }}
        autoTranslateLabel={p.autoTranslate}
        autoTranslatingLabel={p.autoTranslating}
      />

      <TranslationFields
        locale="nl"
        title={p.dutchTranslations}
        hint={p.translationHintNl}
        fields={translationFields}
        values={item?.translationValuesNl}
        autoTranslate={{ sourceFields: autoTranslateSources }}
        autoTranslateLabel={p.autoTranslate}
        autoTranslatingLabel={p.autoTranslating}
      />

      <div className={formStyles.gridTwo}>
        <label>
          {f.icon}
          <select name="icon" defaultValue={item?.icon ?? "shield"}>
            {ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </label>
        <label>
          {f.sortOrder}
          <input name="sort_order" type="number" min="0" defaultValue={item?.sort_order ?? 0} />
        </label>
      </div>

      <label className={styles.checkbox}>
        <input name="is_active" type="checkbox" defaultChecked={item?.is_active ?? true} />
        {f.activeHomepage}
      </label>

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submit} disabled={pending}>
          {pending ? saving : item ? f.saveItem : f.createItem}
        </button>
        {item && (
          <button
            type="submit"
            formAction={deleteTrustItemAction.bind(null, item.id)}
            className={styles.deleteBtn}
            disabled={pending}
          >
            {f.deleteItem}
          </button>
        )}
      </div>
    </form>
  );
}
