import { z } from "zod";

export const categoryFormSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  sort_order: z.coerce.number().int().min(0),
  show_on_homepage: z.coerce.boolean().optional(),
  show_in_nav: z.coerce.boolean().optional(),
});

export const heroTileFormSchema = z.object({
  eyebrow: z.string().min(1),
  title: z.string().min(1),
  link_text: z.string().min(1),
  link_url: z.string().min(1),
  image_alt: z.string().optional(),
  sort_order: z.coerce.number().int().min(0),
  is_active: z.coerce.boolean().optional(),
});
