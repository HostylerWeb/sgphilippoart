import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDictionary, getLocale } from "@/i18n";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const meta = getDictionary(locale).meta;
  return {
    title: meta.registerTitle,
    robots: { index: false },
  };
}

type PageProps = {
  searchParams: Promise<{ callbackUrl?: string }>;
};

export default async function RegisterPage({ searchParams }: PageProps) {
  const { callbackUrl } = await searchParams;
  const params = new URLSearchParams({ tab: "register" });
  if (callbackUrl) {
    params.set("callbackUrl", callbackUrl);
  }
  redirect(`/login?${params.toString()}`);
}
