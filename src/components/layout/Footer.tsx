import Link from "next/link";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { getSocialLinks } from "@/lib/social-links";
import type { StoreSettings } from "@/lib/settings";
import type { Dictionary } from "@/i18n/dictionaries/en";
import styles from "./Footer.module.css";

type FooterProps = {
  settings: StoreSettings;
  dict: Dictionary;
  categories: Array<{ name: string; slug: string }>;
};

export function Footer({ settings, dict, categories }: FooterProps) {
  const t = dict.footer;
  const socialLinks = getSocialLinks(settings);

  return (
    <footer className={styles.footer}>
      <div className="wrap">
        <div className={styles.footerTop}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>{settings.siteName.toUpperCase()}</div>
            <p>{settings.footerDescription}</p>
            <SocialLinks links={socialLinks} />
          </div>
          <div className={styles.footerCol}>
            <h4>{t.shop}</h4>
            <ul>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <li key={category.slug}>
                    <Link href={`/collections/${category.slug}`}>{category.name}</Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link href="/collections">{t.shop}</Link>
                </li>
              )}
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>{t.studio}</h4>
            <ul>
              <li><Link href="/about">{t.about}</Link></li>
              {settings.commissionEnabled && (
                <li><Link href="/commissions">{t.commissions}</Link></li>
              )}
              <li><Link href="/contact">{t.contact}</Link></li>
            </ul>
          </div>
          <div className={styles.footerCol}>
            <h4>{t.support}</h4>
            <ul>
              <li><Link href="/shipping">{t.shipping}</Link></li>
              <li><Link href="/returns">{t.returns}</Link></li>
              <li><Link href="/faq">{t.faq}</Link></li>
              <li><Link href="/privacy">{t.privacy}</Link></li>
              <li><Link href="/terms">{t.terms}</Link></li>
              <li><Link href="/cookies">{t.cookies}</Link></li>
              <li><Link href="/legal">{t.legalNotice}</Link></li>
              <li><Link href="/track-order">{t.trackOrder}</Link></li>
            </ul>
          </div>
          <div className={styles.newsletterBox}>
            <span className={styles.newsletterEyebrow}>{t.newsletterEyebrow}</span>
            <h4>{t.newsletterTitle}</h4>
            <p>{t.newsletterBody}</p>
            <NewsletterForm variant="footer" />
            <span className={styles.newsletterFine}>{t.newsletterFine}</span>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <span>
            &copy; {new Date().getFullYear()} {settings.siteName}. {t.rights}
          </span>
          <span>{settings.localeDisplay}</span>
        </div>
      </div>
    </footer>
  );
}
