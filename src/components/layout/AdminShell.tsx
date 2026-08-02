import Link from "next/link";
import styles from "./AdminShell.module.css";

export const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/collections", label: "Collections" },
  { href: "/admin/hero-tiles", label: "Hero tiles" },
  { href: "/admin/trust-items", label: "Trust strip" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/testimonials", label: "Reviews" },
  { href: "/admin/commissions", label: "Commissions" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/newsletter", label: "Newsletter" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/account", label: "Storefront account" },
];

type AdminShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  activePath?: string;
  actions?: React.ReactNode;
};

export function AdminShell({
  title,
  description,
  children,
  activePath = "/admin",
  actions,
}: AdminShellProps) {
  return (
    <section className={styles.section}>
      <div className={`wrap ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <span className="eyebrow">Studio</span>
            <strong>Admin</strong>
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
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link href="/" className={styles.backLink}>
            View storefront
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
