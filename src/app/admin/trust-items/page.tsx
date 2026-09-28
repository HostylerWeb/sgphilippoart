import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import tableStyles from "@/components/admin/AdminTable.module.css";
import styles from "../products/page.module.css";
import { db } from "@/lib/db";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminTrustItemsPage() {
  const admin = await getAdminLabels();
  const p = admin.pages.trustItems;
  const t = admin.tables;
  const c = admin.common;

  const items = await db.trust_items.findMany({
    orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
  });

  return (
    <StorefrontShell>
      <AdminShell
        title={p.title}
        description={p.description}
        activePath="/admin/trust-items"
        actions={
          <Link href="/admin/trust-items/new" className={styles.addBtn}>
            {p.add}
          </Link>
        }
      >
        {items.length === 0 ? (
          <p className={tableStyles.empty}>{admin.empty.trustItems}</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>{t.title}</th>
                  <th>{t.icon}</th>
                  <th>{t.status}</th>
                  <th>{t.sort}</th>
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
                    <td>{item.is_active ? c.active : c.hidden}</td>
                    <td>{item.sort_order}</td>
                    <td>
                      <Link href={`/admin/trust-items/${item.id}/edit`}>{c.edit}</Link>
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
