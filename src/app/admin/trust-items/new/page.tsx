import { AdminShell } from "@/components/layout/AdminShell";
import { TrustItemForm } from "@/components/admin/TrustItemForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

export default async function AdminNewTrustItemPage() {
  return (
    <StorefrontShell>
      <AdminShell
        title="Add trust item"
        description="Create a trust strip item for the homepage."
        activePath="/admin/trust-items"
      >
        <TrustItemForm />
      </AdminShell>
    </StorefrontShell>
  );
}
