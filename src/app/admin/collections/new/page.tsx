import { AdminShell } from "@/components/layout/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminNewCollectionPage() {
  const admin = await getAdminLabels();
  const p = admin.pages.collections;

  return (
    <StorefrontShell>
      <AdminShell
        title={p.add}
        description={p.newDescription}
        activePath="/admin/collections"
      >
        <CategoryForm />
      </AdminShell>
    </StorefrontShell>
  );
}
