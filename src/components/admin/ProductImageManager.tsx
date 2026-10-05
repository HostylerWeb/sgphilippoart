"use client";

import { StoreImage } from "@/components/ui/StoreImage";
import {
  deleteProductImageAction,
  reorderProductImagesAction,
  setPrimaryImageAction,
} from "@/actions/admin/product-images";
import { useI18n } from "@/components/layout/I18nProvider";
import { useEffect, useRef, useState, useTransition } from "react";
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

function reorderList(items: ProductImage[], activeId: string, overId: string): ProductImage[] {
  if (activeId === overId) return items;
  const from = items.findIndex((item) => item.id === activeId);
  const to = items.findIndex((item) => item.id === overId);
  if (from === -1 || to === -1) return items;
  const next = [...items];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}

function imageIdFromPoint(clientX: number, clientY: number): string | null {
  const elements = document.elementsFromPoint(clientX, clientY);
  for (const el of elements) {
    if (el instanceof HTMLElement && el.dataset.imageId) {
      return el.dataset.imageId;
    }
  }
  return null;
}

export function ProductImageManager({ productId, images }: ProductImageManagerProps) {
  const { dict } = useI18n();
  const f = dict.admin.forms.images;
  const [ordered, setOrdered] = useState(images);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const orderAtDragStart = useRef<string[]>([]);
  const draggingRef = useRef<string | null>(null);
  const orderedRef = useRef(ordered);
  orderedRef.current = ordered;

  useEffect(() => {
    setOrdered(images);
  }, [images]);

  if (images.length === 0) return null;

  function handlePointerDown(event: React.PointerEvent, imageId: string) {
    if (event.button !== 0) return;
    event.preventDefault();
    draggingRef.current = imageId;
    setDraggingId(imageId);
    orderAtDragStart.current = ordered.map((item) => item.id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: React.PointerEvent) {
    const activeId = draggingRef.current;
    if (!activeId) return;

    const overId = imageIdFromPoint(event.clientX, event.clientY);
    if (!overId || overId === activeId) return;

    setOrdered((prev) => {
      const next = reorderList(prev, activeId, overId);
      if (next === prev) return prev;
      draggingRef.current = activeId;
      return next;
    });
  }

  function finishDrag(event: React.PointerEvent) {
    const activeId = draggingRef.current;
    if (!activeId) return;

    draggingRef.current = null;
    setDraggingId(null);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    const newIds = orderedRef.current.map((item) => item.id);
    const unchanged = newIds.join() === orderAtDragStart.current.join();
    if (unchanged) return;

    setSaveError(null);
    startTransition(async () => {
      try {
        await reorderProductImagesAction(productId, newIds);
      } catch {
        setSaveError(f.reorderFailed);
        setOrdered(images);
      }
    });
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.label}>{f.galleryLabel}</span>
        <span className={styles.dragHint}>{f.dragToReorder}</span>
      </div>
      {saveError && (
        <p className={styles.saveError} role="alert">
          {saveError}
        </p>
      )}
      {pending && (
        <p className={styles.saving} role="status">
          {f.savingOrder}
        </p>
      )}
      <div className={styles.grid}>
        {ordered.map((image) => (
          <div
            key={image.id}
            className={`${styles.card} ${draggingId === image.id ? styles.cardDragging : ""}`}
            data-image-id={image.id}
          >
            <div
              className={styles.thumb}
              data-image-id={image.id}
              onPointerDown={(event) => handlePointerDown(event, image.id)}
              onPointerMove={handlePointerMove}
              onPointerUp={finishDrag}
              onPointerCancel={finishDrag}
              role="button"
              tabIndex={0}
              aria-label={f.dragImageAria}
              onKeyDown={(event) => {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                event.preventDefault();
                const index = ordered.findIndex((item) => item.id === image.id);
                const swapIndex =
                  event.key === "ArrowLeft" ? index - 1 : index + 1;
                if (swapIndex < 0 || swapIndex >= ordered.length) return;
                const next = [...ordered];
                const [moved] = next.splice(index, 1);
                next.splice(swapIndex, 0, moved);
                setOrdered(next);
                setSaveError(null);
                startTransition(async () => {
                  try {
                    await reorderProductImagesAction(productId, next.map((item) => item.id));
                  } catch {
                    setSaveError(f.reorderFailed);
                    setOrdered(images);
                  }
                });
              }}
            >
              <StoreImage
                src={image.url}
                alt={image.alt_text ?? f.productImageAlt}
                fill
                sizes="120px"
              />
              <span className={styles.dragBadge} aria-hidden="true">⋮⋮</span>
              {image.is_primary && <span className={styles.badge}>{f.primary}</span>}
            </div>
            <div className={styles.actions}>
              {!image.is_primary && (
                <button
                  type="submit"
                  formAction={setPrimaryImageAction.bind(null, image.id, productId)}
                  className={styles.btn}
                  disabled={pending}
                >
                  {f.setPrimary}
                </button>
              )}
              <button
                type="submit"
                formAction={deleteProductImageAction.bind(null, image.id, productId)}
                className={styles.deleteBtn}
                disabled={pending}
              >
                {f.delete}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
