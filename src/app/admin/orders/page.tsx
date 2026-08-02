import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import tableStyles from "@/components/admin/AdminTable.module.css";
import { formatPrice } from "@/lib/format";
import { db } from "@/lib/db";
import { getStoreSettings } from "@/lib/settings";

export default async function AdminOrdersPage() {
  const [orders, settings] = await Promise.all([
    db.orders.findMany({
      orderBy: { created_at: "desc" },
      include: { items: true },
    }),
    getStoreSettings(),
  ]);

  return (
    <StorefrontShell>
      <AdminShell
        title="Orders"
        description="Review customer inquiries and order status."
        activePath="/admin/orders"
      >
        {orders.length === 0 ? (
          <p className={tableStyles.empty}>No orders yet.</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <strong>{order.order_number}</strong>
                    </td>
                    <td>
                      <div>{order.customer_name}</div>
                      <span style={{ color: "var(--ink-soft)", fontSize: 12 }}>{order.customer_email}</span>
                    </td>
                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={order.status} />
                    </td>
                    <td>{formatPrice(order.total.toString(), settings)}</td>
                    <td>
                      <Link href={`/admin/orders/${order.id}`}>View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminShell>
    </StorefrontShell>
  );
}
