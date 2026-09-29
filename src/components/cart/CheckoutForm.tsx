"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitOrderInquiry } from "@/actions/cart";
import dynamic from "next/dynamic";
import type { CheckoutPayload } from "@/components/cart/PayPalCheckout";

const PayPalCheckout = dynamic(
  () =>
    import("@/components/cart/PayPalCheckout").then((mod) => mod.PayPalCheckout),
  { ssr: false },
);
import { useI18n } from "@/components/layout/I18nProvider";
import {
  getCountryAddressFormat,
  resolveCountryCode,
  sortCountriesByLocale,
  type AddressLabelKey,
} from "@/lib/european-countries";
import styles from "./CheckoutForm.module.css";

export type CheckoutDefaults = {
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
};

type CheckoutFormProps = {
  defaults?: CheckoutDefaults;
  onCountryChange?: (countryCode: string) => void;
  paymentMode?: "inquiry" | "manual" | "stripe" | "paypal";
  currencyCode?: string;
  paypalClientId?: string | null;
};

export function CheckoutForm({
  defaults,
  onCountryChange,
  paymentMode = "inquiry",
  currencyCode = "EUR",
  paypalClientId,
}: CheckoutFormProps) {
  const { locale, dict } = useI18n();
  const t = dict.checkout;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [countryCode, setCountryCode] = useState(() => resolveCountryCode(defaults?.country));
  const formRef = useRef<HTMLFormElement>(null);
  const usePayPal = paymentMode === "paypal" && Boolean(paypalClientId);

  const countries = useMemo(() => sortCountriesByLocale(locale), [locale]);
  const addressFormat = getCountryAddressFormat(countryCode);

  function fieldLabel(key: AddressLabelKey): string {
    return addressFormat.labels?.[key]?.[locale] ?? t[key];
  }

  function readPayload(form: HTMLFormElement): CheckoutPayload {
    const formData = new FormData(form);
    return {
      customerName: String(formData.get("customerName") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      customerPhone: String(formData.get("customerPhone") ?? ""),
      addressLine1: String(formData.get("addressLine1") ?? ""),
      addressLine2: String(formData.get("addressLine2") ?? ""),
      city: String(formData.get("city") ?? ""),
      state: String(formData.get("state") ?? ""),
      postalCode: String(formData.get("postalCode") ?? ""),
      countryCode: String(formData.get("countryCode") ?? ""),
      notes: String(formData.get("notes") ?? ""),
    };
  }

  function getPayloadForPayPal(): CheckoutPayload | null {
    const form = formRef.current;
    if (!form) return null;
    if (!form.checkValidity()) {
      form.reportValidity();
      return null;
    }
    return readPayload(form);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (usePayPal) return;
    setError(null);
    const form = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await submitOrderInquiry({
        customerName: String(form.get("customerName") ?? ""),
        customerEmail: String(form.get("customerEmail") ?? ""),
        customerPhone: String(form.get("customerPhone") ?? ""),
        addressLine1: String(form.get("addressLine1") ?? ""),
        addressLine2: String(form.get("addressLine2") ?? ""),
        city: String(form.get("city") ?? ""),
        state: String(form.get("state") ?? ""),
        postalCode: String(form.get("postalCode") ?? ""),
        countryCode: String(form.get("countryCode") ?? ""),
        notes: String(form.get("notes") ?? ""),
      });

      if (result.success && result.orderNumber) {
        router.push(`/checkout/success?order=${encodeURIComponent(result.orderNumber)}`);
      } else {
        setError(result.message ?? t.submitError);
      }
    });
  }

  const showState = addressFormat.state !== "hidden";
  const stateRequired = addressFormat.state === "required";

  const postalField = (
    <label>
      {fieldLabel("postalCode")}
      <input
        name="postalCode"
        required
        autoComplete="postal-code"
        defaultValue={defaults?.postalCode}
        placeholder={addressFormat.postalPlaceholder?.[locale]}
        pattern={addressFormat.postalPattern}
        title={addressFormat.postalPlaceholder?.[locale]}
      />
    </label>
  );

  const cityField = (
    <label>
      {fieldLabel("city")}
      <input
        name="city"
        required
        autoComplete="address-level2"
        defaultValue={defaults?.city}
      />
    </label>
  );

  const stateField = showState ? (
    <label>
      {fieldLabel("state")}
      <input
        name="state"
        required={stateRequired}
        autoComplete="address-level1"
        defaultValue={defaults?.state}
      />
    </label>
  ) : null;

  return (
    <form ref={formRef} className={styles.form} onSubmit={handleSubmit}>
      <section className={styles.section}>
        <h2>{t.yourDetails}</h2>
        <div className={styles.grid}>
          <label>
            {t.fullName}
            <input
              name="customerName"
              required
              autoComplete="name"
              defaultValue={defaults?.customerName}
            />
          </label>
          <label>
            {t.email}
            <input
              name="customerEmail"
              type="email"
              required
              autoComplete="email"
              defaultValue={defaults?.customerEmail}
            />
          </label>
          <label className={styles.full}>
            {t.phone}
            <input
              name="customerPhone"
              type="tel"
              required
              autoComplete="tel"
              defaultValue={defaults?.customerPhone}
            />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <h2>{t.billingAddress}</h2>
        <div className={styles.grid}>
          <label className={styles.full}>
            {t.country}
            <select
              name="countryCode"
              required
              autoComplete="country"
              value={countryCode}
              onChange={(event) => {
                setCountryCode(event.target.value);
                onCountryChange?.(event.target.value);
              }}
            >
              <option value="" disabled>
                {t.selectCountry}
              </option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name[locale]}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.full}>
            {fieldLabel("address1")}
            <input
              name="addressLine1"
              required
              autoComplete="address-line1"
              defaultValue={defaults?.addressLine1}
            />
          </label>
          <label className={styles.full}>
            {fieldLabel("address2")}
            <input
              name="addressLine2"
              autoComplete="address-line2"
              defaultValue={defaults?.addressLine2}
            />
          </label>

          {addressFormat.postalBeforeCity ? (
            <>
              {postalField}
              {cityField}
            </>
          ) : showState ? (
            <>
              {cityField}
              {stateField}
              {postalField}
            </>
          ) : (
            <>
              {cityField}
              {postalField}
            </>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <label className={styles.full}>
          {t.notes}
          <textarea
            name="notes"
            rows={4}
            placeholder={t.notesPlaceholder}
          />
        </label>
      </section>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.footer}>
        {usePayPal ? (
          <>
            <p className={styles.note}>{t.paymentNote}</p>
            <section className={styles.section}>
              <h2>{t.paymentSection}</h2>
              <PayPalCheckout
                clientId={paypalClientId!}
                currencyCode={currencyCode}
                getPayload={getPayloadForPayPal}
                processingLabel={t.paymentProcessing}
                loadingLabel={t.paymentLoading}
                onPaid={(orderNumber) => {
                  router.push(
                    `/checkout/success?order=${encodeURIComponent(orderNumber)}`,
                  );
                }}
                onError={(message) => setError(message)}
              />
            </section>
          </>
        ) : (
          <>
            <p className={styles.note}>{t.inquiryNote}</p>
            <button type="submit" disabled={isPending} className={styles.submit}>
              {isPending ? t.submitting : t.submit}
            </button>
          </>
        )}
      </div>
    </form>
  );
}
