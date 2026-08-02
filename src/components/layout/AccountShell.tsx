import Link from "next/link";
import styles from "./AccountShell.module.css";

const NAV_ITEMS = [
  { href: "/account", labelKey: "overview" as const, exact: true },
  { href: "/account/orders", labelKey: "orders" as const },
  { href: "/account/wishlist", labelKey: "wishlist" as const },
  { href: "/account/settings", labelKey: "settings" as const },
];

type AccountLabels = {
  account: string;
  overview: string;
  orders: string;
  wishlist: string;
  settings: string;
  admin: string;
};

type AccountShellProps = {
  title: string;
  description?: string;
  userEmail: string;
  userName?: string | null;
  isAdmin?: boolean;
  children: React.ReactNode;
  activePath: string;
  labels?: AccountLabels;
};

export function AccountShell({
  title,
  description,
  userEmail,
  userName,
  isAdmin,
  children,
  activePath,
  labels,
}: AccountShellProps) {
  const navLabels = labels ?? {
    account: "Account",
    overview: "Overview",
    orders: "Orders",
    wishlist: "Wishlist",
    settings: "Settings",
    admin: "Admin",
  };

  return (
    <section className={styles.section}>
      <div className={`wrap ${styles.layout}`}>
        <aside className={styles.sidebar}>
          <div className={styles.user}>
            <span className="eyebrow">{navLabels.account}</span>
            <strong>{userName ?? "Collector"}</strong>
            <span>{userEmail}</span>
          </div>
          <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => {
              const active =
                item.exact ? activePath === item.href : activePath.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? styles.active : undefined}
                >
                  {navLabels[item.labelKey]}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className={activePath.startsWith("/admin") ? styles.active : undefined}
              >
                {navLabels.admin}
              </Link>
            )}
          </nav>
        </aside>
        <div className={styles.content}>
          <header className={styles.header}>
            <h1>{title}</h1>
            {description && <p>{description}</p>}
          </header>
          {children}
        </div>
      </div>
    </section>
  );
}
