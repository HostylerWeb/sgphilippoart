/**
 * Re-publish originals marked sold and restock prints at 0 (default qty 1).
 * Skips products on paid orders. Run on VPS: pnpm exec tsx scripts/restore-all-sold-out-products.ts
 */
import { db } from "../src/lib/db";
import { restoreOrderInventory } from "../src/lib/order-inventory";

const DEFAULT_PRINT_STOCK = 1;

async function main() {
  const awaiting = await db.orders.findMany({
    where: {
      payment_status: "awaiting_payment",
      status: { not: "cancelled" },
    },
    select: { id: true, order_number: true },
  });

  for (const order of awaiting) {
    await db.$transaction(async (tx) => {
      await restoreOrderInventory(tx, order.id);
      await tx.orders.update({
        where: { id: order.id },
        data: { status: "cancelled", payment_status: "failed" },
      });
    });
    console.log(`Cancelled unpaid order ${order.order_number}`);
  }

  const paidProductIds = new Set(
    (
      await db.order_items.findMany({
        where: { order: { payment_status: "paid" } },
        select: { product_id: true },
      })
    ).map((row) => row.product_id),
  );

  const soldOriginals = await db.products.findMany({
    where: { status: "sold", product_type: "original" },
    select: { id: true, slug: true, title: true },
  });

  let originalsRepublished = 0;
  for (const product of soldOriginals) {
    if (paidProductIds.has(product.id)) {
      console.log(`Skip original (paid order): ${product.slug}`);
      continue;
    }
    await db.products.update({
      where: { id: product.id },
      data: { status: "published" },
    });
    originalsRepublished += 1;
    console.log(`Republished original: ${product.slug}`);
  }

  const zeroStockPrints = await db.products.findMany({
    where: {
      product_type: "print",
      status: "published",
      stock_quantity: { lte: 0 },
    },
    select: { id: true, slug: true, title: true, stock_quantity: true },
  });

  let printsRestocked = 0;
  for (const product of zeroStockPrints) {
    const paidQty = await db.order_items.aggregate({
      where: {
        product_id: product.id,
        order: { payment_status: "paid" },
      },
      _sum: { quantity: true },
    });
    const reservedByPaid = paidQty._sum.quantity ?? 0;
    if (reservedByPaid > 0) {
      console.log(`Skip print (paid qty ${reservedByPaid}): ${product.slug}`);
      continue;
    }
    await db.products.update({
      where: { id: product.id },
      data: { stock_quantity: DEFAULT_PRINT_STOCK },
    });
    printsRestocked += 1;
    console.log(`Restocked print ${product.slug} -> ${DEFAULT_PRINT_STOCK}`);
  }

  console.log(
    `Done. Unpaid orders cancelled: ${awaiting.length}, originals: ${originalsRepublished}, prints: ${printsRestocked}`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
