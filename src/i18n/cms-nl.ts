/** Dutch CMS copy keyed for runtime lookup when DB has no translations.nl yet. */

export type CmsNlFields = Partial<Record<"name" | "description" | "title" | "body" | "eyebrow" | "link_text" | "image_alt", string>>;

const CATEGORY_NL: Record<string, CmsNlFields> = {
  "the-artist": {
    name: "SGphilippo",
    description:
      "Sommige gezichten vertellen een verhaal.\nAnderen lijken de herinnering eraan te dragen.\n\nIk heb altijd geloofd dat een gezicht een verhaal kan verbergen, lang voordat er een woord wordt uitgesproken.\n\nMisschien is dat waarom ik vrouwen schilder.\n\nIk ben een autodidact, maar mijn schilderijen zijn niet geboren uit lessen of regels.\nZe zijn geboren uit vragen — over vrouwen, geschiedenis, vergeten beschavingen, symbolen, herinnering en die onzichtbare verhalen die blijven wanneer de tijd de namen heeft uitgewist.\n\nMijn schilderijen proberen niet alles te verklaren.\n\nWelkom in mijn wereld. 🤍",
  },
  "what-remains-of-the-gods": {
    name: "Wat overblijft van de goden",
    description:
      "15 fragmenten van een vergeten wereld. Vrouwelijke figuren en voorouderlijke bewakers waken stil over de doeken en dragen de geheime symbolen van beschavingen.\nWat u ziet is slechts de oppervlakte; het ware, intieme en mysterieuze verhaal wacht aan de andere kant.\nKeer het doek om om de legende te laten ontwaken.",
  },
  "beyond-the-surface": {
    name: "Voorbij de oppervlakte",
    description:
      "Een gecureerde kunstcollectie over de verborgen complexiteit van de menselijke natuur, dualiteit en wat onder de uiterlijke schijn ligt. Expressieve portretten waarin lagen, maskers en schaduwen het ware innerlijke zelf tonen.",
  },
  portraits: {
    name: "Portretten",
    description:
      "Ontdek onze collectie handgemaakte portretten op maat en doekkunst gemaakt van uw favoriete foto's.",
  },
  "silent-burn": {
    name: "Stille brand",
    description:
      "Een collectie schilderijen over het diepe contrast tussen koude schaduwen en innerlijke vurige warmte.",
  },
  "works-that-found-their-collector": {
    name: "Werken die hun verzamelaar vonden",
    description:
      "Een collectie werken die hun plaats hebben gevonden bij verzamelaars. Elk schilderij draagt zijn eigen verhaal, herinnering en symboliek — en zet zijn reis voort buiten mijn atelier.",
  },
  "sold-painted-tshirts": {
    name: "Galerie van verkochte handgeschilderde T-shirts",
    description:
      "Een galerie van unieke, met de hand geschilderde T-shirts die hun plek bij verzamelaars hebben gevonden.",
  },
};

const TRUST_NL: Record<string, CmsNlFields> = {
  shield: {
    title: "Met de hand geschilderde originelen",
    body: "Elk werk wordt in acryl geschilderd door Sgphilippoart, zonder reproducties.",
  },
  truck: {
    title: "Veilige EU- en internationale verzending",
    body: "Verzekerde, traceerbare levering bij elke bestelling.",
  },
  return: {
    title: "Garantie op originele kunst",
    body: "Zorgvuldig verpakt en gecontroleerd. Neem contact op als er problemen zijn bij levering.",
  },
  star: {
    title: "Echtheidscertificaat",
    body: "Ondertekend en genummerd bij elk origineel.",
  },
};

const HERO_NL: Record<string, CmsNlFields> = {
  cmsbpcwau000a9xl1sifjxzvf: {
    eyebrow: "Souhad Ghinwi",
    title: "artiest",
    link_text: "SGphilippoart",
    image_alt: "Souhad Ghinwi",
  },
  cmsbpcwau00099xl12462u29b: {
    eyebrow: "Portretten op maat",
    title: "Maak van uw foto een kunstwerk",
    link_text: "Bestel uw portret",
    image_alt: "Op maat geschilderd portret op doek",
  },
  cmsbpcwau00089xl14je1c5ky: {
    eyebrow: "Nieuwe serie",
    title: "Strijdsters",
    link_text: "Bekijk de collectie",
    image_alt: "Strijdster met helm, schild en speer",
  },
  cmsbpcwau000b9xl1ztu47hx3: {
    eyebrow: "Galerie",
    title: "Verkochte handgeschilderde T-shirts",
    link_text: "Bekijk de galerie",
    image_alt: "Handgeschilderde T-shirts uit de galerie",
  },
};

const TESTIMONIAL_NL: Record<string, CmsNlFields> = {
  cmsbpcwdv000w9xl1s8zm3dfn: {
    title: "Nog mooier in het echt",
    body: "Het schilderij kwam nog mooier aan dan op de foto's. De verpakking was uitstekend en de verzending snel.",
  },
  cmsbpcwdv000x9xl11y4ckcmk: {
    title: "Precies zoals beschreven",
    body: "De communicatie met het atelier was geweldig. De kleuren zijn rijker in het echt dan online.",
  },
  cmsbpcwdv000y9xl1w0n1nd3y: {
    title: "Mijn tweede aankoop",
    body: "Dit is mijn tweede schilderij uit deze collectie en ik ben er net zo dol op als op het eerste. Snel en eenvoudig afrekenen.",
  },
  cmsbpcwdv000z9xl1r6slcre7: {
    title: "Mooi en betekenisvol",
    body: 'Ik kocht "Sophia" als cadeau — de printkwaliteit is uitstekend en het arriveerde ruim binnen de geschatte termijn.',
  },
};

const CMS_NL_BY_SCOPE: Record<string, CmsNlFields> = {
  ...Object.fromEntries(
    Object.entries(CATEGORY_NL).map(([slug, fields]) => [`category:${slug}`, fields]),
  ),
  ...Object.fromEntries(
    Object.entries(TRUST_NL).map(([icon, fields]) => [`trust:${icon}`, fields]),
  ),
  ...Object.fromEntries(
    Object.entries(HERO_NL).map(([id, fields]) => [`hero:${id}`, fields]),
  ),
  ...Object.fromEntries(
    Object.entries(TESTIMONIAL_NL).map(([id, fields]) => [`testimonial:${id}`, fields]),
  ),
};

export function getCmsNlField(
  scope: string,
  field: string,
): string | undefined {
  const pack = CMS_NL_BY_SCOPE[scope];
  const value = pack?.[field as keyof CmsNlFields];
  return value?.trim() ? value : undefined;
}

/** For DB backfill scripts — merge into Prisma `translations` JSON. */
export function buildNlTranslationsForCategory(slug: string): Record<string, string> | undefined {
  const fields = CATEGORY_NL[slug];
  if (!fields) return undefined;
  const out: Record<string, string> = {};
  if (fields.name) out.name = fields.name;
  if (fields.description) out.description = fields.description;
  return Object.keys(out).length ? out : undefined;
}

export function buildNlTranslationsForTrust(icon: string): Record<string, string> | undefined {
  const fields = TRUST_NL[icon];
  if (!fields?.title || !fields?.body) return undefined;
  return { title: fields.title, body: fields.body };
}

export function buildNlTranslationsForHero(id: string): Record<string, string> | undefined {
  const fields = HERO_NL[id];
  if (!fields) return undefined;
  const out: Record<string, string> = {};
  for (const key of ["eyebrow", "title", "link_text", "image_alt"] as const) {
    if (fields[key]) out[key] = fields[key]!;
  }
  return Object.keys(out).length ? out : undefined;
}

export function buildNlTranslationsForTestimonial(id: string): Record<string, string> | undefined {
  const fields = TESTIMONIAL_NL[id];
  if (!fields?.title || !fields?.body) return undefined;
  return { title: fields.title, body: fields.body };
}
