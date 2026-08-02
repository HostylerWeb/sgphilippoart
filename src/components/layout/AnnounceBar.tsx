import styles from "./AnnounceBar.module.css";

type AnnounceBarProps = {
  text: string;
  highlight?: string;
};

export function AnnounceBar({ text, highlight }: AnnounceBarProps) {
  if (highlight && text.includes(highlight)) {
    const [before, after] = text.split(highlight);
    return (
      <div className={styles.announce}>
        {before}
        <b>{highlight}</b>
        {after}
      </div>
    );
  }

  return <div className={styles.announce}>{text}</div>;
}
