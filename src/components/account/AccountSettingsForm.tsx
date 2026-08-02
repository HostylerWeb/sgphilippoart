"use client";

import { useMemo, useState, useActionState } from "react";
import { updateAccountSettingsAction } from "@/actions/account";
import { useI18n } from "@/components/layout/I18nProvider";
import {
  getCountryAddressFormat,
  getCountryName,
  resolveCountryCode,
  sortCountriesByLocale,
  type AddressLabelKey,
} from "@/lib/european-countries";
import type { UserProfile } from "@/lib/user-profile";
import styles from "./AccountSettingsForm.module.css";

type AccountSettingsFormProps = {
  profile: UserProfile;
  labels: {
    profileSection: string;
    shippingSection: string;
    email: string;
    emailNote: string;
    fullName: string;
    phone: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    selectCountry: string;
    save: string;
    saving: string;
  };
};

export function AccountSettingsForm({ profile, labels }: AccountSettingsFormProps) {
  const { locale, dict } = useI18n();
  const checkoutLabels = dict.checkout;
  const [state, formAction, isPending] = useActionState(updateAccountSettingsAction, {});
  const address = profile.shipping_address;
  const [countryCode, setCountryCode] = useState(() => resolveCountryCode(address?.country));

  const countries = useMemo(() => sortCountriesByLocale(locale), [locale]);
  const addressFormat = getCountryAddressFormat(countryCode);
  const showState = addressFormat.state !== "hidden";
  const stateRequired = addressFormat.state === "required";

  function fieldLabel(key: AddressLabelKey): string {
    return addressFormat.labels?.[key]?.[locale] ?? checkoutLabels[key];
  }

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="country" value={getCountryName(countryCode, locale)} />

      <section className={styles.section}>
        <h2>{labels.profileSection}</h2>
        <div className={styles.grid}>
          <label className={styles.full}>
            {labels.email}
            <input value={profile.email} readOnly disabled className={styles.readOnly} />
          </label>
          <p className={styles.hint}>{labels.emailNote}</p>
          <label>
            {labels.fullName}
            <input
              name="name"
              required
              defaultValue={profile.name ?? ""}
              autoComplete="name"
            />
          </label>
          <label>
            {labels.phone}
            <input
              name="phone"
              type="tel"
              required
              defaultValue={profile.phone ?? ""}
              autoComplete="tel"
            />
          </label>
        </div>
      </section>

      <section className={styles.section}>
        <h2>{labels.shippingSection}</h2>
        <div className={styles.grid}>
          <label className={styles.full}>
            {labels.country}
            <select
              required
              autoComplete="country"
              value={countryCode}
              onChange={(event) => setCountryCode(event.target.value)}
              className={styles.select}
            >
              <option value="" disabled>
                {labels.selectCountry}
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
              defaultValue={address?.line1 ?? ""}
              autoComplete="address-line1"
            />
          </label>
          <label className={styles.full}>
            {fieldLabel("address2")}
            <input
              name="addressLine2"
              defaultValue={address?.line2 ?? ""}
              autoComplete="address-line2"
            />
          </label>

          {addressFormat.postalBeforeCity ? (
            <>
              <label>
                {fieldLabel("postalCode")}
                <input
                  name="postalCode"
                  required
                  defaultValue={address?.postal_code ?? ""}
                  autoComplete="postal-code"
                  placeholder={addressFormat.postalPlaceholder?.[locale]}
                />
              </label>
              <label>
                {fieldLabel("city")}
                <input
                  name="city"
                  required
                  defaultValue={address?.city ?? ""}
                  autoComplete="address-level2"
                />
              </label>
            </>
          ) : (
            <>
              <label>
                {fieldLabel("city")}
                <input
                  name="city"
                  required
                  defaultValue={address?.city ?? ""}
                  autoComplete="address-level2"
                />
              </label>
              {showState && (
                <label>
                  {fieldLabel("state")}
                  <input
                    name="state"
                    required={stateRequired}
                    defaultValue={address?.state ?? ""}
                    autoComplete="address-level1"
                  />
                </label>
              )}
              <label className={showState ? undefined : styles.full}>
                {fieldLabel("postalCode")}
                <input
                  name="postalCode"
                  required
                  defaultValue={address?.postal_code ?? ""}
                  autoComplete="postal-code"
                  placeholder={addressFormat.postalPlaceholder?.[locale]}
                />
              </label>
            </>
          )}
        </div>
      </section>

      {state.error && <p className={styles.error}>{state.error}</p>}
      {state.success && <p className={styles.success}>{state.success}</p>}

      <button type="submit" className={styles.submit} disabled={isPending}>
        {isPending ? labels.saving : labels.save}
      </button>
    </form>
  );
}
