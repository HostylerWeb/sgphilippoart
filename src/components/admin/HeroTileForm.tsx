"use client";

import { StoreImage } from "@/components/ui/StoreImage";
import { useActionState } from "react";
import {
  createHeroTileAction,
  deleteHeroTileAction,
  updateHeroTileAction,
} from "@/actions/admin/content";
import { TranslationFields } from "@/components/admin/TranslationFields";
import { useI18n } from "@/components/layout/I18nProvider";
import formStyles from "@/components/forms/Form.module.css";
import styles from "./ContentForms.module.css";
import productStyles from "./ProductForm.module.css";

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
    translationValuesEn?: Record<string, string>;
    translationValuesNl?: Record<string, string>;
  };
};

export function HeroTileForm({ tile }: HeroTileFormProps) {
  const { dict } = useI18n();
  const f = dict.admin.forms.heroTile;
  const p = dict.admin.forms.product;
  const saving = dict.admin.common.saving;

  const action = tile ? updateHeroTileAction.bind(null, tile.id) : createHeroTileAction;
  const [state, formAction, pending] = useActionState(action, {});

  const translationFields = [
    { name: "eyebrow", label: f.eyebrow },
    { name: "title", label: f.title },
    { name: "link_text", label: f.linkText },
    { name: "image_alt", label: f.imageAlt },
  ];
  const autoTranslateSources = {
    eyebrow: "eyebrow",
    title: "title",
    link_text: "link_text",
    image_alt: "image_alt",
  };

  return (
    <form
      action={formAction}
      className={`${formStyles.form} ${styles.form}`}
      encType="multipart/form-data"
    >
      {state.error && <p className={formStyles.error}>{state.error}</p>}

      <section className={productStyles.localeBlock}>
        <h2 className={productStyles.localeHeading}>{p.frenchPrimary}</h2>
        <p className={productStyles.localeHint}>{p.frenchPrimaryHint}</p>

        <div className={formStyles.gridTwo}>
          <label>
            {f.eyebrow}
            <input name="eyebrow" defaultValue={tile?.eyebrow} required />
          </label>
          <label>
            {f.title}
            <input name="title" defaultValue={tile?.title} required />
          </label>
        </div>

        <div className={formStyles.gridTwo}>
          <label>
            {f.linkText}
            <input name="link_text" defaultValue={tile?.link_text} required />
          </label>
          <label>
            {f.linkUrl}
            <input name="link_url" defaultValue={tile?.link_url} required />
          </label>
        </div>

        <label>
          {f.imageAlt}
          <input name="image_alt" defaultValue={tile?.image_alt ?? ""} />
        </label>
      </section>

      <TranslationFields
        locale="en"
        title={p.englishTranslations}
        hint={p.translationHintEn}
        fields={translationFields}
        values={tile?.translationValuesEn}
        autoTranslate={{ sourceFields: autoTranslateSources }}
        autoTranslateLabel={p.autoTranslate}
        autoTranslatingLabel={p.autoTranslating}
      />

      <TranslationFields
        locale="nl"
        title={p.dutchTranslations}
        hint={p.translationHintNl}
        fields={translationFields}
        values={tile?.translationValuesNl}
        autoTranslate={{ sourceFields: autoTranslateSources }}
        autoTranslateLabel={p.autoTranslate}
        autoTranslatingLabel={p.autoTranslating}
      />

      <label>
        {f.sortOrder}
        <input name="sort_order" type="number" min="0" defaultValue={tile?.sort_order ?? 0} />
      </label>

      <label className={styles.checkbox}>
        <input name="is_active" type="checkbox" defaultChecked={tile?.is_active ?? true} />
        {f.activeHomepage}
      </label>

      {tile?.image_url && (
        <div className={styles.preview}>
          <StoreImage src={tile.image_url} alt={tile.image_alt ?? ""} width={200} height={120} />
        </div>
      )}

      <label>
        {f.replaceImage}
        <input name="image" type="file" accept="image/*" className={styles.fileInput} />
      </label>

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submit} disabled={pending}>
          {pending ? saving : tile ? f.saveTile : f.createTile}
        </button>
        {tile && (
          <button
            type="submit"
            formAction={deleteHeroTileAction.bind(null, tile.id)}
            className={styles.deleteBtn}
            disabled={pending}
          >
            {f.deleteTile}
          </button>
        )}
      </div>
    </form>
  );
}
