import { escapeHtml } from "@/lib/html-escape";
import { getEmailCopy } from "@/i18n/emails";
import type { Locale } from "@/i18n/config";
import { getStudioEmail } from "@/lib/studio-email";
import {
  formatSmtpFromAddress,
  getSmtpTransporter,
  isSmtpConfigured,
} from "@/lib/smtp";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const fromEmail = await getStudioEmail();
  const transporter = getSmtpTransporter();

  if (!transporter || !isSmtpConfigured()) {
    console.info("[email:dev]", fromEmail, "→", payload.to, payload.subject);
    return true;
  }

  try {
    await transporter.sendMail({
      from: formatSmtpFromAddress(fromEmail),
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });
    return true;
  } catch (error) {
    console.error("[email:smtp]", error);
    return false;
  }
}

export async function sendContactNotification(input: {
  name: string;
  email: string;
  subject?: string;
  message: string;
  artworkSlug?: string;
}) {
  const studioEmail = await getStudioEmail();
  const subject = input.subject ?? `Contact from ${input.name}`;
  const artworkLine = input.artworkSlug
    ? `<p><strong>Artwork:</strong> ${escapeHtml(input.artworkSlug)}</p>`
    : "";

  await sendEmail({
    to: studioEmail,
    subject: `[SG Philippo Art] ${subject}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      ${artworkLine}
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(input.message).replace(/\n/g, "<br>")}</p>
    `,
    text: `${input.name} <${input.email}>\n\n${input.message}`,
  });
}

export async function sendCommissionNotification(
  input: {
    name: string;
    email: string;
    phone?: string;
    budgetRange?: string;
    description: string;
    referenceUrl?: string;
  },
  locale: Locale = "en",
) {
  const studioEmail = await getStudioEmail();
  const copy = getEmailCopy(locale);

  await sendEmail({
    to: studioEmail,
    subject: `[SG Philippo Art] New commission inquiry from ${input.name}`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(input.name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(input.email)}</p>
      ${input.phone ? `<p><strong>Phone:</strong> ${escapeHtml(input.phone)}</p>` : ""}
      ${input.budgetRange ? `<p><strong>Budget:</strong> ${escapeHtml(input.budgetRange)}</p>` : ""}
      ${input.referenceUrl ? `<p><strong>Reference:</strong> ${escapeHtml(input.referenceUrl)}</p>` : ""}
      <p><strong>Description:</strong></p>
      <p>${escapeHtml(input.description).replace(/\n/g, "<br>")}</p>
    `,
  });

  await sendEmail({
    to: input.email,
    subject: copy.commissionCustomerSubject,
    html: copy.commissionCustomerBody(escapeHtml(input.name)),
  });
}

export async function sendNewsletterWelcome(
  email: string,
  unsubscribeToken: string,
  locale: Locale = "en",
) {
  const copy = getEmailCopy(locale);
  const unsubscribeUrl = `${siteUrl}/newsletter/unsubscribe?token=${unsubscribeToken}`;

  await sendEmail({
    to: email,
    subject: copy.newsletterSubject,
    html: copy.newsletterBody(unsubscribeUrl),
    text: `${copy.newsletterWelcomeText}${unsubscribeUrl}`,
  });
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  locale: Locale = "en",
) {
  const copy = getEmailCopy(locale);
  await sendEmail({
    to: email,
    subject: copy.passwordResetSubject,
    html: copy.passwordResetBody(escapeHtml(resetUrl)),
  });
}

export async function sendOrderConfirmation(
  input: {
    email: string;
    name: string;
    orderNumber: string;
    total: string;
  },
  locale: Locale = "en",
) {
  const studioEmail = await getStudioEmail();
  const copy = getEmailCopy(locale);
  const trackUrl = `${siteUrl}/track-order`;

  const customerSent = await sendEmail({
    to: input.email,
    subject: copy.orderConfirmationSubject(input.orderNumber),
    html: copy.orderConfirmationCustomer({
      name: escapeHtml(input.name),
      orderNumber: escapeHtml(input.orderNumber),
      total: escapeHtml(input.total),
      trackUrl,
    }),
  });

  const studioSent = await sendEmail({
    to: studioEmail,
    subject: `[SG Philippo Art] New order inquiry ${input.orderNumber}`,
    html: copy.orderConfirmationStudio({
      name: escapeHtml(input.name),
      email: escapeHtml(input.email),
      orderNumber: escapeHtml(input.orderNumber),
    }),
  });

  return customerSent && studioSent;
}

export async function sendOrderStatusUpdate(
  input: {
    email: string;
    name: string;
    orderNumber: string;
    status: string;
    trackingNumber?: string | null;
  },
  locale: Locale = "en",
) {
  const copy = getEmailCopy(locale);
  const statusLabel =
    input.status in copy.statusLabels
      ? copy.statusLabels[input.status as keyof typeof copy.statusLabels]
      : input.status;
  const trackingLine = input.trackingNumber
    ? `<p><strong>${copy.trackingLabel}:</strong> ${escapeHtml(input.trackingNumber)}</p>`
    : "";
  const trackUrl = `${siteUrl}/track-order`;

  return sendEmail({
    to: input.email,
    subject: copy.orderStatusSubject(input.orderNumber),
    html: copy.orderStatusBody({
      name: escapeHtml(input.name),
      orderNumber: escapeHtml(input.orderNumber),
      statusLabel: escapeHtml(statusLabel),
      trackingLine,
      trackUrl,
    }),
  });
}
