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

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = getDictionary(locale).meta;
  return buildPageMetadata({
    title: meta.checkoutSuccessTitle,
    path: "/checkout/success",
    noIndex: true,
  });
}

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

  return (
    <StorefrontShell>
      <AuthPageShell eyebrow={t.eyebrow} title={t.successTitle}>
        <div className={styles.message}>
          {verifiedOrder && (
            <p className={styles.orderRef}>
              {t.orderReference.replace("{order}", verifiedOrder)}
            </p>
          )}
          <p className={styles.lead}>
            {verifiedOrder ? t.successDescription : t.successDescriptionNoOrder}
          </p>
        </div>
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
