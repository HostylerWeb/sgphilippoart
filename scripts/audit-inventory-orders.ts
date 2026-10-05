import { db } from "../src/lib/db";

async function main() {
  const orders = await db.orders.findMany({
    where: { status: { not: "cancelled" } },
    select: {
      order_number: true,
      status: true,
      payment_status: true,
      items: { select: { title: true, product_id: true, quantity: true } },
    },
    orderBy: { created_at: "desc" },
    take: 20,
  });
  console.log(JSON.stringify(orders, null, 2));
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
