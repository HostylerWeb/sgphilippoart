import type { Locale } from "@/i18n/config";

export function getEmailCopy(locale: Locale) {
  const isFr = locale === "fr";

  return {
    orderConfirmationSubject: (orderNumber: string) =>
      isFr
        ? `Demande de commande reçue — ${orderNumber}`
        : `Order inquiry received — ${orderNumber}`,
    orderConfirmationCustomer: (input: {
      name: string;
      orderNumber: string;
      total: string;
      trackUrl: string;
    }) =>
      isFr
        ? `<p>Bonjour ${input.name},</p>
      <p>Nous avons bien reçu votre demande de commande <strong>${input.orderNumber}</strong>.</p>
      <p>Total estimé : <strong>${input.total}</strong></p>
      <p>Nous confirmerons la disponibilité, la livraison et les modalités de paiement par e-mail sous peu.</p>
      <p>Vous pouvez suivre votre commande sur <a href="${input.trackUrl}">${input.trackUrl}</a>.</p>`
        : `<p>Hi ${input.name},</p>
      <p>We received your order inquiry <strong>${input.orderNumber}</strong>.</p>
      <p>Estimated total: <strong>${input.total}</strong></p>
      <p>We will confirm availability, shipping, and payment details by email shortly.</p>
      <p>You can track your order at <a href="${input.trackUrl}">${input.trackUrl}</a>.</p>`,
    orderConfirmationStudio: (input: {
      name: string;
      email: string;
      orderNumber: string;
    }) =>
      isFr
        ? `<p>Nouvelle demande de commande de ${input.name} (${input.email}).</p><p>Commande : ${input.orderNumber}</p>`
        : `<p>New order inquiry from ${input.name} (${input.email}).</p><p>Order: ${input.orderNumber}</p>`,
    orderStatusSubject: (orderNumber: string) =>
      isFr ? `Mise à jour de commande — ${orderNumber}` : `Order update — ${orderNumber}`,
    orderStatusBody: (input: {
      name: string;
      orderNumber: string;
      statusLabel: string;
      trackingLine: string;
      trackUrl: string;
    }) =>
      isFr
        ? `<p>Bonjour ${input.name},</p>
      <p>Votre commande <strong>${input.orderNumber}</strong> est maintenant <strong>${input.statusLabel}</strong>.</p>
      ${input.trackingLine}
      <p>Suivez votre commande sur <a href="${input.trackUrl}">${input.trackUrl}</a>.</p>`
        : `<p>Hi ${input.name},</p>
      <p>Your order <strong>${input.orderNumber}</strong> is now <strong>${input.statusLabel}</strong>.</p>
      ${input.trackingLine}
      <p>Track your order at <a href="${input.trackUrl}">${input.trackUrl}</a>.</p>`,
    commissionCustomerSubject: isFr
      ? "Nous avons reçu votre demande de commande — SG Philippo Art"
      : "We received your commission inquiry — SG Philippo Art",
    commissionCustomerBody: (name: string) =>
      isFr
        ? `<p>Bonjour ${name},</p><p>Merci pour votre demande de commande sur mesure. Nous l'examinerons et vous répondrons sous 1 à 2 jours ouvrés.</p>`
        : `<p>Hi ${name},</p><p>Thank you for your commission inquiry. We will review your request and respond within 1–2 business days.</p>`,
    newsletterSubject: isFr ? "Bienvenue chez SG Philippo Art" : "Welcome to SG Philippo Art",
    newsletterBody: (unsubscribeUrl: string) =>
      isFr
        ? `<p>Merci pour votre inscription. Nous partagerons bientôt nos nouvelles œuvres et actualités d'atelier.</p>
      <p style="font-size:12px;color:#666;"><a href="${unsubscribeUrl}">Se désabonner</a> de cette liste à tout moment.</p>`
        : `<p>Thank you for subscribing. We will share new works and studio updates with you soon.</p>
      <p style="font-size:12px;color:#666;"><a href="${unsubscribeUrl}">Unsubscribe</a> from this list at any time.</p>`,
    passwordResetSubject: isFr
      ? "Réinitialiser votre mot de passe — SG Philippo Art"
      : "Reset your password — SG Philippo Art",
    passwordResetBody: (resetUrl: string) =>
      isFr
        ? `<p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe. Ce lien expire dans 1 heure.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
        : `<p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    statusLabels: isFr
      ? {
          pending: "En attente",
          confirmed: "Confirmée",
          processing: "En traitement",
          shipped: "Expédiée",
          delivered: "Livrée",
          cancelled: "Annulée",
        }
      : {
          pending: "Pending review",
          confirmed: "Confirmed",
          processing: "Processing",
          shipped: "Shipped",
          delivered: "Delivered",
          cancelled: "Cancelled",
        },
    trackingLabel: isFr ? "Numéro de suivi" : "Tracking number",
    newsletterWelcomeText: isFr
      ? "Merci pour votre inscription.\n\nSe désabonner : "
      : "Thank you for subscribing.\n\nUnsubscribe: ",
  };
}
