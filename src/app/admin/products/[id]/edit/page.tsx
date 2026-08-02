import { notFound } from "next/navigation";
import { AdminShell } from "@/components/layout/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { db } from "@/lib/db";
import { getFrenchTranslations } from "@/lib/i18n/content";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEditProductPage({ params }: PageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.products.findUnique({
      where: { id },
      include: { images: { orderBy: { sort_order: "asc" } } },
    }),
    db.categories.findMany({ orderBy: { sort_order: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <StorefrontShell>
      <AdminShell
        title="Edit product"
        description={product.title}
        activePath="/admin/products"
      >
        <ProductForm
          categories={categories}
          product={{
            ...product,
            price: product.price.toString(),
            translationValues: getFrenchTranslations(product),
          }}
        />
      </AdminShell>
    </StorefrontShell>
  );
}
