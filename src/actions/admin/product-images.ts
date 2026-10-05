"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export async function deleteProductImageAction(imageId: string, productId: string) {
  await requireAdmin(`/admin/products/${productId}/edit`);

  const image = await db.product_images.findUnique({ where: { id: imageId } });
  if (!image || image.product_id !== productId) return;

  await db.$transaction(async (tx) => {
    await tx.product_images.delete({ where: { id: imageId } });

    if (image.is_primary) {
      const next = await tx.product_images.findFirst({
        where: { product_id: productId },
        orderBy: { sort_order: "asc" },
      });
      if (next) {
        await tx.product_images.update({
          where: { id: next.id },
          data: { is_primary: true },
        });
      }
    }
  });

  revalidatePath(`/admin/products/${productId}/edit`);
  const product = await db.products.findUnique({ where: { id: productId } });
  revalidatePath("/");
  revalidatePath("/collections");
  if (product) revalidatePath(`/products/${product.slug}`);
}

export async function setPrimaryImageAction(imageId: string, productId: string) {
  await requireAdmin(`/admin/products/${productId}/edit`);

  await db.$transaction(async (tx) => {
    await tx.product_images.updateMany({
      where: { product_id: productId },
      data: { is_primary: false },
    });
    await tx.product_images.update({
      where: { id: imageId },
      data: { is_primary: true },
    });
  });

  revalidatePath(`/admin/products/${productId}/edit`);
  const product = await db.products.findUnique({ where: { id: productId } });
  revalidatePath("/");
  revalidatePath("/collections");
  if (product) revalidatePath(`/products/${product.slug}`);
}

export async function reorderProductImagesAction(productId: string, imageIds: string[]) {
  await requireAdmin(`/admin/products/${productId}/edit`);

  const images = await db.product_images.findMany({
    where: { product_id: productId },
    orderBy: { sort_order: "asc" },
  });

  if (imageIds.length !== images.length) return;

  const ownedIds = new Set(images.map((image) => image.id));
  if (!imageIds.every((id) => ownedIds.has(id))) return;

  const unique = new Set(imageIds);
  if (unique.size !== imageIds.length) return;

  await db.$transaction(
    imageIds.map((id, sortOrder) =>
      db.product_images.update({
        where: { id },
        data: { sort_order: sortOrder },
      }),
    ),
  );

  revalidatePath(`/admin/products/${productId}/edit`);
  const product = await db.products.findUnique({ where: { id: productId } });
  revalidatePath("/");
  revalidatePath("/collections");
  if (product) revalidatePath(`/products/${product.slug}`);
}
