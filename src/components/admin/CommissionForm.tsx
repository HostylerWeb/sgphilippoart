"use client";

import { useActionState } from "react";
import { updateCommissionAction } from "@/actions/admin/commissions";
import { useI18n } from "@/components/layout/I18nProvider";
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
  const { dict } = useI18n();
  const f = dict.admin.forms.commission;
  const orderF = dict.admin.forms.order;
  const productF = dict.admin.forms.product;
  const saving = dict.admin.common.saving;
  const statusLabels = dict.status as Record<string, string>;

  const [state, formAction, pending] = useActionState(
    updateCommissionAction.bind(null, commissionId),
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <label>
        {f.status}
        <select name="status" defaultValue={currentStatus}>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status] ?? status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </label>
      <label>
        {orderF.adminNotes}
        <textarea
          name="admin_notes"
          rows={5}
          defaultValue={adminNotes ?? ""}
          placeholder={f.adminNotesPlaceholder}
        />
      </label>
      <button type="submit" className={formStyles.submit} disabled={pending}>
        {pending ? saving : productF.saveChanges}
      </button>
      {state.error && <p className={formStyles.error}>{state.error}</p>}
      {state.success && <p className={formStyles.success}>{state.success}</p>}
    </form>
  );
}
