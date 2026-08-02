import { redirect } from "next/navigation";
import { AccountShell } from "@/components/layout/AccountShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { ProductGrid } from "@/components/product/ProductGrid";
import { EmptyState } from "@/components/ui/EmptyState";
import { auth } from "@/lib/auth";
import { getWishlistProducts } from "@/lib/queries";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";

export default async function WishlistPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const [products, settings, dict] = await Promise.all([
    getWishlistProducts(session.user.id, locale),
    getStoreSettings(locale),
    getDictionary(locale),
  ]);
  const t = dict.account;

  const wishlistedIds = new Set(products.map((p) => p.id));

  return (
    <StorefrontShell>
      <AccountShell
        title={t.wishlistTitle}
        description={t.wishlistDescription}
        userEmail={session.user.email ?? ""}
        userName={session.user.name}
        isAdmin={session.user.role === "admin"}
        activePath="/account/wishlist"
        labels={t}
      >
        {products.length === 0 ? (
          <EmptyState
            title={t.wishlistEmptyTitle}
            description={t.wishlistEmptyDescription}
            actionLabel={t.browseCollections}
            actionHref="/collections"
          />
        ) : (
          <ProductGrid
            products={products}
            currency={settings}
            wishlistedIds={wishlistedIds}
            soldLabel={dict.product.sold}
          />
        )}
      </AccountShell>
    </StorefrontShell>
  );
}
