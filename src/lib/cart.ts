import { db } from "@/lib/db";
import { sanitizeCart } from "@/lib/cart-sanitize";
import { mapProductToCard } from "@/lib/product-mapper";
import type { StoreSettings } from "@/lib/settings";
import type { Locale } from "@/i18n/config";
import type { CartContext } from "@/lib/cart-context";
import { getCartWhere } from "@/lib/cart-context";
import { calculateOrderTotals, type OrderTotals } from "@/lib/order-totals";

export type { OrderTotals };
export { calculateOrderTotals };

export type CartLineItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    slug: string;
    title: string;
    price: string;
    product_type: "original" | "print";
    status: string;
    stock_quantity: number | null;
    image_url: string;
    image_alt: string | null;
  };
};

export type CartSummary = {
  items: CartLineItem[];
  itemCount: number;
  subtotal: number;
};

export async function getCart(ctx: CartContext, locale: Locale = "en"): Promise<CartSummary> {
  const where = getCartWhere(ctx);
  if (!where) {
    return { items: [], itemCount: 0, subtotal: 0 };
  }

  await sanitizeCart(ctx);

  const rows = await db.cart_items.findMany({
    where,
    orderBy: { created_at: "asc" },
    include: {
      product: {
        include: { images: { orderBy: { sort_order: "asc" } } },
      },
    },
  });

  const items: CartLineItem[] = rows.map((row) => {
    const card = mapProductToCard(row.product, locale);
    return {
      id: row.id,
      quantity: row.quantity,
      product: {
        id: row.product.id,
        slug: row.product.slug,
        title: card.title,
        price: row.product.price.toString(),
        product_type: row.product.product_type,
        status: row.product.status,
        stock_quantity: row.product.stock_quantity,
        image_url: card.image_url,
        image_alt: card.image_alt,
      },
    };
  });

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0,
  );

  return { items, itemCount, subtotal };
}

export async function getCartItemCount(ctx: CartContext): Promise<number> {
  const where = getCartWhere(ctx);
  if (!where) return 0;

  const result = await db.cart_items.aggregate({
    where,
    _sum: { quantity: true },
  });
  return result._sum.quantity ?? 0;
}

export async function mergeGuestCart(sessionId: string, userId: string) {
  const guestItems = await db.cart_items.findMany({
    where: { session_id: sessionId },
    include: { product: true },
  });

  for (const item of guestItems) {
    if (item.product.status !== "published") {
      await db.cart_items.delete({ where: { id: item.id } });
      continue;
    }

    const existing = await db.cart_items.findUnique({
      where: {
        user_id_product_id: { user_id: userId, product_id: item.product_id },
      },
    });

    if (existing) {
      if (item.product.product_type === "print") {
        const stock = item.product.stock_quantity ?? 0;
        if (stock <= 0) {
          await db.cart_items.delete({ where: { id: item.id } });
          continue;
        }
        const mergedQty = Math.min(existing.quantity + item.quantity, stock);
        await db.cart_items.update({
          where: { id: existing.id },
          data: { quantity: mergedQty },
        });
      }
      await db.cart_items.delete({ where: { id: item.id } });
    } else if (item.product.product_type === "print") {
      const stock = item.product.stock_quantity ?? 0;
      if (stock <= 0) {
        await db.cart_items.delete({ where: { id: item.id } });
        continue;
      }
      if (item.quantity > stock) {
        await db.cart_items.update({
          where: { id: item.id },
          data: { user_id: userId, session_id: null, quantity: stock },
        });
      } else {
        await db.cart_items.update({
          where: { id: item.id },
          data: { user_id: userId, session_id: null },
        });
      }
    } else {
      await db.cart_items.update({
        where: { id: item.id },
        data: { user_id: userId, session_id: null },
      });
    }
  }
}

export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `SPA-${year}-`;

  for (let attempt = 0; attempt < 5; attempt++) {
    const latest = await db.orders.findFirst({
      where: { order_number: { startsWith: prefix } },
      orderBy: { order_number: "desc" },
      select: { order_number: true },
    });

    const lastSequence = latest
      ? Number.parseInt(latest.order_number.replace(prefix, ""), 10)
      : 0;

    const candidate = `${prefix}${String(lastSequence + 1 + attempt).padStart(4, "0")}`;
    const exists = await db.orders.findUnique({
      where: { order_number: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
  }

  return `${prefix}${String(Date.now()).slice(-8)}`;
}
