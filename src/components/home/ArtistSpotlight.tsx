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

  const lead = paragraphs[0];
  const supporting = paragraphs.slice(1, 4);

  return (
    <section className={styles.spotlight} aria-labelledby="artist-spotlight-title">
      <div className={styles.glow} aria-hidden />
      <div className={styles.inner}>
        <div className={styles.visual}>
          <div className={styles.portraitShell}>
            <div className={styles.portraitFrame}>
              <StoreImage
                src={imageUrl}
                alt={imageAlt}
                fill
                priority
                sizes="(max-width: 760px) 100vw, 46vw"
                className={styles.image}
              />
            </div>
          </div>
        </div>

        <div className={styles.copy}>
          <div className={styles.copyPanel}>
            <header className={styles.copyHeader}>
              <div className={styles.eyebrowRow}>
                <span className={styles.eyebrowLine} aria-hidden />
                <span className="eyebrow">{eyebrow}</span>
              </div>
              <h2 id="artist-spotlight-title" className={styles.title}>{title}</h2>
            </header>

            {lead && (
              <p className={styles.lead}>{lead}</p>
            )}

            {supporting.length > 0 && (
              <div className={styles.body}>
                {supporting.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            )}

            <Link href={ctaHref} className={styles.cta}>
              <span>{ctaLabel}</span>
              <span className={styles.ctaArrow} aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
