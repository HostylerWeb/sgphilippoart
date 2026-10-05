import type { Locale } from "@/i18n/config";

export function getEmailCopy(locale: Locale) {
  if (locale === "fr") {
    return {
      orderConfirmationSubject: (orderNumber: string) =>
        `Confirmation de commande — ${orderNumber}`,
      orderConfirmationCustomer: (input: {
        name: string;
        orderNumber: string;
        total: string;
        trackUrl: string;
      }) =>
        `<p>Bonjour ${input.name},</p>
      <p>Nous avons bien reçu votre commande <strong>${input.orderNumber}</strong>.</p>
      <p>Total : <strong>${input.total}</strong></p>
      <p>Ceci confirme que votre commande a été enregistrée. Nous vous contacterons dans les plus brefs délais pour organiser la livraison et préciser tout autre détail.</p>
      <p>Vous pouvez consulter votre commande sur <a href="${input.trackUrl}">${input.trackUrl}</a>.</p>`,
      orderConfirmationStudio: (input: {
        name: string;
        email: string;
        orderNumber: string;
      }) =>
        `<p>Nouvelle commande de ${input.name} (${input.email}).</p><p>Commande : ${input.orderNumber}</p>`,
      orderStatusSubject: (orderNumber: string) => `Mise à jour de commande — ${orderNumber}`,
      orderStatusBody: (input: {
        name: string;
        orderNumber: string;
        statusLabel: string;
        trackingLine: string;
        trackUrl: string;
      }) =>
        `<p>Bonjour ${input.name},</p>
      <p>Votre commande <strong>${input.orderNumber}</strong> est maintenant <strong>${input.statusLabel}</strong>.</p>
      ${input.trackingLine}
      <p>Suivez votre commande sur <a href="${input.trackUrl}">${input.trackUrl}</a>.</p>`,
      commissionCustomerSubject:
        "Nous avons reçu votre demande de commande — SG Philippo Art",
      commissionCustomerBody: (name: string) =>
        `<p>Bonjour ${name},</p><p>Merci pour votre demande de commande sur mesure. Nous l'examinerons et vous répondrons sous 1 à 2 jours ouvrés.</p>`,
      newsletterSubject: "Bienvenue chez SG Philippo Art",
      newsletterBody: (unsubscribeUrl: string) =>
        `<p>Merci pour votre inscription. Nous partagerons bientôt nos nouvelles œuvres et actualités d'atelier.</p>
      <p style="font-size:12px;color:#666;"><a href="${unsubscribeUrl}">Se désabonner</a> de cette liste à tout moment.</p>`,
      passwordResetSubject: "Réinitialiser votre mot de passe — SG Philippo Art",
      passwordResetBody: (resetUrl: string) =>
        `<p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe. Ce lien expire dans 1 heure.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      statusLabels: {
        pending: "En attente",
        confirmed: "Confirmée",
        processing: "En traitement",
        shipped: "Expédiée",
        delivered: "Livrée",
        cancelled: "Annulée",
      },
      trackingLabel: "Numéro de suivi",
      newsletterWelcomeText:
        "Merci pour votre inscription.\n\nSe désabonner : ",
    };
  }

  if (locale === "nl") {
    return {
      orderConfirmationSubject: (orderNumber: string) =>
        `Bestelbevestiging — ${orderNumber}`,
      orderConfirmationCustomer: (input: {
        name: string;
        orderNumber: string;
        total: string;
        trackUrl: string;
      }) =>
        `<p>Hallo ${input.name},</p>
      <p>We hebben uw bestelling <strong>${input.orderNumber}</strong> ontvangen.</p>
      <p>Totaal: <strong>${input.total}</strong></p>
      <p>Dit bevestigt dat uw bestelling is geregistreerd. We nemen zo snel mogelijk contact met u op om de levering te regelen en andere details te bespreken.</p>
      <p>U kunt uw bestelling bekijken op <a href="${input.trackUrl}">${input.trackUrl}</a>.</p>`,
      orderConfirmationStudio: (input: {
        name: string;
        email: string;
        orderNumber: string;
      }) =>
        `<p>Nieuwe bestelling van ${input.name} (${input.email}).</p><p>Bestelling: ${input.orderNumber}</p>`,
      orderStatusSubject: (orderNumber: string) => `Bestelling bijgewerkt — ${orderNumber}`,
      orderStatusBody: (input: {
        name: string;
        orderNumber: string;
        statusLabel: string;
        trackingLine: string;
        trackUrl: string;
      }) =>
        `<p>Hallo ${input.name},</p>
      <p>Uw bestelling <strong>${input.orderNumber}</strong> is nu <strong>${input.statusLabel}</strong>.</p>
      ${input.trackingLine}
      <p>Volg uw bestelling op <a href="${input.trackUrl}">${input.trackUrl}</a>.</p>`,
      commissionCustomerSubject:
        "We hebben uw commissieverzoek ontvangen — SG Philippo Art",
      commissionCustomerBody: (name: string) =>
        `<p>Hallo ${name},</p><p>Bedankt voor uw commissieverzoek. We bekijken uw aanvraag en reageren binnen 1–2 werkdagen.</p>`,
      newsletterSubject: "Welkom bij SG Philippo Art",
      newsletterBody: (unsubscribeUrl: string) =>
        `<p>Bedankt voor uw inschrijving. We delen binnenkort nieuwe werken en nieuws uit het atelier.</p>
      <p style="font-size:12px;color:#666;"><a href="${unsubscribeUrl}">Uitschrijven</a> kan op elk moment.</p>`,
      passwordResetSubject: "Wachtwoord resetten — SG Philippo Art",
      passwordResetBody: (resetUrl: string) =>
        `<p>Klik op de onderstaande link om uw wachtwoord te resetten. Deze link verloopt binnen 1 uur.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
      statusLabels: {
        pending: "In behandeling",
        confirmed: "Bevestigd",
        processing: "Wordt verwerkt",
        shipped: "Verzonden",
        delivered: "Geleverd",
        cancelled: "Geannuleerd",
      },
      trackingLabel: "Trackingnummer",
      newsletterWelcomeText:
        "Bedankt voor uw inschrijving.\n\nUitschrijven: ",
    };
  }

  return {
    orderConfirmationSubject: (orderNumber: string) =>
      `Order confirmation — ${orderNumber}`,
    orderConfirmationCustomer: (input: {
      name: string;
      orderNumber: string;
      total: string;
      trackUrl: string;
    }) =>
      `<p>Hi ${input.name},</p>
      <p>We have received your order <strong>${input.orderNumber}</strong>.</p>
      <p>Total: <strong>${input.total}</strong></p>
      <p>This confirms your order is on file. We will contact you as soon as possible to arrange delivery and confirm any other details.</p>
      <p>You can view your order at <a href="${input.trackUrl}">${input.trackUrl}</a>.</p>`,
    orderConfirmationStudio: (input: {
      name: string;
      email: string;
      orderNumber: string;
    }) =>
      `<p>New order from ${input.name} (${input.email}).</p><p>Order: ${input.orderNumber}</p>`,
    orderStatusSubject: (orderNumber: string) => `Order update — ${orderNumber}`,
    orderStatusBody: (input: {
      name: string;
      orderNumber: string;
      statusLabel: string;
      trackingLine: string;
      trackUrl: string;
    }) =>
      `<p>Hi ${input.name},</p>
      <p>Your order <strong>${input.orderNumber}</strong> is now <strong>${input.statusLabel}</strong>.</p>
      ${input.trackingLine}
      <p>Track your order at <a href="${input.trackUrl}">${input.trackUrl}</a>.</p>`,
    commissionCustomerSubject: "We received your commission inquiry — SG Philippo Art",
    commissionCustomerBody: (name: string) =>
      `<p>Hi ${name},</p><p>Thank you for your commission inquiry. We will review your request and respond within 1–2 business days.</p>`,
    newsletterSubject: "Welcome to SG Philippo Art",
    newsletterBody: (unsubscribeUrl: string) =>
      `<p>Thank you for subscribing. We will share new works and studio updates with you soon.</p>
      <p style="font-size:12px;color:#666;"><a href="${unsubscribeUrl}">Unsubscribe</a> from this list at any time.</p>`,
    passwordResetSubject: "Reset your password — SG Philippo Art",
    passwordResetBody: (resetUrl: string) =>
      `<p>Click the link below to reset your password. This link expires in 1 hour.</p><p><a href="${resetUrl}">${resetUrl}</a></p>`,
    statusLabels: {
      pending: "Pending review",
      confirmed: "Confirmed",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
    },
    trackingLabel: "Tracking number",
    newsletterWelcomeText: "Thank you for subscribing.\n\nUnsubscribe: ",
  };
}
