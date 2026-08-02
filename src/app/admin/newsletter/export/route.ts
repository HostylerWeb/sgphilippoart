import { NextResponse } from "next/server";
import { ACTIVE_SUBSCRIBER_WHERE } from "@/lib/admin-stats";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export async function GET() {
  await requireAdmin("/admin/newsletter");

  const subscribers = await db.newsletter_subscribers.findMany({
    where: ACTIVE_SUBSCRIBER_WHERE,
    orderBy: { created_at: "desc" },
  });

  const rows = [
    "email,subscribed_at",
    ...subscribers.map(
      (subscriber) =>
        `"${subscriber.email.replace(/"/g, '""')}",${subscriber.created_at.toISOString()}`,
    ),
  ];

  return new NextResponse(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="newsletter-subscribers.csv"',
    },
  });
}
