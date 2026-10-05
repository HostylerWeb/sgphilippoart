import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { TrustItemForm } from "@/components/admin/TrustItemForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";
import { adminEntityTranslationProps } from "@/lib/i18n/admin-edit-props";
import { getAdminLabels } from "@/lib/admin-dict";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditTrustItemPage({ params }: PageProps) {
  const { id } = await params;
  const [item, admin] = await Promise.all([
    db.trust_items.findUnique({ where: { id } }),
    getAdminLabels(),
  ]);
  if (!item) notFound();

  const { entity, translationValuesEn, translationValuesNl } =
    adminEntityTranslationProps(item, "trust");

  return (
    <StorefrontShell>
      <AdminShell
        title={admin.pages.trustItems.edit}
        description={item.title}
        activePath="/admin/trust-items"
      >
        <TrustItemForm
          item={{
            ...entity,
            translationValuesEn,
            translationValuesNl,
          }}
        />
      </AdminShell>
    </StorefrontShell>
  );
}
