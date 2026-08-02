import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

export type SmtpConfig = {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  password?: string;
};

export function getSmtpConfig(): SmtpConfig | null {
  const host = process.env.SMTP_HOST?.trim();
  if (!host) return null;

  const port = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
  const secure =
    process.env.SMTP_SECURE === "true" || (process.env.SMTP_SECURE !== "false" && port === 465);

  return {
    host,
    port: Number.isFinite(port) ? port : 587,
    secure,
    user: process.env.SMTP_USER?.trim() || undefined,
    password: process.env.SMTP_PASSWORD || undefined,
  };
}

export function isSmtpConfigured(): boolean {
  return getSmtpConfig() !== null;
}

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo> | null = null;

export function getSmtpTransporter() {
  const config = getSmtpConfig();
  if (!config) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth:
        config.user && config.password
          ? {
              user: config.user,
              pass: config.password,
            }
          : undefined,
    });
  }

  return transporter;
}

export function getSmtpFromName(): string {
  return process.env.SMTP_FROM_NAME?.trim() || process.env.NEXT_PUBLIC_SITE_NAME || "SG Philippo Art";
}

export function formatSmtpFromAddress(email: string): string {
  const name = getSmtpFromName();
  return `"${name.replace(/"/g, '\\"')}" <${email}>`;
}
