import { redirect } from "next/navigation";
import Link from "next/link";
import { AccountShell } from "@/components/layout/AccountShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { getOrdersForUser } from "@/lib/queries";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";
import styles from "./page.module.css";

export default async function AccountOrdersPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const [orders, settings, dict] = await Promise.all([
    getOrdersForUser(session.user.id, session.user.email ?? ""),
    getStoreSettings(locale),
    getDictionary(locale),
  ]);
  const t = dict.account;

  return (
    <StorefrontShell>
      <AccountShell
        title={t.ordersTitle}
        description={t.ordersDescription}
        userEmail={session.user.email ?? ""}
        userName={session.user.name}
        isAdmin={session.user.role === "admin"}
        activePath="/account/orders"
        labels={t}
      >
        {orders.length === 0 ? (
          <EmptyState
            title={t.ordersEmptyTitle}
            description={t.ordersEmptyDescription}
            actionLabel={t.browseCollections}
            actionHref="/collections"
          />
        ) : (
          <ul className={styles.list}>
            {orders.map((order) => (
              <li key={order.id}>
                <Link href={`/account/orders/${order.order_number}`} className={styles.row}>
                  <div>
                    <strong>{order.order_number}</strong>
                    <span>{new Date(order.created_at).toLocaleDateString(locale)}</span>
                  </div>
                  <div className={styles.meta}>
                    <StatusBadge status={order.status} />
                    <span>{formatPrice(order.total.toString(), settings)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </AccountShell>
    </StorefrontShell>
  );
}
