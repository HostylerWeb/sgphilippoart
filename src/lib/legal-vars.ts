import { formatPrice } from "@/lib/format";
import type { LegalPageVars } from "@/i18n/legal/types";
import type { StoreSettings } from "@/lib/settings";

export function buildLegalPageVars(settings: StoreSettings): LegalPageVars {
  return {
    siteName: settings.siteName,
    contactEmail: settings.contactEmail,
    returnsDays: settings.returnsDays,
    returnsSummary: settings.returnsPolicySummary,
    shippingLabel: settings.shippingLabel,
    currencyCode: settings.currencyCode,
    handlingFeeLabel: settings.handlingFeeLabel.toLowerCase(),
    handlingFeeAmount: formatPrice(settings.handlingFee, settings),
    localeDisplay: settings.localeDisplay,
    year: new Date().getFullYear(),
  };
}
