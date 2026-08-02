import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import tableStyles from "@/components/admin/AdminTable.module.css";
import { markMessageReadAction } from "@/actions/admin/orders";
import { db } from "@/lib/db";

export default async function AdminMessagesPage() {
  const messages = await db.contact_messages.findMany({
    orderBy: { created_at: "desc" },
  });

  return (
    <StorefrontShell>
      <AdminShell
        title="Messages"
        description="Contact form submissions from the storefront."
        activePath="/admin/messages"
      >
        {messages.length === 0 ? (
          <p className={tableStyles.empty}>No contact messages yet.</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Subject</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th>Received</th>
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
                    <td>{item.subject ?? "—"}</td>
                    <td style={{ maxWidth: 320 }}>
                      {item.message}
                    </td>
                    <td>{item.is_read ? "Read" : "New"}</td>
                    <td>{new Date(item.created_at).toLocaleDateString()}</td>
                    <td>
                      {!item.is_read && (
                        <form action={markMessageReadAction.bind(null, item.id)}>
                          <button type="submit" style={{ fontSize: 12, textDecoration: "underline", background: "none", border: "none", cursor: "pointer" }}>
                            Mark read
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
