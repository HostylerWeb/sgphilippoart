"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/actions/admin/products";
import { ProductMediaSection } from "@/components/admin/ProductMediaSection";
import { TranslationFields } from "@/components/admin/TranslationFields";
import { useI18n } from "@/components/layout/I18nProvider";
import formStyles from "@/components/forms/Form.module.css";
import styles from "./ProductForm.module.css";

type CategoryOption = {
  id: string;
  name: string;
};

type ProductImage = {
  id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
};

type ProductFormProps = {
  categories: CategoryOption[];
  product?: {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    price: string;
    product_type: "original" | "print";
    status: "draft" | "published" | "sold" | "archived";
    medium: string | null;
    dimensions: string | null;
    edition_size: number | null;
    stock_quantity: number | null;
    category_id: string | null;
    is_featured: boolean;
    meta_title: string | null;
    meta_description: string | null;
    images: ProductImage[];
    video_url: string | null;
    translationValues?: Record<string, string>;
    translationValuesNl?: Record<string, string>;
  };
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const { dict } = useI18n();
  const f = dict.admin.forms.product;
  const pf = dict.admin.productFilter;
  const saving = dict.admin.common.saving;

  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className={`${formStyles.form} ${styles.form}`} encType="multipart/form-data">
      {state.error && <p className={formStyles.error}>{state.error}</p>}
      {pending && (
        <p className={formStyles.success} role="status">
          {f.savingProductHint}
        </p>
      )}

      <div className={formStyles.gridTwo}>
        <label>
          {f.title}
          <input name="title" defaultValue={product?.title} required />
        </label>
        <label>
          {f.slug}
          <input name="slug" defaultValue={product?.slug} placeholder={f.slugPlaceholder} />
        </label>
      </div>

      <label>
        {f.description}
        <textarea name="description" rows={5} defaultValue={product?.description ?? ""} />
      </label>

      <div className={formStyles.gridTwo}>
        <label>
          {f.price}
          <input name="price" type="number" step="0.01" min="0" defaultValue={product?.price} required />
        </label>
        <label>
          {f.category}
          <select name="category_id" defaultValue={product?.category_id ?? ""}>
            <option value="">{f.noCategory}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={formStyles.gridTwo}>
        <label>
          {f.type}
          <select name="product_type" defaultValue={product?.product_type ?? "original"}>
            <option value="original">{f.typeOriginal}</option>
            <option value="print">{f.typePrint}</option>
          </select>
        </label>
        <label>
          {f.status}
          <select name="status" defaultValue={product?.status ?? "published"}>
            <option value="draft">{pf.statusDraft}</option>
            <option value="published">{pf.statusPublished}</option>
            <option value="sold">{pf.statusSold}</option>
            <option value="archived">{pf.statusArchived}</option>
          </select>
        </label>
      </div>

      <div className={formStyles.gridTwo}>
        <label>
          {f.medium}
          <input name="medium" defaultValue={product?.medium ?? ""} placeholder={f.mediumPlaceholder} />
        </label>
        <label>
          {f.dimensions}
          <input name="dimensions" defaultValue={product?.dimensions ?? ""} placeholder={f.dimensionsPlaceholder} />
        </label>
      </div>

      <div className={formStyles.gridTwo}>
        <label>
          {f.editionSize}
          <input
            name="edition_size"
            type="number"
            min="1"
            defaultValue={product?.edition_size ?? ""}
          />
        </label>
        <label>
          {f.stockQuantity}
          <input
            name="stock_quantity"
            type="number"
            min="0"
            defaultValue={product?.stock_quantity ?? ""}
          />
        </label>
      </div>

      <div className={formStyles.gridTwo}>
        <label>
          {f.metaTitle}
          <input name="meta_title" defaultValue={product?.meta_title ?? ""} />
        </label>
        <label className={styles.checkbox}>
          <input
            name="is_featured"
            type="checkbox"
            defaultChecked={product?.is_featured}
          />
          {f.featuredHomepage}
        </label>
      </div>

      <label>
        {f.metaDescription}
        <textarea name="meta_description" rows={3} defaultValue={product?.meta_description ?? ""} />
      </label>

      <TranslationFields
        locale="fr"
        title={f.frenchTranslations}
        hint={f.translationHint}
        fields={[
          { name: "title", label: f.title },
          { name: "description", label: f.description, type: "textarea", rows: 5 },
          { name: "medium", label: f.medium },
          { name: "meta_title", label: f.metaTitle },
          { name: "meta_description", label: f.metaDescription, type: "textarea", rows: 3 },
        ]}
        values={product?.translationValues}
      />

      <TranslationFields
        locale="nl"
        title={f.dutchTranslations}
        hint={f.translationHint}
        fields={[
          { name: "title", label: f.title },
          { name: "description", label: f.description, type: "textarea", rows: 5 },
          { name: "medium", label: f.medium },
          { name: "meta_title", label: f.metaTitle },
          { name: "meta_description", label: f.metaDescription, type: "textarea", rows: 3 },
        ]}
        values={product?.translationValuesNl}
      />

      <ProductMediaSection
        product={
          product
            ? {
                id: product.id,
                title: product.title,
                images: product.images,
                video_url: product.video_url,
              }
            : undefined
        }
      />

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submit} disabled={pending}>
          {pending ? saving : product ? f.saveChanges : f.createProduct}
        </button>
        {product && (
          <>
            <Link href={`/products/${product.slug}`} className={styles.previewLink} target="_blank">
              {f.previewStorefront}
            </Link>
            <button
              type="submit"
              formAction={deleteProductAction.bind(null, product.id)}
              className={styles.deleteBtn}
              disabled={pending}
            >
              {f.deleteProduct}
            </button>
          </>
        )}
      </div>
    </form>
  );
}
