"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import formStyles from "@/components/forms/Form.module.css";
import styles from "./AdminFlashNotice.module.css";

type AdminFlashNoticeProps = {
  message: string | null;
  clearHref: string;
};

export function AdminFlashNotice({ message, clearHref }: AdminFlashNoticeProps) {
  const router = useRouter();

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => {
      router.replace(clearHref, { scroll: false });
    }, 10_000);
    return () => window.clearTimeout(timer);
  }, [message, clearHref, router]);

  if (!message) return null;

  return (
    <div className={styles.wrap} role="status">
      <p className={formStyles.success}>{message}</p>
      <button
        type="button"
        className={styles.dismiss}
        onClick={() => router.replace(clearHref, { scroll: false })}
      >
        ×
      </button>
    </div>
  );
}
