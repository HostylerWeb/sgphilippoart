import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthPageShell } from "@/components/layout/AuthPageShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { buildPageMetadata } from "@/lib/seo";
import { getDictionary, getLocale } from "@/i18n";
import styles from "./page.module.css";

export const metadata: Metadata = buildPageMetadata({
  title: "Order Confirmed — SG Philippo Art",
  path: "/checkout/success",
  noIndex: true,
});

type PageProps = {
  searchParams: Promise<{ order?: string }>;
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const { order } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale).checkout;
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/account/orders");
  }

  let verifiedOrder: string | null = null;
  if (order) {
    const record = await db.orders.findFirst({
      where: {
        order_number: order,
        OR: [
          { user_id: session.user.id },
          { customer_email: { equals: session.user.email ?? "", mode: "insensitive" } },
        ],
      },
      select: { order_number: true },
    });
    verifiedOrder = record?.order_number ?? null;
  }

  const description = verifiedOrder
    ? t.orderReference.replace("{order}", verifiedOrder) + " " + t.successDescription
    : t.successDescriptionNoOrder;

  return (
    <StorefrontShell>
      <AuthPageShell eyebrow={t.eyebrow} title={t.successTitle} description={description}>
        <div className={styles.actions}>
          <Link href="/collections" className={styles.primary}>
            {t.continueShopping}
          </Link>
          <Link href="/account/orders" className={styles.secondary}>
            {t.viewOrders}
          </Link>
        </div>
      </AuthPageShell>
    </StorefrontShell>
  );
}
