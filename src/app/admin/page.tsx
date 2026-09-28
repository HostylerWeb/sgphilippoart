import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { auth } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/admin-stats";
import { formatPrice } from "@/lib/format";
import { db } from "@/lib/db";
import { getStoreSettings } from "@/lib/settings";
import { formatMessage } from "@/i18n/format-message";
import { getLocale } from "@/i18n";
import { getAdminLabels } from "@/lib/admin-dict";
import styles from "./page.module.css";

export default async function AdminDashboardPage() {
  const session = await auth();
  const settings = await getStoreSettings();
  const admin = await getAdminLabels();
  const locale = await getLocale();
  const d = admin.pages.dashboard;
  const nav = admin.nav;

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

  const dateLocale = locale === "fr" ? "fr-FR" : "en-US";

  return (
    <StorefrontShell>
      <AdminShell
        title={d.title}
        description={formatMessage(d.description, { email: session?.user?.email ?? "" })}
        activePath="/admin"
        actions={
          <Link href="/admin/products/new" className={styles.quickAction}>
            {d.addProduct}
          </Link>
        }
      >
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span>{d.openOrders}</span>
            <strong>{totalOrders}</strong>
            {cancelledOrders > 0 && (
              <span className={styles.statHint}>
                {formatMessage(d.cancelledCount, { count: cancelledOrders })}
              </span>
            )}
            {pendingOrders > 0 && (
              <span className={styles.statHint}>
                {formatMessage(d.awaitingConfirmation, { count: pendingOrders })}
              </span>
            )}
          </div>
          <div className={styles.stat}>
            <span>{d.ordersToday}</span>
            <strong>{ordersToday}</strong>
          </div>
          <div className={styles.stat}>
            <span>{d.confirmedRevenue}</span>
            <strong>{formatPrice(revenue, settings)}</strong>
            {pendingOrders > 0 && (
              <span className={styles.statHint}>
                {formatMessage(d.pendingNotInRevenue, { count: pendingOrders })}
              </span>
            )}
          </div>
          <div className={styles.stat}>
            <span>{d.publishedWorks}</span>
            <strong>{publishedProducts}</strong>
          </div>
          <div className={styles.stat}>
            <span>{d.liveReviews}</span>
            <strong>{publishedReviews}</strong>
          </div>
          <div className={styles.stat}>
            <span>{d.newsletter}</span>
            <strong>{subscriberCount}</strong>
          </div>
          <div className={styles.stat}>
            <span>{d.newCommissions}</span>
            <strong>{newCommissions}</strong>
          </div>
          <div className={styles.stat}>
            <span>{d.unreadMessages}</span>
            <strong>{unreadContacts}</strong>
          </div>
        </div>

        <div className={styles.quickLinks}>
          <Link href="/admin/products">{nav.products}</Link>
          <Link href="/admin/collections">{nav.collections}</Link>
          <Link href="/admin/hero-tiles">{nav.heroTiles}</Link>
          <Link href="/admin/testimonials">{nav.testimonials}</Link>
          <Link href="/admin/orders">{nav.orders}</Link>
          <Link href="/admin/settings">{nav.settings}</Link>
        </div>

        <div className={styles.panels}>
          <section className={styles.panel}>
            <div className={styles.panelHead}>
              <h2>{d.recentOrders}</h2>
              <Link href="/admin/orders">{admin.common.viewAll}</Link>
            </div>
            {orders.length === 0 ? (
              <p className={styles.empty}>{d.noOrdersYet}</p>
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
                          ? admin.common.dash
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
              <h2>{d.commissionInquiries}</h2>
              <Link href="/admin/commissions">{admin.common.viewAll}</Link>
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
              <h2>{d.contactMessages}</h2>
              <Link href="/admin/messages">{admin.common.viewAll}</Link>
            </div>
            <ul>
              {contacts.map((item) => (
                <li key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>{item.subject ?? item.message.slice(0, 60)}</span>
                  </div>
                  <span className={styles.date}>
                    {item.is_read ? admin.common.read : admin.common.new} ·{" "}
                    {new Date(item.created_at).toLocaleDateString(dateLocale)}
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
