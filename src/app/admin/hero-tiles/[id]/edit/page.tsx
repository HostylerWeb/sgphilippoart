import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { HeroTileForm } from "@/components/admin/HeroTileForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";
import { getDutchTranslations, getFrenchTranslations } from "@/lib/i18n/content";
import { getAdminLabels } from "@/lib/admin-dict";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditHeroTilePage({ params }: PageProps) {
  const { id } = await params;
  const [tile, admin] = await Promise.all([
    db.hero_tiles.findUnique({ where: { id } }),
    getAdminLabels(),
  ]);
  if (!tile) notFound();

  return (
    <StorefrontShell>
      <AdminShell
        title={admin.pages.heroTiles.edit}
        description={tile.title}
        activePath="/admin/hero-tiles"
      >
        <HeroTileForm
          tile={{
            ...tile,
            translationValues: getFrenchTranslations(tile),
            translationValuesNl: getDutchTranslations(tile),
          }}
        />
      </AdminShell>
    </StorefrontShell>
  );
}
