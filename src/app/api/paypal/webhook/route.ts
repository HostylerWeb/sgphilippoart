import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getLocale } from "@/i18n";
import { isPayPalConfigured } from "@/lib/paypal/config";
import { verifyPayPalWebhookSignature } from "@/lib/paypal/client";
import { fulfillPayPalOrderPayment } from "@/lib/paypal/fulfill-payment";

type WebhookEvent = {
  event_type: string;
  resource?: {
    id?: string;
    supplementary_data?: {
      related_ids?: { order_id?: string };
    };
  };
};

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: "PayPal is not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  let event: WebhookEvent;

  try {
    event = JSON.parse(rawBody) as WebhookEvent;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const verified = await verifyPayPalWebhookSignature(request.headers, event);
  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const locale = await getLocale();

  if (event.event_type === "CHECKOUT.ORDER.APPROVED") {
    const paypalOrderId =
      event.resource?.id ??
      event.resource?.supplementary_data?.related_ids?.order_id;

    if (paypalOrderId) {
      const order = await db.orders.findFirst({
        where: { paypal_order_id: paypalOrderId, payment_status: "awaiting_payment" },
      });

      if (order) {
        const result = await fulfillPayPalOrderPayment(
          order.id,
          paypalOrderId,
          locale,
        );
        if (!result.ok) {
          console.error("[paypal:webhook] fulfill failed", result.error);
        }
      }
    }
  }

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const captureId = event.resource?.id;
    if (captureId) {
      const order = await db.orders.findFirst({
        where: { paypal_capture_id: captureId },
      });
      if (!order) {
        const paypalOrderId =
          event.resource?.supplementary_data?.related_ids?.order_id;
        if (paypalOrderId) {
          const pending = await db.orders.findFirst({
            where: {
              paypal_order_id: paypalOrderId,
              payment_status: "awaiting_payment",
            },
          });
          if (pending) {
            const result = await fulfillPayPalOrderPayment(
              pending.id,
              paypalOrderId,
              locale,
            );
            if (!result.ok) {
              console.error("[paypal:webhook] fulfill failed", result.error);
            }
          }
        }
      }
    }
  }

  if (event.event_type === "PAYMENT.CAPTURE.DENIED") {
    const paypalOrderId =
      event.resource?.supplementary_data?.related_ids?.order_id;
    if (paypalOrderId) {
      await db.orders.updateMany({
        where: { paypal_order_id: paypalOrderId, payment_status: "awaiting_payment" },
        data: { payment_status: "failed" },
      });
    }
  }

  return NextResponse.json({ received: true });
}
