import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";
import { adminEntityTranslationProps } from "@/lib/i18n/admin-edit-props";
import { getAdminLabels } from "@/lib/admin-dict";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories, admin] = await Promise.all([
    db.products.findUnique({
      where: { id },
      include: { images: { orderBy: { sort_order: "asc" } } },
    }),
    db.categories.findMany({ orderBy: { sort_order: "asc" } }),
    getAdminLabels(),
  ]);

  if (!product) notFound();

  const { entity, translationValuesEn, translationValuesNl } =
    adminEntityTranslationProps(product, "product");

  return (
    <StorefrontShell>
      <AdminShell
        title={admin.pages.products.editProduct}
        description={product.title}
        activePath="/admin/products"
      >
        <ProductForm
          categories={categories}
          product={{
            ...entity,
            price: product.price.toString(),
            translationValuesEn,
            translationValuesNl,
          }}
        />
      </AdminShell>
    </StorefrontShell>
  );
}
