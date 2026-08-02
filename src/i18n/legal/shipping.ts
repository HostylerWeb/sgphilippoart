import type { LegalPageContent } from "@/i18n/legal/types";

export const shipping: Record<"en" | "fr", LegalPageContent> = {
  en: {
    eyebrow: "Support",
    title: "Shipping",
    description: "How we pack, ship, and deliver artworks worldwide. {shippingLabel}.",
    lastUpdated: "Last updated: 29 July 2026",
    sections: [
      {
        id: "overview",
        title: "Overview",
        paragraphs: [
          "Every artwork leaving the {siteName} studio is packed with care. We ship to collectors internationally, with a focus on Belgium, Luxembourg, France, and wider Europe.",
          "Shipping costs and options are confirmed by email after you submit a checkout inquiry. Prices shown on the website are displayed in {currencyCode}.",
        ],
      },
      {
        id: "packaging",
        title: "Packaging",
        paragraphs: [
          "Original paintings are protected with acid-free materials, corner guards, and reinforced outer packaging suited to the size of the work.",
          "Limited-edition prints are shipped flat between rigid boards or rolled in protective tubes for larger formats, depending on dimensions and destination.",
          "Each parcel is inspected before dispatch to ensure the artwork arrives in gallery-ready condition.",
        ],
      },
      {
        id: "dispatch",
        title: "Dispatch times",
        paragraphs: [
          "Orders are typically prepared and dispatched within 3–5 business days after payment is confirmed and the order is accepted by the studio.",
          "Commissioned works and made-to-order prints follow the timeline agreed in your commission confirmation.",
          "You will receive an email when your order ships, including tracking information when available.",
        ],
      },
      {
        id: "delivery",
        title: "Delivery times",
        paragraphs: [
          "Domestic and European deliveries usually arrive within 7–14 business days after dispatch, depending on carrier and destination.",
          "International deliveries outside Europe may take longer and are subject to local customs processing.",
          "Delivery times are estimates only and are not guaranteed. Events outside our control — including customs delays, weather, or carrier disruption — may affect arrival dates.",
        ],
      },
      {
        id: "handling",
        title: "Handling fees",
        paragraphs: [
          "A {handlingFeeLabel} of {handlingFeeAmount} may apply to certain orders, particularly for oversized originals or special packaging requirements. Any applicable fee will be confirmed before your order is finalised.",
        ],
      },
      {
        id: "customs",
        title: "Customs, duties, and taxes",
        paragraphs: [
          "International shipments may be subject to import duties, VAT, or customs fees charged by your country. These charges are generally the responsibility of the recipient unless otherwise agreed in writing.",
          "Customs processing can add time to delivery. We provide commercial invoices and required documentation to facilitate clearance.",
        ],
      },
      {
        id: "tracking",
        title: "Tracking your order",
        paragraphs: [
          "Once dispatched, you can track your order using the link provided in your shipping confirmation email or via our Track order page with your order number and email address.",
        ],
      },
      {
        id: "damage",
        title: "Damaged in transit",
        paragraphs: [
          "If your artwork arrives damaged, contact us at {contactEmail} within 48 hours of delivery with photographs of the packaging and the work. We will work with you on a repair, replacement, or refund as appropriate under our Returns policy.",
        ],
      },
      {
        id: "contact",
        title: "Questions",
        paragraphs: [
          "For shipping questions before or after purchase, contact the studio at {contactEmail}.",
        ],
      },
    ],
  },
  fr: {
    eyebrow: "Assistance",
    title: "Livraison",
    description:
      "Comment nous emballons, expédions et livrons les œuvres dans le monde entier. {shippingLabel}.",
    lastUpdated: "Dernière mise à jour : 29 juillet 2026",
    sections: [
      {
        id: "overview",
        title: "Aperçu",
        paragraphs: [
          "Chaque œuvre quittant l'atelier {siteName} est emballée avec soin. Nous expédions à des collectionneurs du monde entier, avec une attention particulière pour la Belgique, le Luxembourg, la France et l'Europe.",
          "Les frais et options de livraison sont confirmés par e-mail après votre demande de commande. Les prix affichés sur le site sont en {currencyCode}.",
        ],
      },
      {
        id: "packaging",
        title: "Emballage",
        paragraphs: [
          "Les peintures originales sont protégées avec des matériaux sans acide, des protections d'angle et un emballage extérieur renforcé adapté au format de l'œuvre.",
          "Les estampes en édition limitée sont expédiées à plat entre planches rigides ou en tube de protection pour les grands formats, selon les dimensions et la destination.",
          "Chaque colis est inspecté avant expédition afin que l'œuvre arrive en parfait état.",
        ],
      },
      {
        id: "dispatch",
        title: "Délais d'expédition",
        paragraphs: [
          "Les commandes sont généralement préparées et expédiées sous 3 à 5 jours ouvrables après confirmation du paiement et acceptation de la commande par l'atelier.",
          "Les œuvres sur commande et les estampes fabriquées à la demande suivent le calendrier convenu dans votre confirmation de commande sur mesure.",
          "Vous recevrez un e-mail lors de l'expédition, avec les informations de suivi lorsque disponibles.",
        ],
      },
      {
        id: "delivery",
        title: "Délais de livraison",
        paragraphs: [
          "Les livraisons nationales et européennes arrivent habituellement sous 7 à 14 jours ouvrables après expédition, selon le transporteur et la destination.",
          "Les livraisons internationales hors Europe peuvent prendre plus de temps et sont soumises au traitement douanier local.",
          "Les délais sont des estimations et ne sont pas garantis. Des événements indépendants de notre volonté — retards douaniers, conditions météo ou perturbations du transporteur — peuvent affecter la date d'arrivée.",
        ],
      },
      {
        id: "handling",
        title: "Frais de manutention",
        paragraphs: [
          "Des {handlingFeeLabel} de {handlingFeeAmount} peuvent s'appliquer à certaines commandes, notamment pour les originaux de grand format ou les emballages spéciaux. Tout frais applicable sera confirmé avant la finalisation de votre commande.",
        ],
      },
      {
        id: "customs",
        title: "Douanes, droits et taxes",
        paragraphs: [
          "Les envois internationaux peuvent être soumis à des droits d'importation, à la TVA ou à des frais de douane facturés par votre pays. Ces frais sont généralement à la charge du destinataire, sauf accord écrit contraire.",
          "Le traitement douanier peut prolonger la livraison. Nous fournissons les factures commerciales et documents requis pour faciliter le dédouanement.",
        ],
      },
      {
        id: "tracking",
        title: "Suivi de commande",
        paragraphs: [
          "Une fois expédiée, vous pouvez suivre votre commande via le lien fourni dans l'e-mail de confirmation d'expédition ou sur notre page Suivre votre commande avec votre numéro de commande et votre e-mail.",
        ],
      },
      {
        id: "damage",
        title: "Dommages pendant le transport",
        paragraphs: [
          "Si votre œuvre arrive endommagée, contactez-nous à {contactEmail} dans les 48 heures suivant la livraison avec des photos de l'emballage et de l'œuvre. Nous travaillerons avec vous sur une réparation, un remplacement ou un remboursement selon notre politique de Retours.",
        ],
      },
      {
        id: "contact",
        title: "Questions",
        paragraphs: [
          "Pour toute question sur la livraison avant ou après achat, contactez l'atelier à {contactEmail}.",
        ],
      },
    ],
  },
};
