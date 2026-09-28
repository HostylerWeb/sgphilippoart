import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import tableStyles from "@/components/admin/AdminTable.module.css";
import styles from "../products/page.module.css";
import { db } from "@/lib/db";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminTestimonialsPage() {
  const admin = await getAdminLabels();
  const p = admin.pages.testimonials;
  const t = admin.tables;
  const c = admin.common;

  const testimonials = await db.testimonials.findMany({
    orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
  });

  return (
    <StorefrontShell>
      <AdminShell
        title={p.title}
        description={p.description}
        activePath="/admin/testimonials"
        actions={
          <Link href="/admin/testimonials/new" className={styles.addBtn}>
            {p.add}
          </Link>
        }
      >
        {testimonials.length === 0 ? (
          <p className={tableStyles.empty}>{admin.empty.reviews}</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>{t.title}</th>
                  <th>{t.author}</th>
                  <th>{t.rating}</th>
                  <th>{t.status}</th>
                  <th>{t.sort}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {testimonials.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.title}</strong>
                      <div style={{ color: "var(--ink-soft)", fontSize: 12, marginTop: 4 }}>
                        {item.body.slice(0, 80)}
                        {item.body.length > 80 ? "…" : ""}
                      </div>
                    </td>
                    <td>{item.author_name}</td>
                    <td>{item.rating} ★</td>
                    <td>{item.is_published ? c.published : c.hidden}</td>
                    <td>{item.sort_order}</td>
                    <td>
                      <Link href={`/admin/testimonials/${item.id}/edit`}>{c.edit}</Link>
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
