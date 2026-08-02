import type { LegalPageContent } from "@/i18n/legal/types";

export const privacy: Record<"en" | "fr", LegalPageContent> = {
  en: {
    eyebrow: "Legal",
    title: "Privacy policy",
    description: "How {siteName} collects, uses, stores, and protects your personal data.",
    lastUpdated: "Last updated: 29 July 2026",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        paragraphs: [
          "{siteName} (“we”, “us”, “our”) respects your privacy. This policy explains what personal data we collect when you use our website, why we collect it, how long we keep it, and what rights you have under applicable data protection law, including the General Data Protection Regulation (GDPR).",
          "By using this website, creating an account, placing an order inquiry, subscribing to our newsletter, or contacting the studio, you acknowledge that you have read this policy.",
        ],
      },
      {
        id: "controller",
        title: "Data controller",
        paragraphs: [
          "The data controller responsible for your personal data is {siteName}. For any privacy-related request, contact us at {contactEmail}.",
          "We primarily serve collectors in {localeDisplay}. If you are located in the European Economic Area, UK, or Switzerland, GDPR-style rights described below apply to you.",
        ],
      },
      {
        id: "collect",
        title: "What data we collect",
        paragraphs: [
          "We may collect the following categories of personal data depending on how you interact with the site:",
        ],
        list: [
          "Identity and contact details: name, email address, phone number, billing and shipping address.",
          "Account data: login credentials (stored in hashed form), account preferences, and saved shipping details.",
          "Order and inquiry data: artworks requested, cart contents, order numbers, order status, and correspondence about availability, shipping, and payment.",
          "Communication data: messages sent through contact or commission forms, and newsletter subscription preferences.",
          "Technical data: IP address, browser type, device information, and basic server logs used for security and troubleshooting.",
          "Cookie data: language preference, cart session, authentication session, and cookie consent choice. See our Cookie Policy for details.",
        ],
      },
      {
        id: "use",
        title: "How we use your data",
        paragraphs: [
          "We use personal data only where we have a lawful basis to do so. This includes:",
        ],
        list: [
          "Processing order inquiries and fulfilling purchases you request.",
          "Managing your account and wishlist.",
          "Responding to contact, commission, and support requests.",
          "Sending studio updates and newsletters where you have opted in.",
          "Improving website performance, security, and user experience.",
          "Complying with legal, tax, and accounting obligations.",
        ],
      },
      {
        id: "legal-bases",
        title: "Legal bases for processing",
        paragraphs: [
          "Under the GDPR, we rely on one or more of the following legal bases:",
        ],
        list: [
          "Contract: to process your order inquiry and deliver the artworks or services you request.",
          "Consent: for newsletter emails and non-essential cookies where required.",
          "Legitimate interests: to operate and secure the website, prevent fraud, and improve our services in a way that does not override your rights.",
          "Legal obligation: where we must retain records for tax, accounting, or regulatory purposes.",
        ],
      },
      {
        id: "sharing",
        title: "Sharing your data",
        paragraphs: [
          "We do not sell your personal data. We may share limited information with trusted service providers who help us operate the website and studio, such as hosting providers, email delivery services, and shipping carriers. These providers may only use your data to perform services on our behalf.",
          "If online card payments are introduced in future, payment processors will handle payment data under their own privacy policies. We do not store full card numbers on our servers.",
          "We may disclose information if required by law, court order, or to protect the rights, property, or safety of the studio, our customers, or others.",
        ],
      },
      {
        id: "retention",
        title: "How long we keep data",
        paragraphs: [
          "We retain personal data only for as long as necessary for the purposes described in this policy.",
        ],
        list: [
          "Account data is kept while your account remains active and for a reasonable period afterwards.",
          "Order records are retained for the period required by applicable commercial and tax law.",
          "Newsletter data is kept until you unsubscribe.",
          "Server logs and security records are kept for a limited period unless needed for an investigation.",
        ],
      },
      {
        id: "transfers",
        title: "International transfers",
        paragraphs: [
          "Some of our service providers may process data outside your country of residence. Where this occurs, we take appropriate safeguards such as standard contractual clauses or equivalent protections required by applicable law.",
        ],
      },
      {
        id: "rights",
        title: "Your rights",
        paragraphs: [
          "Depending on your location, you may have the right to access, correct, delete, restrict, or object to certain processing, withdraw consent, request data portability, or lodge a complaint with your local data protection authority.",
          "To exercise these rights, email {contactEmail}. We may need to verify your identity before responding.",
        ],
      },
      {
        id: "security",
        title: "Security",
        paragraphs: [
          "We implement appropriate technical and organisational measures to protect personal data against unauthorised access, loss, misuse, or alteration. No method of transmission over the internet is completely secure, but we work to safeguard your information using industry-standard practices.",
        ],
      },
      {
        id: "children",
        title: "Children",
        paragraphs: [
          "Our website is not directed at children under 16, and we do not knowingly collect personal data from children. If you believe a child has provided us with personal data, please contact us so we can delete it.",
        ],
      },
      {
        id: "changes",
        title: "Changes to this policy",
        paragraphs: [
          "We may update this privacy policy from time to time. The “Last updated” date at the top of this page will reflect the latest version. Material changes may also be communicated by email or a notice on the website where appropriate.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        paragraphs: [
          "For questions about this privacy policy or your personal data, contact {siteName} at {contactEmail}.",
        ],
      },
    ],
  },
  fr: {
    eyebrow: "Mentions légales",
    title: "Politique de confidentialité",
    description:
      "Comment {siteName} collecte, utilise, conserve et protège vos données personnelles.",
    lastUpdated: "Dernière mise à jour : 29 juillet 2026",
    sections: [
      {
        id: "introduction",
        title: "Introduction",
        paragraphs: [
          "{siteName} (« nous », « notre ») respecte votre vie privée. Cette politique explique quelles données personnelles nous collectons lorsque vous utilisez notre site, pourquoi nous les collectons, combien de temps nous les conservons et quels droits vous avez en vertu du droit applicable, notamment le Règlement général sur la protection des données (RGPD).",
          "En utilisant ce site, en créant un compte, en envoyant une demande de commande, en vous abonnant à notre newsletter ou en contactant l'atelier, vous reconnaissez avoir lu cette politique.",
        ],
      },
      {
        id: "controller",
        title: "Responsable du traitement",
        paragraphs: [
          "Le responsable du traitement de vos données personnelles est {siteName}. Pour toute demande relative à la confidentialité, contactez-nous à {contactEmail}.",
          "Nous servons principalement des collectionneurs en {localeDisplay}. Si vous êtes situé dans l'Espace économique européen, au Royaume-Uni ou en Suisse, les droits de type RGPD décrits ci-dessous s'appliquent à vous.",
        ],
      },
      {
        id: "collect",
        title: "Données que nous collectons",
        paragraphs: [
          "Nous pouvons collecter les catégories de données personnelles suivantes selon votre utilisation du site :",
        ],
        list: [
          "Identité et coordonnées : nom, adresse e-mail, numéro de téléphone, adresse de facturation et de livraison.",
          "Données de compte : identifiants de connexion (stockés de manière hachée), préférences et adresse de livraison enregistrée.",
          "Données de commande et de demande : œuvres demandées, contenu du panier, numéros de commande, statut et correspondance sur la disponibilité, la livraison et le paiement.",
          "Données de communication : messages envoyés via les formulaires de contact ou de commande sur mesure, et préférences d'abonnement à la newsletter.",
          "Données techniques : adresse IP, type de navigateur, informations sur l'appareil et journaux serveur utilisés pour la sécurité et le dépannage.",
          "Données de cookies : préférence de langue, session panier, session d'authentification et choix de consentement aux cookies. Voir notre Politique de cookies.",
        ],
      },
      {
        id: "use",
        title: "Utilisation de vos données",
        paragraphs: [
          "Nous utilisons les données personnelles uniquement lorsque nous disposons d'une base légale, notamment pour :",
        ],
        list: [
          "Traiter vos demandes de commande et exécuter les achats demandés.",
          "Gérer votre compte et votre liste de favoris.",
          "Répondre aux demandes de contact, de commande sur mesure et d'assistance.",
          "Envoyer des actualités de l'atelier et la newsletter lorsque vous y avez consenti.",
          "Améliorer les performances, la sécurité et l'expérience du site.",
          "Respecter les obligations légales, fiscales et comptables.",
        ],
      },
      {
        id: "legal-bases",
        title: "Bases légales du traitement",
        paragraphs: [
          "En vertu du RGPD, nous nous appuyons sur une ou plusieurs des bases suivantes :",
        ],
        list: [
          "Contrat : pour traiter votre demande de commande et livrer les œuvres ou services demandés.",
          "Consentement : pour les e-mails newsletter et les cookies non essentiels lorsque requis.",
          "Intérêt légitime : pour exploiter et sécuriser le site, prévenir la fraude et améliorer nos services sans porter atteinte à vos droits.",
          "Obligation légale : lorsque nous devons conserver des documents à des fins fiscales, comptables ou réglementaires.",
        ],
      },
      {
        id: "sharing",
        title: "Partage de vos données",
        paragraphs: [
          "Nous ne vendons pas vos données personnelles. Nous pouvons partager des informations limitées avec des prestataires de confiance qui nous aident à exploiter le site et l'atelier, tels que l'hébergement, l'envoi d'e-mails et les transporteurs. Ces prestataires ne peuvent utiliser vos données que pour nous fournir leurs services.",
          "Si un paiement en ligne par carte est introduit à l'avenir, les processeurs de paiement traiteront les données de paiement selon leurs propres politiques. Nous ne stockons pas les numéros de carte complets sur nos serveurs.",
          "Nous pouvons divulguer des informations si la loi l'exige ou pour protéger les droits, les biens ou la sécurité de l'atelier, de nos clients ou d'autrui.",
        ],
      },
      {
        id: "retention",
        title: "Durée de conservation",
        paragraphs: [
          "Nous conservons les données personnelles uniquement le temps nécessaire aux finalités décrites :",
        ],
        list: [
          "Les données de compte sont conservées tant que votre compte est actif, puis pendant une période raisonnable.",
          "Les dossiers de commande sont conservés pendant la durée requise par le droit commercial et fiscal applicable.",
          "Les données newsletter sont conservées jusqu'à votre désabonnement.",
          "Les journaux serveur et de sécurité sont conservés pour une durée limitée, sauf enquête en cours.",
        ],
      },
      {
        id: "transfers",
        title: "Transferts internationaux",
        paragraphs: [
          "Certains prestataires peuvent traiter des données en dehors de votre pays de résidence. Le cas échéant, nous mettons en place des garanties appropriées, telles que les clauses contractuelles types ou des protections équivalentes exigées par la loi applicable.",
        ],
      },
      {
        id: "rights",
        title: "Vos droits",
        paragraphs: [
          "Selon votre lieu de résidence, vous pouvez avoir le droit d'accéder à vos données, de les rectifier, de demander leur effacement, de limiter ou vous opposer à certains traitements, de retirer votre consentement, de demander la portabilité ou d'introduire une réclamation auprès de votre autorité de protection des données.",
          "Pour exercer ces droits, écrivez à {contactEmail}. Nous pouvons devoir vérifier votre identité avant de répondre.",
        ],
      },
      {
        id: "security",
        title: "Sécurité",
        paragraphs: [
          "Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger les données contre l'accès non autorisé, la perte, l'utilisation abusive ou l'altération. Aucune transmission sur Internet n'est totalement sécurisée, mais nous travaillons à protéger vos informations selon les pratiques du secteur.",
        ],
      },
      {
        id: "children",
        title: "Enfants",
        paragraphs: [
          "Notre site ne s'adresse pas aux enfants de moins de 16 ans et nous ne collectons pas sciemment de données personnelles les concernant. Si vous pensez qu'un enfant nous a transmis des données, contactez-nous afin que nous puissions les supprimer.",
        ],
      },
      {
        id: "changes",
        title: "Modifications de cette politique",
        paragraphs: [
          "Nous pouvons mettre à jour cette politique de temps à autre. La date « Dernière mise à jour » en haut de cette page reflète la version la plus récente. Les changements importants peuvent également être communiqués par e-mail ou par un avis sur le site le cas échéant.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        paragraphs: [
          "Pour toute question concernant cette politique ou vos données personnelles, contactez {siteName} à {contactEmail}.",
        ],
      },
    ],
  },
};
