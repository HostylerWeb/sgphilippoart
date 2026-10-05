import { db } from "../src/lib/db";

async function main() {
  const all = await db.products.findMany({
    select: {
      slug: true,
      title: true,
      status: true,
      product_type: true,
      stock_quantity: true,
    },
    orderBy: { title: "asc" },
  });
  const unavailable = all.filter((p) => {
    if (p.status === "sold") return true;
    if (p.product_type === "print" && (p.stock_quantity ?? 0) <= 0) return true;
    return false;
  });
  console.log(JSON.stringify({ unavailable, all }, null, 2));
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
