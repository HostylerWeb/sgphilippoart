import type { Dictionary } from "@/i18n/dictionaries/en";

export const ADMIN_PRODUCT_NOTICES = {
  created: "product-created",
  updated: "product-updated",
  deleted: "product-deleted",
} as const;

export type AdminProductNotice =
  (typeof ADMIN_PRODUCT_NOTICES)[keyof typeof ADMIN_PRODUCT_NOTICES];

export function adminProductsListUrl(notice: AdminProductNotice): string {
  return `/admin/products?notice=${notice}`;
}

export function getAdminProductNoticeMessage(
  notice: string | undefined,
  feedback: Dictionary["admin"]["feedback"],
): string | null {
  switch (notice) {
    case ADMIN_PRODUCT_NOTICES.created:
      return feedback.productCreated;
    case ADMIN_PRODUCT_NOTICES.updated:
      return feedback.productSaved;
    case ADMIN_PRODUCT_NOTICES.deleted:
      return feedback.productDeleted;
    default:
      return null;
  }
}
