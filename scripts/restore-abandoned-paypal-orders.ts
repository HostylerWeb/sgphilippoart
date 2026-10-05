/**
 * One-off: cancel unpaid PayPal orders and put inventory back.
 * Run: pnpm exec tsx scripts/restore-abandoned-paypal-orders.ts
 */
import { db } from "../src/lib/db";
import { restoreOrderInventory } from "../src/lib/order-inventory";

async function main() {
  const orders = await db.orders.findMany({
    where: {
      payment_status: "awaiting_payment",
      status: { not: "cancelled" },
    },
    select: { id: true, order_number: true },
    orderBy: { created_at: "asc" },
  });

  if (orders.length === 0) {
    console.log("No abandoned PayPal orders found.");
    return;
  }

  for (const order of orders) {
    await db.$transaction(async (tx) => {
      await restoreOrderInventory(tx, order.id);
      await tx.orders.update({
        where: { id: order.id },
        data: { status: "cancelled", payment_status: "failed" },
      });
    });
    console.log(`Restored inventory for order ${order.order_number} (${order.id})`);
  }

  console.log(`Done. Processed ${orders.length} order(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
