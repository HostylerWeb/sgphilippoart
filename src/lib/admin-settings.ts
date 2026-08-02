import { getSiteSettings } from "@/lib/queries";
import { SOCIAL_PLATFORMS } from "@/lib/social-links";
import type { SettingsFormValues } from "@/lib/validations/settings";
import { parseShippingCountryRates, serializeShippingCountryRates } from "@/lib/shipping";

const socialDefaults = Object.fromEntries(
  SOCIAL_PLATFORMS.map((platform) => [platform.settingKey, ""]),
) as Record<(typeof SOCIAL_PLATFORMS)[number]["settingKey"], string>;

const DEFAULTS: SettingsFormValues = {
  site_name: "SG Philippo Art",
  currency_code: "EUR",
  currency_locale: "fr-BE",
  locale_display: "Belgique · Luxembourg · France / EUR / cm",
  tax_enabled: "false",
  tax_rate: 0,
  tax_label: "Tax",
  tax_inclusive: "false",
  shipping_mode: "free_worldwide",
  shipping_flat_rate: 0,
  shipping_label: "Free worldwide shipping",
  shipping_country_rates: serializeShippingCountryRates({ defaultRate: 25, countries: [] }),
  free_shipping_threshold: 0,
  handling_fee: 0,
  handling_fee_label: "Handling",
  min_order_amount: 0,
  returns_days: 14,
  returns_policy_summary: "14-day free returns",
  payment_mode: "inquiry",
  contact_email: "contact@sgphilippoart.com",
  commission_enabled: "true",
  announcement_text:
    "Free worldwide shipping on original paintings · New: the Warrior Women series",
  announcement_highlight: "New: the Warrior Women series",
  footer_description:
    "Original oil paintings exploring beauty, myth, and the strength of women across history.",
  concierge_eyebrow: "Personal Guidance",
  concierge_title: "Not sure which piece is right for your space?",
  concierge_body:
    "Get complimentary one-on-one advice on choosing a piece that fits your taste, room, and budget.",
  concierge_cta: "Connect with the studio",
  ...socialDefaults,
  announcement_text_fr: "",
  announcement_highlight_fr: "",
  footer_description_fr: "",
  concierge_eyebrow_fr: "",
  concierge_title_fr: "",
  concierge_body_fr: "",
  concierge_cta_fr: "",
  shipping_label_fr: "",
  returns_policy_summary_fr: "",
  tax_label_fr: "",
  handling_fee_label_fr: "",
};

export async function getSettingsFormValues(): Promise<SettingsFormValues> {
  const raw = await getSiteSettings();

  return {
    ...DEFAULTS,
    ...Object.fromEntries(
      Object.entries(raw).map(([key, value]) => {
        if (
          key === "tax_rate" ||
          key === "shipping_flat_rate" ||
          key === "free_shipping_threshold" ||
          key === "handling_fee" ||
          key === "min_order_amount" ||
          key === "returns_days"
        ) {
          return [key, Number(value)];
        }
        return [key, value];
      }),
    ),
  } as SettingsFormValues;
}
