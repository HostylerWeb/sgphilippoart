"use client";

import { useActionState } from "react";
import { trackOrderAction } from "@/actions/track-order";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { formatPrice } from "@/lib/format";
import type { StoreSettings } from "@/lib/settings";
import formStyles from "@/components/forms/Form.module.css";
import styles from "./TrackOrderForm.module.css";

type TrackOrderLabels = {
  orderNumber: string;
  email: string;
  submit: string;
  submitting: string;
  placedOn: string;
  items: string;
  total: string;
  tracking: string;
};

type TrackOrderFormProps = {
  labels: TrackOrderLabels;
  currency: Pick<StoreSettings, "currencyCode" | "currencyLocale">;
};

export function TrackOrderForm({ labels, currency }: TrackOrderFormProps) {
  const [state, formAction, pending] = useActionState(trackOrderAction, {});

  return (
    <div className={styles.wrap}>
      <form action={formAction} className={formStyles.form}>
        {state.error && <p className={formStyles.error}>{state.error}</p>}
        <label>
          {labels.orderNumber}
          <input name="orderNumber" required autoComplete="off" />
        </label>
        <label>
          {labels.email}
          <input name="email" type="email" required autoComplete="email" />
        </label>
        <button type="submit" className={formStyles.submit} disabled={pending}>
          {pending ? labels.submitting : labels.submit}
        </button>
      </form>

      {state.order && (
        <div className={styles.result}>
          <div className={styles.resultHead}>
            <strong>{state.order.orderNumber}</strong>
            <StatusBadge status={state.order.status} />
          </div>
          <p className={styles.meta}>
            {labels.placedOn}{" "}
            {new Date(state.order.createdAt).toLocaleDateString()}
          </p>
          {state.order.trackingNumber && (
            <p className={styles.meta}>
              {labels.tracking}: <strong>{state.order.trackingNumber}</strong>
            </p>
          )}
          <h3>{labels.items}</h3>
          <ul className={styles.items}>
            {state.order.items.map((item, index) => (
              <li key={`${item.title}-${index}`}>
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span>{formatPrice(item.price, currency)}</span>
              </li>
            ))}
          </ul>
          <p className={styles.total}>
            {labels.total}: <strong>{formatPrice(state.order.total, currency)}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
