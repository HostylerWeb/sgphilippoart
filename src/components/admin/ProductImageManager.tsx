"use client";

import { StoreImage } from "@/components/ui/StoreImage";
import { deleteProductImageAction, moveProductImageAction, setPrimaryImageAction } from "@/actions/admin/product-images";
import styles from "./ProductImageManager.module.css";

type ProductImage = {
  id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
};

type ProductImageManagerProps = {
  productId: string;
  images: ProductImage[];
};

export function ProductImageManager({ productId, images }: ProductImageManagerProps) {
  if (images.length === 0) return null;

  return (
    <div className={styles.wrap}>
      <span className={styles.label}>Gallery images</span>
      <div className={styles.grid}>
        {images.map((image, index) => (
          <div key={image.id} className={styles.card}>
            <div className={styles.thumb}>
              <StoreImage
                src={image.url}
                alt={image.alt_text ?? "Product image"}
                fill
                sizes="120px"
              />
              {image.is_primary && <span className={styles.badge}>Primary</span>}
            </div>
            <div className={styles.actions}>
              {!image.is_primary && (
                <button
                  type="submit"
                  formAction={setPrimaryImageAction.bind(null, image.id, productId)}
                  className={styles.btn}
                >
                  Set primary
                </button>
              )}
              {index > 0 && (
                <button
                  type="submit"
                  formAction={moveProductImageAction.bind(null, image.id, productId, "up")}
                  className={styles.btn}
                >
                  ↑
                </button>
              )}
              {index < images.length - 1 && (
                <button
                  type="submit"
                  formAction={moveProductImageAction.bind(null, image.id, productId, "down")}
                  className={styles.btn}
                >
                  ↓
                </button>
              )}
              <button
                type="submit"
                formAction={deleteProductImageAction.bind(null, image.id, productId)}
                className={styles.deleteBtn}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
