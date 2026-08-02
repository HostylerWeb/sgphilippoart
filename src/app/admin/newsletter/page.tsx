import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import tableStyles from "@/components/admin/AdminTable.module.css";
import { ACTIVE_SUBSCRIBER_WHERE } from "@/lib/admin-stats";
import { db } from "@/lib/db";

export default async function AdminNewsletterPage() {
  const subscribers = await db.newsletter_subscribers.findMany({
    where: ACTIVE_SUBSCRIBER_WHERE,
    orderBy: { created_at: "desc" },
  });

  return (
    <StorefrontShell>
      <AdminShell
        title="Newsletter"
        description={`${subscribers.length} subscriber${subscribers.length === 1 ? "" : "s"} on the list.`}
        activePath="/admin/newsletter"
        actions={
          subscribers.length > 0 ? (
            <Link href="/admin/newsletter/export" className={tableStyles.exportBtn}>
              Export CSV
            </Link>
          ) : undefined
        }
      >
        {subscribers.length === 0 ? (
          <p className={tableStyles.empty}>No subscribers yet.</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Subscribed</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id}>
                    <td>{subscriber.email}</td>
                    <td>{new Date(subscriber.created_at).toLocaleDateString()}</td>
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
