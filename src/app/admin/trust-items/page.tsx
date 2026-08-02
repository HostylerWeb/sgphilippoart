import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import tableStyles from "@/components/admin/AdminTable.module.css";
import styles from "../products/page.module.css";
import { db } from "@/lib/db";

export default async function AdminTrustItemsPage() {
  const items = await db.trust_items.findMany({
    orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
  });

  return (
    <StorefrontShell>
      <AdminShell
        title="Trust strip"
        description="Manage the trust icons shown below the homepage product section."
        activePath="/admin/trust-items"
        actions={
          <Link href="/admin/trust-items/new" className={styles.addBtn}>
            Add item
          </Link>
        }
      >
        {items.length === 0 ? (
          <p className={tableStyles.empty}>No trust items yet.</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Icon</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.title}</strong>
                      <div style={{ color: "var(--ink-soft)", fontSize: 12, marginTop: 4 }}>
                        {item.body}
                      </div>
                    </td>
                    <td>{item.icon}</td>
                    <td>{item.is_active ? "Active" : "Hidden"}</td>
                    <td>{item.sort_order}</td>
                    <td>
                      <Link href={`/admin/trust-items/${item.id}/edit`}>Edit</Link>
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
