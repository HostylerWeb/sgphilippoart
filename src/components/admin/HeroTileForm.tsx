"use client";

import Image from "next/image";
import { useActionState } from "react";
import {
  createHeroTileAction,
  deleteHeroTileAction,
  updateHeroTileAction,
} from "@/actions/admin/content";
import formStyles from "@/components/forms/Form.module.css";
import { TranslationFields } from "@/components/admin/TranslationFields";
import styles from "./ContentForms.module.css";

type HeroTileFormProps = {
  tile?: {
    id: string;
    eyebrow: string;
    title: string;
    link_text: string;
    link_url: string;
    image_url: string;
    image_alt: string | null;
    sort_order: number;
    is_active: boolean;
    translationValues?: Record<string, string>;
  };
};

export function HeroTileForm({ tile }: HeroTileFormProps) {
  const action = tile ? updateHeroTileAction.bind(null, tile.id) : createHeroTileAction;
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form
      action={formAction}
      className={`${formStyles.form} ${styles.form}`}
      encType="multipart/form-data"
    >
      {state.error && <p className={formStyles.error}>{state.error}</p>}

      <div className={formStyles.gridTwo}>
        <label>
          Eyebrow
          <input name="eyebrow" defaultValue={tile?.eyebrow} required />
        </label>
        <label>
          Title
          <input name="title" defaultValue={tile?.title} required />
        </label>
      </div>

      <div className={formStyles.gridTwo}>
        <label>
          Link text
          <input name="link_text" defaultValue={tile?.link_text} required />
        </label>
        <label>
          Link URL
          <input name="link_url" defaultValue={tile?.link_url} required />
        </label>
      </div>

      <label>
        Image alt text
        <input name="image_alt" defaultValue={tile?.image_alt ?? ""} />
      </label>

      <TranslationFields
        fields={[
          { name: "eyebrow", label: "Eyebrow" },
          { name: "title", label: "Title" },
          { name: "link_text", label: "Link text" },
          { name: "image_alt", label: "Image alt text" },
        ]}
        values={tile?.translationValues}
      />

      <label>
        Sort order
        <input name="sort_order" type="number" min="0" defaultValue={tile?.sort_order ?? 0} />
      </label>

      <label className={styles.checkbox}>
        <input name="is_active" type="checkbox" defaultChecked={tile?.is_active ?? true} />
        Active on homepage
      </label>

      {tile && (
        <div className={styles.preview}>
          <span>Current image</span>
          <div className={styles.previewImage}>
            <Image src={tile.image_url} alt={tile.image_alt ?? tile.title} fill sizes="200px" />
          </div>
        </div>
      )}

      <label>
        {tile ? "Replace image (optional)" : "Hero image"}
        <input name="image" type="file" accept="image/*" className={styles.fileInput} />
      </label>

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submit} disabled={pending}>
          {pending ? "Saving…" : tile ? "Save hero tile" : "Create hero tile"}
        </button>
        {tile && (
          <button
            type="submit"
            formAction={deleteHeroTileAction.bind(null, tile.id)}
            className={styles.deleteBtn}
            disabled={pending}
          >
            Delete tile
          </button>
        )}
      </div>
    </form>
  );
}
