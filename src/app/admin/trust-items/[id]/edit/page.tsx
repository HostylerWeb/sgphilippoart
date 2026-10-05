import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { TrustItemForm } from "@/components/admin/TrustItemForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";
import { getDutchTranslations, getFrenchTranslations } from "@/lib/i18n/content";
import { getAdminLabels } from "@/lib/admin-dict";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditTrustItemPage({ params }: PageProps) {
  const { id } = await params;
  const [item, admin] = await Promise.all([
    db.trust_items.findUnique({ where: { id } }),
    getAdminLabels(),
  ]);
  if (!item) notFound();

  return (
    <StorefrontShell>
      <AdminShell
        title={admin.pages.trustItems.edit}
        description={item.title}
        activePath="/admin/trust-items"
      >
        <TrustItemForm
          item={{
            ...item,
            translationValues: getFrenchTranslations(item),
            translationValuesNl: getDutchTranslations(item),
          }}
        />
      </AdminShell>
    </StorefrontShell>
  );
}
