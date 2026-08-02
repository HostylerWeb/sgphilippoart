import { redirect, notFound } from "next/navigation";
import { AccountSettingsForm } from "@/components/account/AccountSettingsForm";
import { AccountShell } from "@/components/layout/AccountShell";
import { StorefrontShell } from "@/components/layout/StorefrontShell";
import { auth } from "@/lib/auth";
import { getUserProfile } from "@/lib/user-profile";
import { getDictionary, getLocale } from "@/i18n";

export default async function AccountSettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const locale = await getLocale();
  const dict = getDictionary(locale);
  const t = dict.account;

  const profile = await getUserProfile(session.user.id);
  if (!profile) notFound();

  return (
    <StorefrontShell>
      <AccountShell
        title={t.settingsTitle}
        description={t.settingsDescription}
        userEmail={profile.email}
        userName={profile.name}
        isAdmin={session.user.role === "admin"}
        activePath="/account/settings"
        labels={t}
      >
        <AccountSettingsForm profile={profile} labels={t} />
      </AccountShell>
    </StorefrontShell>
  );
}
