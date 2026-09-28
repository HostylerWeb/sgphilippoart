import { z } from "zod";

export const aboutPageContentSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  p1: z.string().min(1),
  p2: z.string().min(1),
  h2: z.string().min(1),
  p3: z.string().min(1),
  processTitle: z.string().min(1),
  processP1: z.string().min(1),
  processP2: z.string().min(1),
  ctaEyebrow: z.string().min(1),
  ctaTitle: z.string().min(1),
  ctaBody: z.string().min(1),
  ctaCollections: z.string().min(1),
  ctaCommissions: z.string().min(1),
});

export type AboutPageContent = z.infer<typeof aboutPageContentSchema>;

export const aboutPageFormSchema = z.object({
  en: aboutPageContentSchema,
  fr: aboutPageContentSchema,
});

export type AboutPageFormValues = z.infer<typeof aboutPageFormSchema>;
