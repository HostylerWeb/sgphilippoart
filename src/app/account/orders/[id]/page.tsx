import Link from "next/link";
import { StoreImage } from "@/components/ui/StoreImage";
import { notFound, redirect } from "next/navigation";
import { AccountShell } from "@/components/layout/AccountShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { auth } from "@/lib/auth";
import { formatPrice } from "@/lib/format";
import { getOrderByNumber } from "@/lib/queries";
import { getStoreSettings } from "@/lib/settings";
import { getDictionary, getLocale } from "@/i18n";
import styles from "./page.module.css";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function AccountOrderDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const locale = await getLocale();
  const { id: orderNumber } = await params;
  const [order, settings, dict] = await Promise.all([
    getOrderByNumber(orderNumber),
    getStoreSettings(locale),
    getDictionary(locale),
  ]);

  if (
    !order ||
    (order.user_id !== session.user.id && order.customer_email !== session.user.email)
  ) {
    notFound();
  }

  const t = dict.account;
  const address = order.shipping_address as Record<string, string | null> | null;

  return (
    <StorefrontShell>
      <AccountShell
        title={order.order_number}
        description={`${t.placedOn} ${new Date(order.created_at).toLocaleString(locale)}`}
        userEmail={session.user.email ?? ""}
        userName={session.user.name}
        isAdmin={session.user.role === "admin"}
        activePath="/account/orders"
        labels={t}
        collectorLabel={t.collector}
      >
        <div className={styles.top}>
          <StatusBadge status={order.status} />
          <Link href="/account/orders" className={styles.back}>
            ← {t.allOrders}
          </Link>
        </div>

        {order.tracking_number && (
          <p className={styles.tracking}>
            {t.trackingNumber}: <strong>{order.tracking_number}</strong>
          </p>
        )}

        <div className={styles.grid}>
          <div className={styles.block}>
            <h2>{t.items}</h2>
            <ul className={styles.items}>
              {order.items.map((item: (typeof order.items)[number]) => {
                const image = item.product.images[0];

                return (
                  <li key={item.id}>
                    <div className={styles.itemMain}>
                      <span className={styles.thumb}>
                        {image?.url ? (
                          <StoreImage
                            src={image.url}
                            alt={image.alt_text ?? item.title}
                            fill
                            sizes="56px"
                          />
                        ) : null}
                      </span>
                      <span className={styles.itemCopy}>
                        <Link href={`/products/${item.product.slug}`} className={styles.itemTitle}>
                          {item.title}
                        </Link>
                        <span className={styles.itemMeta}>× {item.quantity}</span>
                      </span>
                    </div>
                    <span className={styles.itemPrice}>
                      {formatPrice(item.price.toString(), settings)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className={styles.block}>
            <h2>{t.summary}</h2>
            <dl className={styles.summary}>
              <div>
                <dt>{t.subtotal}</dt>
                <dd>{formatPrice(order.subtotal.toString(), settings)}</dd>
              </div>
              {Number(order.shipping_cost) > 0 && (
                <div>
                  <dt>{t.shippingLabel}</dt>
                  <dd>{formatPrice(order.shipping_cost.toString(), settings)}</dd>
                </div>
              )}
              {Number(order.tax) > 0 && (
                <div>
                  <dt>{t.tax}</dt>
                  <dd>{formatPrice(order.tax.toString(), settings)}</dd>
                </div>
              )}
              <div className={styles.total}>
                <dt>{t.total}</dt>
                <dd>{formatPrice(order.total.toString(), settings)}</dd>
              </div>
            </dl>
          </div>
        </div>

        {address && (
          <div className={styles.block}>
            <h2>{t.shippingAddress}</h2>
            <p className={styles.address}>
              {order.customer_name}
              <br />
              {address.line1}
              {address.line2 && (
                <>
                  <br />
                  {address.line2}
                </>
              )}
              <br />
              {[address.city, address.state, address.postal_code].filter(Boolean).join(", ")}
              <br />
              {address.country}
            </p>
          </div>
        )}
      </AccountShell>
    </StorefrontShell>
  );
}
