import type { LegalPageContent } from "@/i18n/legal/types";

export const terms: Record<"en" | "fr", LegalPageContent> = {
  en: {
    eyebrow: "Legal",
    title: "Terms of service",
    description: "Terms governing your use of the {siteName} website and studio services.",
    lastUpdated: "Last updated: 29 July 2026",
    sections: [
      {
        id: "agreement",
        title: "Agreement to these terms",
        paragraphs: [
          "These Terms of Service (“Terms”) govern your access to and use of the {siteName} website and related services. By browsing, creating an account, submitting an order inquiry, or contacting the studio, you agree to these Terms.",
          "If you do not agree, please do not use the website.",
        ],
      },
      {
        id: "studio",
        title: "About the studio",
        paragraphs: [
          "{siteName} is a contemporary art studio offering original paintings, limited-edition prints, and commissioned works. Product descriptions, images, dimensions, and prices are provided in good faith and may be updated without prior notice.",
        ],
      },
      {
        id: "accounts",
        title: "Accounts",
        paragraphs: [
          "You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account. Please notify us promptly at {contactEmail} if you suspect unauthorised access.",
          "We may suspend or close accounts that violate these Terms or are used fraudulently.",
        ],
      },
      {
        id: "orders",
        title: "Orders and checkout",
        paragraphs: [
          "Checkout on this website operates as an order inquiry. Submitting checkout does not guarantee availability and does not constitute a completed sale until the studio confirms your order by email.",
          "We will confirm artwork availability, final pricing in {currencyCode}, shipping costs, payment method, and estimated delivery before your order is finalised.",
          "You agree to provide accurate contact and shipping information. We are not responsible for delays or failed delivery caused by incorrect details supplied by you.",
        ],
      },
      {
        id: "pricing",
        title: "Pricing and availability",
        paragraphs: [
          "All prices are displayed in {currencyCode} unless stated otherwise. Original artworks are unique and may be marked sold after purchase. Print editions are subject to available stock.",
          "We reserve the right to refuse or cancel an order before confirmation, including in cases of pricing error, suspected fraud, or unavailability.",
        ],
      },
      {
        id: "ip",
        title: "Intellectual property",
        paragraphs: [
          "All artworks, photographs, text, graphics, logos, and website content are owned by {siteName} or its licensors and are protected by copyright and other intellectual property laws.",
          "Purchasing an artwork grants you ownership of the physical work (or print) as described in your order confirmation. It does not transfer copyright or reproduction rights unless expressly agreed in writing.",
          "You may not reproduce, distribute, or commercially exploit studio images or content without prior written permission.",
        ],
      },
      {
        id: "commissions",
        title: "Commissions",
        paragraphs: [
          "Custom commissions are subject to a separate agreement covering scope, timeline, revisions, deposit, and delivery. Commission requests submitted through the website do not create a binding contract until confirmed by the studio.",
        ],
      },
      {
        id: "shipping-returns",
        title: "Shipping, customs, and returns",
        paragraphs: [
          "Shipping arrangements, delivery times, and packaging standards are described on our Shipping page. Import duties, taxes, and customs charges may apply depending on your destination and are generally the responsibility of the recipient unless otherwise stated.",
          "Returns and replacements are governed by our Returns policy ({returnsSummary}). Please review that page before purchasing.",
        ],
      },
      {
        id: "newsletter",
        title: "Newsletter and communications",
        paragraphs: [
          "If you subscribe to our newsletter, you consent to receive studio updates by email. You may unsubscribe at any time using the link in each email or by contacting {contactEmail}.",
        ],
      },
      {
        id: "liability",
        title: "Disclaimer and limitation of liability",
        paragraphs: [
          "The website is provided on an “as is” and “as available” basis. To the fullest extent permitted by law, {siteName} disclaims warranties not required by applicable consumer law.",
          "We are not liable for indirect, incidental, special, or consequential damages arising from your use of the website or purchase of artworks, except where liability cannot be excluded under mandatory consumer protection law.",
        ],
      },
      {
        id: "law",
        title: "Governing law",
        paragraphs: [
          "These Terms are governed by the laws of Belgium, without regard to conflict-of-law principles. If you are a consumer in the European Union, you also benefit from mandatory protections of your country of residence where applicable.",
          "Disputes should first be raised with us at {contactEmail}. If unresolved, competent courts or alternative dispute resolution mechanisms may apply under applicable law.",
        ],
      },
      {
        id: "changes",
        title: "Changes",
        paragraphs: [
          "We may update these Terms from time to time. Continued use of the website after changes are posted constitutes acceptance of the revised Terms.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        paragraphs: [
          "Questions about these Terms may be sent to {contactEmail}.",
        ],
      },
    ],
  },
  fr: {
    eyebrow: "Mentions légales",
    title: "Conditions d'utilisation",
    description:
      "Conditions régissant votre utilisation du site {siteName} et des services de l'atelier.",
    lastUpdated: "Dernière mise à jour : 29 juillet 2026",
    sections: [
      {
        id: "agreement",
        title: "Acceptation des conditions",
        paragraphs: [
          "Les présentes Conditions d'utilisation (« Conditions ») régissent votre accès au site {siteName} et à ses services associés. En naviguant, en créant un compte, en envoyant une demande de commande ou en contactant l'atelier, vous acceptez ces Conditions.",
          "Si vous n'êtes pas d'accord, veuillez ne pas utiliser le site.",
        ],
      },
      {
        id: "studio",
        title: "À propos de l'atelier",
        paragraphs: [
          "{siteName} est un atelier d'art contemporain proposant des peintures originales, des estampes en édition limitée et des œuvres sur commande. Les descriptions, images, dimensions et prix sont fournis de bonne foi et peuvent être mis à jour sans préavis.",
        ],
      },
      {
        id: "accounts",
        title: "Comptes",
        paragraphs: [
          "Vous êtes responsable de la confidentialité de vos identifiants et de toute activité effectuée via votre compte. Prévenez-nous rapidement à {contactEmail} en cas d'accès non autorisé suspecté.",
          "Nous pouvons suspendre ou fermer les comptes qui violent ces Conditions ou sont utilisés de manière frauduleuse.",
        ],
      },
      {
        id: "orders",
        title: "Commandes et passage en caisse",
        paragraphs: [
          "Le passage en caisse sur ce site fonctionne comme une demande de commande. L'envoi du formulaire ne garantit pas la disponibilité et ne constitue pas une vente définitive tant que l'atelier n'a pas confirmé votre commande par e-mail.",
          "Nous confirmerons la disponibilité de l'œuvre, le prix final en {currencyCode}, les frais de livraison, le mode de paiement et le délai estimé avant toute finalisation.",
          "Vous vous engagez à fournir des coordonnées et une adresse de livraison exactes. Nous ne sommes pas responsables des retards ou échecs de livraison dus à des informations incorrectes fournies par vous.",
        ],
      },
      {
        id: "pricing",
        title: "Prix et disponibilité",
        paragraphs: [
          "Tous les prix sont affichés en {currencyCode} sauf indication contraire. Les œuvres originales sont uniques et peuvent être marquées vendues après achat. Les éditions d'estampes dépendent du stock disponible.",
          "Nous nous réservons le droit de refuser ou d'annuler une commande avant confirmation, notamment en cas d'erreur de prix, de fraude suspectée ou d'indisponibilité.",
        ],
      },
      {
        id: "ip",
        title: "Propriété intellectuelle",
        paragraphs: [
          "Toutes les œuvres, photographies, textes, graphismes, logos et contenus du site appartiennent à {siteName} ou à ses concédants et sont protégés par le droit d'auteur et d'autres lois sur la propriété intellectuelle.",
          "L'achat d'une œuvre vous confère la propriété du bien physique (ou de l'estampes) tel que décrit dans la confirmation de commande. Cela ne transfère pas le droit d'auteur ni les droits de reproduction, sauf accord écrit exprès.",
          "Vous ne pouvez pas reproduire, distribuer ou exploiter commercialement les images ou contenus de l'atelier sans autorisation écrite préalable.",
        ],
      },
      {
        id: "commissions",
        title: "Commandes sur mesure",
        paragraphs: [
          "Les commandes sur mesure sont soumises à un accord distinct couvrant le périmètre, le calendrier, les révisions, l'acompte et la livraison. Une demande envoyée via le site ne crée pas de contrat contraignant tant qu'elle n'est pas confirmée par l'atelier.",
        ],
      },
      {
        id: "shipping-returns",
        title: "Livraison, douanes et retours",
        paragraphs: [
          "Les modalités d'expédition, délais et normes d'emballage sont décrits sur notre page Livraison. Des droits d'importation, taxes ou frais de douane peuvent s'appliquer selon votre destination et sont généralement à la charge du destinataire, sauf mention contraire.",
          "Les retours et remplacements sont régis par notre politique de Retours ({returnsSummary}). Veuillez la consulter avant tout achat.",
        ],
      },
      {
        id: "newsletter",
        title: "Newsletter et communications",
        paragraphs: [
          "Si vous vous abonnez à notre newsletter, vous consentez à recevoir des actualités de l'atelier par e-mail. Vous pouvez vous désabonner à tout moment via le lien présent dans chaque e-mail ou en écrivant à {contactEmail}.",
        ],
      },
      {
        id: "liability",
        title: "Responsabilité",
        paragraphs: [
          "Le site est fourni « en l'état » et « selon disponibilité ». Dans la mesure permise par la loi, {siteName} exclut les garanties non exigées par le droit de la consommation applicable.",
          "Nous ne sommes pas responsables des dommages indirects, accessoires, spéciaux ou consécutifs liés à votre utilisation du site ou à l'achat d'œuvres, sauf lorsque une telle responsabilité ne peut être exclue en vertu du droit impératif de la consommation.",
        ],
      },
      {
        id: "law",
        title: "Droit applicable",
        paragraphs: [
          "Ces Conditions sont régies par le droit belge, sans égard aux règles de conflit de lois. Si vous êtes consommateur dans l'Union européenne, vous bénéficiez également des protections impératives de votre pays de résidence le cas échéant.",
          "Les litiges doivent d'abord être signalés à {contactEmail}. À défaut de résolution, les tribunaux compétents ou mécanismes de règlement alternatif des litiges peuvent s'appliquer selon la loi.",
        ],
      },
      {
        id: "changes",
        title: "Modifications",
        paragraphs: [
          "Nous pouvons mettre à jour ces Conditions de temps à autre. L'utilisation continue du site après publication des modifications vaut acceptation des Conditions révisées.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        paragraphs: [
          "Pour toute question concernant ces Conditions, écrivez à {contactEmail}.",
        ],
      },
    ],
  },
};
