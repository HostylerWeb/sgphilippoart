import Image from "next/image";
import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { ProductsFilter } from "@/components/admin/ProductsFilter";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice } from "@/lib/format";
import { db } from "@/lib/db";
import { getStoreSettings } from "@/lib/settings";
import styles from "./page.module.css";

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string }>;
};

type ProductStatus = "draft" | "published" | "sold" | "archived";

const VALID_STATUSES = new Set<string>(["draft", "published", "sold", "archived"]);

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { q = "", status = "" } = await searchParams;
  const query = q.trim();
  const statusFilter = VALID_STATUSES.has(status) ? (status as ProductStatus) : undefined;

  const [products, settings] = await Promise.all([
    db.products.findMany({
      where: {
        ...(statusFilter ? { status: statusFilter } : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { slug: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { updated_at: "desc" },
      include: {
        images: { where: { is_primary: true }, take: 1 },
        category: true,
      },
    }),
    getStoreSettings(),
  ]);

  return (
    <StorefrontShell>
      <AdminShell
        title="Products"
        description="Create, edit, and publish artworks for the storefront."
        activePath="/admin/products"
        actions={
          <Link href="/admin/products/new" className={styles.addBtn}>
            Add product
          </Link>
        }
      >
        <ProductsFilter query={query} status={statusFilter ?? ""} />

        {products.length === 0 ? (
          <p className={styles.empty}>No products match your filters.</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Work</th>
                  <th>Type</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const image = product.images[0];
                  return (
                    <tr key={product.id}>
                      <td>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className={styles.thumb}>
                            {image && (
                              <Image
                                src={image.url}
                                alt={image.alt_text ?? product.title}
                                fill
                                sizes="48px"
                              />
                            )}
                          </div>
                          <div className={styles.titleCell}>
                            <strong>{product.title}</strong>
                            <span>{product.slug}</span>
                          </div>
                        </div>
                      </td>
                      <td>{product.product_type}</td>
                      <td>{formatPrice(product.price.toString(), settings)}</td>
                      <td>
                        <StatusBadge status={product.status} />
                      </td>
                      <td>{product.category?.name ?? "—"}</td>
                      <td>
                        <div className={styles.actions}>
                          <Link href={`/admin/products/${product.id}/edit`}>Edit</Link>
                          <Link href={`/products/${product.slug}`} target="_blank">
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </AdminShell>
    </StorefrontShell>
  );
}
