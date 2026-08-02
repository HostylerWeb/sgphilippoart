"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { enforceRateLimit } from "@/lib/rate-limit";
import { getDictionary, getLocale } from "@/i18n";

type ActionState = {
  error?: string;
  success?: string;
};

export async function unsubscribeNewsletterAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const locale = await getLocale();
  const t = getDictionary(locale).pages.newsletterUnsubscribe;
  const v = getDictionary(locale).validation;

  const limited = await enforceRateLimit("newsletter-unsubscribe", 20, 15 * 60 * 1000);
  if (!limited.ok) {
    return { error: v.rateLimited };
  }

  const token = String(formData.get("token") ?? "").trim();
  if (!token) {
    return { error: t.invalid };
  }

  const subscriber = await db.newsletter_subscribers.findUnique({
    where: { unsubscribe_token: token },
  });

  if (!subscriber) {
    return { error: t.invalidUsed };
  }

  if (!subscriber.unsubscribed_at) {
    await db.newsletter_subscribers.update({
      where: { id: subscriber.id },
      data: { unsubscribed_at: new Date() },
    });
  }

  revalidatePath("/newsletter/unsubscribe");
  return { success: t.success };
}
