import "dotenv/config";
import { randomUUID } from "crypto";
import type { Locale } from "../src/i18n/config";
import { sendNewsletterWelcome } from "../src/lib/email";

async function main() {
  const to =
    process.env.SMTP_TEST_TO?.trim() ||
    process.env.EMAIL_TEST_CUSTOMER?.trim();

  if (!to) {
    console.error("Set SMTP_TEST_TO or EMAIL_TEST_CUSTOMER in the environment.");
    process.exit(1);
  }

  const locale = (process.env.EMAIL_TEST_LOCALE?.trim() || "fr") as Locale;
  await sendNewsletterWelcome(to, randomUUID(), locale);
  console.log(`Newsletter welcome email sent to ${to} (${locale}).`);
}

main().catch((error) => {
  console.error("Welcome email failed:", error);
  process.exit(1);
});
