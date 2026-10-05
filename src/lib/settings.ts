import { getSiteSettings } from "@/lib/queries";
import type { Locale } from "@/i18n/config";
import { localizedSettingValue } from "@/lib/i18n/content";
import { parseShippingCountryRates, type ShippingCountryRates } from "@/lib/shipping";

export type StoreSettings = {
  siteName: string;
  currencyCode: string;
  currencyLocale: string;
  localeDisplay: string;
  taxEnabled: boolean;
  taxRate: number;
  taxLabel: string;
  taxInclusive: boolean;
  shippingMode: "free_worldwide" | "flat_rate" | "by_country";
  shippingFlatRate: number;
  shippingLabel: string;
  shippingCountryRates: ShippingCountryRates;
  freeShippingThreshold: number;
  handlingFee: number;
  handlingFeeLabel: string;
  minOrderAmount: number;
  returnsDays: number;
  returnsPolicySummary: string;
  paymentMode: "inquiry" | "manual" | "stripe" | "paypal";
  contactEmail: string;
  commissionEnabled: boolean;
  announcementText: string;
  announcementHighlight: string;
  footerDescription: string;
  conciergeEyebrow: string;
  conciergeTitle: string;
  conciergeBody: string;
  conciergeCta: string;
  socialInstagram: string;
  socialPinterest: string;
  socialTiktok: string;
  socialFacebook: string;
  socialYoutube: string;
  socialX: string;
  socialLinkedin: string;
  socialEtsy: string;
};

const DEFAULTS: StoreSettings = {
  siteName: "SG Philippo Art",
  currencyCode: "EUR",
  currencyLocale: "fr-BE",
  localeDisplay: "Belgique · Luxembourg · France / EUR / cm",
  taxEnabled: false,
  taxRate: 0,
  taxLabel: "Tax",
  taxInclusive: false,
  shippingMode: "free_worldwide",
  shippingFlatRate: 0,
  shippingLabel: "Free worldwide shipping",
  shippingCountryRates: { defaultRate: 25, countries: [] },
  freeShippingThreshold: 0,
  handlingFee: 0,
  handlingFeeLabel: "Handling",
  minOrderAmount: 0,
  returnsDays: 14,
  returnsPolicySummary: "14-day free returns",
  paymentMode: "inquiry",
  contactEmail: "contact@sgphilippoart.com",
  commissionEnabled: true,
  announcementText:
    "Free worldwide shipping on original paintings · New: the Warrior Women series",
  announcementHighlight: "New: the Warrior Women series",
  footerDescription:
    "Original oil paintings exploring beauty, myth, and the strength of women across history. Hand-painted, shipped worldwide.",
  conciergeEyebrow: "Personal Guidance",
  conciergeTitle: "Not sure which piece is right for your space?",
  conciergeBody:
    "Get complimentary one-on-one advice on choosing a piece that fits your taste, room, and budget — no pressure, just guidance.",
  conciergeCta: "Get in touch",
  socialInstagram: "",
  socialPinterest: "",
  socialTiktok: "",
  socialFacebook: "",
  socialYoutube: "",
  socialX: "",
  socialLinkedin: "",
  socialEtsy: "",
};

/** Storefront copy defaults when locale is Dutch (overridable via `*_nl` site settings). */
const NL_LOCALIZED_DEFAULTS: Pick<
  StoreSettings,
  | "localeDisplay"
  | "announcementText"
  | "announcementHighlight"
  | "footerDescription"
  | "conciergeEyebrow"
  | "conciergeTitle"
  | "conciergeBody"
  | "conciergeCta"
  | "shippingLabel"
  | "returnsPolicySummary"
  | "taxLabel"
  | "handlingFeeLabel"
> = {
  localeDisplay: "België · Luxemburg · Nederland / EUR / cm",
  announcementText:
    "Gratis wereldwijde verzending op originele schilderijen · Nieuw: de serie Warrior Women",
  announcementHighlight: "Nieuw: de serie Warrior Women",
  footerDescription:
    "Originele olieverfschilderijen over schoonheid, mythe en de kracht van vrouwen door de geschiedenis. Met de hand geschilderd, wereldwijd verzonden.",
  conciergeEyebrow: "Persoonlijk advies",
  conciergeTitle: "Weet u niet welk werk past bij uw ruimte?",
  conciergeBody:
    "Gratis persoonlijk advies bij het kiezen van een werk dat past bij uw smaak, interieur en budget — zonder druk, alleen begeleiding.",
  conciergeCta: "Neem contact op",
  shippingLabel: "Gratis wereldwijde verzending",
  returnsPolicySummary: "14 dagen gratis retour",
  taxLabel: "Belasting",
  handlingFeeLabel: "Behandeling",
};

function applyLocaleSettings(
  base: StoreSettings,
  raw: Record<string, string | undefined>,
  locale: Locale,
  defaults: typeof NL_LOCALIZED_DEFAULTS,
): StoreSettings {
  return {
    ...base,
    localeDisplay: localizedSettingValue(raw, "locale_display", locale, defaults.localeDisplay),
    announcementText: localizedSettingValue(
      raw,
      "announcement_text",
      locale,
      defaults.announcementText,
    ),
    announcementHighlight: localizedSettingValue(
      raw,
      "announcement_highlight",
      locale,
      defaults.announcementHighlight,
    ),
    footerDescription: localizedSettingValue(
      raw,
      "footer_description",
      locale,
      defaults.footerDescription,
    ),
    conciergeEyebrow: localizedSettingValue(
      raw,
      "concierge_eyebrow",
      locale,
      defaults.conciergeEyebrow,
    ),
    conciergeTitle: localizedSettingValue(raw, "concierge_title", locale, defaults.conciergeTitle),
    conciergeBody: localizedSettingValue(raw, "concierge_body", locale, defaults.conciergeBody),
    conciergeCta: localizedSettingValue(raw, "concierge_cta", locale, defaults.conciergeCta),
    shippingLabel: localizedSettingValue(raw, "shipping_label", locale, defaults.shippingLabel),
    returnsPolicySummary: localizedSettingValue(
      raw,
      "returns_policy_summary",
      locale,
      defaults.returnsPolicySummary,
    ),
    taxLabel: localizedSettingValue(raw, "tax_label", locale, defaults.taxLabel),
    handlingFeeLabel: localizedSettingValue(
      raw,
      "handling_fee_label",
      locale,
      defaults.handlingFeeLabel,
    ),
  };
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
}

function parseNumber(value: string | undefined, fallback: number): number {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export async function getStoreSettings(locale: Locale = "en"): Promise<StoreSettings> {
  const raw = await getSiteSettings();

  const base: StoreSettings = {
    siteName: raw.site_name ?? DEFAULTS.siteName,
    currencyCode: raw.currency_code ?? DEFAULTS.currencyCode,
    currencyLocale: raw.currency_locale ?? DEFAULTS.currencyLocale,
    localeDisplay: raw.locale_display ?? DEFAULTS.localeDisplay,
    taxEnabled: parseBoolean(raw.tax_enabled, DEFAULTS.taxEnabled),
    taxRate: parseNumber(raw.tax_rate, DEFAULTS.taxRate),
    taxLabel: raw.tax_label ?? DEFAULTS.taxLabel,
    taxInclusive: parseBoolean(raw.tax_inclusive, DEFAULTS.taxInclusive),
    shippingMode:
      raw.shipping_mode === "calculated"
        ? "by_country"
        : ((raw.shipping_mode as StoreSettings["shippingMode"]) ?? DEFAULTS.shippingMode),
    shippingFlatRate: parseNumber(raw.shipping_flat_rate, DEFAULTS.shippingFlatRate),
    shippingLabel: raw.shipping_label ?? DEFAULTS.shippingLabel,
    shippingCountryRates: parseShippingCountryRates(raw.shipping_country_rates),
    freeShippingThreshold: parseNumber(
      raw.free_shipping_threshold,
      DEFAULTS.freeShippingThreshold,
    ),
    handlingFee: parseNumber(raw.handling_fee, DEFAULTS.handlingFee),
    handlingFeeLabel: raw.handling_fee_label ?? DEFAULTS.handlingFeeLabel,
    minOrderAmount: parseNumber(raw.min_order_amount, DEFAULTS.minOrderAmount),
    returnsDays: parseNumber(raw.returns_days, DEFAULTS.returnsDays),
    returnsPolicySummary: raw.returns_policy_summary ?? DEFAULTS.returnsPolicySummary,
    paymentMode:
      (raw.payment_mode as StoreSettings["paymentMode"]) ?? DEFAULTS.paymentMode,
    contactEmail: raw.contact_email ?? DEFAULTS.contactEmail,
    commissionEnabled: parseBoolean(raw.commission_enabled, DEFAULTS.commissionEnabled),
    announcementText: raw.announcement_text ?? DEFAULTS.announcementText,
    announcementHighlight: raw.announcement_highlight ?? DEFAULTS.announcementHighlight,
    footerDescription: raw.footer_description ?? DEFAULTS.footerDescription,
    conciergeEyebrow: raw.concierge_eyebrow ?? DEFAULTS.conciergeEyebrow,
    conciergeTitle: raw.concierge_title ?? DEFAULTS.conciergeTitle,
    conciergeBody: raw.concierge_body ?? DEFAULTS.conciergeBody,
    conciergeCta: raw.concierge_cta ?? DEFAULTS.conciergeCta,
    socialInstagram: raw.social_instagram ?? DEFAULTS.socialInstagram,
    socialPinterest: raw.social_pinterest ?? DEFAULTS.socialPinterest,
    socialTiktok: raw.social_tiktok ?? DEFAULTS.socialTiktok,
    socialFacebook: raw.social_facebook ?? DEFAULTS.socialFacebook,
    socialYoutube: raw.social_youtube ?? DEFAULTS.socialYoutube,
    socialX: raw.social_x ?? DEFAULTS.socialX,
    socialLinkedin: raw.social_linkedin ?? DEFAULTS.socialLinkedin,
    socialEtsy: raw.social_etsy ?? DEFAULTS.socialEtsy,
  };

  if (locale === "fr") {
    return applyLocaleSettings(base, raw, locale, {
      localeDisplay: base.localeDisplay,
      announcementText: base.announcementText,
      announcementHighlight: base.announcementHighlight,
      footerDescription: base.footerDescription,
      conciergeEyebrow: base.conciergeEyebrow,
      conciergeTitle: base.conciergeTitle,
      conciergeBody: base.conciergeBody,
      conciergeCta: base.conciergeCta,
      shippingLabel: base.shippingLabel,
      returnsPolicySummary: base.returnsPolicySummary,
      taxLabel: base.taxLabel,
      handlingFeeLabel: base.handlingFeeLabel,
    });
  }

  if (locale === "nl") {
    return applyLocaleSettings(base, raw, locale, NL_LOCALIZED_DEFAULTS);
  }

  return base;
}
