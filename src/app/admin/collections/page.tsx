import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import tableStyles from "@/components/admin/AdminTable.module.css";
import styles from "../products/page.module.css";
import { getCategoriesWithCounts } from "@/lib/queries";

export default async function AdminCollectionsPage() {
  const categories = await getCategoriesWithCounts();

  return (
    <StorefrontShell>
      <AdminShell
        title="Collections"
        description="Manage storefront categories and collection pages."
        activePath="/admin/collections"
        actions={
          <Link href="/admin/collections/new" className={styles.addBtn}>
            Add collection
          </Link>
        }
      >
        {categories.length === 0 ? (
          <p className={tableStyles.empty}>No collections yet.</p>
        ) : (
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Works</th>
                  <th>Homepage</th>
                  <th>Nav</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td><strong>{category.name}</strong></td>
                    <td>{category.slug}</td>
                    <td>{category._count.products}</td>
                    <td>{category.show_on_homepage ? "Yes" : "No"}</td>
                    <td>{category.show_in_nav ? "Yes" : "No"}</td>
                    <td>
                      <Link href={`/admin/collections/${category.id}/edit`}>Edit</Link>
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
