import type { Locale } from "@/i18n/config";
import {
  commissionSchema as commissionSchemaForLocale,
  contactSchema as contactSchemaForLocale,
  loginSchema as loginSchemaForLocale,
  newsletterSchema as newsletterSchemaForLocale,
  passwordResetRequestSchema as passwordResetRequestSchemaForLocale,
  passwordResetSchema as passwordResetSchemaForLocale,
  registerSchema as registerSchemaForLocale,
} from "@/lib/validations/messages";

export const loginSchema = loginSchemaForLocale("en");
export const registerSchema = registerSchemaForLocale("en");
export const contactSchema = contactSchemaForLocale("en");
export const commissionSchema = commissionSchemaForLocale("en");
export const newsletterSchema = newsletterSchemaForLocale("en");
export const passwordResetRequestSchema = passwordResetRequestSchemaForLocale("en");
export const passwordResetSchema = passwordResetSchemaForLocale("en");

export function schemasForLocale(locale: Locale) {
  return {
    login: loginSchemaForLocale(locale),
    register: registerSchemaForLocale(locale),
    contact: contactSchemaForLocale(locale),
    commission: commissionSchemaForLocale(locale),
    newsletter: newsletterSchemaForLocale(locale),
    passwordResetRequest: passwordResetRequestSchemaForLocale(locale),
    passwordReset: passwordResetSchemaForLocale(locale),
  };
}
