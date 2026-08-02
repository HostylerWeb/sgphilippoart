import Link from "next/link";
import Image from "next/image";
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
};

export function HeroGrid({ tiles }: HeroGridProps) {
  return (
    <section
      className={styles.heroGrid}
      tabIndex={0}
      role="region"
      aria-label="Featured collections"
    >
      {tiles.map((tile, index) => (
        <Link key={tile.id} href={tile.link_url} className={styles.heroTile}>
          <div className={styles.heroTileImg}>
            <Image
              src={tile.image_url}
              alt={tile.image_alt ?? tile.title}
              fill
              sizes="(max-width: 600px) 88vw, (max-width: 980px) 50vw, 25vw"
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
