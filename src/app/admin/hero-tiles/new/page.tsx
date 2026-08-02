import { AdminShell } from "@/components/layout/AdminShell";
import { HeroTileForm } from "@/components/admin/HeroTileForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";

export default async function AdminNewHeroTilePage() {
  return (
    <StorefrontShell>
      <AdminShell
        title="Add hero tile"
        description="Create a tile for the homepage hero grid."
        activePath="/admin/hero-tiles"
      >
        <HeroTileForm />
      </AdminShell>
    </StorefrontShell>
  );
}
