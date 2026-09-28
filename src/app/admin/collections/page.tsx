import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import tableStyles from "@/components/admin/AdminTable.module.css";
import styles from "../products/page.module.css";
import { getCategoriesWithCounts } from "@/lib/queries";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminCollectionsPage() {
  const categories = await getCategoriesWithCounts();
  const admin = await getAdminLabels();
  const p = admin.pages.collections;
  const t = admin.tables;
  const c = admin.common;

  return (
    <StorefrontShell>
      <AdminShell
        title={p.title}
        description={p.description}
        activePath="/admin/collections"
        actions={
          <Link href="/admin/collections/new" className={styles.addBtn}>
            {p.add}
          </Link>
        }
      >
        {categories.length === 0 ? (
          <p className={tableStyles.empty}>{admin.empty.collections}</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>{t.name}</th>
                  <th>{t.slug}</th>
                  <th>{t.works}</th>
                  <th>{t.homepage}</th>
                  <th>{t.nav}</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td><strong>{category.name}</strong></td>
                    <td>{category.slug}</td>
                    <td>{category._count.products}</td>
                    <td>{category.show_on_homepage ? c.yes : c.no}</td>
                    <td>{category.show_in_nav ? c.yes : c.no}</td>
                    <td>
                      <Link href={`/admin/collections/${category.id}/edit`}>{c.edit}</Link>
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
