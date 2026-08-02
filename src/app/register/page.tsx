import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create account — SG Philippo Art",
  robots: { index: false },
};

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
