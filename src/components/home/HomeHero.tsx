import { ArtistSpotlight } from "@/components/home/ArtistSpotlight";
import { HeroGrid, type HeroTileData } from "@/components/home/HeroGrid";
import styles from "./HomeHero.module.css";

type HomeHeroProps = {
  gridTiles: HeroTileData[];
  gridAriaLabel: string;
  spotlight?: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    imageUrl: string;
    imageAlt: string;
    ctaLabel: string;
    ctaHref: string;
  } | null;
};

export function HomeHero({ gridTiles, gridAriaLabel, spotlight }: HomeHeroProps) {
  return (
    <div className={styles.heroStack}>
      {spotlight && (
        <ArtistSpotlight
          eyebrow={spotlight.eyebrow}
          title={spotlight.title}
          paragraphs={spotlight.paragraphs}
          imageUrl={spotlight.imageUrl}
          imageAlt={spotlight.imageAlt}
          ctaLabel={spotlight.ctaLabel}
          ctaHref={spotlight.ctaHref}
        />
      )}
      {gridTiles.length > 0 && (
        <HeroGrid tiles={gridTiles} ariaLabel={gridAriaLabel} />
      )}
    </div>
  );
}
