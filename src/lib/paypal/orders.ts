import { db } from "@/lib/db";
import { sendOrderConfirmation } from "@/lib/email";
import { formatPrice } from "@/lib/format";
import type { Locale } from "@/i18n/config";
import { getStoreSettings } from "@/lib/settings";
import type { PayPalCaptureResult } from "@/lib/paypal/client";

function decimalString(value: { toString: () => string }): string {
  return Number(value.toString()).toFixed(2);
}

export async function markOrderPaidFromPayPalCapture(
  capture: PayPalCaptureResult,
  paypalOrderId: string,
  locale: Locale = "fr",
): Promise<{ orderNumber: string } | null> {
  const unit = capture.purchase_units?.[0];
  const shopOrderId = unit?.reference_id;
  const captureRecord = unit?.payments?.captures?.[0];

  if (!shopOrderId || capture.status !== "COMPLETED") {
    return null;
  }

  const order = await db.orders.findUnique({
    where: { id: shopOrderId },
  });

  if (!order) {
    return null;
  }

  if (order.payment_status === "paid") {
    return { orderNumber: order.order_number };
  }

  if (captureRecord?.amount?.value) {
    const expected = decimalString(order.total);
    if (captureRecord.amount.value !== expected) {
      throw new Error("PayPal capture amount does not match order total");
    }
  }

  const settings = await getStoreSettings(locale);

  await db.orders.update({
    where: { id: order.id },
    data: {
      payment_status: "paid",
      status: "confirmed",
      paypal_order_id: paypalOrderId,
      paypal_capture_id: captureRecord?.id ?? null,
      paid_at: new Date(),
    },
  });

  if (order.user_id) {
    await db.cart_items.deleteMany({ where: { user_id: order.user_id } });
  }

  await sendOrderConfirmation(
    {
      email: order.customer_email,
      name: order.customer_name,
      orderNumber: order.order_number,
      total: formatPrice(Number(order.total), settings),
    },
    locale,
  );

  return { orderNumber: order.order_number };
}

export async function markOrderPaymentFailed(shopOrderId: string): Promise<void> {
  await db.orders.updateMany({
    where: {
      id: shopOrderId,
      payment_status: "awaiting_payment",
    },
    data: { payment_status: "failed" },
  });
}
