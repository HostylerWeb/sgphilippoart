import { z } from "zod";
import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { getCountryAddressFormat, isEuropeanCountryCode } from "@/lib/european-countries";

export function getValidationMessages(locale: Locale) {
  return getDictionary(locale).validation;
}

export function loginSchema(locale: Locale) {
  const v = getValidationMessages(locale);
  return z.object({
    email: z.string().email(v.email).transform((value) => value.toLowerCase().trim()),
    password: z.string().min(1, v.passwordRequired),
  });
}

export function registerSchema(locale: Locale) {
  const v = getValidationMessages(locale);
  return z
    .object({
      name: z.string().min(2, v.nameMin),
      email: z.string().email(v.email),
      password: z.string().min(8, v.passwordMin),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v.passwordMismatch,
      path: ["confirmPassword"],
    });
}

export function contactSchema(locale: Locale) {
  const v = getValidationMessages(locale);
  return z.object({
    name: z.string().min(2, v.nameRequired),
    email: z.string().email(v.email),
    subject: z.string().optional(),
    message: z.string().min(10, v.messageMin),
    artworkSlug: z.string().optional(),
  });
}

export function commissionSchema(locale: Locale) {
  const v = getValidationMessages(locale);
  return z.object({
    name: z.string().min(2, v.nameRequired),
    email: z.string().email(v.email),
    phone: z.string().optional(),
    budgetRange: z.string().optional(),
    description: z.string().min(20, v.commissionDescriptionMin),
    referenceUrl: z.string().url(v.urlInvalid).optional().or(z.literal("")),
  });
}

export function newsletterSchema(locale: Locale) {
  const v = getValidationMessages(locale);
  return z.object({
    email: z.string().email(v.email),
  });
}

export function passwordResetRequestSchema(locale: Locale) {
  const v = getValidationMessages(locale);
  return z.object({
    email: z.string().email(v.email),
  });
}

export function passwordResetSchema(locale: Locale) {
  const v = getValidationMessages(locale);
  return z
    .object({
      token: z.string().min(1),
      password: z.string().min(8, v.passwordMin),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: v.passwordMismatch,
      path: ["confirmPassword"],
    });
}

export function accountSettingsSchema(locale: Locale) {
  const v = getValidationMessages(locale);
  return z.object({
    name: z.string().min(1, v.nameRequired),
    phone: z.string().trim().min(6, v.phoneRequired),
    addressLine1: z.string().min(1, v.address1Required),
    addressLine2: z.string().optional(),
    city: z.string().min(1, v.cityRequired),
    state: z.string().optional(),
    postalCode: z.string().min(1, v.postalRequired),
    country: z.string().min(1, v.countryRequired),
  });
}

export function checkoutSchema(locale: Locale) {
  const v = getValidationMessages(locale);

  return z
    .object({
      customerName: z.string().trim().min(1, v.nameRequired),
      customerEmail: z.string().trim().email(v.email),
      customerPhone: z.string().trim().min(6, v.phoneRequired),
      addressLine1: z.string().trim().min(1, v.address1Required),
      addressLine2: z.string().optional(),
      city: z.string().trim().min(1, v.cityRequired),
      state: z.string().optional(),
      postalCode: z.string().trim().min(1, v.postalRequired),
      countryCode: z.string().trim().toUpperCase(),
      notes: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (!isEuropeanCountryCode(data.countryCode)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["countryCode"],
          message: v.invalidCountry,
        });
        return;
      }

      const format = getCountryAddressFormat(data.countryCode);

      if (format.state === "required" && !data.state?.trim()) {
        const stateLabel = format.labels?.state?.[locale] ?? format.labels?.state?.en ?? "State / region";
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["state"],
          message: v.stateRequired.replace("{label}", stateLabel),
        });
      }

      if (format.postalPattern && data.postalCode) {
        const pattern = new RegExp(format.postalPattern, "i");
        if (!pattern.test(data.postalCode.trim())) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["postalCode"],
            message: v.invalidPostal,
          });
        }
      }
    });
}
