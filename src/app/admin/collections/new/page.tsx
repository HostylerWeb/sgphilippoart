import { AdminShell } from "@/components/layout/AdminShell";
import { CategoryForm } from "@/components/admin/CategoryForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

export default async function AdminNewCollectionPage() {
  return (
    <StorefrontShell>
      <AdminShell
        title="Add collection"
        description="Create a new storefront collection."
        activePath="/admin/collections"
      >
        <CategoryForm />
      </AdminShell>
    </StorefrontShell>
  );
}
