import { CookieConsent } from "@/components/layout/CookieConsent";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { I18nProvider } from "@/components/layout/I18nProvider";
import { auth } from "@/lib/auth";
import { getCart, getCartItemCount } from "@/lib/cart";
import { getCartContext } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { getCategories } from "@/lib/queries";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";
import { localizeCategoryEntity } from "@/lib/i18n/localize";

type StorefrontShellProps = {
  children: React.ReactNode;
  activeSlug?: string;
};

export async function StorefrontShell({ children, activeSlug }: StorefrontShellProps) {
  const cartCtx = await getCartContext();
  const locale = await getLocale();
  const dict = getDictionary(locale);

  const [settings, categories, cartCount, cart, session] = await Promise.all([
    getStoreSettings(locale),
    getCategories(),
    getCartItemCount(cartCtx),
    getCart(cartCtx, locale),
    auth(),
  ]);

  const cartDrawerItems = cart.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    slug: item.product.slug,
    title: item.product.title,
    imageUrl: item.product.image_url,
    imageAlt: item.product.image_alt,
    lineTotal: formatPrice(
      (Number(item.product.price) * item.quantity).toString(),
      settings,
    ),
  }));

  const translatedCategories = categories.map((category) => ({
    ...category,
    name: localizeCategoryEntity(category, locale).name,
  }));

  return (
    <I18nProvider locale={locale} dict={dict}>
      <Header
        categories={translatedCategories}
        activeSlug={activeSlug}
        cartCount={cartCount}
        cartItems={cartDrawerItems}
        cartSubtotal={formatPrice(cart.subtotal.toString(), settings)}
        user={session?.user ?? null}
        locale={locale}
        dict={dict}
        commissionEnabled={settings.commissionEnabled}
      />
      <main>{children}</main>
      <Footer settings={settings} dict={dict} categories={translatedCategories} />
      <CookieConsent labels={dict.cookies} />
    </I18nProvider>
  );
}
