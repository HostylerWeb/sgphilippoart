import Link from "next/link";
import { OrderDetailsForm } from "@/components/admin/OrderDetailsForm";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import tableStyles from "@/components/admin/AdminTable.module.css";
import { formatPrice } from "@/lib/format";
import { db } from "@/lib/db";
import { getStoreSettings } from "@/lib/settings";
import { formatMessage } from "@/i18n/format-message";
import { getIntlLocale } from "@/i18n/config";
import { getLocale } from "@/i18n";
import { getAdminLabels } from "@/lib/admin-dict";
import styles from "./page.module.css";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [order, settings, admin, locale] = await Promise.all([
    db.orders.findUnique({
      where: { id },
      include: { items: true },
    }),
    getStoreSettings(),
    getAdminLabels(),
    getLocale(),
  ]);

  if (!order) notFound();

  const d = admin.detail.order;
  const t = admin.tables;
  const dateLocale = getIntlLocale(locale);
  const address = order.shipping_address as Record<string, string> | null;

  return (
    <StorefrontShell>
      <AdminShell
        title={order.order_number}
        description={formatMessage(d.placed, {
          date: new Date(order.created_at).toLocaleString(dateLocale),
        })}
        activePath="/admin/orders"
      >
        <div className={styles.grid}>
          <section className={styles.panel}>
            <h2>{d.customer}</h2>
            <p><strong>{order.customer_name}</strong></p>
            <p>{order.customer_email}</p>
            {order.customer_phone && <p>{order.customer_phone}</p>}
            {address && (
              <div className={styles.address}>
                {Object.values(address).filter(Boolean).join(", ")}
              </div>
            )}
            {order.notes && (
              <div className={styles.notes}>
                <strong>{d.customerNotes}</strong>
                <p>{order.notes}</p>
              </div>
            )}
          </section>

          <section className={styles.panel}>
            <h2>{d.status}</h2>
            <StatusBadge status={order.status} />
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
            <OrderDetailsForm
              orderId={order.id}
              trackingNumber={order.tracking_number}
              adminNotes={order.admin_notes}
            />
          </section>
        </div>

        <section className={styles.panel}>
          <h2>{d.lineItems}</h2>
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>{t.work}</th>
                  <th>{d.qty}</th>
                  <th>{t.price}</th>
                  <th>{t.total}</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.title}</strong>
                    </td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price.toString(), settings)}</td>
                    <td>{formatPrice((Number(item.price) * item.quantity).toString(), settings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.totals}>
            <div><span>{d.subtotal}</span><strong>{formatPrice(order.subtotal.toString(), settings)}</strong></div>
            <div><span>{d.shipping}</span><strong>{formatPrice(order.shipping_cost.toString(), settings)}</strong></div>
            <div><span>{d.tax}</span><strong>{formatPrice(order.tax.toString(), settings)}</strong></div>
            <div><span>{d.handling}</span><strong>{formatPrice(order.handling_fee.toString(), settings)}</strong></div>
            <div className={styles.grandTotal}>
              <span>{t.total}</span>
              <strong>{formatPrice(order.total.toString(), settings)}</strong>
            </div>
          </div>
        </section>

        <Link href="/admin/orders" className={styles.back}>
          {d.backToOrders}
        </Link>
      </AdminShell>
    </StorefrontShell>
  );
}
