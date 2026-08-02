import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import tableStyles from "@/components/admin/AdminTable.module.css";
import styles from "../products/page.module.css";
import { db } from "@/lib/db";

export default async function AdminTestimonialsPage() {
  const testimonials = await db.testimonials.findMany({
    orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
  });

  return (
    <StorefrontShell>
      <AdminShell
        title="Reviews"
        description="Manage customer testimonials shown on the homepage."
        activePath="/admin/testimonials"
        actions={
          <Link href="/admin/testimonials/new" className={styles.addBtn}>
            Add review
          </Link>
        }
      >
        {testimonials.length === 0 ? (
          <p className={tableStyles.empty}>No reviews yet.</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Order</th>
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
                    <td>{item.is_published ? "Published" : "Hidden"}</td>
                    <td>{item.sort_order}</td>
                    <td>
                      <Link href={`/admin/testimonials/${item.id}/edit`}>Edit</Link>
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
