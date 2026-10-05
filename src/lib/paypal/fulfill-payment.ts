import { db } from "@/lib/db";
import type { Locale } from "@/i18n/config";
import { localizeInventoryError } from "@/lib/inventory-errors";
import {
  reserveOrderInventory,
  restoreOrderInventory,
} from "@/lib/order-inventory";
import { capturePayPalOrder, PayPalApiError } from "@/lib/paypal/client";
import { getDictionary } from "@/i18n";
import { markOrderPaidFromPayPalCapture } from "@/lib/paypal/orders";

export type FulfillPayPalPaymentResult =
  | { ok: true; orderNumber: string }
  | { ok: false; status: number; error: string };

export async function fulfillPayPalOrderPayment(
  orderId: string,
  paypalOrderId: string,
  locale: Locale,
): Promise<FulfillPayPalPaymentResult> {
  const order = await db.orders.findFirst({
    where: { id: orderId },
  });

  if (!order) {
    return { ok: false, status: 404, error: "Order not found" };
  }

  if (order.payment_status === "paid") {
    return { ok: true, orderNumber: order.order_number };
  }

  if (order.payment_status !== "awaiting_payment") {
    return { ok: false, status: 404, error: "Order not found" };
  }

  if (order.paypal_order_id && order.paypal_order_id !== paypalOrderId) {
    return { ok: false, status: 409, error: "PayPal order mismatch" };
  }

  const inventoryError = await db.$transaction(async (tx) =>
    reserveOrderInventory(tx, orderId),
  );

  if (inventoryError) {
    return {
      ok: false,
      status: 409,
      error: localizeInventoryError(locale, inventoryError),
    };
  }

  let capture;
  try {
    capture = await capturePayPalOrder(paypalOrderId);
  } catch (error) {
    console.error("PayPal capture failed:", error);
    await db.$transaction(async (tx) => {
      await restoreOrderInventory(tx, orderId);
    });
    const v = getDictionary(locale).validation;
    if (error instanceof PayPalApiError && error.issue === "INSTRUMENT_DECLINED") {
      return { ok: false, status: 422, error: v.paypalInstrumentDeclined };
    }
    return {
      ok: false,
      status: error instanceof PayPalApiError ? error.status : 502,
      error: v.paypalCaptureFailed,
    };
  }

  const paid = await markOrderPaidFromPayPalCapture(capture, paypalOrderId, locale);

  if (!paid) {
    await db.$transaction(async (tx) => {
      await restoreOrderInventory(tx, orderId);
    });
    return { ok: false, status: 422, error: "Payment was not completed" };
  }

  return { ok: true, orderNumber: paid.orderNumber };
}
