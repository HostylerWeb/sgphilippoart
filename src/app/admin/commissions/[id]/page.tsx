import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { CommissionForm } from "@/components/admin/CommissionForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { db } from "@/lib/db";
import { formatMessage } from "@/i18n/format-message";
import { getIntlLocale } from "@/i18n/config";
import { getLocale } from "@/i18n";
import { getAdminLabels } from "@/lib/admin-dict";
import styles from "./page.module.css";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminCommissionDetailPage({ params }: PageProps) {
  const { id } = await params;
  const [inquiry, admin, locale] = await Promise.all([
    db.commission_inquiries.findUnique({ where: { id } }),
    getAdminLabels(),
    getLocale(),
  ]);

  if (!inquiry) notFound();

  const d = admin.detail.commission;
  const dateLocale = getIntlLocale(locale);

  return (
    <StorefrontShell>
      <AdminShell
        title={inquiry.name}
        description={formatMessage(d.inquiryDate, {
          date: new Date(inquiry.created_at).toLocaleString(dateLocale),
        })}
        activePath="/admin/commissions"
      >
        <div className={styles.grid}>
          <section className={styles.panel}>
            <h2>{d.contact}</h2>
            <p><strong>{inquiry.name}</strong></p>
            <p>
              <a href={`mailto:${inquiry.email}`}>{inquiry.email}</a>
            </p>
            {inquiry.phone && <p>{inquiry.phone}</p>}
            {inquiry.budget_range && (
              <p><strong>{d.budget}</strong> {inquiry.budget_range}</p>
            )}
            {inquiry.reference_url && (
              <p>
                <strong>{d.reference}</strong>{" "}
                <a href={inquiry.reference_url} target="_blank" rel="noreferrer">
                  {inquiry.reference_url}
                </a>
              </p>
            )}
          </section>

          <section className={styles.panel}>
            <h2>{d.status}</h2>
            <StatusBadge status={inquiry.status} />
            <CommissionForm
              commissionId={inquiry.id}
              currentStatus={inquiry.status}
              adminNotes={inquiry.admin_notes}
            />
          </section>
        </div>

        <section className={styles.panel}>
          <h2>{d.brief}</h2>
          <p className={styles.description}>{inquiry.description}</p>
        </section>

        <Link href="/admin/commissions" className={styles.back}>
          {d.backToCommissions}
        </Link>
      </AdminShell>
    </StorefrontShell>
  );
}
