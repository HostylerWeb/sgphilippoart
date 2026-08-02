import "dotenv/config";
import { randomUUID } from "crypto";
import { getStudioEmail } from "../src/lib/studio-email";
import { isSmtpConfigured } from "../src/lib/smtp";
import {
  sendCommissionNotification,
  sendContactNotification,
  sendNewsletterWelcome,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  sendPasswordResetEmail,
} from "../src/lib/email";

type EmailTest = {
  name: string;
  audience: "admin" | "customer" | "both";
  run: () => Promise<void>;
};

async function main() {
  if (!isSmtpConfigured()) {
    console.error("SMTP is not configured. Set SMTP_HOST in .env");
    process.exit(1);
  }

  const studioEmail = await getStudioEmail();
  const customerEmail =
    process.env.EMAIL_TEST_CUSTOMER?.trim() ||
    process.env.SMTP_TEST_TO?.trim() ||
    studioEmail;

  const stamp = new Date().toISOString();
  const orderNumber = `SPA-TEST-${stamp.slice(0, 10).replace(/-/g, "")}`;
  const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password?token=test-token`;
  const unsubscribeToken = randomUUID();

  console.log("Email test run");
  console.log(`  Studio (admin): ${studioEmail}`);
  console.log(`  Customer:       ${customerEmail}`);
  console.log("");

  const tests: EmailTest[] = [
    {
      name: "Contact form → admin",
      audience: "admin",
      run: () =>
        sendContactNotification({
          name: "Test Customer",
          email: customerEmail,
          subject: `[TEST] Contact form`,
          message: `Automated email test at ${stamp}.\nThis simulates a contact form submission.`,
          artworkSlug: "sample-painting",
        }),
    },
    {
      name: "Commission inquiry → admin + customer",
      audience: "both",
      run: () =>
        sendCommissionNotification({
          name: "Test Customer",
          email: customerEmail,
          phone: "+32 470 00 00 00",
          budgetRange: "$1,000 – $2,500",
          description: `Automated commission test at ${stamp}.`,
          referenceUrl: "https://example.com/reference.jpg",
        }),
    },
    {
      name: "Newsletter welcome → customer",
      audience: "customer",
      run: () => sendNewsletterWelcome(customerEmail, unsubscribeToken),
    },
    {
      name: "Password reset → customer",
      audience: "customer",
      run: () => sendPasswordResetEmail(customerEmail, resetUrl),
    },
    {
      name: "Order confirmation → customer + admin",
      audience: "both",
      run: async () => {
        await sendOrderConfirmation({
          email: customerEmail,
          name: "Test Customer",
          orderNumber,
          total: "€1,250.00",
        });
      },
    },
    {
      name: "Order status update (shipped) → customer",
      audience: "customer",
      run: async () => {
        await sendOrderStatusUpdate({
          email: customerEmail,
          name: "Test Customer",
          orderNumber,
          status: "shipped",
          trackingNumber: "TEST-TRACK-123456",
        });
      },
    },
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const label = `[${test.audience.toUpperCase()}] ${test.name}`;
    process.stdout.write(`${label}… `);
    try {
      await test.run();
      console.log("OK");
      passed += 1;
    } catch (error) {
      console.log("FAILED");
      console.error(error);
      failed += 1;
    }
  }

  console.log("");
  console.log(`Done: ${passed} passed, ${failed} failed`);
  console.log("");
  console.log("Check inboxes:");
  console.log(`  Admin:    ${studioEmail}`);
  console.log(`  Customer: ${customerEmail}`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Email test run failed:", error);
  process.exit(1);
});
