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
import styles from "./page.module.css";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminOrderDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [order, settings] = await Promise.all([
    db.orders.findUnique({
      where: { id },
      include: { items: true },
    }),
    getStoreSettings(),
  ]);

  if (!order) notFound();

  const address = order.shipping_address as Record<string, string> | null;

  return (
    <StorefrontShell>
      <AdminShell
        title={order.order_number}
        description={`Placed ${new Date(order.created_at).toLocaleString()}`}
        activePath="/admin/orders"
      >
        <div className={styles.grid}>
          <section className={styles.panel}>
            <h2>Customer</h2>
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
                <strong>Customer notes</strong>
                <p>{order.notes}</p>
              </div>
            )}
          </section>

          <section className={styles.panel}>
            <h2>Status</h2>
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
          <h2>Line items</h2>
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Work</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
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
            <div><span>Subtotal</span><strong>{formatPrice(order.subtotal.toString(), settings)}</strong></div>
            <div><span>Shipping</span><strong>{formatPrice(order.shipping_cost.toString(), settings)}</strong></div>
            <div><span>Tax</span><strong>{formatPrice(order.tax.toString(), settings)}</strong></div>
            <div><span>Handling</span><strong>{formatPrice(order.handling_fee.toString(), settings)}</strong></div>
            <div className={styles.grandTotal}>
              <span>Total</span>
              <strong>{formatPrice(order.total.toString(), settings)}</strong>
            </div>
          </div>
        </section>

        <Link href="/admin/orders" className={styles.back}>
          ← Back to orders
        </Link>
      </AdminShell>
    </StorefrontShell>
  );
}
