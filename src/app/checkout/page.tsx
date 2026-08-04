import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutExperience } from "@/components/cart/CheckoutExperience";
import { CatalogPageShell } from "@/components/layout/CatalogPageShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { getCart } from "@/lib/cart";
import { getCartContext } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { getStoreSettings } from "@/lib/settings";
import { buildPageMetadata } from "@/lib/seo";
import { getUserProfile } from "@/lib/user-profile";
import { auth } from "@/lib/auth";
import { getDictionary, getLocale } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = getDictionary(locale).meta;
  return buildPageMetadata({
    title: meta.checkoutTitle,
    path: "/checkout",
    noIndex: true,
  });
}

export default async function CheckoutPage() {
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.checkout;

  const cartCtx = await getCartContext();
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/checkout");
  }

  const [settings, cart, profile] = await Promise.all([
    getStoreSettings(locale),
    getCart(cartCtx, locale),
    session?.user?.id ? getUserProfile(session.user.id) : Promise.resolve(null),
  ]);

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  const address = profile?.shipping_address;
  const checkoutDefaults = profile
    ? {
        customerName: profile.name ?? undefined,
        customerEmail: profile.email,
        customerPhone: profile.phone ?? undefined,
        addressLine1: address?.line1,
        addressLine2: address?.line2 ?? undefined,
        city: address?.city,
        state: address?.state ?? undefined,
        postalCode: address?.postal_code,
        country: address?.country,
      }
    : session?.user?.email
      ? { customerEmail: session.user.email, customerName: session.user.name ?? undefined }
      : undefined;

  return (
    <StorefrontShell>
      <CatalogPageShell eyebrow={t.eyebrow} title={t.title} description={t.description}>
        <CheckoutExperience
          items={cart.items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            title: item.product.title,
            imageUrl: item.product.image_url,
            imageAlt: item.product.image_alt,
            lineTotal: formatPrice(
              Number(item.product.price) * item.quantity,
              settings,
            ),
          }))}
          subtotal={cart.subtotal}
          settings={settings}
          defaults={checkoutDefaults}
          dict={dict}
        />
      </CatalogPageShell>
    </StorefrontShell>
  );
}
