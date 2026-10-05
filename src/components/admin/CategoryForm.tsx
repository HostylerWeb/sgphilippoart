"use client";

import { useActionState } from "react";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/actions/admin/content";
import { TranslationFields } from "@/components/admin/TranslationFields";
import { useI18n } from "@/components/layout/I18nProvider";
import formStyles from "@/components/forms/Form.module.css";
import styles from "./ContentForms.module.css";
import productStyles from "./ProductForm.module.css";

type CategoryFormProps = {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
    show_on_homepage: boolean;
    show_in_nav: boolean;
    translationValuesEn?: Record<string, string>;
    translationValuesNl?: Record<string, string>;
  };
};

export function CategoryForm({ category }: CategoryFormProps) {
  const { dict } = useI18n();
  const f = dict.admin.forms.category;
  const p = dict.admin.forms.product;
  const saving = dict.admin.common.saving;

  const action = category
    ? updateCategoryAction.bind(null, category.id)
    : createCategoryAction;
  const [state, formAction, pending] = useActionState(action, {});

  const translationFields = [
    { name: "name", label: f.collectionName },
    { name: "description", label: f.description, type: "textarea" as const, rows: 3 },
  ];

  const autoTranslateSources = { name: "name", description: "description" };

  return (
    <form action={formAction} className={`${formStyles.form} ${styles.form}`}>
      {state.error && <p className={formStyles.error}>{state.error}</p>}

      <section className={productStyles.localeBlock}>
        <h2 className={productStyles.localeHeading}>{p.frenchPrimary}</h2>
        <p className={productStyles.localeHint}>{p.frenchPrimaryHint}</p>

        <div className={formStyles.gridTwo}>
          <label>
            {f.name}
            <input name="name" defaultValue={category?.name} required />
          </label>
          <label>
            {f.slug}
            <input name="slug" defaultValue={category?.slug} placeholder={f.slugPlaceholder} />
          </label>
        </div>

        <label>
          {f.description}
          <textarea name="description" rows={3} defaultValue={category?.description ?? ""} />
        </label>
      </section>

      <TranslationFields
        locale="en"
        title={p.englishTranslations}
        hint={p.translationHintEn}
        fields={translationFields}
        values={category?.translationValuesEn}
        autoTranslate={{ sourceFields: autoTranslateSources }}
        autoTranslateLabel={p.autoTranslate}
        autoTranslatingLabel={p.autoTranslating}
      />

      <TranslationFields
        locale="nl"
        title={p.dutchTranslations}
        hint={p.translationHintNl}
        fields={translationFields}
        values={category?.translationValuesNl}
        autoTranslate={{ sourceFields: autoTranslateSources }}
        autoTranslateLabel={p.autoTranslate}
        autoTranslatingLabel={p.autoTranslating}
      />

      <label>
        {f.sortOrder}
        <input name="sort_order" type="number" min="0" defaultValue={category?.sort_order ?? 0} />
      </label>

      <div className={styles.checkboxes}>
        <label className={styles.checkbox}>
          <input name="show_on_homepage" type="checkbox" defaultChecked={category?.show_on_homepage} />
          {f.showOnHomepage}
        </label>
        <label className={styles.checkbox}>
          <input name="show_in_nav" type="checkbox" defaultChecked={category?.show_in_nav ?? true} />
          {f.showInNav}
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submit} disabled={pending}>
          {pending ? saving : category ? f.saveCollection : f.createCollection}
        </button>
        {category && (
          <button
            type="submit"
            formAction={deleteCategoryAction.bind(null, category.id)}
            className={styles.deleteBtn}
            disabled={pending}
          >
            {f.deleteCollection}
          </button>
        )}
      </div>
    </form>
  );
}
