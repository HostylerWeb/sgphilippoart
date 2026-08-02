import type { LegalPageContent } from "@/i18n/legal/types";

export const legalNotice: Record<"en" | "fr", LegalPageContent> = {
  en: {
    eyebrow: "Legal",
    title: "Legal notice",
    description: "Publisher information and legal details for the {siteName} website.",
    lastUpdated: "Last updated: 29 July 2026",
    sections: [
      {
        id: "publisher",
        title: "Website publisher",
        paragraphs: [
          "This website is published by {siteName}, a contemporary art studio.",
          "Primary markets: {localeDisplay}.",
          "Contact email: {contactEmail}.",
        ],
      },
      {
        id: "hosting",
        title: "Hosting",
        paragraphs: [
          "The website is hosted on secure infrastructure operated by professional hosting providers. Server locations and providers may be updated as the studio's technical requirements evolve.",
        ],
      },
      {
        id: "ip",
        title: "Intellectual property",
        paragraphs: [
          "All content on this website — including artworks, photographs, text, graphics, logos, and design — is protected by copyright and belongs to {siteName} or its licensors unless otherwise stated.",
          "Any reproduction, representation, modification, or exploitation without prior written authorisation is prohibited.",
        ],
      },
      {
        id: "liability",
        title: "Liability",
        paragraphs: [
          "{siteName} endeavours to keep information on this website accurate and up to date. However, we cannot guarantee the absence of errors or uninterrupted availability.",
          "The studio cannot be held liable for direct or indirect damage resulting from access to or use of the website, except where liability cannot be excluded under mandatory law.",
        ],
      },
      {
        id: "links",
        title: "External links",
        paragraphs: [
          "This website may contain links to third-party websites. We are not responsible for the content or privacy practices of external sites.",
        ],
      },
      {
        id: "law",
        title: "Applicable law",
        paragraphs: [
          "This legal notice and use of the website are governed by Belgian law, subject to mandatory consumer protections in your country of residence where applicable.",
        ],
      },
      {
        id: "privacy",
        title: "Personal data",
        paragraphs: [
          "For information on how we process personal data, please see our Privacy Policy. For cookies, see our Cookie Policy.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        paragraphs: [
          "For any legal enquiry regarding this website, contact {contactEmail}.",
        ],
      },
    ],
  },
  fr: {
    eyebrow: "Mentions légales",
    title: "Mentions légales",
    description: "Informations sur l'éditeur et détails juridiques du site {siteName}.",
    lastUpdated: "Dernière mise à jour : 29 juillet 2026",
    sections: [
      {
        id: "publisher",
        title: "Éditeur du site",
        paragraphs: [
          "Ce site est édité par {siteName}, atelier d'art contemporain.",
          "Marchés principaux : {localeDisplay}.",
          "E-mail de contact : {contactEmail}.",
        ],
      },
      {
        id: "hosting",
        title: "Hébergement",
        paragraphs: [
          "Le site est hébergé sur une infrastructure sécurisée exploitée par des prestataires professionnels. Les emplacements serveur et prestataires peuvent évoluer selon les besoins techniques de l'atelier.",
        ],
      },
      {
        id: "ip",
        title: "Propriété intellectuelle",
        paragraphs: [
          "L'ensemble du contenu de ce site — œuvres, photographies, textes, graphismes, logos et design — est protégé par le droit d'auteur et appartient à {siteName} ou à ses concédants, sauf mention contraire.",
          "Toute reproduction, représentation, modification ou exploitation sans autorisation écrite préalable est interdite.",
        ],
      },
      {
        id: "liability",
        title: "Responsabilité",
        paragraphs: [
          "{siteName} s'efforce de maintenir les informations de ce site exactes et à jour. Toutefois, nous ne pouvons garantir l'absence d'erreurs ni une disponibilité ininterrompue.",
          "L'atelier ne peut être tenu responsable des dommages directs ou indirects résultant de l'accès ou de l'utilisation du site, sauf lorsque une telle responsabilité ne peut être exclue en vertu du droit impératif.",
        ],
      },
      {
        id: "links",
        title: "Liens externes",
        paragraphs: [
          "Ce site peut contenir des liens vers des sites tiers. Nous ne sommes pas responsables du contenu ni des pratiques de confidentialité de ces sites externes.",
        ],
      },
      {
        id: "law",
        title: "Droit applicable",
        paragraphs: [
          "Les présentes mentions légales et l'utilisation du site sont régies par le droit belge, sous réserve des protections impératives dont bénéficient les consommateurs dans leur pays de résidence le cas échéant.",
        ],
      },
      {
        id: "privacy",
        title: "Données personnelles",
        paragraphs: [
          "Pour savoir comment nous traitons les données personnelles, consultez notre Politique de confidentialité. Pour les cookies, consultez notre Politique de cookies.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        paragraphs: [
          "Pour toute demande juridique concernant ce site, contactez {contactEmail}.",
        ],
      },
    ],
  },
};
