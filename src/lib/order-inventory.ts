import type { Prisma } from "@/generated/prisma/client";
import type { InventoryError } from "@/lib/inventory-errors";

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
): Promise<InventoryError | null> {
  for (const item of items) {
    const product = await db.products.findUnique({ where: { id: item.product_id } });
    if (!product || product.status !== "published") {
      return { code: "not_available", title: item.title };
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
        return {
          code: "insufficient_stock",
          title: item.title,
          count: product.stock_quantity,
        };
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
): Promise<InventoryError | null> {
  const items = await getOrderItems(db, orderId);

  for (const item of items) {
    if (item.product.product_type === "original") {
      const hasOtherActiveOrder = await hasOtherActiveOrderForProduct(
        db,
        orderId,
        item.product_id,
      );
      if (hasOtherActiveOrder) {
        return { code: "already_reserved", title: item.title };
      }
      if (item.product.status === "sold") {
        return { code: "not_available", title: item.title };
      }

      await db.products.update({
        where: { id: item.product_id },
        data: { status: "sold" },
      });
      continue;
    }

    if (item.product.stock_quantity !== null) {
      if (item.product.stock_quantity < item.quantity) {
        return {
          code: "insufficient_stock",
          title: item.title,
          count: item.product.stock_quantity,
        };
      }

      await db.products.update({
        where: { id: item.product_id },
        data: { stock_quantity: { decrement: item.quantity } },
      });
    }
  }

  return null;
}
