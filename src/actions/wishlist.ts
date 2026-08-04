"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { getDictionary, getLocale } from "@/i18n";

type WishlistResult = {
  success: boolean;
  message?: string;
  saved?: boolean;
  requiresLogin?: boolean;
};

export async function toggleWishlist(productId: string): Promise<WishlistResult> {
  const locale = await getLocale();
  const v = getDictionary(locale).validation;

  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, requiresLogin: true, message: v.signInToWishlist };
  }

  const existing = await db.wishlists.findUnique({
    where: {
      user_id_product_id: {
        user_id: session.user.id,
        product_id: productId,
      },
    },
  });

  if (existing) {
    await db.wishlists.delete({ where: { id: existing.id } });
    revalidatePath("/account/wishlist");
    return { success: true, saved: false };
  }

  const product = await db.products.findUnique({ where: { id: productId } });
  if (!product || product.status !== "published") {
    return { success: false, message: v.artworkUnavailable };
  }

  await db.wishlists.create({
    data: {
      user_id: session.user.id,
      product_id: productId,
    },
  });

  revalidatePath("/account/wishlist");
  return { success: true, saved: true };
}

export async function getWishlistProductIds(userId: string): Promise<string[]> {
  const rows = await db.wishlists.findMany({
    where: { user_id: userId },
    select: { product_id: true },
  });
  return rows.map((row) => row.product_id);
}
