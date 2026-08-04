"use client";

import Image from "next/image";
import { useState } from "react";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "./ProductGallery.module.css";

type GalleryImage = {
  url: string;
  alt_text: string | null;
};

type ProductGalleryProps = {
  images: GalleryImage[];
  title: string;
};

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const { dict } = useI18n();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) {
    return <div className={styles.placeholder} />;
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.primary}>
        <Image
          src={active.url}
          alt={active.alt_text ?? title}
          fill
          priority
          sizes="(max-width: 980px) 100vw, 50vw"
          className={styles.image}
        />
      </div>
      {images.length > 1 && (
        <div className={styles.thumbs}>
          {images.map((image, index) => (
            <button
              key={`${image.url}-${index}`}
              type="button"
              className={`${styles.thumb} ${index === activeIndex ? styles.thumbActive : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={dict.aria.viewImage.replace("{index}", String(index + 1))}
              aria-current={index === activeIndex}
            >
              <Image
                src={image.url}
                alt={image.alt_text ?? `${title} view ${index + 1}`}
                fill
                sizes="80px"
                className={styles.image}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
