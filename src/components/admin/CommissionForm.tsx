"use client";

import { useActionState } from "react";
import { updateCommissionAction } from "@/actions/admin/commissions";
import formStyles from "@/components/forms/Form.module.css";
import styles from "./CommissionForm.module.css";

const STATUSES = ["new", "in_review", "accepted", "declined", "completed"] as const;

type CommissionFormProps = {
  commissionId: string;
  currentStatus: string;
  adminNotes: string | null;
};

export function CommissionForm({
  commissionId,
  currentStatus,
  adminNotes,
}: CommissionFormProps) {
  const [state, formAction, pending] = useActionState(
    updateCommissionAction.bind(null, commissionId),
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <label>
        Status
        <select name="status" defaultValue={currentStatus}>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </label>
      <label>
        Admin notes (internal)
        <textarea
          name="admin_notes"
          rows={5}
          defaultValue={adminNotes ?? ""}
          placeholder="Follow-up notes, quotes, timeline…"
        />
      </label>
      <button type="submit" className={formStyles.submit} disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </button>
      {state.error && <p className={formStyles.error}>{state.error}</p>}
      {state.success && <p className={formStyles.success}>{state.success}</p>}
    </form>
  );
}
