import type { SettingsFormValues } from "@/lib/validations/settings";

export type SettingsSectionKey =
  | "general"
  | "currency"
  | "tax"
  | "shippingFees"
  | "returns"
  | "payments"
  | "announcement"
  | "homepageFooter"
  | "social"
  | "frenchStorefront";

type FieldConfig = {
  key: keyof SettingsFormValues;
  type?: "text" | "email" | "number" | "textarea" | "select";
  optionValues?: string[];
};

export const SETTINGS_FIELD_GROUPS: Array<{
  sectionKey: SettingsSectionKey;
  fields: FieldConfig[];
}> = [
  {
    sectionKey: "general",
    fields: [
      { key: "site_name" },
      { key: "contact_email", type: "email" },
      {
        key: "commission_enabled",
        type: "select",
        optionValues: ["true", "false"],
      },
    ],
  },
  {
    sectionKey: "currency",
    fields: [
      { key: "currency_code" },
      { key: "currency_locale" },
      { key: "locale_display" },
    ],
  },
  {
    sectionKey: "tax",
    fields: [
      { key: "tax_enabled", type: "select", optionValues: ["true", "false"] },
      { key: "tax_rate", type: "number" },
      { key: "tax_label" },
      { key: "tax_inclusive", type: "select", optionValues: ["true", "false"] },
    ],
  },
  {
    sectionKey: "shippingFees",
    fields: [
      {
        key: "shipping_mode",
        type: "select",
        optionValues: ["free_worldwide", "flat_rate", "by_country"],
      },
      { key: "shipping_flat_rate", type: "number" },
      { key: "shipping_label" },
      { key: "free_shipping_threshold", type: "number" },
      { key: "handling_fee", type: "number" },
      { key: "handling_fee_label" },
      { key: "min_order_amount", type: "number" },
    ],
  },
  {
    sectionKey: "returns",
    fields: [
      { key: "returns_days", type: "number" },
      { key: "returns_policy_summary", type: "textarea" },
    ],
  },
  {
    sectionKey: "payments",
    fields: [
      {
        key: "payment_mode",
        type: "select",
        optionValues: ["inquiry", "manual"],
      },
    ],
  },
  {
    sectionKey: "announcement",
    fields: [
      { key: "announcement_text", type: "textarea" },
      { key: "announcement_highlight" },
    ],
  },
  {
    sectionKey: "homepageFooter",
    fields: [
      { key: "footer_description", type: "textarea" },
      { key: "concierge_eyebrow" },
      { key: "concierge_title", type: "textarea" },
      { key: "concierge_body", type: "textarea" },
      { key: "concierge_cta" },
    ],
  },
  {
    sectionKey: "social",
    fields: [],
  },
  {
    sectionKey: "frenchStorefront",
    fields: [
      { key: "announcement_text_fr", type: "textarea" },
      { key: "announcement_highlight_fr" },
      { key: "footer_description_fr", type: "textarea" },
      { key: "concierge_eyebrow_fr" },
      { key: "concierge_title_fr", type: "textarea" },
      { key: "concierge_body_fr", type: "textarea" },
      { key: "concierge_cta_fr" },
      { key: "shipping_label_fr" },
      { key: "returns_policy_summary_fr", type: "textarea" },
      { key: "tax_label_fr" },
      { key: "handling_fee_label_fr" },
    ],
  },
];
