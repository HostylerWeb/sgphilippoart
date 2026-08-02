import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { HeroTileForm } from "@/components/admin/HeroTileForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";
import { getFrenchTranslations } from "@/lib/i18n/content";

type PageProps = { params: Promise<{ id: string }> };

export default async function AdminEditHeroTilePage({ params }: PageProps) {
  const { id } = await params;
  const tile = await db.hero_tiles.findUnique({ where: { id } });
  if (!tile) notFound();

  return (
    <StorefrontShell>
      <AdminShell
        title="Edit hero tile"
        description={tile.title}
        activePath="/admin/hero-tiles"
      >
        <HeroTileForm
          tile={{
            ...tile,
            translationValues: getFrenchTranslations(tile),
          }}
        />
      </AdminShell>
    </StorefrontShell>
  );
}
