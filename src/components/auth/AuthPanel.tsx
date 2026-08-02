"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { useI18n } from "@/components/layout/I18nProvider";
import styles from "./AuthPanel.module.css";

type AuthTab = "login" | "register";

type AuthPanelProps = {
  callbackUrl?: string;
  showGoogle?: boolean;
  initialTab?: AuthTab;
  checkoutFlow?: boolean;
};

export function AuthPanel({
  callbackUrl = "/account",
  showGoogle,
  initialTab = "login",
  checkoutFlow = false,
}: AuthPanelProps) {
  const { dict } = useI18n();
  const t = dict.auth;
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
  const [registerMessage, setRegisterMessage] = useState<string | null>(null);

  const switchTab = useCallback(
    (tab: AuthTab, options?: { keepMessage?: boolean }) => {
      setActiveTab(tab);
      if (!options?.keepMessage) {
        setRegisterMessage(null);
      }

      const params = new URLSearchParams(searchParams.toString());
      if (tab === "register") {
        params.set("tab", "register");
      } else {
        params.delete("tab");
      }
      if (callbackUrl !== "/account") {
        params.set("callbackUrl", callbackUrl);
      }

      const query = params.toString();
      router.replace(query ? `/login?${query}` : "/login", { scroll: false });
    },
    [callbackUrl, router, searchParams],
  );

  const tabDescription =
    activeTab === "login"
      ? checkoutFlow
        ? t.checkoutLoginDescription
        : t.loginDescription
      : checkoutFlow
        ? t.checkoutRegisterDescription
        : t.registerDescription;

  return (
    <div className={styles.panel}>
      <div className={styles.tabs} role="tablist" aria-label={t.pageTitle}>
        <button
          type="button"
          role="tab"
          id="auth-tab-login"
          aria-selected={activeTab === "login"}
          aria-controls="auth-panel-login"
          className={`${styles.tab} ${activeTab === "login" ? styles.tabActive : ""}`}
          onClick={() => switchTab("login")}
        >
          {t.signIn}
        </button>
        <button
          type="button"
          role="tab"
          id="auth-tab-register"
          aria-selected={activeTab === "register"}
          aria-controls="auth-panel-register"
          className={`${styles.tab} ${activeTab === "register" ? styles.tabActive : ""}`}
          onClick={() => switchTab("register")}
        >
          {t.signUp}
        </button>
      </div>

      <p className={styles.tabDescription}>{tabDescription}</p>

      <div className={styles.panelContent}>
        {activeTab === "login" ? (
          <div role="tabpanel" id="auth-panel-login" aria-labelledby="auth-tab-login">
            {registerMessage && <p className={styles.registerSuccess}>{registerMessage}</p>}
            <LoginForm
              callbackUrl={callbackUrl}
              showGoogle={showGoogle}
              embedded
            />
          </div>
        ) : (
          <div role="tabpanel" id="auth-panel-register" aria-labelledby="auth-tab-register">
            <RegisterForm
              callbackUrl={callbackUrl}
              embedded
              onRegistered={(message) => {
                setRegisterMessage(message);
                switchTab("login", { keepMessage: true });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
