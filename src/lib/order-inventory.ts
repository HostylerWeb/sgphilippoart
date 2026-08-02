import type { Prisma } from "@/generated/prisma/client";

type DbClient = Prisma.TransactionClient;

async function getOrderItems(db: DbClient, orderId: string) {
  return db.order_items.findMany({
    where: { order_id: orderId },
    include: { product: true },
  });
}

async function hasOtherActiveOrderForProduct(
  db: DbClient,
  orderId: string,
  productId: string,
) {
  const otherItem = await db.order_items.findFirst({
    where: {
      product_id: productId,
      order_id: { not: orderId },
      order: { status: { not: "cancelled" } },
    },
    select: { id: true },
  });

  return Boolean(otherItem);
}

export async function reserveCartItems(
  db: DbClient,
  items: Array<{ product_id: string; title: string; quantity: number }>,
): Promise<string | null> {
  for (const item of items) {
    const product = await db.products.findUnique({ where: { id: item.product_id } });
    if (!product || product.status !== "published") {
      return `"${item.title}" is no longer available.`;
    }

    if (product.product_type === "original") {
      await db.products.update({
        where: { id: product.id },
        data: { status: "sold" },
      });
      continue;
    }

    if (product.stock_quantity !== null) {
      if (product.stock_quantity < item.quantity) {
        return `Insufficient stock for "${item.title}" (only ${product.stock_quantity} left).`;
      }

      await db.products.update({
        where: { id: product.id },
        data: { stock_quantity: { decrement: item.quantity } },
      });
    }
  }

  return null;
}

export async function restoreOrderInventory(
  db: DbClient,
  orderId: string,
): Promise<void> {
  const items = await getOrderItems(db, orderId);

  for (const item of items) {
    if (item.product.product_type === "original") {
      const hasOtherActiveOrder = await hasOtherActiveOrderForProduct(
        db,
        orderId,
        item.product_id,
      );
      if (!hasOtherActiveOrder && item.product.status === "sold") {
        await db.products.update({
          where: { id: item.product_id },
          data: { status: "published" },
        });
      }
      continue;
    }

    if (item.product.stock_quantity !== null) {
      await db.products.update({
        where: { id: item.product_id },
        data: { stock_quantity: { increment: item.quantity } },
      });
    }
  }
}

export async function reserveOrderInventory(
  db: DbClient,
  orderId: string,
): Promise<string | null> {
  const items = await getOrderItems(db, orderId);

  for (const item of items) {
    if (item.product.product_type === "original") {
      const hasOtherActiveOrder = await hasOtherActiveOrderForProduct(
        db,
        orderId,
        item.product_id,
      );
      if (hasOtherActiveOrder) {
        return `"${item.title}" is already reserved by another active order.`;
      }
      if (item.product.status === "sold") {
        return `"${item.title}" is no longer available.`;
      }

      await db.products.update({
        where: { id: item.product_id },
        data: { status: "sold" },
      });
      continue;
    }

    if (item.product.stock_quantity !== null) {
      if (item.product.stock_quantity < item.quantity) {
        return `Insufficient stock for "${item.title}" (only ${item.product.stock_quantity} left).`;
      }

      await db.products.update({
        where: { id: item.product_id },
        data: { stock_quantity: { decrement: item.quantity } },
      });
    }
  }

  return null;
}
