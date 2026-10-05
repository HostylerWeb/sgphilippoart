import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";
import { adminEntityTranslationProps } from "@/lib/i18n/admin-edit-props";
import { getAdminLabels } from "@/lib/admin-dict";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditCollectionPage({ params }: PageProps) {
  const { id } = await params;
  const [category, admin] = await Promise.all([
    db.categories.findUnique({ where: { id } }),
    getAdminLabels(),
  ]);
  if (!category) notFound();

  const { entity, translationValuesEn, translationValuesNl } =
    adminEntityTranslationProps(category, "category");

  return (
    <StorefrontShell>
      <AdminShell
        title={admin.pages.collections.edit}
        description={category.name}
        activePath="/admin/collections"
      >
        <CategoryForm
          category={{
            ...entity,
            translationValuesEn,
            translationValuesNl,
          }}
        />
      </AdminShell>
    </StorefrontShell>
  );
}
