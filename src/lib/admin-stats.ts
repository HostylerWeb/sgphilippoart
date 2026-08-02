import type { order_status } from "@/generated/prisma/enums";
import type { db } from "@/lib/db";

type StatsDb = typeof db;

/** Orders that count toward dashboard revenue (confirmed sales, not inquiries or cancellations). */
export const REVENUE_ORDER_STATUSES: order_status[] = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
];

export const ACTIVE_SUBSCRIBER_WHERE = {
  unsubscribed_at: null,
} as const;

export function getStartOfToday(): Date {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return start;
}

export async function getAdminDashboardStats(client: StatsDb) {
  const startOfToday = getStartOfToday();

  const [
    totalOrders,
    cancelledOrders,
    ordersToday,
    pendingOrders,
    revenueAgg,
    newCommissions,
    unreadContacts,
    publishedProducts,
    publishedReviews,
    subscriberCount,
  ] = await Promise.all([
    client.orders.count({ where: { status: { not: "cancelled" } } }),
    client.orders.count({ where: { status: "cancelled" } }),
    client.orders.count({
      where: {
        created_at: { gte: startOfToday },
        status: { not: "cancelled" },
      },
    }),
    client.orders.count({ where: { status: "pending" } }),
    client.orders.aggregate({
      where: { status: { in: REVENUE_ORDER_STATUSES } },
      _sum: { total: true },
    }),
    client.commission_inquiries.count({ where: { status: "new" } }),
    client.contact_messages.count({ where: { is_read: false } }),
    client.products.count({ where: { status: "published" } }),
    client.testimonials.count({ where: { is_published: true } }),
    client.newsletter_subscribers.count({ where: ACTIVE_SUBSCRIBER_WHERE }),
  ]);

  return {
    totalOrders,
    cancelledOrders,
    ordersToday,
    pendingOrders,
    revenue: revenueAgg._sum.total?.toString() ?? "0",
    newCommissions,
    unreadContacts,
    publishedProducts,
    publishedReviews,
    subscriberCount,
  };
}
