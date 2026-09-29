import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLocale } from "@/i18n";
import { isPayPalConfigured } from "@/lib/paypal/config";
import { capturePayPalOrder } from "@/lib/paypal/client";
import { markOrderPaidFromPayPalCapture } from "@/lib/paypal/orders";

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: "PayPal is not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as {
    orderId?: string;
    paypalOrderId?: string;
  };
  const orderId = body.orderId?.trim();
  const paypalOrderId = body.paypalOrderId?.trim();

  if (!orderId || !paypalOrderId) {
    return NextResponse.json({ error: "Missing orderId or paypalOrderId" }, { status: 400 });
  }

  const order = await db.orders.findFirst({
    where: {
      id: orderId,
      user_id: session.user.id,
      payment_status: "awaiting_payment",
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (order.paypal_order_id && order.paypal_order_id !== paypalOrderId) {
    return NextResponse.json({ error: "PayPal order mismatch" }, { status: 409 });
  }

  const capture = await capturePayPalOrder(paypalOrderId);
  const locale = await getLocale();
  const paid = await markOrderPaidFromPayPalCapture(capture, paypalOrderId, locale);

  if (!paid) {
    return NextResponse.json({ error: "Payment was not completed" }, { status: 422 });
  }

  return NextResponse.json({
    orderNumber: paid.orderNumber,
    status: capture.status,
  });
}
