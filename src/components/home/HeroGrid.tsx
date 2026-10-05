import type { CSSProperties } from "react";
import Link from "next/link";
import { StoreImage } from "@/components/ui/StoreImage";
import styles from "./HeroGrid.module.css";

export type HeroTileData = {
  id: string;
  eyebrow: string;
  title: string;
  link_text: string;
  link_url: string;
  image_url: string;
  image_alt: string | null;
};

type HeroGridProps = {
  tiles: HeroTileData[];
  ariaLabel: string;
};

export function HeroGrid({ tiles, ariaLabel }: HeroGridProps) {
  const columnCount = Math.min(Math.max(tiles.length, 1), 4);

  return (
    <section
      className={styles.heroGrid}
      style={{ "--hero-columns": columnCount } as CSSProperties}
      tabIndex={0}
      role="region"
      aria-label={ariaLabel}
    >
      {tiles.map((tile, index) => (
        <Link key={tile.id} href={tile.link_url} className={styles.heroTile}>
          <div className={styles.heroTileImg}>
            <StoreImage
              src={tile.image_url}
              alt={tile.image_alt ?? tile.title}
              fill
              sizes={`(max-width: 600px) 88vw, (max-width: 980px) ${Math.ceil(100 / columnCount)}vw, ${Math.ceil(100 / columnCount)}vw`}
              priority={index < 2}
              className={styles.image}
            />
          </div>
          <div className={styles.heroTileCopy}>
            <div className={styles.heroTileEyebrow}>{tile.eyebrow}</div>
            <div className={styles.heroTileTitle}>{tile.title}</div>
            <div className={styles.heroTileLink}>{tile.link_text}</div>
          </div>
        </Link>
      ))}
    </section>
  );
}
