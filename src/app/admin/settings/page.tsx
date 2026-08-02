import { AdminShell } from "@/components/layout/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getSettingsFormValues } from "@/lib/admin-settings";

export default async function AdminSettingsPage() {
  const values = await getSettingsFormValues();

  return (
    <StorefrontShell>
      <AdminShell
        title="Site settings"
        description="Control currency, shipping, tax, announcements, and storefront copy."
        activePath="/admin/settings"
      >
        <SettingsForm values={values} />
      </AdminShell>
    </StorefrontShell>
  );
}
