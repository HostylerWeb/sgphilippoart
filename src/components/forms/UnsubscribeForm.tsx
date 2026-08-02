"use client";

import { useActionState } from "react";
import { unsubscribeNewsletterAction } from "@/actions/newsletter";
import formStyles from "@/components/forms/Form.module.css";

type UnsubscribeFormProps = {
  token: string;
  labels: {
    submit: string;
    submitting: string;
    success: string;
  };
};

export function UnsubscribeForm({ token, labels }: UnsubscribeFormProps) {
  const [state, formAction, pending] = useActionState(unsubscribeNewsletterAction, {});

  if (state.success) {
    return <p className={formStyles.success}>{state.success}</p>;
  }

  return (
    <form action={formAction} className={formStyles.form}>
      {state.error && <p className={formStyles.error}>{state.error}</p>}
      <input type="hidden" name="token" value={token} />
      <button type="submit" className={formStyles.submit} disabled={pending}>
        {pending ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
