import type { LocalizedLegalPage } from "@/i18n/legal/types";

export const returns: LocalizedLegalPage = {
  en: {
    eyebrow: "Support",
    title: "Returns & exchanges",
    description: "{returnsSummary}. Full details on eligibility, timelines, and how to request a return.",
    lastUpdated: "Last updated: 29 July 2026",
    sections: [
      {
        id: "overview",
        title: "Overview",
        paragraphs: [
          "We want you to be delighted with your purchase. Because many of our works are original or limited edition, our returns policy differs by product type. Please read the sections below carefully.",
        ],
      },
      {
        id: "originals",
        title: "Original artworks",
        paragraphs: [
          "Due to the unique nature of original paintings, all sales of original works are final once the order is confirmed and dispatched, except where the piece arrives damaged or materially not as described.",
          "If your original arrives damaged, contact us at {contactEmail} within 48 hours of delivery with clear photographs of the outer packaging, inner packaging, and the artwork. We will assess the situation and propose an appropriate remedy, which may include repair, partial refund, or return where feasible.",
          "Change-of-mind returns are not accepted for original artworks.",
        ],
      },
      {
        id: "prints",
        title: "Limited-edition prints",
        paragraphs: [
          "If a print arrives damaged, defective, or incorrect, we will replace it at no additional cost or offer a refund once the issue is verified.",
          "Prints must be returned in their original packaging where possible. Contact {contactEmail} with your order number, a description of the issue, and photographs.",
        ],
      },
      {
        id: "window",
        title: "Return window",
        paragraphs: [
          "Eligible return requests must be submitted within {returnsDays} days of delivery unless a shorter period applies for damage notifications on originals (48 hours as stated above).",
          "Items must be returned in the same condition in which they were received, excluding damage caused in transit.",
        ],
      },
      {
        id: "process",
        title: "How to request a return",
        paragraphs: [
          "To start a return or report a problem:",
        ],
        list: [
          "Email {contactEmail} with your order number and the email address used at checkout.",
          "Describe the issue and attach photographs where relevant.",
          "Wait for written approval and return instructions before shipping any item back to us.",
          "Unauthorized returns may not be accepted.",
        ],
      },
      {
        id: "refunds",
        title: "Refunds",
        paragraphs: [
          "Approved refunds are processed to the original payment method where possible. Because checkout currently operates as an inquiry-based flow, refunds are arranged manually by us and may take 5–10 business days to appear depending on your bank or payment provider.",
          "Original shipping costs are non-refundable unless the return is due to our error or a damaged delivery.",
        ],
      },
      {
        id: "exchanges",
        title: "Exchanges",
        paragraphs: [
          "We do not offer direct exchanges. If you wish to purchase a different work, please place a new order inquiry or contact us for assistance once any eligible return has been approved.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        paragraphs: [
          "For questions about returns, contact {contactEmail}.",
        ],
      },
    ],
  },
  fr: {
    eyebrow: "Assistance",
    title: "Retours et échanges",
    description:
      "{returnsSummary}. Détails complets sur l'éligibilité, les délais et la procédure de retour.",
    lastUpdated: "Dernière mise à jour : 29 juillet 2026",
    sections: [
      {
        id: "overview",
        title: "Aperçu",
        paragraphs: [
          "Nous souhaitons que vous soyez pleinement satisfait de votre achat. Comme nombre de nos œuvres sont originales ou en édition limitée, notre politique de retour varie selon le type de produit. Veuillez lire attentivement les sections ci-dessous.",
        ],
      },
      {
        id: "originals",
        title: "Œuvres originales",
        paragraphs: [
          "En raison de la nature unique des peintures originales, toutes les ventes d'originaux sont définitives une fois la commande confirmée et expédiée, sauf si l'œuvre arrive endommagée ou sensiblement différente de la description.",
          "Si votre original arrive endommagé, contactez-nous à {contactEmail} dans les 48 heures suivant la livraison avec des photos claires de l'emballage extérieur, de l'emballage intérieur et de l'œuvre. Nous évaluerons la situation et proposerons une solution appropriée : réparation, remboursement partiel ou retour lorsque possible.",
          "Les retours pour changement d'avis ne sont pas acceptés pour les œuvres originales.",
        ],
      },
      {
        id: "prints",
        title: "Estampes en édition limitée",
        paragraphs: [
          "Si une estampe arrive endommagée, défectueuse ou incorrecte, nous la remplacerons sans frais supplémentaires ou proposerons un remboursement une fois le problème vérifié.",
          "Les estampes doivent être retournées dans leur emballage d'origine lorsque possible. Contactez {contactEmail} avec votre numéro de commande, une description du problème et des photographies.",
        ],
      },
      {
        id: "window",
        title: "Délai de retour",
        paragraphs: [
          "Les demandes de retour éligibles doivent être soumises dans les {returnsDays} jours suivant la livraison, sauf délai plus court pour les signalements de dommages sur les originaux (48 heures comme indiqué ci-dessus).",
          "Les articles doivent être retournés dans le même état que celui dans lequel ils ont été reçus, hors dommages survenus pendant le transport.",
        ],
      },
      {
        id: "process",
        title: "Comment demander un retour",
        paragraphs: ["Pour initier un retour ou signaler un problème :"],
        list: [
          "Écrivez à {contactEmail} avec votre numéro de commande et l'adresse e-mail utilisée lors de la commande.",
          "Décrivez le problème et joignez des photographies le cas échéant.",
          "Attendez notre accord écrit et les instructions de retour avant de renvoyer un article.",
          "Les retours non autorisés peuvent être refusés.",
        ],
      },
      {
        id: "refunds",
        title: "Remboursements",
        paragraphs: [
          "Les remboursements approuvés sont traités vers le mode de paiement d'origine lorsque possible. Comme le passage en caisse fonctionne actuellement par demande de commande, les remboursements sont organisés manuellement par nous et peuvent prendre 5 à 10 jours ouvrables selon votre banque ou prestataire de paiement.",
          "Les frais de livraison initiaux ne sont pas remboursables, sauf en cas d'erreur de notre part ou de livraison endommagée.",
        ],
      },
      {
        id: "exchanges",
        title: "Échanges",
        paragraphs: [
          "Nous n'offrons pas d'échanges directs. Si vous souhaitez acquérir une autre œuvre, veuillez envoyer une nouvelle demande de commande ou nous contacter une fois tout retour éligible approuvé.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        paragraphs: [
          "Pour toute question sur les retours, contactez {contactEmail}.",
        ],
      },
    ],
  },
  nl: {
    eyebrow: "Ondersteuning",
    title: "Retour en omruiling",
    description:
      "{returnsSummary}. Volledige details over geschiktheid, termijnen en hoe u een retour aanvraagt.",
    lastUpdated: "Laatst bijgewerkt: 29 juli 2026",
    sections: [
      {
        id: "overview",
        title: "Overzicht",
        paragraphs: [
          "We willen dat u tevreden bent met uw aankoop. Omdat veel van onze werken origineel of in limited edition zijn, verschilt ons retourbeleid per producttype. Lees de onderstaande secties zorgvuldig.",
        ],
      },
      {
        id: "originals",
        title: "Originele kunstwerken",
        paragraphs: [
          "Vanwege de unieke aard van originele schilderijen zijn alle verkopen van originelen definitief zodra de bestelling is bevestigd en verzonden, behalve wanneer het werk beschadigd aankomt of wezenlijk afwijkt van de beschrijving.",
          "Als uw origineel beschadigd aankomt, neem binnen 48 uur na levering contact op via {contactEmail} met duidelijke foto's van de buitenverpakking, binnenverpakking en het kunstwerk. We beoordelen de situatie en stellen een passende oplossing voor, waaronder reparatie, gedeeltelijke terugbetaling of retour indien mogelijk.",
          "Retour omwille van spijtopties wordt niet geaccepteerd voor originele kunstwerken.",
        ],
      },
      {
        id: "prints",
        title: "Limited-edition prints",
        paragraphs: [
          "Als een print beschadigd, defect of incorrect aankomt, vervangen we deze kosteloos of bieden we terugbetaling zodra het probleem is geverifieerd.",
          "Prints moeten waar mogelijk in de originele verpakking worden geretourneerd. Neem contact op via {contactEmail} met uw bestelnummer, een beschrijving van het probleem en foto's.",
        ],
      },
      {
        id: "window",
        title: "Retourtermijn",
        paragraphs: [
          "In aanmerking komende retourverzoeken moeten binnen {returnsDays} dagen na levering worden ingediend, tenzij een kortere termijn geldt voor schademeldingen bij originelen (48 uur zoals hierboven).",
          "Artikelen moeten in dezelfde staat worden geretourneerd als bij ontvangst, met uitzondering van schade tijdens transport.",
        ],
      },
      {
        id: "process",
        title: "Hoe u een retour aanvraagt",
        paragraphs: ["Om een retour te starten of een probleem te melden:"],
        list: [
          "Mail naar {contactEmail} met uw bestelnummer en het e-mailadres gebruikt bij afrekenen.",
          "Beschrijf het probleem en voeg waar relevant foto's toe.",
          "Wacht op schriftelijke goedkeuring en retourinstructies voordat u iets naar ons terugstuurt.",
          "Niet-geautoriseerde retouren worden mogelijk niet geaccepteerd.",
        ],
      },
      {
        id: "refunds",
        title: "Terugbetalingen",
        paragraphs: [
          "Goedgekeurde terugbetalingen worden waar mogelijk naar de oorspronkelijke betaalmethode verwerkt. Omdat afrekenen momenteel als aanvraagflow werkt, worden terugbetalingen handmatig door ons geregeld en kunnen 5–10 werkdagen duren afhankelijk van uw bank of betaalprovider.",
          "Oorspronkelijke verzendkosten worden niet terugbetaald, tenzij de retour te wijten is aan onze fout of een beschadigde levering.",
        ],
      },
      {
        id: "exchanges",
        title: "Omruilingen",
        paragraphs: [
          "We bieden geen directe omruilingen. Wilt u een ander werk aanschaffen, plaats dan een nieuw bestelverzoek of neem contact op met ons nadat een eventuele retour is goedgekeurd.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        paragraphs: [
          "Voor vragen over retour kunt u contact opnemen via {contactEmail}.",
        ],
      },
    ],
  },
};
