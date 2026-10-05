import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getLocale } from "@/i18n";
import { isPayPalConfigured } from "@/lib/paypal/config";
import { fulfillPayPalOrderPayment } from "@/lib/paypal/fulfill-payment";

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

  const owned = await db.orders.findFirst({
    where: { id: orderId, user_id: session.user.id },
    select: { id: true },
  });

  if (!owned) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const locale = await getLocale();
  const result = await fulfillPayPalOrderPayment(orderId, paypalOrderId, locale);

  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ orderNumber: result.orderNumber });
}
