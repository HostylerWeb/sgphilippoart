import { AdminShell } from "@/components/layout/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getSettingsFormValues } from "@/lib/admin-settings";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminSettingsPage() {
  const values = await getSettingsFormValues();
  const admin = await getAdminLabels();
  const p = admin.pages.settings;

  return (
    <StorefrontShell>
      <AdminShell
        title={p.title}
        description={p.description}
        activePath="/admin/settings"
      >
        <SettingsForm values={values} />
      </AdminShell>
    </StorefrontShell>
  );
}
