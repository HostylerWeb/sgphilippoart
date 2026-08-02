import { z } from "zod";
import { SOCIAL_PLATFORMS } from "@/lib/social-links";

const socialFields = Object.fromEntries(
  SOCIAL_PLATFORMS.map((platform) => [platform.settingKey, z.string()]),
) as Record<(typeof SOCIAL_PLATFORMS)[number]["settingKey"], z.ZodString>;

export const settingsFormSchema = z.object({
  site_name: z.string().min(1),
  currency_code: z.string().min(3).max(3),
  currency_locale: z.string().min(2),
  locale_display: z.string().min(1),
  tax_enabled: z.enum(["true", "false"]),
  tax_rate: z.coerce.number().min(0).max(100),
  tax_label: z.string().min(1),
  tax_inclusive: z.enum(["true", "false"]),
  shipping_mode: z.enum(["free_worldwide", "flat_rate", "by_country"]),
  shipping_flat_rate: z.coerce.number().min(0),
  shipping_label: z.string().min(1),
  shipping_country_rates: z.string().optional(),
  free_shipping_threshold: z.coerce.number().min(0),
  handling_fee: z.coerce.number().min(0),
  handling_fee_label: z.string().min(1),
  min_order_amount: z.coerce.number().min(0),
  returns_days: z.coerce.number().int().min(0),
  returns_policy_summary: z.string().min(1),
  payment_mode: z.enum(["inquiry", "manual", "stripe"]),
  contact_email: z.string().email(),
  commission_enabled: z.enum(["true", "false"]),
  announcement_text: z.string().min(1),
  announcement_highlight: z.string().min(1),
  footer_description: z.string().min(1),
  concierge_eyebrow: z.string().min(1),
  concierge_title: z.string().min(1),
  concierge_body: z.string().min(1),
  concierge_cta: z.string().min(1),
  ...socialFields,
  announcement_text_fr: z.string().optional(),
  announcement_highlight_fr: z.string().optional(),
  footer_description_fr: z.string().optional(),
  concierge_eyebrow_fr: z.string().optional(),
  concierge_title_fr: z.string().optional(),
  concierge_body_fr: z.string().optional(),
  concierge_cta_fr: z.string().optional(),
  shipping_label_fr: z.string().optional(),
  returns_policy_summary_fr: z.string().optional(),
  tax_label_fr: z.string().optional(),
  handling_fee_label_fr: z.string().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export const SETTINGS_FIELDS: Array<{
  section: string;
  fields: Array<{
    key: keyof SettingsFormValues;
    label: string;
    type?: "text" | "email" | "number" | "textarea" | "select";
    options?: Array<{ value: string; label: string }>;
  }>;
}> = [
  {
    section: "General",
    fields: [
      { key: "site_name", label: "Site name" },
      { key: "contact_email", label: "Studio email (send + notifications)", type: "email" },
      { key: "commission_enabled", label: "Commissions enabled", type: "select", options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ]},
    ],
  },
  {
    section: "Currency",
    fields: [
      { key: "currency_code", label: "Currency code" },
      { key: "currency_locale", label: "Currency locale" },
      { key: "locale_display", label: "Footer locale display" },
    ],
  },
  {
    section: "Tax",
    fields: [
      { key: "tax_enabled", label: "Tax enabled", type: "select", options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ]},
      { key: "tax_rate", label: "Tax rate (%)", type: "number" },
      { key: "tax_label", label: "Tax label" },
      { key: "tax_inclusive", label: "Prices tax-inclusive", type: "select", options: [
        { value: "true", label: "Yes" },
        { value: "false", label: "No" },
      ]},
    ],
  },
  {
    section: "Shipping & fees",
    fields: [
      { key: "shipping_mode", label: "Shipping mode", type: "select", options: [
        { value: "free_worldwide", label: "Free worldwide" },
        { value: "flat_rate", label: "Flat rate (same for all countries)" },
        { value: "by_country", label: "Rate by country" },
      ]},
      { key: "shipping_flat_rate", label: "Flat shipping rate", type: "number" },
      { key: "shipping_label", label: "Shipping label" },
      { key: "free_shipping_threshold", label: "Free shipping threshold", type: "number" },
      { key: "handling_fee", label: "Handling fee", type: "number" },
      { key: "handling_fee_label", label: "Handling fee label" },
      { key: "min_order_amount", label: "Minimum order amount", type: "number" },
    ],
  },
  {
    section: "Returns",
    fields: [
      { key: "returns_days", label: "Return window (days)", type: "number" },
      { key: "returns_policy_summary", label: "Returns policy summary", type: "textarea" },
    ],
  },
  {
    section: "Payments",
    fields: [
      { key: "payment_mode", label: "Payment mode", type: "select", options: [
        { value: "inquiry", label: "Inquiry / manual checkout" },
        { value: "manual", label: "Manual" },
      ]},
    ],
  },
  {
    section: "Announcement bar",
    fields: [
      { key: "announcement_text", label: "Announcement text", type: "textarea" },
      { key: "announcement_highlight", label: "Gold highlight text" },
    ],
  },
  {
    section: "Homepage & footer",
    fields: [
      { key: "footer_description", label: "Footer description", type: "textarea" },
      { key: "concierge_eyebrow", label: "Concierge eyebrow" },
      { key: "concierge_title", label: "Concierge title", type: "textarea" },
      { key: "concierge_body", label: "Concierge body", type: "textarea" },
      { key: "concierge_cta", label: "Concierge CTA" },
    ],
  },
  {
    section: "Social",
    fields: SOCIAL_PLATFORMS.map((platform) => ({
      key: platform.settingKey as keyof SettingsFormValues,
      label: `${platform.label} URL (leave blank to hide)`,
    })),
  },
  {
    section: "French translations (storefront)",
    fields: [
      { key: "announcement_text_fr", label: "Announcement text (FR)", type: "textarea" },
      { key: "announcement_highlight_fr", label: "Announcement highlight (FR)" },
      { key: "footer_description_fr", label: "Footer description (FR)", type: "textarea" },
      { key: "concierge_eyebrow_fr", label: "Concierge eyebrow (FR)" },
      { key: "concierge_title_fr", label: "Concierge title (FR)", type: "textarea" },
      { key: "concierge_body_fr", label: "Concierge body (FR)", type: "textarea" },
      { key: "concierge_cta_fr", label: "Concierge CTA (FR)" },
      { key: "shipping_label_fr", label: "Shipping label (FR)" },
      { key: "returns_policy_summary_fr", label: "Returns policy summary (FR)", type: "textarea" },
      { key: "tax_label_fr", label: "Tax label (FR)" },
      { key: "handling_fee_label_fr", label: "Handling fee label (FR)" },
    ],
  },
];
