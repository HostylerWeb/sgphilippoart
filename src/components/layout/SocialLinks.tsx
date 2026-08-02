import type { SocialLink } from "@/lib/social-links";
import { SocialBrandIcon } from "@/components/layout/SocialBrandIcons";
import styles from "./Footer.module.css";

type SocialLinksProps = {
  links: SocialLink[];
};

export function SocialLinks({ links }: SocialLinksProps) {
  if (links.length === 0) return null;

  return (
    <div className={styles.socialRow}>
      {links.map((link) => (
        <a
          key={link.id}
          href={link.href}
          aria-label={link.label}
          target="_blank"
          rel="noopener noreferrer"
        >
          <SocialBrandIcon id={link.id} />
        </a>
      ))}
    </div>
  );
}
