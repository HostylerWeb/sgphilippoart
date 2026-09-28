import { AdminShell } from "@/components/layout/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";
import { getAdminLabels } from "@/lib/admin-dict";

export default async function AdminNewProductPage() {
  const [categories, admin] = await Promise.all([
    db.categories.findMany({ orderBy: { sort_order: "asc" } }),
    getAdminLabels(),
  ]);
  const p = admin.pages.products;

  return (
    <StorefrontShell>
      <AdminShell
        title={p.addProduct}
        description={p.newDescription}
        activePath="/admin/products"
      >
        <ProductForm categories={categories} />
      </AdminShell>
    </StorefrontShell>
  );
}
