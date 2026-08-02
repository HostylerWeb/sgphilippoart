import { HeaderNav } from "@/components/layout/HeaderNav";
import type { CartDrawerItem } from "@/components/cart/CartDrawer";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

type Category = {
  name: string;
  slug: string;
};

type HeaderProps = {
  categories: Category[];
  activeSlug?: string;
  cartCount?: number;
  cartItems?: CartDrawerItem[];
  cartSubtotal?: string;
  user?: { name?: string | null; email?: string | null } | null;
  locale: Locale;
  dict: Dictionary;
  commissionEnabled?: boolean;
};

export function Header(props: HeaderProps) {
  return <HeaderNav {...props} />;
}
