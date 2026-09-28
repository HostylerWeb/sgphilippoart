import { AdminShell } from "@/components/layout/AdminShell";
import { HeroTileForm } from "@/components/admin/HeroTileForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminNewHeroTilePage() {
  const admin = await getAdminLabels();
  const p = admin.pages.heroTiles;

  return (
    <StorefrontShell>
      <AdminShell
        title={p.add}
        description={p.newDescription}
        activePath="/admin/hero-tiles"
      >
        <HeroTileForm />
      </AdminShell>
    </StorefrontShell>
  );
}
