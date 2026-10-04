import { StoreImage } from "@/components/ui/StoreImage";
import Link from "next/link";
import { AdminShell } from "@/components/layout/AdminShell";
import { ProductsFilter } from "@/components/admin/ProductsFilter";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice } from "@/lib/format";
import { db } from "@/lib/db";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";
import { getAdminLabels } from "@/lib/admin-dict";
import { getAdminProductNoticeMessage } from "@/lib/admin-product-notices";
import { AdminFlashNotice } from "@/components/admin/AdminFlashNotice";
import styles from "./page.module.css";

type PageProps = {
  searchParams: Promise<{ q?: string; status?: string; notice?: string }>;
};

type ProductStatus = "draft" | "published" | "sold" | "archived";

const VALID_STATUSES = new Set<string>(["draft", "published", "sold", "archived"]);

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const { q = "", status = "", notice } = await searchParams;
  const query = q.trim();
  const statusFilter = VALID_STATUSES.has(status) ? (status as ProductStatus) : undefined;
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const admin = await getAdminLabels();
  const p = admin.pages.products;
  const t = admin.tables;
  const c = admin.common;
  const noticeMessage = getAdminProductNoticeMessage(notice, admin.feedback);
  const noticeClearHref =
    query || statusFilter
      ? `/admin/products?${new URLSearchParams({
          ...(query ? { q: query } : {}),
          ...(statusFilter ? { status: statusFilter } : {}),
        }).toString()}`
      : "/admin/products";
  const productTypeLabel = (type: "original" | "print") =>
    type === "print" ? dict.product.print : dict.product.original;

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
        title={p.title}
        description={p.description}
        activePath="/admin/products"
        actions={
          <Link href="/admin/products/new" className={styles.addBtn}>
            {p.addProduct}
          </Link>
        }
      >
        <AdminFlashNotice message={noticeMessage} clearHref={noticeClearHref} />
        <ProductsFilter
          query={query}
          status={statusFilter ?? ""}
          labels={{
            ...admin.productFilter,
            filter: c.filter,
            clear: c.clear,
          }}
        />

        {products.length === 0 ? (
          <p className={styles.empty}>{p.empty}</p>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>{t.work}</th>
                  <th>{t.type}</th>
                  <th>{t.price}</th>
                  <th>{t.status}</th>
                  <th>{t.category}</th>
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
                              <StoreImage
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
                      <td>{productTypeLabel(product.product_type)}</td>
                      <td>{formatPrice(product.price.toString(), settings)}</td>
                      <td>
                        <StatusBadge status={product.status} />
                      </td>
                      <td>{product.category?.name ?? c.dash}</td>
                      <td>
                        <div className={styles.actions}>
                          <Link href={`/admin/products/${product.id}/edit`}>{c.edit}</Link>
                          <Link href={`/products/${product.slug}`} target="_blank">
                            {c.view}
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
