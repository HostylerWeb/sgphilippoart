import { z } from "zod";
import { accountSettingsSchema as accountSettingsSchemaForLocale } from "@/lib/validations/messages";

export const accountSettingsSchema = accountSettingsSchemaForLocale("en");
export type AccountSettingsValues = z.infer<typeof accountSettingsSchema>;

export { accountSettingsSchemaForLocale };
