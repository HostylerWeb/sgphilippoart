import { z } from "zod";

export const trustItemFormSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
  icon: z.enum(["shield", "truck", "return", "star", "heart", "globe"]),
  sort_order: z.coerce.number().int().min(0),
  is_active: z.coerce.boolean().optional(),
});
