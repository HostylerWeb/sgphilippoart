import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z.string().min(2, "Slug is required").regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be greater than zero"),
  product_type: z.enum(["original", "print"]),
  status: z.enum(["draft", "published", "sold", "archived"]),
  medium: z.string().optional(),
  dimensions: z.string().optional(),
  edition_size: z.union([z.coerce.number().int().positive(), z.literal("")]).optional(),
  stock_quantity: z.union([z.coerce.number().int().min(0), z.literal("")]).optional(),
  category_id: z.string().optional(),
  is_featured: z.coerce.boolean().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
