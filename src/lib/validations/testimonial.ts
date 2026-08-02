import { z } from "zod";

export const testimonialFormSchema = z.object({
  title: z.string().min(2),
  body: z.string().min(10),
  author_name: z.string().min(2),
  author_image_url: z
    .string()
    .optional()
    .refine((value) => !value || value.startsWith("http"), "Enter a valid image URL."),
  rating: z.coerce.number().int().min(1).max(5),
  sort_order: z.coerce.number().int().min(0),
  is_verified: z.coerce.boolean().optional(),
  is_published: z.coerce.boolean().optional(),
});
