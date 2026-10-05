import Link from "next/link";
import { ProductCard, type ProductCardData } from "@/components/product/ProductCard";
import { StoreImage } from "@/components/ui/StoreImage";
import type { AboutPageCopy } from "@/lib/cms/about-page";
import type { ArtistPortrait } from "@/lib/artist-portrait";
import type { StoreSettings } from "@/lib/settings";
import styles from "./AboutArtistPage.module.css";

type BadgeLabels = Pick<
  import("@/i18n/dictionaries/en").Dictionary["product"],
  "original" | "print" | "printEdition"
>;

type AboutArtistPageProps = {
  copy: AboutPageCopy;
  portrait: ArtistPortrait | null;
  storyParagraphs: string[];
  storyTitle?: string | null;
  commissionEnabled: boolean;
  sampleWorks: ProductCardData[];
  currency?: Pick<StoreSettings, "currencyCode" | "currencyLocale">;
  wishlistedIds?: Set<string>;
  worksEyebrow: string;
  worksTitle: string;
  viewAllWorks: string;
  soldLabel: string;
  badgeLabels: BadgeLabels;
};

export function AboutArtistPage({
  copy,
  portrait,
  storyParagraphs,
  storyTitle,
  commissionEnabled,
  sampleWorks,
  currency,
  wishlistedIds,
  worksEyebrow,
  worksTitle,
  viewAllWorks,
  soldLabel,
  badgeLabels,
}: AboutArtistPageProps) {
  const leadParagraph = storyParagraphs[0];
  const restStory = storyParagraphs.slice(1);

  return (
    <article className={styles.about}>
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroInner}>
          {portrait && (
            <div className={styles.portraitCol}>
              <div className={styles.portraitFrame}>
                <StoreImage
                  src={portrait.imageUrl}
                  alt={portrait.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 760px) 100vw, 46vw"
                  className={styles.portraitImage}
                />
              </div>
            </div>
          )}
          <div className={styles.heroCopy}>
            <span className="eyebrow">{copy.eyebrow}</span>
            <h1 id="about-title" className={styles.heroTitle}>{copy.title}</h1>
            <p className={styles.heroLead}>{copy.description}</p>
            {leadParagraph && (
              <blockquote className={styles.pullQuote}>{leadParagraph}</blockquote>
            )}
          </div>
        </div>
      </section>

      {restStory.length > 0 && (
        <section className={styles.story} aria-labelledby="about-story-title">
          <div className="wrap">
            <div className={styles.storyHeader}>
              <span className={styles.storyLine} aria-hidden />
              <h2 id="about-story-title" className={styles.storyTitle}>
                {storyTitle ?? copy.h2}
              </h2>
            </div>
            <div className={styles.storyBody}>
              {restStory.map((paragraph) => (
                <p key={paragraph.slice(0, 64)}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.pillars}>
        <div className="wrap">
          <div className={styles.pillarGrid}>
            <div className={styles.pillar}>
              <span className={styles.pillarIndex}>01</span>
              <h2>{copy.h2}</h2>
              <p>{copy.p3}</p>
            </div>
            <div className={styles.pillar} id="process">
              <span className={styles.pillarIndex}>02</span>
              <h2>{copy.processTitle}</h2>
              <p>{copy.processP1}</p>
              <p>{copy.processP2}</p>
            </div>
          </div>
        </div>
      </section>

      {sampleWorks.length > 0 && (
        <section className={styles.works} aria-labelledby="about-works-title">
          <div className="wrap">
            <div className={styles.worksHead}>
              <div>
                <span className="eyebrow">{worksEyebrow}</span>
                <h2 id="about-works-title">{worksTitle}</h2>
              </div>
              <Link href="/works" className={styles.worksLink}>
                {viewAllWorks}
              </Link>
            </div>
            <div className={styles.worksGrid}>
              {sampleWorks.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  isWishlisted={wishlistedIds?.has(product.id)}
                  imageSizes="(max-width: 600px) 50vw, (max-width: 980px) 33vw, 25vw"
                  soldLabel={soldLabel}
                  badgeLabels={badgeLabels}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={styles.cta}>
        <div className="wrap">
          <div className={styles.ctaInner}>
            <span className="eyebrow">{copy.ctaEyebrow}</span>
            <h2>{copy.ctaTitle}</h2>
            <p>{copy.ctaBody}</p>
            <div className={styles.ctaLinks}>
              <Link href="/collections" className={styles.primary}>
                {copy.ctaCollections}
              </Link>
              {commissionEnabled && (
                <Link href="/commissions" className={styles.secondary}>
                  {copy.ctaCommissions}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
