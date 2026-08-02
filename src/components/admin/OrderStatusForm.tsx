"use client";

import { useActionState } from "react";
import { updateOrderStatusAction } from "@/actions/admin/orders";
import formStyles from "@/components/forms/Form.module.css";
import styles from "./OrderStatusForm.module.css";

const STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

type OrderStatusFormProps = {
  orderId: string;
  currentStatus: string;
};

export function OrderStatusForm({ orderId, currentStatus }: OrderStatusFormProps) {
  const [state, formAction, pending] = useActionState(
    updateOrderStatusAction.bind(null, orderId),
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <label>
        Order status
        <select name="status" defaultValue={currentStatus}>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className={formStyles.submit} disabled={pending}>
        {pending ? "Updating…" : "Update status"}
      </button>
      {state.error && <p className={formStyles.error}>{state.error}</p>}
      {state.success && <p className={formStyles.success}>{state.success}</p>}
    </form>
  );
}
