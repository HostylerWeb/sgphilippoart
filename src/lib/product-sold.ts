/** Whether the storefront should treat a work as sold (badge, no purchase). */
export function isProductSoldForDisplay(product: {
  status: string;
  product_type: "original" | "print";
  stock_quantity: number | null;
}): boolean {
  if (product.status === "sold") return true;
  if (product.product_type === "print") {
    return (product.stock_quantity ?? 0) <= 0;
  }
  if (product.stock_quantity !== null && product.stock_quantity <= 0) {
    return true;
  }
  return false;
}
