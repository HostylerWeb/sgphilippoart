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
