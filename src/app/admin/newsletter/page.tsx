import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import tableStyles from "@/components/admin/AdminTable.module.css";
import { ACTIVE_SUBSCRIBER_WHERE } from "@/lib/admin-stats";
import { db } from "@/lib/db";
import { formatMessage } from "@/i18n/format-message";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminNewsletterPage() {
  const admin = await getAdminLabels();
  const p = admin.pages.newsletter;
  const t = admin.tables;
  const c = admin.common;

  const subscribers = await db.newsletter_subscribers.findMany({
    where: ACTIVE_SUBSCRIBER_WHERE,
    orderBy: { created_at: "desc" },
  });

  const description =
    subscribers.length === 1
      ? formatMessage(p.descriptionOne, { count: subscribers.length })
      : formatMessage(p.descriptionMany, { count: subscribers.length });

  return (
    <StorefrontShell>
      <AdminShell
        title={p.title}
        description={description}
        activePath="/admin/newsletter"
        actions={
          subscribers.length > 0 ? (
            <Link href="/admin/newsletter/export" className={tableStyles.exportBtn}>
              {c.exportCsv}
            </Link>
          ) : undefined
        }
      >
        {subscribers.length === 0 ? (
          <p className={tableStyles.empty}>{admin.empty.subscribers}</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>{t.email}</th>
                  <th>{t.subscribed}</th>
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
