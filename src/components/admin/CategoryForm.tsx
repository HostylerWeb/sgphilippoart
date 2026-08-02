"use client";

import { useActionState } from "react";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/actions/admin/content";
import formStyles from "@/components/forms/Form.module.css";
import { TranslationFields } from "@/components/admin/TranslationFields";
import styles from "./ContentForms.module.css";

type CategoryFormProps = {
  category?: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    sort_order: number;
    show_on_homepage: boolean;
    show_in_nav: boolean;
    translationValues?: Record<string, string>;
  };
};

export function CategoryForm({ category }: CategoryFormProps) {
  const action = category
    ? updateCategoryAction.bind(null, category.id)
    : createCategoryAction;
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className={`${formStyles.form} ${styles.form}`}>
      {state.error && <p className={formStyles.error}>{state.error}</p>}

      <div className={formStyles.gridTwo}>
        <label>
          Name
          <input name="name" defaultValue={category?.name} required />
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={category?.slug} placeholder="auto-from-name" />
        </label>
      </div>

      <label>
        Description
        <textarea name="description" rows={3} defaultValue={category?.description ?? ""} />
      </label>

      <TranslationFields
        fields={[
          { name: "name", label: "Collection name" },
          { name: "description", label: "Description", type: "textarea", rows: 3 },
        ]}
        values={category?.translationValues}
      />

      <label>
        Sort order
        <input name="sort_order" type="number" min="0" defaultValue={category?.sort_order ?? 0} />
      </label>

      <div className={styles.checkboxes}>
        <label className={styles.checkbox}>
          <input name="show_on_homepage" type="checkbox" defaultChecked={category?.show_on_homepage} />
          Show on homepage
        </label>
        <label className={styles.checkbox}>
          <input name="show_in_nav" type="checkbox" defaultChecked={category?.show_in_nav ?? true} />
          Show in navigation
        </label>
      </div>

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submit} disabled={pending}>
          {pending ? "Saving…" : category ? "Save collection" : "Create collection"}
        </button>
        {category && (
          <button
            type="submit"
            formAction={deleteCategoryAction.bind(null, category.id)}
            className={styles.deleteBtn}
            disabled={pending}
          >
            Delete collection
          </button>
        )}
      </div>
    </form>
  );
}
