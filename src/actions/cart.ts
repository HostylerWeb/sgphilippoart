"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  calculateOrderTotals,
  generateOrderNumber,
  getCart,
} from "@/lib/cart";
import { getCartContext } from "@/lib/cart-context";
import { ensureCartSessionId } from "@/lib/cart-session";
import { sendOrderConfirmation } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";
import { enforceRateLimit } from "@/lib/rate-limit";
import { reserveCartItems } from "@/lib/order-inventory";
import { parseCheckoutInput } from "@/lib/validations/checkout";

type ActionResult = {
  success: boolean;
  message?: string;
  itemCount?: number;
};

async function resolveCartOwner() {
  const ctx = await getCartContext();
  if (ctx.userId) return ctx;
  const sessionId = await ensureCartSessionId();
  return { userId: null, sessionId };
}

export async function addToCart(productId: string): Promise<ActionResult> {
  const ctx = await resolveCartOwner();
  const product = await db.products.findUnique({ where: { id: productId } });

  if (!product || product.status !== "published") {
    return { success: false, message: "This artwork is not available." };
  }

  const ownerWhere = ctx.userId
    ? { user_id_product_id: { user_id: ctx.userId, product_id: productId } }
    : { session_id_product_id: { session_id: ctx.sessionId!, product_id: productId } };

  if (product.product_type === "original") {
    const existing = await db.cart_items.findUnique({ where: ownerWhere });
    if (existing) {
      return { success: false, message: "This original is already in your cart." };
    }
    await db.cart_items.create({
      data: {
        user_id: ctx.userId,
        session_id: ctx.userId ? null : ctx.sessionId,
        product_id: productId,
        quantity: 1,
      },
    });
  } else {
    const stock = product.stock_quantity ?? 0;
    if (stock <= 0) {
      return { success: false, message: "This print is out of stock." };
    }

    const existing = await db.cart_items.findUnique({ where: ownerWhere });
    const nextQty = (existing?.quantity ?? 0) + 1;
    if (nextQty > stock) {
      return { success: false, message: `Only ${stock} available.` };
    }

    await db.cart_items.upsert({
      where: ownerWhere,
      create: {
        user_id: ctx.userId,
        session_id: ctx.userId ? null : ctx.sessionId,
        product_id: productId,
        quantity: 1,
      },
      update: { quantity: nextQty },
    });
  }

  const cart = await getCart(ctx);
  revalidatePath("/cart");
  revalidatePath("/", "layout");

  return { success: true, itemCount: cart.itemCount };
}

export async function updateCartItemQuantity(
  itemId: string,
  quantity: number,
): Promise<ActionResult> {
  const ctx = await getCartContext();
  const where = ctx.userId
    ? { id: itemId, user_id: ctx.userId }
    : { id: itemId, session_id: ctx.sessionId ?? "" };

  const item = await db.cart_items.findFirst({
    where,
    include: { product: true },
  });

  if (!item) return { success: false, message: "Item not found." };

  if (quantity <= 0) {
    await db.cart_items.delete({ where: { id: itemId } });
  } else if (item.product.product_type === "original") {
    await db.cart_items.update({ where: { id: itemId }, data: { quantity: 1 } });
  } else {
    const stock = item.product.stock_quantity ?? 0;
    if (quantity > stock) {
      return { success: false, message: `Only ${stock} available.` };
    }
    await db.cart_items.update({ where: { id: itemId }, data: { quantity } });
  }

  const cart = await getCart(ctx);
  revalidatePath("/cart");
  revalidatePath("/", "layout");

  return { success: true, itemCount: cart.itemCount };
}

export async function removeFromCart(itemId: string): Promise<ActionResult> {
  const ctx = await getCartContext();
  const where = ctx.userId
    ? { id: itemId, user_id: ctx.userId }
    : { id: itemId, session_id: ctx.sessionId ?? "" };

  await db.cart_items.deleteMany({ where });

  const cart = await getCart(ctx);
  revalidatePath("/cart");
  revalidatePath("/", "layout");

  return { success: true, itemCount: cart.itemCount };
}

type CheckoutInput = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  countryCode: string;
  notes?: string;
};

export async function submitOrderInquiry(
  input: CheckoutInput,
): Promise<{ success: boolean; message?: string; orderNumber?: string }> {
  const locale = await getLocale();
  const v = getDictionary(locale).validation;

  const limited = await enforceRateLimit("checkout", 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return { success: false, message: v.checkoutRateLimited };
  }

  const ctx = await getCartContext();
  const [cart, settings] = await Promise.all([
    getCart(ctx, locale),
    getStoreSettings(locale),
  ]);

  if (cart.items.length === 0) {
    return { success: false, message: v.cartEmpty };
  }

  if (!ctx.userId) {
    return { success: false, message: v.checkoutSignInRequired };
  }

  if (cart.subtotal < settings.minOrderAmount) {
    return {
      success: false,
      message: v.minOrderAmount
        .replace("{amount}", String(settings.minOrderAmount))
        .replace("{currency}", settings.currencyCode),
    };
  }

  const parsed = parseCheckoutInput(input, locale);
  if (!parsed.success) {
    return { success: false, message: parsed.message };
  }

  const checkout = parsed.data;
  const totals = calculateOrderTotals(cart.subtotal, settings, input.countryCode);

  let orderNumber: string | undefined;

  try {
    orderNumber = await db.$transaction(async (tx) => {
      const inventoryError = await reserveCartItems(
        tx,
        cart.items.map((item) => ({
          product_id: item.product.id,
          title: item.product.title,
          quantity: item.quantity,
        })),
      );
      if (inventoryError) {
        throw new Error(inventoryError);
      }

      const number = await generateOrderNumber();

      await tx.orders.create({
        data: {
          order_number: number,
          user_id: ctx.userId,
          status: "pending",
          subtotal: totals.subtotal,
          shipping_cost: totals.shippingCost,
          tax: totals.tax,
          handling_fee: totals.handlingFee,
          total: totals.total,
          currency: settings.currencyCode,
          customer_name: checkout.customerName,
          customer_email: checkout.customerEmail,
          customer_phone: checkout.customerPhone,
          shipping_address: {
            line1: checkout.addressLine1,
            line2: checkout.addressLine2?.trim() || null,
            city: checkout.city,
            state: checkout.state?.trim() || null,
            postal_code: checkout.postalCode,
            country: checkout.country,
          },
          notes: checkout.notes?.trim() || null,
          items: {
            create: cart.items.map((item) => ({
              product_id: item.product.id,
              title: item.product.title,
              price: item.product.price,
              quantity: item.quantity,
            })),
          },
        },
      });

      await tx.users.update({
        where: { id: ctx.userId! },
        data: {
          name: checkout.customerName,
          phone: checkout.customerPhone,
          shipping_address: {
            line1: checkout.addressLine1,
            line2: checkout.addressLine2?.trim() || null,
            city: checkout.city,
            state: checkout.state?.trim() || null,
            postal_code: checkout.postalCode,
            country: checkout.country,
          },
        },
      });
      await tx.cart_items.deleteMany({ where: { user_id: ctx.userId } });

      return number;
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : v.checkoutFailed;
    if (message.includes("is no longer available") || message.includes("Insufficient stock")) {
      return { success: false, message };
    }
    return { success: false, message: v.checkoutFailed };
  }

  if (!orderNumber) {
    return { success: false, message: v.checkoutFailed };
  }

  await sendOrderConfirmation({
    email: checkout.customerEmail,
    name: checkout.customerName,
    orderNumber,
    total: formatPrice(totals.total, settings),
  }, locale);

  revalidatePath("/cart");
  revalidatePath("/", "layout");

  return { success: true, orderNumber };
}
