import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";
import { getFrenchTranslations } from "@/lib/i18n/content";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditCollectionPage({ params }: PageProps) {
  const { id } = await params;
  const category = await db.categories.findUnique({ where: { id } });
  if (!category) notFound();

  return (
    <StorefrontShell>
      <AdminShell
        title="Edit collection"
        description={category.name}
        activePath="/admin/collections"
      >
        <CategoryForm
          category={{
            ...category,
            translationValues: getFrenchTranslations(category),
          }}
        />
      </AdminShell>
    </StorefrontShell>
  );
}
