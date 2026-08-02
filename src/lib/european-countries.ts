export type LocaleKey = "en" | "fr";

export type LocalizedString = Record<LocaleKey, string>;

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
  { code: "AL", name: { en: "Albania", fr: "Albanie" }, address: HIDDEN_STATE },
  { code: "AD", name: { en: "Andorra", fr: "Andorre" }, address: HIDDEN_STATE },
  { code: "AT", name: { en: "Austria", fr: "Autriche" }, address: {
    state: "optional",
    labels: { state: { en: "Federal state", fr: "Land" } },
  }},
  { code: "BY", name: { en: "Belarus", fr: "Biélorussie" }, address: {
    state: "optional",
    labels: { state: { en: "Region", fr: "Région" } },
  }},
  { code: "BE", name: { en: "Belgium", fr: "Belgique" }, address: HIDDEN_STATE },
  { code: "BA", name: { en: "Bosnia and Herzegovina", fr: "Bosnie-Herzégovine" }, address: {
    state: "optional",
    labels: { state: { en: "Canton / entity", fr: "Canton / entité" } },
  }},
  { code: "BG", name: { en: "Bulgaria", fr: "Bulgarie" }, address: {
    state: "optional",
    labels: { state: { en: "Province", fr: "Province" } },
  }},
  { code: "HR", name: { en: "Croatia", fr: "Croatie" }, address: {
    state: "optional",
    labels: { state: { en: "County", fr: "Comté" } },
  }},
  { code: "CY", name: { en: "Cyprus", fr: "Chypre" }, address: HIDDEN_STATE },
  { code: "CZ", name: { en: "Czechia", fr: "Tchéquie" }, address: HIDDEN_STATE },
  { code: "DK", name: { en: "Denmark", fr: "Danemark" }, address: HIDDEN_STATE },
  { code: "EE", name: { en: "Estonia", fr: "Estonie" }, address: {
    state: "optional",
    labels: { state: { en: "County", fr: "Comté" } },
  }},
  { code: "FI", name: { en: "Finland", fr: "Finlande" }, address: HIDDEN_STATE },
  { code: "FR", name: { en: "France", fr: "France" }, address: HIDDEN_STATE },
  { code: "DE", name: { en: "Germany", fr: "Allemagne" }, address: {
    state: "optional",
    labels: { state: { en: "Federal state", fr: "Land" } },
    postalPlaceholder: { en: "10115", fr: "10115" },
  }},
  { code: "GR", name: { en: "Greece", fr: "Grèce" }, address: {
    state: "optional",
    labels: { postalCode: { en: "Postal code (TK)", fr: "Code postal (TK)" } },
  }},
  { code: "HU", name: { en: "Hungary", fr: "Hongrie" }, address: {
    state: "optional",
    labels: { state: { en: "County", fr: "Comté" } },
  }},
  { code: "IS", name: { en: "Iceland", fr: "Islande" }, address: HIDDEN_STATE },
  { code: "IE", name: { en: "Ireland", fr: "Irlande" }, address: {
    state: "required",
    labels: {
      state: { en: "County", fr: "Comté" },
      postalCode: { en: "Eircode", fr: "Eircode" },
      city: { en: "Town / city", fr: "Ville" },
    },
    postalPlaceholder: { en: "D02 X285", fr: "D02 X285" },
  }},
  { code: "IT", name: { en: "Italy", fr: "Italie" }, address: {
    state: "optional",
    labels: { state: { en: "Province", fr: "Province" } },
    postalPlaceholder: { en: "00118", fr: "00118" },
  }},
  { code: "XK", name: { en: "Kosovo", fr: "Kosovo" }, address: {
    state: "optional",
    labels: { state: { en: "Municipality", fr: "Municipalité" } },
  }},
  { code: "LV", name: { en: "Latvia", fr: "Lettonie" }, address: HIDDEN_STATE },
  { code: "LI", name: { en: "Liechtenstein", fr: "Liechtenstein" }, address: HIDDEN_STATE },
  { code: "LT", name: { en: "Lithuania", fr: "Lituanie" }, address: {
    state: "optional",
    labels: { state: { en: "County", fr: "Comté" } },
  }},
  { code: "LU", name: { en: "Luxembourg", fr: "Luxembourg" }, address: HIDDEN_STATE },
  { code: "MT", name: { en: "Malta", fr: "Malte" }, address: HIDDEN_STATE },
  { code: "MD", name: { en: "Moldova", fr: "Moldavie" }, address: {
    state: "optional",
    labels: { state: { en: "District", fr: "District" } },
  }},
  { code: "MC", name: { en: "Monaco", fr: "Monaco" }, address: HIDDEN_STATE },
  { code: "ME", name: { en: "Montenegro", fr: "Monténégro" }, address: HIDDEN_STATE },
  { code: "NL", name: { en: "Netherlands", fr: "Pays-Bas" }, address: {
    state: "hidden",
    labels: { postalCode: { en: "Postcode", fr: "Code postal" } },
    postalPlaceholder: { en: "1234 AB", fr: "1234 AB" },
    postalBeforeCity: true,
  }},
  { code: "MK", name: { en: "North Macedonia", fr: "Macédoine du Nord" }, address: {
    state: "optional",
    labels: { state: { en: "Municipality", fr: "Municipalité" } },
  }},
  { code: "NO", name: { en: "Norway", fr: "Norvège" }, address: HIDDEN_STATE },
  { code: "PL", name: { en: "Poland", fr: "Pologne" }, address: {
    state: "optional",
    labels: { state: { en: "Voivodeship", fr: "Voïvodie" } },
    postalPlaceholder: { en: "00-001", fr: "00-001" },
  }},
  { code: "PT", name: { en: "Portugal", fr: "Portugal" }, address: HIDDEN_STATE },
  { code: "RO", name: { en: "Romania", fr: "Roumanie" }, address: {
    state: "optional",
    labels: { state: { en: "County", fr: "Județ" } },
  }},
  { code: "SM", name: { en: "San Marino", fr: "Saint-Marin" }, address: HIDDEN_STATE },
  { code: "RS", name: { en: "Serbia", fr: "Serbie" }, address: {
    state: "optional",
    labels: { state: { en: "District", fr: "District" } },
  }},
  { code: "SK", name: { en: "Slovakia", fr: "Slovaquie" }, address: HIDDEN_STATE },
  { code: "SI", name: { en: "Slovenia", fr: "Slovénie" }, address: HIDDEN_STATE },
  { code: "ES", name: { en: "Spain", fr: "Espagne" }, address: {
    state: "optional",
    labels: { state: { en: "Province", fr: "Province" } },
    postalPlaceholder: { en: "28001", fr: "28001" },
  }},
  { code: "SE", name: { en: "Sweden", fr: "Suède" }, address: HIDDEN_STATE },
  { code: "CH", name: { en: "Switzerland", fr: "Suisse" }, address: {
    state: "optional",
    labels: { state: { en: "Canton", fr: "Canton" } },
    postalPlaceholder: { en: "8001", fr: "8001" },
  }},
  { code: "UA", name: { en: "Ukraine", fr: "Ukraine" }, address: {
    state: "optional",
    labels: { state: { en: "Oblast", fr: "Oblast" } },
  }},
  { code: "GB", name: { en: "United Kingdom", fr: "Royaume-Uni" }, address: {
    state: "optional",
    labels: {
      postalCode: { en: "Postcode", fr: "Code postal" },
      state: { en: "County (optional)", fr: "Comté (facultatif)" },
    },
    postalPlaceholder: { en: "SW1A 1AA", fr: "SW1A 1AA" },
  }},
  { code: "VA", name: { en: "Vatican City", fr: "Vatican" }, address: HIDDEN_STATE },
  { code: "GE", name: { en: "Georgia", fr: "Géorgie" }, address: HIDDEN_STATE },
  { code: "AM", name: { en: "Armenia", fr: "Arménie" }, address: {
    state: "optional",
    labels: { state: { en: "Province", fr: "Province" } },
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
  return country?.name[locale] ?? code;
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
      country.name.fr.toLowerCase() === normalized,
  );

  return byName?.code ?? "BE";
}

export function sortCountriesByLocale(locale: LocaleKey): EuropeanCountry[] {
  return [...COUNTRIES].sort((a, b) => a.name[locale].localeCompare(b.name[locale]));
}
