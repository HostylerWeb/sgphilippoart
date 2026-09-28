"use client";

import { useMemo, useState } from "react";
import { StoreImage } from "@/components/ui/StoreImage";
import { ProductImageManager } from "@/components/admin/ProductImageManager";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "./ProductMediaSection.module.css";

type ProductImage = {
  id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
};

type ProductMediaSectionProps = {
  product?: {
    id: string;
    title: string;
    images: ProductImage[];
    video_url: string | null;
  };
};

type FilePreview = {
  id: string;
  name: string;
  url: string;
};

function makePreview(file: File): FilePreview {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name,
    url: URL.createObjectURL(file),
  };
}

export function ProductMediaSection({ product }: ProductMediaSectionProps) {
  const { dict } = useI18n();
  const m = dict.admin.forms.media;

  const primaryImage = useMemo(
    () => product?.images.find((image) => image.is_primary) ?? product?.images[0],
    [product],
  );
  const galleryImages = useMemo(
    () =>
      product?.images.filter((image) => image.id !== primaryImage?.id) ?? [],
    [product, primaryImage],
  );

  const [mainPreview, setMainPreview] = useState<FilePreview | null>(null);
  const [galleryPreviews, setGalleryPreviews] = useState<FilePreview[]>([]);
  const [videoPreview, setVideoPreview] = useState<FilePreview | null>(null);
  const [removeVideo, setRemoveVideo] = useState(false);

  function onMainChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (mainPreview) URL.revokeObjectURL(mainPreview.url);
    setMainPreview(file ? makePreview(file) : null);
  }

  function onGalleryChange(event: React.ChangeEvent<HTMLInputElement>) {
    galleryPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    const files = Array.from(event.target.files ?? []);
    setGalleryPreviews(files.map(makePreview));
  }

  function onVideoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (videoPreview) URL.revokeObjectURL(videoPreview.url);
    setVideoPreview(file ? makePreview(file) : null);
    if (file) setRemoveVideo(false);
  }

  const showCurrentVideo = product?.video_url && !removeVideo && !videoPreview;

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <h2 className={styles.heading}>{m.sectionTitle}</h2>
        <p className={styles.lead}>{m.sectionLead}</p>
      </header>

      <section className={styles.block} aria-labelledby="media-main-heading">
        <div className={styles.blockHead}>
          <span className={styles.blockIcon} aria-hidden>1</span>
          <div>
            <h3 id="media-main-heading" className={styles.blockTitle}>{m.mainImageTitle}</h3>
            <p className={styles.blockHint}>{m.mainImageHint}</p>
          </div>
        </div>

        {(primaryImage || mainPreview) && (
          <div className={styles.mainPreview}>
            <StoreImage
              src={mainPreview?.url ?? primaryImage!.url}
              alt={product?.title ?? m.mainImageTitle}
              fill
              sizes="320px"
              className={styles.cover}
            />
            {mainPreview && <span className={styles.badge}>{m.newUploadBadge}</span>}
          </div>
        )}

        <label className={styles.dropzone}>
          <input
            type="file"
            name="main_image"
            accept="image/*"
            className={styles.fileInput}
            onChange={onMainChange}
          />
          <span className={styles.dropTitle}>{m.mainImageChoose}</span>
          <span className={styles.dropMeta}>{m.imageFormats}</span>
        </label>
      </section>

      <section className={styles.block} aria-labelledby="media-gallery-heading">
        <div className={styles.blockHead}>
          <span className={styles.blockIcon} aria-hidden>2</span>
          <div>
            <h3 id="media-gallery-heading" className={styles.blockTitle}>{m.galleryTitle}</h3>
            <p className={styles.blockHint}>{m.galleryHint}</p>
          </div>
        </div>

        {product && galleryImages.length > 0 && (
          <ProductImageManager productId={product.id} images={galleryImages} />
        )}

        {galleryPreviews.length > 0 && (
          <ul className={styles.pendingGrid}>
            {galleryPreviews.map((preview) => (
              <li key={preview.id} className={styles.pendingThumb}>
                <img src={preview.url} alt="" className={styles.pendingImg} />
              </li>
            ))}
          </ul>
        )}

        <label className={styles.dropzone}>
          <input
            type="file"
            name="gallery_images"
            accept="image/*"
            multiple
            className={styles.fileInput}
            onChange={onGalleryChange}
          />
          <span className={styles.dropTitle}>{m.galleryChoose}</span>
          <span className={styles.dropMeta}>{m.galleryFormats}</span>
        </label>
      </section>

      <section className={styles.block} aria-labelledby="media-video-heading">
        <div className={styles.blockHead}>
          <span className={styles.blockIcon} aria-hidden>3</span>
          <div>
            <h3 id="media-video-heading" className={styles.blockTitle}>{m.videoTitle}</h3>
            <p className={styles.blockHint}>{m.videoHint}</p>
          </div>
        </div>

        {showCurrentVideo && (
          <div className={styles.videoPreview}>
            <video src={product!.video_url!} controls playsInline preload="metadata" />
          </div>
        )}

        {videoPreview && (
          <div className={styles.videoPreview}>
            <video src={videoPreview.url} controls playsInline preload="metadata" />
            <span className={styles.badge}>{m.newUploadBadge}</span>
          </div>
        )}

        {product?.video_url && (
          <label className={styles.removeVideo}>
            <input
              type="checkbox"
              name="remove_video"
              checked={removeVideo}
              onChange={(event) => setRemoveVideo(event.target.checked)}
            />
            {m.removeVideo}
          </label>
        )}

        <label className={styles.dropzone}>
          <input
            type="file"
            name="video"
            accept="video/*"
            className={styles.fileInput}
            onChange={onVideoChange}
            disabled={removeVideo}
          />
          <span className={styles.dropTitle}>{m.videoChoose}</span>
          <span className={styles.dropMeta}>{m.videoFormats}</span>
        </label>

        <label className={styles.urlField}>
          {m.videoUrlLabel}
          <input
            type="url"
            name="video_url"
            placeholder={m.videoUrlPlaceholder}
            defaultValue={
              product?.video_url?.startsWith("http") ? product.video_url : ""
            }
            disabled={removeVideo}
          />
          <span className={styles.urlHint}>{m.videoUrlHint}</span>
        </label>
      </section>
    </div>
  );
}
