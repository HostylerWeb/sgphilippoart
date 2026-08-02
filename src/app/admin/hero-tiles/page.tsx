import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import tableStyles from "@/components/admin/AdminTable.module.css";
import styles from "../products/page.module.css";
import { db } from "@/lib/db";

export default async function AdminHeroTilesPage() {
  const tiles = await db.hero_tiles.findMany({
    orderBy: [{ sort_order: "asc" }, { created_at: "desc" }],
  });

  return (
    <StorefrontShell>
      <AdminShell
        title="Hero tiles"
        description="Manage the homepage hero grid."
        activePath="/admin/hero-tiles"
        actions={
          <Link href="/admin/hero-tiles/new" className={styles.addBtn}>
            Add tile
          </Link>
        }
      >
        {tiles.length === 0 ? (
          <p className={tableStyles.empty}>No hero tiles yet.</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Eyebrow</th>
                  <th>Link</th>
                  <th>Active</th>
                  <th>Order</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {tiles.map((tile) => (
                  <tr key={tile.id}>
                    <td><strong>{tile.title}</strong></td>
                    <td>{tile.eyebrow}</td>
                    <td>{tile.link_url}</td>
                    <td>{tile.is_active ? "Yes" : "No"}</td>
                    <td>{tile.sort_order}</td>
                    <td>
                      <Link href={`/admin/hero-tiles/${tile.id}/edit`}>Edit</Link>
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
