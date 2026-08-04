import Link from "next/link";
import { getDictionary, getLocale } from "@/i18n";
import styles from "./AdminShell.module.css";

const ADMIN_NAV_ITEMS = [
  { href: "/admin", labelKey: "dashboard" as const, exact: true },
  { href: "/admin/products", labelKey: "products" as const },
  { href: "/admin/collections", labelKey: "collections" as const },
  { href: "/admin/hero-tiles", labelKey: "heroTiles" as const },
  { href: "/admin/trust-items", labelKey: "trustItems" as const },
  { href: "/admin/orders", labelKey: "orders" as const },
  { href: "/admin/testimonials", labelKey: "testimonials" as const },
  { href: "/admin/commissions", labelKey: "commissions" as const },
  { href: "/admin/messages", labelKey: "messages" as const },
  { href: "/admin/newsletter", labelKey: "newsletter" as const },
  { href: "/admin/settings", labelKey: "settings" as const },
  { href: "/account", labelKey: "account" as const },
];

type AdminShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  activePath?: string;
  actions?: React.ReactNode;
};

export async function AdminShell({
  title,
  description,
  children,
  activePath = "/admin",
  actions,
}: AdminShellProps) {
  const locale = await getLocale();
  const admin = getDictionary(locale).admin;

  return (
    <section className={styles.section}>
      <div className={`wrap ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <span className="eyebrow">{admin.studio}</span>
            <strong>{admin.title}</strong>
          </div>
          <nav className={styles.nav}>
            {ADMIN_NAV_ITEMS.map((item) => {
              const active = item.exact
                ? activePath === item.href
                : activePath.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? styles.active : undefined}
                >
                  {admin.nav[item.labelKey]}
                </Link>
              );
            })}
          </nav>
          <Link href="/" className={styles.backLink}>
            {admin.viewStorefront}
          </Link>
        </aside>
        <div className={styles.content}>
          <header className={styles.header}>
            <div>
              <h1>{title}</h1>
              {description && <p>{description}</p>}
            </div>
            {actions}
          </header>
          {children}
        </div>
      </div>
    </section>
  );
}

export { ADMIN_NAV_ITEMS };
