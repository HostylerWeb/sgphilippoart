"use server";

import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { enforceRateLimit } from "@/lib/rate-limit";
import { randomBytes, randomUUID } from "crypto";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import {
  sendCommissionNotification,
  sendContactNotification,
  sendNewsletterWelcome,
  sendPasswordResetEmail,
} from "@/lib/email";
import { getDictionary, getLocale } from "@/i18n";
import { schemasForLocale } from "@/lib/validations/auth";

type FormState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string[]>;
};

export async function registerUser(formData: FormData): Promise<FormState> {
  const locale = await getLocale();
  const m = getDictionary(locale).validation;
  const limited = await enforceRateLimit("register", 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return { success: false, message: m.rateLimited };
  }

  const parsed = schemasForLocale(locale).register.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await db.users.findUnique({ where: { email } });
  if (existing) {
    return { success: false, message: m.accountExists };
  }

  const password_hash = await bcrypt.hash(parsed.data.password, 12);
  await db.users.create({
    data: {
      name: parsed.data.name,
      email,
      password_hash,
      role: "customer",
    },
  });

  return { success: true, message: m.accountCreated };
}

export async function submitContactForm(formData: FormData): Promise<FormState> {
  const locale = await getLocale();
  const m = getDictionary(locale).validation;
  const limited = await enforceRateLimit("contact", 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return { success: false, message: m.rateLimited };
  }

  const parsed = schemasForLocale(locale).contact.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
    artworkSlug: formData.get("artworkSlug") || undefined,
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  await db.contact_messages.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      subject: parsed.data.subject,
      message: parsed.data.message,
      artwork_slug: parsed.data.artworkSlug,
    },
  });

  await sendContactNotification(parsed.data);

  return { success: true, message: m.contactSuccess };
}

export async function submitCommissionForm(formData: FormData): Promise<FormState> {
  const locale = await getLocale();
  const m = getDictionary(locale).validation;
  const limited = await enforceRateLimit("commission", 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return { success: false, message: m.rateLimited };
  }

  const { getStoreSettings } = await import("@/lib/settings");
  const settings = await getStoreSettings(locale);
  if (!settings.commissionEnabled) {
    return { success: false, message: m.commissionsDisabled };
  }

  const parsed = schemasForLocale(locale).commission.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    budgetRange: formData.get("budgetRange") || undefined,
    description: formData.get("description"),
    referenceUrl: formData.get("referenceUrl") || undefined,
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const session = await auth();

  await db.commission_inquiries.create({
    data: {
      user_id: session?.user?.id,
      name: parsed.data.name,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      budget_range: parsed.data.budgetRange,
      description: parsed.data.description,
      reference_url: parsed.data.referenceUrl || null,
    },
  });

  await sendCommissionNotification(parsed.data, locale);

  return { success: true, message: m.commissionSuccess };
}

export async function subscribeNewsletter(formData: FormData): Promise<FormState> {
  const locale = await getLocale();
  const m = getDictionary(locale).validation;
  const limited = await enforceRateLimit("newsletter", 8, 15 * 60 * 1000);
  if (!limited.ok) {
    return { success: false, message: m.rateLimited };
  }

  const parsed = schemasForLocale(locale).newsletter.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await db.newsletter_subscribers.findUnique({ where: { email } });

  if (existing && !existing.unsubscribed_at) {
    return { success: true, message: m.newsletterAlreadySubscribed };
  }

  if (existing?.unsubscribed_at) {
    const subscriber = await db.newsletter_subscribers.update({
      where: { email },
      data: { unsubscribed_at: null },
    });
    await sendNewsletterWelcome(email, subscriber.unsubscribe_token, locale);
  } else {
    const subscriber = await db.newsletter_subscribers.create({
      data: { email, unsubscribe_token: randomUUID() },
    });
    await sendNewsletterWelcome(email, subscriber.unsubscribe_token, locale);
  }
  revalidatePath("/", "layout");

  return { success: true, message: m.newsletterSubscribed };
}

export async function requestPasswordReset(formData: FormData): Promise<FormState> {
  const locale = await getLocale();
  const m = getDictionary(locale).validation;
  const limited = await enforceRateLimit("password-reset", 5, 15 * 60 * 1000);
  if (!limited.ok) {
    return { success: false, message: m.rateLimited };
  }

  const parsed = schemasForLocale(locale).passwordResetRequest.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const email = parsed.data.email.toLowerCase();
  const user = await db.users.findUnique({ where: { email } });

  if (user?.password_hash) {
    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await db.verification_tokens.deleteMany({ where: { identifier: email } });
    await db.verification_tokens.create({
      data: { identifier: email, token, expires },
    });

    const baseUrl = process.env.AUTH_URL ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    await sendPasswordResetEmail(email, `${baseUrl}/reset-password?token=${token}`, locale);
  }

  return { success: true, message: m.resetSent };
}

export async function resetPassword(formData: FormData): Promise<FormState> {
  const locale = await getLocale();
  const m = getDictionary(locale).validation;
  const limited = await enforceRateLimit("password-reset-submit", 10, 15 * 60 * 1000);
  if (!limited.ok) {
    return { success: false, message: m.rateLimited };
  }

  const parsed = schemasForLocale(locale).passwordReset.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const record = await db.verification_tokens.findUnique({
    where: { token: parsed.data.token },
  });

  if (!record || record.expires < new Date()) {
    return { success: false, message: m.resetInvalid };
  }

  const password_hash = await bcrypt.hash(parsed.data.password, 12);
  await db.users.update({
    where: { email: record.identifier },
    data: { password_hash },
  });
  await db.verification_tokens.delete({ where: { token: parsed.data.token } });

  return { success: true, message: m.resetUpdated };
}
