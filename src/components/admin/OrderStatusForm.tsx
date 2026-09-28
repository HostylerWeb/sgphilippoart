"use client";

import { useActionState } from "react";
import { updateOrderStatusAction } from "@/actions/admin/orders";
import { useI18n } from "@/components/layout/I18nProvider";
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
  const { dict } = useI18n();
  const f = dict.admin.forms.order;
  const statusLabels = dict.status as Record<string, string>;

  const [state, formAction, pending] = useActionState(
    updateOrderStatusAction.bind(null, orderId),
    {},
  );

  return (
    <form action={formAction} className={styles.form}>
      <label>
        {f.orderStatus}
        <select name="status" defaultValue={currentStatus}>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {statusLabels[status] ?? status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </label>
      <button type="submit" className={formStyles.submit} disabled={pending}>
        {pending ? f.updating : f.updateStatus}
      </button>
      {state.error && <p className={formStyles.error}>{state.error}</p>}
      {state.success && <p className={formStyles.success}>{state.success}</p>}
    </form>
  );
}
