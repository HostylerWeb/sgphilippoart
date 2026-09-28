import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import tableStyles from "@/components/admin/AdminTable.module.css";
import { formatPrice } from "@/lib/format";
import { db } from "@/lib/db";
import { getStoreSettings } from "@/lib/settings";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminOrdersPage() {
  const admin = await getAdminLabels();
  const p = admin.pages.orders;
  const t = admin.tables;
  const c = admin.common;

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
        title={p.title}
        description={p.description}
        activePath="/admin/orders"
      >
        {orders.length === 0 ? (
          <p className={tableStyles.empty}>{admin.empty.orders}</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>{t.order}</th>
                  <th>{t.customer}</th>
                  <th>{t.date}</th>
                  <th>{t.status}</th>
                  <th>{t.total}</th>
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
                      <Link href={`/admin/orders/${order.id}`}>{c.view}</Link>
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
