import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import tableStyles from "@/components/admin/AdminTable.module.css";
import { markMessageReadAction } from "@/actions/admin/orders";
import { db } from "@/lib/db";
import { getAdminLabels } from "@/lib/admin-dict";
import { getIntlLocale } from "@/i18n/config";
import { getLocale } from "@/i18n";

export default async function AdminMessagesPage() {
  const locale = await getLocale();
  const dateLocale = getIntlLocale(locale);
  const admin = await getAdminLabels();
  const p = admin.pages.messages;
  const t = admin.tables;
  const c = admin.common;

  const messages = await db.contact_messages.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <StorefrontShell>
      <AdminShell
        title={p.title}
        description={p.description}
        activePath="/admin/messages"
      >
        {messages.length === 0 ? (
          <p className={tableStyles.empty}>{admin.empty.contactMessages}</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>{t.name}</th>
                  <th>{t.subject}</th>
                  <th>{t.message}</th>
                  <th>{t.status}</th>
                  <th>{t.received}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {messages.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong>{item.name}</strong>
                      <div style={{ color: "var(--ink-soft)", fontSize: 12 }}>{item.email}</div>
                    </td>
                    <td>{item.subject ?? c.dash}</td>
                    <td style={{ maxWidth: 320 }}>
                      {item.message}
                    </td>
                    <td>{item.is_read ? c.read : c.new}</td>
                    <td>{new Date(item.created_at).toLocaleDateString(dateLocale)}</td>
                    <td>
                      {!item.is_read && (
                        <form action={markMessageReadAction.bind(null, item.id)}>
                          <button type="submit" style={{ fontSize: 12, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
                            {c.markRead}
                          </button>
                        </form>
                      )}
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
