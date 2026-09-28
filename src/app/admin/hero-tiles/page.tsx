import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import tableStyles from "@/components/admin/AdminTable.module.css";
import styles from "../products/page.module.css";
import { db } from "@/lib/db";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminHeroTilesPage() {
  const admin = await getAdminLabels();
  const p = admin.pages.heroTiles;
  const t = admin.tables;
  const c = admin.common;

  const tiles = await db.hero_tiles.findMany({
    orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
  });

  return (
    <StorefrontShell>
      <AdminShell
        title={p.title}
        description={p.description}
        activePath="/admin/hero-tiles"
        actions={
          <Link href="/admin/hero-tiles/new" className={styles.addBtn}>
            {p.add}
          </Link>
        }
      >
        {tiles.length === 0 ? (
          <p className={tableStyles.empty}>{admin.empty.heroTiles}</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>{t.title}</th>
                  <th>{t.eyebrow}</th>
                  <th>{t.link}</th>
                  <th>{t.active}</th>
                  <th>{t.sort}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {tiles.map((tile) => (
                  <tr key={tile.id}>
                    <td><strong>{tile.title}</strong></td>
                    <td>{tile.eyebrow}</td>
                    <td>{tile.link_url}</td>
                    <td>{tile.is_active ? c.yes : c.no}</td>
                    <td>{tile.sort_order}</td>
                    <td>
                      <Link href={`/admin/hero-tiles/${tile.id}/edit`}>{c.edit}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminShell>
    </StorefrontShell>
  );
}
