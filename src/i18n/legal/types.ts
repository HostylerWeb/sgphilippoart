export type LegalTable = {
  headers: string[];
  rows: string[][];
};

export type LegalSection = {
  id?: string;
  title: string;
  paragraphs: string[];
  list?: string[];
  table?: LegalTable;
};

export type LegalPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  lastUpdated: string;
  sections: LegalSection[];
};

export type LegalPageSlug =
  | "privacy"
  | "terms"
  | "cookies"
  | "shipping"
  | "returns"
  | "legalNotice";

export type LegalPageVars = {
  siteName: string;
  contactEmail: string;
  returnsDays: number;
  returnsSummary: string;
  shippingLabel: string;
  currencyCode: string;
  handlingFeeLabel: string;
  handlingFeeAmount: string;
  localeDisplay: string;
  year: number;
};
