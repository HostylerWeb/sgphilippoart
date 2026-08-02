import { AdminShell } from "@/components/layout/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";

export default async function AdminNewProductPage() {
  const categories = await db.categories.findMany({ orderBy: { sort_order: "asc" } });

  return (
    <StorefrontShell>
      <AdminShell
        title="Add product"
        description="Create a new artwork listing for the storefront."
        activePath="/admin/products"
      >
        <ProductForm categories={categories} />
      </AdminShell>
    </StorefrontShell>
  );
}
