import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { auth } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/admin-stats";
import { formatPrice } from "@/lib/format";
import { db } from "@/lib/db";
import { getStoreSettings } from "@/lib/settings";
import styles from "./page.module.css";

export default async function AdminDashboardPage() {
  const session = await auth();
  const settings = await getStoreSettings();

  const [orders, commissions, contacts, dashboardStats] = await Promise.all([
    db.orders.findMany({ orderBy: { created_at: "desc" }, take: 8, include: { items: true } }),
    db.commission_inquiries.findMany({ orderBy: { created_at: "desc" }, take: 8 }),
    db.contact_messages.findMany({ orderBy: { created_at: "desc" }, take: 8 }),
    getAdminDashboardStats(db),
  ]);

  const {
    totalOrders,
    cancelledOrders,
    ordersToday,
    pendingOrders,
    revenue,
    newCommissions,
    unreadContacts,
    publishedProducts,
    publishedReviews,
    subscriberCount,
  } = dashboardStats;

  return (
    <StorefrontShell>
      <AdminShell
        title="Dashboard"
        description={`Signed in as ${session?.user?.email}. Revenue reflects confirmed orders only — pending inquiries and cancellations are excluded.`}
        activePath="/admin"
        actions={
          <Link href="/admin/products/new" className={styles.quickAction}>
            Add product
          </Link>
        }
      >
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>Open orders</span>
            <strong>{totalOrders}</strong>
            {cancelledOrders > 0 && (
              <span className={styles.statHint}>{cancelledOrders} cancelled</span>
            )}
            {pendingOrders > 0 && (
              <span className={styles.statHint}>{pendingOrders} awaiting confirmation</span>
            )}
          </div>
          <div className={styles.stat}>
            <span>Orders today</span>
            <strong>{ordersToday}</strong>
          </div>
          <div className={styles.stat}>
            <span>Confirmed revenue</span>
            <strong>{formatPrice(revenue, settings)}</strong>
            {pendingOrders > 0 && (
              <span className={styles.statHint}>{pendingOrders} pending inquiries (not in revenue)</span>
            )}
          </div>
          <div className={styles.stat}>
            <span>Published works</span>
            <strong>{publishedProducts}</strong>
          </div>
          <div className={styles.stat}>
            <span>Live reviews</span>
            <strong>{publishedReviews}</strong>
          </div>
          <div className={styles.stat}>
            <span>Newsletter</span>
            <strong>{subscriberCount}</strong>
          </div>
          <div className={styles.stat}>
            <span>New commissions</span>
            <strong>{newCommissions}</strong>
          </div>
          <div className={styles.stat}>
            <span>Unread messages</span>
            <strong>{unreadContacts}</strong>
          </div>
        </div>

        <div className={styles.quickLinks}>
          <Link href="/admin/products">Products</Link>
          <Link href="/admin/collections">Collections</Link>
          <Link href="/admin/hero-tiles">Hero tiles</Link>
          <Link href="/admin/testimonials">Reviews</Link>
          <Link href="/admin/orders">Orders</Link>
          <Link href="/admin/settings">Settings</Link>
        </div>

        <div className={styles.panels}>
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2>Recent orders</h2>
              <Link href="/admin/orders">View all</Link>
            </div>
            {orders.length === 0 ? (
              <p className={styles.empty}>No orders yet.</p>
            ) : (
              <ul>
                {orders.map((order) => (
                  <li key={order.id}>
                    <div>
                      <Link href={`/admin/orders/${order.id}`}>
                        <strong>{order.order_number}</strong>
                      </Link>
                      <span>{order.customer_name}</span>
                    </div>
                    <div className={styles.rowMeta}>
                      <StatusBadge status={order.status} />
                      <span>
                        {order.status === "cancelled"
                          ? "—"
                          : formatPrice(order.total.toString(), settings)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2>Commission inquiries</h2>
              <Link href="/admin/commissions">View all</Link>
            </div>
            <ul>
              {commissions.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.email}</span>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          </section>

          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2>Contact messages</h2>
              <Link href="/admin/messages">View all</Link>
            </div>
            <ul>
              {contacts.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.subject ?? item.message.slice(0, 60)}</span>
                  </div>
                  <span className={styles.date}>
                    {item.is_read ? "Read" : "New"} · {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </AdminShell>
    </StorefrontShell>
  );
}
