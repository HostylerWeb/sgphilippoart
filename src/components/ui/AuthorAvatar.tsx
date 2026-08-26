import { StoreImage } from "@/components/ui/StoreImage";
import styles from "./AuthorAvatar.module.css";

type AuthorAvatarProps = {
  name: string;
  imageUrl?: string | null;
  size?: number;
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function AuthorAvatar({ name, imageUrl, size = 40 }: AuthorAvatarProps) {
  const initials = getInitials(name);

  if (imageUrl) {
    return (
      <StoreImage
        src={imageUrl}
        alt=""
        width={size}
        height={size}
        className={styles.avatar}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <span
      className={styles.initials}
      style={{ width: size, height: size, fontSize: size * 0.34 }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
