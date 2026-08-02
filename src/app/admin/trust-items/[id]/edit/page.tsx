import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { TrustItemForm } from "@/components/admin/TrustItemForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";
import { getFrenchTranslations } from "@/lib/i18n/content";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditTrustItemPage({ params }: PageProps) {
  const { id } = await params;
  const item = await db.trust_items.findUnique({ where: { id } });
  if (!item) notFound();

  return (
    <StorefrontShell>
      <AdminShell
        title="Edit trust item"
        description={item.title}
        activePath="/admin/trust-items"
      >
        <TrustItemForm
          item={{
            ...item,
            translationValues: getFrenchTranslations(item),
          }}
        />
      </AdminShell>
    </StorefrontShell>
  );
}
