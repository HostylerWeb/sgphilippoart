import Link from "next/link";
import { StoreImage } from "@/components/ui/StoreImage";
import styles from "./ArtistSpotlight.module.css";

type ArtistSpotlightProps = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  imageUrl: string;
  imageAlt: string;
  ctaLabel: string;
  ctaHref: string;
};

export function ArtistSpotlight({
  eyebrow,
  title,
  paragraphs,
  imageUrl,
  imageAlt,
  ctaLabel,
  ctaHref,
}: ArtistSpotlightProps) {
  if (paragraphs.length === 0) {
    return null;
  }

  return (
    <section className={styles.spotlight} aria-labelledby="artist-spotlight-title">
      <div className={styles.inner}>
        <div className={styles.portrait}>
          <StoreImage
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="(max-width: 760px) 100vw, 42vw"
            className={styles.image}
          />
        </div>
        <div className={styles.copy}>
          <span className="eyebrow">{eyebrow}</span>
          <h2 id="artist-spotlight-title" className={styles.title}>{title}</h2>
          <div className={styles.body}>
            {paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <Link href={ctaHref} className={styles.cta}>
            {ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
