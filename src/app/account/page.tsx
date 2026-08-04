import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/auth";
import { AccountShell } from "@/components/layout/AccountShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { NavCard } from "@/components/ui/NavCard";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/user-profile";
import { getDictionary, getLocale } from "@/i18n";
import styles from "./page.module.css";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const t = getDictionary(locale).account;
  const profile = await getUserProfile(session.user.id);

  return (
    <StorefrontShell>
      <AccountShell
        title={t.overviewTitle}
        description={t.overviewDescription}
        userEmail={profile?.email ?? session.user.email ?? ""}
        userName={profile?.name ?? session.user.name}
        isAdmin={session.user.role === "admin"}
        activePath="/account"
        labels={t}
        collectorLabel={t.collector}
      >
        <div className={styles.grid}>
          <NavCard
            href="/account/settings"
            title={t.settingsCardTitle}
            description={t.settingsCardDescription}
          />
          <NavCard
            href="/account/orders"
            title={t.ordersCardTitle}
            description={t.ordersCardDescription}
          />
          <NavCard
            href="/account/wishlist"
            title={t.wishlistCardTitle}
            description={t.wishlistCardDescription}
          />
          <NavCard
            href="/collections"
            title={t.browseCardTitle}
            description={t.browseCardDescription}
          />
          {session.user.role === "admin" && (
            <NavCard
              href="/admin"
              title={t.admin}
              description={t.adminCardDescription}
            />
          )}
        </div>

        <div className={styles.actions}>
          <Link href="/contact" className={styles.link}>
            {t.contactStudio}
          </Link>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
          >
            <button type="submit" className={styles.signOut}>
              {t.signOut}
            </button>
          </form>
        </div>
      </AccountShell>
    </StorefrontShell>
  );
}
