import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isPayPalConfigured } from "@/lib/paypal/config";
import {
  createPayPalCheckoutOrder,
} from "@/lib/paypal/client";
import { formatPayPalAmount } from "@/lib/paypal/format-amount";
import { shippingCountryCodeFromOrder } from "@/lib/paypal/shipping-country";

export async function POST(request: Request) {
  if (!isPayPalConfigured()) {
    return NextResponse.json({ error: "PayPal is not configured" }, { status: 503 });
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { orderId?: string };
  const orderId = body.orderId?.trim();
  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
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

  try {
    const paypalOrder = await createPayPalCheckoutOrder({
      shopOrderId: order.id,
      orderNumber: order.order_number,
      currencyCode: order.currency,
      buyerCountryCode: shippingCountryCodeFromOrder(order.shipping_address),
      subtotal: formatPayPalAmount(Number(order.subtotal)),
      shipping: formatPayPalAmount(Number(order.shipping_cost)),
      tax: formatPayPalAmount(Number(order.tax)),
      handling: formatPayPalAmount(Number(order.handling_fee)),
      total: formatPayPalAmount(Number(order.total)),
    });

    await db.orders.update({
      where: { id: order.id },
      data: { paypal_order_id: paypalOrder.id },
    });

    return NextResponse.json({ id: paypalOrder.id });
  } catch (error) {
    console.error("PayPal create order failed:", error);
    const message =
      error instanceof Error ? error.message : "PayPal order creation failed";
    const status = message.includes("auth failed") ? 502 : 500;
    return NextResponse.json(
      { error: "Could not start PayPal checkout. Please try again later." },
      { status },
    );
  }
}
