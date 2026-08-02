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
  paymentMode: "inquiry" | "manual" | "stripe";
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
  conciergeCta: "Connect with the studio",
  socialInstagram: "",
  socialPinterest: "",
  socialTiktok: "",
  socialFacebook: "",
  socialYoutube: "",
  socialX: "",
  socialLinkedin: "",
  socialEtsy: "",
};

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

  if (locale !== "fr") return base;

  return {
    ...base,
    announcementText: localizedSettingValue(raw, "announcement_text", locale, base.announcementText),
    announcementHighlight: localizedSettingValue(
      raw,
      "announcement_highlight",
      locale,
      base.announcementHighlight,
    ),
    footerDescription: localizedSettingValue(
      raw,
      "footer_description",
      locale,
      base.footerDescription,
    ),
    conciergeEyebrow: localizedSettingValue(
      raw,
      "concierge_eyebrow",
      locale,
      base.conciergeEyebrow,
    ),
    conciergeTitle: localizedSettingValue(raw, "concierge_title", locale, base.conciergeTitle),
    conciergeBody: localizedSettingValue(raw, "concierge_body", locale, base.conciergeBody),
    conciergeCta: localizedSettingValue(raw, "concierge_cta", locale, base.conciergeCta),
    shippingLabel: localizedSettingValue(raw, "shipping_label", locale, base.shippingLabel),
    returnsPolicySummary: localizedSettingValue(
      raw,
      "returns_policy_summary",
      locale,
      base.returnsPolicySummary,
    ),
    taxLabel: localizedSettingValue(raw, "tax_label", locale, base.taxLabel),
    handlingFeeLabel: localizedSettingValue(
      raw,
      "handling_fee_label",
      locale,
      base.handlingFeeLabel,
    ),
  };
}
