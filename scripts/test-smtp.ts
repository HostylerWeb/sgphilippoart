import "dotenv/config";
import nodemailer from "nodemailer";
import {
  formatSmtpFromAddress,
  getSmtpConfig,
  getSmtpFromName,
} from "../src/lib/smtp";

async function main() {
  const config = getSmtpConfig();
  if (!config) {
    console.error("SMTP is not configured. Set SMTP_HOST in .env");
    process.exit(1);
  }

  if (!config.user || !config.password) {
    console.error("SMTP_USER and SMTP_PASSWORD are required in .env");
    process.exit(1);
  }

  const fromEmail =
    process.env.STUDIO_EMAIL?.trim() || config.user;
  const toEmail = process.env.SMTP_TEST_TO?.trim() || fromEmail;

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  console.log(`Verifying SMTP ${config.host}:${config.port} as ${config.user}…`);
  await transporter.verify();
  console.log("SMTP connection verified.");

  const subject = `SMTP test — ${getSmtpFromName()} — ${new Date().toISOString()}`;
  const info = await transporter.sendMail({
    from: formatSmtpFromAddress(fromEmail),
    to: toEmail,
    subject,
    text: "This is a test email from the SG Philippo Art SMTP test script.",
    html: "<p>This is a <strong>test email</strong> from the SG Philippo Art SMTP test script.</p>",
  });

  console.log(`Test email sent to ${toEmail}`);
  console.log(`Message ID: ${info.messageId}`);
}

main().catch((error) => {
  console.error("SMTP test failed:", error);
  process.exit(1);
});
