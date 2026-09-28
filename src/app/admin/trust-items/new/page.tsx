import { AdminShell } from "@/components/layout/AdminShell";
import { TrustItemForm } from "@/components/admin/TrustItemForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminNewTrustItemPage() {
  const admin = await getAdminLabels();
  const p = admin.pages.trustItems;

  return (
    <StorefrontShell>
      <AdminShell
        title={p.add}
        description={p.newDescription}
        activePath="/admin/trust-items"
      >
        <TrustItemForm />
      </AdminShell>
    </StorefrontShell>
  );
}
