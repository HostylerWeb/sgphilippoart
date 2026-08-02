import type { LegalPageContent } from "@/i18n/legal/types";

export const cookies: Record<"en" | "fr", LegalPageContent> = {
  en: {
    eyebrow: "Legal",
    title: "Cookie policy",
    description: "How {siteName} uses cookies and similar technologies on this website.",
    lastUpdated: "Last updated: 29 July 2026",
    sections: [
      {
        id: "what",
        title: "What are cookies?",
        paragraphs: [
          "Cookies are small text files stored on your device when you visit a website. They help the site remember your preferences, keep you signed in, and operate securely.",
          "This policy explains which cookies we use, why we use them, and how you can manage your choices.",
        ],
      },
      {
        id: "essential",
        title: "Essential cookies",
        paragraphs: [
          "These cookies are necessary for the website to function. They do not require marketing consent under EU ePrivacy rules because they are strictly required to provide the service you request.",
        ],
        table: {
          headers: ["Cookie", "Purpose", "Duration"],
          rows: [
            ["spa_locale", "Remembers your language preference (English or French)", "1 year"],
            ["spa_cart_session", "Keeps items in your shopping cart", "30 days"],
            ["spa_cookie_consent", "Stores your cookie banner choice", "1 year"],
            ["next-auth session cookies", "Maintains your account session when signed in", "Session / rolling"],
          ],
        },
      },
      {
        id: "non-essential",
        title: "Non-essential cookies",
        paragraphs: [
          "We do not currently use advertising or third-party tracking cookies.",
          "If analytics or marketing tools are added in future, we will update this policy and request your consent where required before activating non-essential cookies.",
        ],
      },
      {
        id: "banner",
        title: "Cookie consent banner",
        paragraphs: [
          "On your first visit, you may see a banner allowing you to accept all cookies or continue with essential cookies only. Your choice is stored in the spa_cookie_consent cookie so the banner is not shown again unnecessarily.",
        ],
      },
      {
        id: "manage",
        title: "Managing cookies",
        paragraphs: [
          "You can delete or block cookies through your browser settings at any time. Please note that blocking essential cookies may prevent parts of the website from working correctly — for example, your cart may not persist or you may be signed out.",
        ],
        list: [
          "Chrome: Settings → Privacy and security → Cookies",
          "Firefox: Settings → Privacy & Security → Cookies and Site Data",
          "Safari: Settings → Privacy → Manage Website Data",
          "Edge: Settings → Cookies and site permissions",
        ],
      },
      {
        id: "changes",
        title: "Updates",
        paragraphs: [
          "We may update this Cookie Policy when our website or legal requirements change. The date at the top of this page indicates the latest version.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        paragraphs: [
          "Questions about cookies can be sent to {contactEmail}. For broader data protection questions, see our Privacy Policy.",
        ],
      },
    ],
  },
  fr: {
    eyebrow: "Mentions légales",
    title: "Politique de cookies",
    description:
      "Comment {siteName} utilise les cookies et technologies similaires sur ce site.",
    lastUpdated: "Dernière mise à jour : 29 juillet 2026",
    sections: [
      {
        id: "what",
        title: "Que sont les cookies ?",
        paragraphs: [
          "Les cookies sont de petits fichiers texte enregistrés sur votre appareil lorsque vous visitez un site. Ils aident le site à mémoriser vos préférences, à vous maintenir connecté et à fonctionner de manière sécurisée.",
          "Cette politique explique quels cookies nous utilisons, pourquoi nous les utilisons et comment gérer vos choix.",
        ],
      },
      {
        id: "essential",
        title: "Cookies essentiels",
        paragraphs: [
          "Ces cookies sont nécessaires au fonctionnement du site. Ils ne requièrent pas de consentement marketing au sens de la réglementation européenne sur la vie privée électronique, car ils sont strictement nécessaires au service demandé.",
        ],
        table: {
          headers: ["Cookie", "Finalité", "Durée"],
          rows: [
            ["spa_locale", "Mémorise votre préférence de langue (anglais ou français)", "1 an"],
            ["spa_cart_session", "Conserve les articles de votre panier", "30 jours"],
            ["spa_cookie_consent", "Enregistre votre choix sur la bannière cookies", "1 an"],
            ["Cookies de session next-auth", "Maintient votre session de compte lorsque vous êtes connecté", "Session / renouvelable"],
          ],
        },
      },
      {
        id: "non-essential",
        title: "Cookies non essentiels",
        paragraphs: [
          "Nous n'utilisons actuellement pas de cookies publicitaires ni de cookies de suivi tiers.",
          "Si des outils d'analyse ou de marketing sont ajoutés à l'avenir, nous mettrons à jour cette politique et demanderons votre consentement lorsque requis avant d'activer des cookies non essentiels.",
        ],
      },
      {
        id: "banner",
        title: "Bannière de consentement",
        paragraphs: [
          "Lors de votre première visite, une bannière peut vous permettre d'accepter tous les cookies ou de continuer avec les cookies essentiels uniquement. Votre choix est enregistré dans le cookie spa_cookie_consent afin de ne pas afficher inutilement la bannière.",
        ],
      },
      {
        id: "manage",
        title: "Gérer les cookies",
        paragraphs: [
          "Vous pouvez supprimer ou bloquer les cookies via les paramètres de votre navigateur à tout moment. Le blocage des cookies essentiels peut empêcher certaines fonctions du site de fonctionner correctement — par exemple, votre panier peut ne pas être conservé ou vous pouvez être déconnecté.",
        ],
        list: [
          "Chrome : Paramètres → Confidentialité et sécurité → Cookies",
          "Firefox : Paramètres → Vie privée et sécurité → Cookies et données de sites",
          "Safari : Réglages → Confidentialité → Gérer les données de sites web",
          "Edge : Paramètres → Cookies et autorisations de site",
        ],
      },
      {
        id: "changes",
        title: "Mises à jour",
        paragraphs: [
          "Nous pouvons mettre à jour cette Politique de cookies lorsque le site ou les exigences légales évoluent. La date en haut de cette page indique la version la plus récente.",
        ],
      },
      {
        id: "contact",
        title: "Contact",
        paragraphs: [
          "Les questions relatives aux cookies peuvent être envoyées à {contactEmail}. Pour les questions plus générales sur la protection des données, consultez notre Politique de confidentialité.",
        ],
      },
    ],
  },
};
