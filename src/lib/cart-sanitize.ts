import { db } from "@/lib/db";
import type { CartContext } from "@/lib/cart-context";
import { getCartWhere } from "@/lib/cart-context";

export async function sanitizeCart(ctx: CartContext): Promise<void> {
  const where = getCartWhere(ctx);
  if (!where) return;

  const rows = await db.cart_items.findMany({
    where,
    include: { product: true },
  });

  for (const row of rows) {
    const { product } = row;

    if (product.status !== "published") {
      await db.cart_items.delete({ where: { id: row.id } });
      continue;
    }

    if (product.product_type === "original") {
      if (row.quantity !== 1) {
        await db.cart_items.update({
          where: { id: row.id },
          data: { quantity: 1 },
        });
      }
      continue;
    }

    const stock = product.stock_quantity ?? 0;
    if (stock <= 0) {
      await db.cart_items.delete({ where: { id: row.id } });
      continue;
    }

    if (row.quantity > stock) {
      await db.cart_items.update({
        where: { id: row.id },
        data: { quantity: stock },
      });
    }
  }
}
