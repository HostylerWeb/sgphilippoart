import type { Locale } from "@/i18n/config";

export type LocaleKey = Locale;

export type LocalizedString = {
  en: string;
  fr: string;
  nl?: string;
};

export function pickLocalized(value: LocalizedString, locale: LocaleKey): string {
  if (locale === "nl") return value.nl ?? value.en;
  return value[locale];
}

export type StateFieldMode = "hidden" | "optional" | "required";

export type AddressLabelKey = "address1" | "address2" | "city" | "state" | "postalCode";

export type CountryAddressFormat = {
  state: StateFieldMode;
  labels?: Partial<Record<AddressLabelKey, LocalizedString>>;
  postalPlaceholder?: LocalizedString;
  postalPattern?: string;
  postalBeforeCity?: boolean;
};

export type EuropeanCountry = {
  code: string;
  name: LocalizedString;
  address: CountryAddressFormat;
};

const HIDDEN_STATE: CountryAddressFormat = { state: "hidden" };

const COUNTRIES: EuropeanCountry[] = [
  { code: "AL", name: { en: "Albania", fr: "Albanie", nl: "Albanië" }, address: HIDDEN_STATE },
  { code: "AD", name: { en: "Andorra", fr: "Andorre", nl: "Andorra" }, address: HIDDEN_STATE },
  { code: "AT", name: { en: "Austria", fr: "Autriche", nl: "Oostenrijk" }, address: {
    state: "optional",
    labels: { state: { en: "Federal state", fr: "Land", nl: "Deelstaat" } },
  }},
  { code: "BY", name: { en: "Belarus", fr: "Biélorussie", nl: "Belarus" }, address: {
    state: "optional",
    labels: { state: { en: "Region", fr: "Région", nl: "Regio" } },
  }},
  { code: "BE", name: { en: "Belgium", fr: "Belgique", nl: "België" }, address: HIDDEN_STATE },
  { code: "BA", name: { en: "Bosnia and Herzegovina", fr: "Bosnie-Herzégovine", nl: "Bosnië en Herzegovina" }, address: {
    state: "optional",
    labels: { state: { en: "Canton / entity", fr: "Canton / entité", nl: "Kanton / entiteit" } },
  }},
  { code: "BG", name: { en: "Bulgaria", fr: "Bulgarie", nl: "Bulgarije" }, address: {
    state: "optional",
    labels: { state: { en: "Province", fr: "Province", nl: "Provincie" } },
  }},
  { code: "HR", name: { en: "Croatia", fr: "Croatie", nl: "Kroatië" }, address: {
    state: "optional",
    labels: { state: { en: "County", fr: "Comté", nl: "Provincie" } },
  }},
  { code: "CY", name: { en: "Cyprus", fr: "Chypre", nl: "Cyprus" }, address: HIDDEN_STATE },
  { code: "CZ", name: { en: "Czechia", fr: "Tchéquie", nl: "Tsjechië" }, address: HIDDEN_STATE },
  { code: "DK", name: { en: "Denmark", fr: "Danemark", nl: "Denemarken" }, address: HIDDEN_STATE },
  { code: "EE", name: { en: "Estonia", fr: "Estonie", nl: "Estland" }, address: {
    state: "optional",
    labels: { state: { en: "County", fr: "Comté", nl: "Provincie" } },
  }},
  { code: "FI", name: { en: "Finland", fr: "Finlande", nl: "Finland" }, address: HIDDEN_STATE },
  { code: "FR", name: { en: "France", fr: "France", nl: "Frankrijk" }, address: HIDDEN_STATE },
  { code: "DE", name: { en: "Germany", fr: "Allemagne", nl: "Duitsland" }, address: {
    state: "optional",
    labels: { state: { en: "Federal state", fr: "Land", nl: "Deelstaat" } },
    postalPlaceholder: { en: "10115", fr: "10115", nl: "10115" },
  }},
  { code: "GR", name: { en: "Greece", fr: "Grèce", nl: "Griekenland" }, address: {
    state: "optional",
    labels: { postalCode: { en: "Postal code (TK)", fr: "Code postal (TK)", nl: "Postcode (TK)" } },
  }},
  { code: "HU", name: { en: "Hungary", fr: "Hongrie", nl: "Hongarije" }, address: {
    state: "optional",
    labels: { state: { en: "County", fr: "Comté", nl: "Provincie" } },
  }},
  { code: "IS", name: { en: "Iceland", fr: "Islande", nl: "IJsland" }, address: HIDDEN_STATE },
  { code: "IE", name: { en: "Ireland", fr: "Irlande", nl: "Ierland" }, address: {
    state: "required",
    labels: {
      state: { en: "County", fr: "Comté", nl: "Provincie" },
      postalCode: { en: "Eircode", fr: "Eircode", nl: "Eircode" },
      city: { en: "Town / city", fr: "Ville", nl: "Plaats / stad" },
    },
    postalPlaceholder: { en: "D02 X285", fr: "D02 X285", nl: "D02 X285" },
  }},
  { code: "IT", name: { en: "Italy", fr: "Italie", nl: "Italië" }, address: {
    state: "optional",
    labels: { state: { en: "Province", fr: "Province", nl: "Provincie" } },
    postalPlaceholder: { en: "00118", fr: "00118", nl: "00118" },
  }},
  { code: "XK", name: { en: "Kosovo", fr: "Kosovo", nl: "Kosovo" }, address: {
    state: "optional",
    labels: { state: { en: "Municipality", fr: "Municipalité", nl: "Gemeente" } },
  }},
  { code: "LV", name: { en: "Latvia", fr: "Lettonie", nl: "Letland" }, address: HIDDEN_STATE },
  { code: "LI", name: { en: "Liechtenstein", fr: "Liechtenstein", nl: "Liechtenstein" }, address: HIDDEN_STATE },
  { code: "LT", name: { en: "Lithuania", fr: "Lituanie", nl: "Litouwen" }, address: {
    state: "optional",
    labels: { state: { en: "County", fr: "Comté", nl: "Provincie" } },
  }},
  { code: "LU", name: { en: "Luxembourg", fr: "Luxembourg", nl: "Luxemburg" }, address: HIDDEN_STATE },
  { code: "MT", name: { en: "Malta", fr: "Malte", nl: "Malta" }, address: HIDDEN_STATE },
  { code: "MD", name: { en: "Moldova", fr: "Moldavie", nl: "Moldavië" }, address: {
    state: "optional",
    labels: { state: { en: "District", fr: "District", nl: "District" } },
  }},
  { code: "MC", name: { en: "Monaco", fr: "Monaco", nl: "Monaco" }, address: HIDDEN_STATE },
  { code: "ME", name: { en: "Montenegro", fr: "Monténégro", nl: "Montenegro" }, address: HIDDEN_STATE },
  { code: "NL", name: { en: "Netherlands", fr: "Pays-Bas", nl: "Nederland" }, address: {
    state: "hidden",
    labels: { postalCode: { en: "Postcode", fr: "Code postal", nl: "Postcode" } },
    postalPlaceholder: { en: "1234 AB", fr: "1234 AB", nl: "1234 AB" },
    postalBeforeCity: true,
  }},
  { code: "MK", name: { en: "North Macedonia", fr: "Macédoine du Nord", nl: "Noord-Macedonië" }, address: {
    state: "optional",
    labels: { state: { en: "Municipality", fr: "Municipalité", nl: "Gemeente" } },
  }},
  { code: "NO", name: { en: "Norway", fr: "Norvège", nl: "Noorwegen" }, address: HIDDEN_STATE },
  { code: "PL", name: { en: "Poland", fr: "Pologne", nl: "Polen" }, address: {
    state: "optional",
    labels: { state: { en: "Voivodeship", fr: "Voïvodie", nl: "Woiwodschap" } },
    postalPlaceholder: { en: "00-001", fr: "00-001", nl: "00-001" },
  }},
  { code: "PT", name: { en: "Portugal", fr: "Portugal", nl: "Portugal" }, address: HIDDEN_STATE },
  { code: "RO", name: { en: "Romania", fr: "Roumanie", nl: "Roemenië" }, address: {
    state: "optional",
    labels: { state: { en: "County", fr: "Județ", nl: "Provincie" } },
  }},
  { code: "SM", name: { en: "San Marino", fr: "Saint-Marin", nl: "San Marino" }, address: HIDDEN_STATE },
  { code: "RS", name: { en: "Serbia", fr: "Serbie", nl: "Servië" }, address: {
    state: "optional",
    labels: { state: { en: "District", fr: "District", nl: "District" } },
  }},
  { code: "SK", name: { en: "Slovakia", fr: "Slovaquie", nl: "Slowakije" }, address: HIDDEN_STATE },
  { code: "SI", name: { en: "Slovenia", fr: "Slovénie", nl: "Slovenië" }, address: HIDDEN_STATE },
  { code: "ES", name: { en: "Spain", fr: "Espagne", nl: "Spanje" }, address: {
    state: "optional",
    labels: { state: { en: "Province", fr: "Province", nl: "Provincie" } },
    postalPlaceholder: { en: "28001", fr: "28001", nl: "28001" },
  }},
  { code: "SE", name: { en: "Sweden", fr: "Suède", nl: "Zweden" }, address: HIDDEN_STATE },
  { code: "CH", name: { en: "Switzerland", fr: "Suisse", nl: "Zwitserland" }, address: {
    state: "optional",
    labels: { state: { en: "Canton", fr: "Canton", nl: "Kanton" } },
    postalPlaceholder: { en: "8001", fr: "8001", nl: "8001" },
  }},
  { code: "UA", name: { en: "Ukraine", fr: "Ukraine", nl: "Oekraïne" }, address: {
    state: "optional",
    labels: { state: { en: "Oblast", fr: "Oblast", nl: "Oblast" } },
  }},
  { code: "GB", name: { en: "United Kingdom", fr: "Royaume-Uni", nl: "Verenigd Koninkrijk" }, address: {
    state: "optional",
    labels: {
      postalCode: { en: "Postcode", fr: "Code postal", nl: "Postcode" },
      state: { en: "County (optional)", fr: "Comté (facultatif)", nl: "Graafschap (optioneel)" },
    },
    postalPlaceholder: { en: "SW1A 1AA", fr: "SW1A 1AA", nl: "SW1A 1AA" },
  }},
  { code: "VA", name: { en: "Vatican City", fr: "Vatican", nl: "Vaticaanstad" }, address: HIDDEN_STATE },
  { code: "GE", name: { en: "Georgia", fr: "Géorgie", nl: "Georgië" }, address: HIDDEN_STATE },
  { code: "AM", name: { en: "Armenia", fr: "Arménie", nl: "Armenië" }, address: {
    state: "optional",
    labels: { state: { en: "Province", fr: "Province", nl: "Provincie" } },
  }},
];

const COUNTRY_BY_CODE = new Map(COUNTRIES.map((country) => [country.code, country]));

export const EUROPEAN_COUNTRIES = [...COUNTRIES].sort((a, b) =>
  a.name.en.localeCompare(b.name.en),
);

export function getCountryByCode(code: string): EuropeanCountry | undefined {
  return COUNTRY_BY_CODE.get(code.toUpperCase());
}

export function getCountryAddressFormat(code: string): CountryAddressFormat {
  return getCountryByCode(code)?.address ?? HIDDEN_STATE;
}

export function getCountryName(code: string, locale: LocaleKey): string {
  const country = getCountryByCode(code);
  return country ? pickLocalized(country.name, locale) : code;
}

export function isEuropeanCountryCode(code: string): boolean {
  return COUNTRY_BY_CODE.has(code.toUpperCase());
}

export function resolveCountryCode(value?: string | null): string {
  if (!value) return "BE";

  const trimmed = value.trim();
  if (!trimmed) return "BE";

  const byCode = getCountryByCode(trimmed);
  if (byCode) return byCode.code;

  const normalized = trimmed.toLowerCase();
  const byName = COUNTRIES.find(
    (country) =>
      country.name.en.toLowerCase() === normalized ||
      country.name.fr.toLowerCase() === normalized ||
      (country.name.nl?.toLowerCase() === normalized),
  );

  return byName?.code ?? "BE";
}

export function sortCountriesByLocale(locale: LocaleKey): EuropeanCountry[] {
  return [...COUNTRIES].sort((a, b) =>
    pickLocalized(a.name, locale).localeCompare(pickLocalized(b.name, locale)),
  );
}
