"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  createProductAction,
  deleteProductAction,
  updateProductAction,
} from "@/actions/admin/products";
import { ProductImageManager } from "@/components/admin/ProductImageManager";
import { TranslationFields } from "@/components/admin/TranslationFields";
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
    translationValues?: Record<string, string>;
  };
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const action = product
    ? updateProductAction.bind(null, product.id)
    : createProductAction;
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className={`${formStyles.form} ${styles.form}`} encType="multipart/form-data">
      {state.error && <p className={formStyles.error}>{state.error}</p>}

      <div className={formStyles.gridTwo}>
        <label>
          Title
          <input name="title" defaultValue={product?.title} required />
        </label>
        <label>
          Slug
          <input name="slug" defaultValue={product?.slug} placeholder="auto-from-title" />
        </label>
      </div>

      <label>
        Description
        <textarea name="description" rows={5} defaultValue={product?.description ?? ""} />
      </label>

      <div className={formStyles.gridTwo}>
        <label>
          Price
          <input name="price" type="number" step="0.01" min="0" defaultValue={product?.price} required />
        </label>
        <label>
          Category
          <select name="category_id" defaultValue={product?.category_id ?? ""}>
            <option value="">No category</option>
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
          Type
          <select name="product_type" defaultValue={product?.product_type ?? "original"}>
            <option value="original">Original</option>
            <option value="print">Print</option>
          </select>
        </label>
        <label>
          Status
          <select name="status" defaultValue={product?.status ?? "published"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="sold">Sold</option>
            <option value="archived">Archived</option>
          </select>
        </label>
      </div>

      <div className={formStyles.gridTwo}>
        <label>
          Medium
          <input name="medium" defaultValue={product?.medium ?? ""} placeholder="Oil on canvas" />
        </label>
        <label>
          Dimensions
          <input name="dimensions" defaultValue={product?.dimensions ?? ""} placeholder='24" × 36"' />
        </label>
      </div>

      <div className={formStyles.gridTwo}>
        <label>
          Edition size (prints)
          <input
            name="edition_size"
            type="number"
            min="1"
            defaultValue={product?.edition_size ?? ""}
          />
        </label>
        <label>
          Stock quantity (prints)
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
          Meta title
          <input name="meta_title" defaultValue={product?.meta_title ?? ""} />
        </label>
        <label className={styles.checkbox}>
          <input
            name="is_featured"
            type="checkbox"
            defaultChecked={product?.is_featured}
          />
          Featured on homepage
        </label>
      </div>

      <label>
        Meta description
        <textarea name="meta_description" rows={3} defaultValue={product?.meta_description ?? ""} />
      </label>

      <TranslationFields
        fields={[
          { name: "title", label: "Title" },
          { name: "description", label: "Description", type: "textarea", rows: 5 },
          { name: "medium", label: "Medium" },
          { name: "meta_title", label: "Meta title" },
          { name: "meta_description", label: "Meta description", type: "textarea", rows: 3 },
        ]}
        values={product?.translationValues}
      />

      {product && product.images.length > 0 && (
        <ProductImageManager productId={product.id} images={product.images} />
      )}

      <label>
        Upload images
        <input name="images" type="file" accept="image/*" multiple className={styles.fileInput} />
        <span className={styles.uploadHint}>
          Select multiple files for a full gallery. The first image is used as the main photo.
        </span>
      </label>

      <div className={styles.actions}>
        <button type="submit" className={formStyles.submit} disabled={pending}>
          {pending ? "Saving…" : product ? "Save changes" : "Create product"}
        </button>
        {product && (
          <>
            <Link href={`/products/${product.slug}`} className={styles.previewLink} target="_blank">
              Preview on storefront
            </Link>
            <button
              type="submit"
              formAction={deleteProductAction.bind(null, product.id)}
              className={styles.deleteBtn}
              disabled={pending}
            >
              Delete product
            </button>
          </>
        )}
      </div>
    </form>
  );
}
