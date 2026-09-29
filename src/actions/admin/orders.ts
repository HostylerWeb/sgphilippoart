"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { sendOrderConfirmation, sendOrderStatusUpdate } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import { restoreOrderInventory, reserveOrderInventory } from "@/lib/order-inventory";
import { localizeInventoryError } from "@/lib/inventory-errors";
import { getStoreSettings } from "@/lib/settings";
import { getAdminFeedback } from "@/lib/admin-feedback";
import { getLocale } from "@/i18n";
import { z } from "zod";

const orderStatusSchema = z.enum([
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
]);

type ActionState = { error?: string; success?: string };

export async function updateOrderStatusAction(
  orderId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin(`/admin/orders/${orderId}`);
  const feedback = await getAdminFeedback();
  const parsed = orderStatusSchema.safeParse(formData.get("status"));
  if (!parsed.success) {
    return { error: feedback.orderStatusInvalid };
  }

  const existing = await db.orders.findUnique({ where: { id: orderId } });
  if (!existing) {
    return { error: feedback.orderNotFound };
  }

  const nextStatus = parsed.data;
  const isBecomingCancelled =
    nextStatus === "cancelled" && existing.status !== "cancelled";
  const isLeavingCancelled =
    existing.status === "cancelled" && nextStatus !== "cancelled";

  if (isLeavingCancelled) {
    const inventoryError = await db.$transaction(async (tx) => {
      const error = await reserveOrderInventory(tx, orderId);
      if (error) return error;

      await tx.orders.update({
        where: { id: orderId },
        data: { status: nextStatus },
      });
      return null;
    });

    if (inventoryError) {
      const locale = await getLocale();
      return { error: localizeInventoryError(locale, inventoryError) };
    }
  } else {
    await db.$transaction(async (tx) => {
      if (isBecomingCancelled) {
        await restoreOrderInventory(tx, orderId);
      }

      await tx.orders.update({
        where: { id: orderId },
        data: { status: nextStatus },
      });
    });
  }

  const locale = await getLocale();

  if (existing.status !== nextStatus) {
    await sendOrderStatusUpdate({
      email: existing.customer_email,
      name: existing.customer_name,
      orderNumber: existing.order_number,
      status: nextStatus,
      trackingNumber: existing.tracking_number,
    }, locale);
  }

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/collections", "layout");
  return { success: feedback.orderStatusUpdated };
}

export async function updateOrderDetailsAction(
  orderId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin(`/admin/orders/${orderId}`);
  const feedback = await getAdminFeedback();

  const trackingNumber = String(formData.get("tracking_number") ?? "").trim();
  const adminNotes = String(formData.get("admin_notes") ?? "").trim();

  const existing = await db.orders.findUnique({ where: { id: orderId } });
  if (!existing) {
    return { error: feedback.orderNotFound };
  }

  await db.orders.update({
    where: { id: orderId },
    data: {
      tracking_number: trackingNumber || null,
      admin_notes: adminNotes || null,
    },
  });

  if (trackingNumber && trackingNumber !== existing.tracking_number) {
    const locale = await getLocale();
    await sendOrderStatusUpdate({
      email: existing.customer_email,
      name: existing.customer_name,
      orderNumber: existing.order_number,
      status: existing.status,
      trackingNumber,
    }, locale);
  }

  revalidatePath(`/admin/orders/${orderId}`);
  return { success: feedback.orderDetailsSaved };
}

export async function resendOrderConfirmationAction(
  orderId: string,
  _prev: ActionState,
): Promise<ActionState> {
  await requireAdmin(`/admin/orders/${orderId}`);
  const feedback = await getAdminFeedback();

  const [order, settings] = await Promise.all([
    db.orders.findUnique({ where: { id: orderId } }),
    getStoreSettings(),
  ]);

  if (!order) {
    return { error: feedback.orderNotFound };
  }

  if (order.status === "cancelled") {
    return { error: feedback.orderResendCancelled };
  }

  const sent = await sendOrderConfirmation({
    email: order.customer_email,
    name: order.customer_name,
    orderNumber: order.order_number,
    total: formatPrice(order.total.toString(), settings),
  }, await getLocale());

  if (!sent) {
    return { error: feedback.orderResendFailed };
  }

  return { success: feedback.orderResendSuccess };
}

export async function markMessageReadAction(messageId: string) {
  await requireAdmin("/admin/messages");
  await db.contact_messages.update({
    where: { id: messageId },
    data: { is_read: true },
  });
  revalidatePath("/admin/messages");
  revalidatePath("/admin");
}
