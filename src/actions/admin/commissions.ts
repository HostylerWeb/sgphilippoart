"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { z } from "zod";

const commissionStatusSchema = z.enum([
  "new",
  "in_review",
  "accepted",
  "declined",
  "completed",
]);

type ActionState = { error?: string; success?: string };

export async function updateCommissionAction(
  commissionId: string,
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireAdmin(`/admin/commissions/${commissionId}`);

  const statusParsed = commissionStatusSchema.safeParse(formData.get("status"));
  if (!statusParsed.success) {
    return { error: "Invalid commission status." };
  }

  const adminNotes = String(formData.get("admin_notes") ?? "").trim();

  await db.commission_inquiries.update({
    where: { id: commissionId },
    data: {
      status: statusParsed.data,
      admin_notes: adminNotes || null,
    },
  });

  revalidatePath(`/admin/commissions/${commissionId}`);
  revalidatePath("/admin/commissions");
  revalidatePath("/admin");
  return { success: "Commission inquiry updated." };
}
