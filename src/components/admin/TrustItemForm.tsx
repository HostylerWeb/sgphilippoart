"use client";

import { useActionState } from "react";
import {
  createTrustItemAction,
  deleteTrustItemAction,
  updateTrustItemAction,
} from "@/actions/admin/trust-items";
import formStyles from "@/components/forms/Form.module.css";
import { TranslationFields } from "@/components/admin/TranslationFields";
import styles from "./ContentForms.module.css";

const ICON_OPTIONS = ["shield", "truck", "return", "star", "heart", "globe"] as const;

type TrustItemFormProps = {
  item?: {
    id: string;
    title: string;
    body: string;
    icon: string;
    sort_order: number;
    is_active: boolean;
    translationValues?: Record<string, string>;
  };
};

export function TrustItemForm({ item }: TrustItemFormProps) {
  const action = item ? updateTrustItemAction.bind(null, item.id) : createTrustItemAction;
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className={`${formStyles.form} ${styles.form}`}>
      {state.error && <p className={formStyles.error}>{state.error}</p>}

      <label>
        Title
        <input name="title" defaultValue={item?.title} required />
      </label>

      <label>
        Body
        <textarea name="body" rows={3} defaultValue={item?.body} required />
      </label>

      <TranslationFields
        fields={[
          { name: "title", label: "Title" },
          { name: "body", label: "Body", type: "textarea", rows: 3 },
        ]}
        values={item?.translationValues}
      />

      <div className={formStyles.gridTwo}>
        <label>
          Icon
          <select name="icon" defaultValue={item?.icon ?? "shield"}>
            {ICON_OPTIONS.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </label>
        <label>
          Sort order
          <input name="sort_order" type="number" min="0" defaultValue={item?.sort_order ?? 0} />
        </label>
      </div>

      <label className={styles.checkbox}>
        <input name="is_active" type="checkbox" defaultChecked={item?.is_active ?? true} />
        Active on homepage
      </label>

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submit} disabled={pending}>
          {pending ? "Saving…" : item ? "Save item" : "Create item"}
        </button>
        {item && (
          <button
            type="submit"
            formAction={deleteTrustItemAction.bind(null, item.id)}
            className={styles.deleteBtn}
            disabled={pending}
          >
            Delete item
          </button>
        )}
      </div>
    </form>
  );
}
