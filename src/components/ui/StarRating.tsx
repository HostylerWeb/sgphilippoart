import styles from "./StarRating.module.css";

type StarRatingProps = {
  rating: number;
  size?: number;
  className?: string;
};

const STAR_PATH =
  "M12 2l3.1 6.1 6.9 1-5 4.9 1.2 7L12 17.3 5.8 21l1.2-7-5-4.9 6.9-1z";

export function StarRating({ rating, size = 16, className }: StarRatingProps) {
  const clamped = Math.min(5, Math.max(0, rating));

  return (
    <div
      className={`${styles.stars} ${className ?? ""}`}
      role="img"
      aria-label={`${clamped.toFixed(1)} out of 5 stars`}
      style={{ height: size }}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const fill = Math.min(Math.max(clamped - index, 0), 1) * 100;

        return (
          <span
            key={index}
            className={styles.star}
            style={{ width: size, height: size }}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.starSvg}>
              <path d={STAR_PATH} className={styles.starEmpty} />
              <path
                d={STAR_PATH}
                className={styles.starFilled}
                style={{ clipPath: `inset(0 ${100 - fill}% 0 0)` }}
              />
            </svg>
          </span>
        );
      })}
    </div>
  );
}
