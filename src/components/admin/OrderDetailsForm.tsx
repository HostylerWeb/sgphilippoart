"use client";

import { useActionState } from "react";
import {
  resendOrderConfirmationAction,
  updateOrderDetailsAction,
} from "@/actions/admin/orders";
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
          Tracking number
          <input
            name="tracking_number"
            defaultValue={trackingNumber ?? ""}
            placeholder="Carrier tracking ID"
          />
        </label>
        <label>
          Admin notes (internal)
          <textarea
            name="admin_notes"
            rows={4}
            defaultValue={adminNotes ?? ""}
            placeholder="Internal notes — not visible to customer"
          />
        </label>
        <button type="submit" className={formStyles.submit} disabled={detailsPending}>
          {detailsPending ? "Saving…" : "Save details"}
        </button>
        {detailsState.error && <p className={formStyles.error}>{detailsState.error}</p>}
        {detailsState.success && <p className={formStyles.success}>{detailsState.success}</p>}
      </form>

      <form action={emailAction}>
        <button type="submit" className={styles.resendBtn} disabled={emailPending}>
          {emailPending ? "Sending…" : "Resend confirmation email"}
        </button>
        {emailState.error && <p className={formStyles.error}>{emailState.error}</p>}
        {emailState.success && <p className={formStyles.success}>{emailState.success}</p>}
      </form>
    </div>
  );
}
