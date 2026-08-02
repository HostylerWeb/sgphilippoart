import { getStoreSettings } from "@/lib/settings";

const DEFAULT_STUDIO_EMAIL = "contact@sgphilippoart.com";

/** Single studio address: sends customer emails and receives admin notifications. */
export async function getStudioEmail(): Promise<string> {
  const fromEnv =
    process.env.STUDIO_EMAIL ||
    process.env.EMAIL_FROM ||
    process.env.ORDER_NOTIFICATION_EMAIL;

  if (fromEnv) {
    return fromEnv;
  }

  const settings = await getStoreSettings();
  return settings.contactEmail;
}

export function getStudioEmailSync(): string {
  return (
    process.env.STUDIO_EMAIL ||
    process.env.EMAIL_FROM ||
    process.env.ORDER_NOTIFICATION_EMAIL ||
    DEFAULT_STUDIO_EMAIL
  );
}
