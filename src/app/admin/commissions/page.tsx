import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import tableStyles from "@/components/admin/AdminTable.module.css";
import { db } from "@/lib/db";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminCommissionsPage() {
  const admin = await getAdminLabels();
  const p = admin.pages.commissions;
  const t = admin.tables;
  const c = admin.common;

  const inquiries = await db.commission_inquiries.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <StorefrontShell>
      <AdminShell
        title={p.title}
        description={p.description}
        activePath="/admin/commissions"
      >
        {inquiries.length === 0 ? (
          <p className={tableStyles.empty}>{admin.empty.commissions}</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>{t.name}</th>
                  <th>{t.email}</th>
                  <th>{t.budget}</th>
                  <th>{t.status}</th>
                  <th>{t.received}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {inquiries.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      <div style={{ color: "var(--ink-soft)", fontSize: 12, marginTop: 4 }}>
                        {item.description.slice(0, 80)}
                        {item.description.length > 80 ? "…" : ""}
                      </div>
                    </td>
                    <td>{item.email}</td>
                    <td>{item.budget_range ?? c.dash}</td>
                    <td>
                      <StatusBadge status={item.status} />
                    </td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>
                      <Link href={`/admin/commissions/${item.id}`}>{c.view}</Link>
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
