"use server";

import { enforceRateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { getDictionary, getLocale } from "@/i18n";
import { z } from "zod";

const trackOrderSchema = z.object({
  orderNumber: z.string().min(3),
  email: z.string().email(),
});

export type TrackedOrder = {
  orderNumber: string;
  status: string;
  createdAt: string;
  total: string;
  trackingNumber: string | null;
  items: Array<{ title: string; quantity: number; price: string }>;
};

type TrackOrderState = {
  error?: string;
  order?: TrackedOrder;
};

export async function trackOrderAction(
  _prev: TrackOrderState,
  formData: FormData,
): Promise<TrackOrderState> {
  const locale = await getLocale();
  const v = getDictionary(locale).validation;

  const limited = await enforceRateLimit("track-order", 20, 15 * 60 * 1000);
  if (!limited.ok) {
    return { error: v.rateLimited };
  }

  const parsed = trackOrderSchema.safeParse({
    orderNumber: formData.get("orderNumber"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { error: v.trackOrderInvalid };
  }

  const order = await db.orders.findFirst({
    where: {
      order_number: parsed.data.orderNumber.trim(),
      customer_email: {
        equals: parsed.data.email.trim().toLowerCase(),
        mode: "insensitive",
      },
    },
    include: { items: true },
  });

  if (!order) {
    return { error: v.trackOrderNotFound };
  }

  return {
    order: {
      orderNumber: order.order_number,
      status: order.status,
      createdAt: order.created_at.toISOString(),
      total: order.total.toString(),
      trackingNumber: order.tracking_number,
      items: order.items.map((item) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price.toString(),
      })),
    },
  };
}
