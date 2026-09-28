"use client";

import { useActionState } from "react";
import {
  resendOrderConfirmationAction,
  updateOrderDetailsAction,
} from "@/actions/admin/orders";
import { useI18n } from "@/components/layout/I18nProvider";
import formStyles from "@/components/forms/Form.module.css";
import styles from "./OrderDetailsForm.module.css";

type OrderDetailsFormProps = {
  orderId: string;
  trackingNumber: string | null;
  adminNotes: string | null;
};

export function OrderDetailsForm({
  orderId,
  trackingNumber,
  adminNotes,
}: OrderDetailsFormProps) {
  const { dict } = useI18n();
  const f = dict.admin.forms.order;
  const saving = dict.admin.common.saving;

  const [detailsState, detailsAction, detailsPending] = useActionState(
    updateOrderDetailsAction.bind(null, orderId),
    {},
  );
  const [emailState, emailAction, emailPending] = useActionState(
    resendOrderConfirmationAction.bind(null, orderId),
    {},
  );

  return (
    <div className={styles.wrap}>
      <form action={detailsAction} className={styles.form}>
        <label>
          {f.trackingNumber}
          <input
            name="tracking_number"
            defaultValue={trackingNumber ?? ""}
            placeholder={f.trackingPlaceholder}
          />
        </label>
        <label>
          {f.adminNotes}
          <textarea
            name="admin_notes"
            rows={4}
            defaultValue={adminNotes ?? ""}
            placeholder={f.adminNotesPlaceholder}
          />
        </label>
        <button type="submit" className={formStyles.submit} disabled={detailsPending}>
          {detailsPending ? saving : f.saveDetails}
        </button>
        {detailsState.error && <p className={formStyles.error}>{detailsState.error}</p>}
        {detailsState.success && <p className={formStyles.success}>{detailsState.success}</p>}
      </form>

      <form action={emailAction}>
        <button type="submit" className={styles.resendBtn} disabled={emailPending}>
          {emailPending ? f.sending : f.resendConfirmation}
        </button>
        {emailState.error && <p className={formStyles.error}>{emailState.error}</p>}
        {emailState.success && <p className={formStyles.success}>{emailState.success}</p>}
      </form>
    </div>
  );
}
