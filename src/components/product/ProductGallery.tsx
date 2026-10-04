"use client";

import { StoreImage } from "@/components/ui/StoreImage";
import { useMemo, useState } from "react";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "./ProductGallery.module.css";

type GalleryImage = {
  url: string;
  alt_text: string | null;
  is_primary?: boolean;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  videoUrl?: string | null;
  title: string;
};

type ActiveView = { kind: "image"; index: number } | { kind: "video" };

export function ProductGallery({ images, videoUrl, title }: ProductGalleryProps) {
  const { dict } = useI18n();
  const orderedImages = useMemo(() => {
    if (images.length === 0) return [];
    const primary = images.find((image) => image.is_primary);
    const rest = images.filter((image) => image !== primary);
    return primary ? [primary, ...rest] : images;
  }, [images]);

  const [active, setActive] = useState<ActiveView>({ kind: "image", index: 0 });

  const activeImage =
    active.kind === "image" ? orderedImages[active.index] ?? orderedImages[0] : null;

  if (!activeImage && !videoUrl) {
    return <div className={styles.placeholder} />;
  }

  const showThumbs = orderedImages.length > 1 || Boolean(videoUrl);

  return (
    <div className={styles.gallery}>
      <div className={styles.primary}>
        {active.kind === "video" && videoUrl ? (
          <video
            key={videoUrl}
            className={styles.video}
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
            poster={orderedImages[0]?.url}
          />
        ) : activeImage ? (
          <StoreImage
            src={activeImage.url}
            alt={activeImage.alt_text ?? title}
            fill
            priority
            sizes="(max-width: 600px) 300px, (max-width: 980px) 400px, 50vw"
            className={styles.image}
          />
        ) : null}
      </div>

      {showThumbs && (
        <div className={styles.thumbs} role="tablist" aria-label={title}>
          {orderedImages.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              role="tab"
              className={`${styles.thumb} ${
                active.kind === "image" && active.index === index ? styles.thumbActive : ""
              }`}
              onClick={() => setActive({ kind: "image", index })}
              aria-label={dict.aria.viewImage.replace("{index}", String(index + 1))}
              aria-selected={active.kind === "image" && active.index === index}
            >
              <StoreImage
                src={image.url}
                alt={image.alt_text ?? `${title} view ${index + 1}`}
                fill
                sizes="80px"
                className={styles.image}
              />
            </button>
          ))}
          {videoUrl && (
            <button
              type="button"
              role="tab"
              className={`${styles.thumb} ${styles.videoThumb} ${
                active.kind === "video" ? styles.thumbActive : ""
              }`}
              onClick={() => setActive({ kind: "video" })}
              aria-label={dict.product.viewVideo}
              aria-selected={active.kind === "video"}
            >
              <span className={styles.playIcon} aria-hidden>▶</span>
              <span className={styles.videoThumbLabel}>{dict.product.videoLabel}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
