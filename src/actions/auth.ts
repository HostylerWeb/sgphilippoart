"use server";

import { AuthError } from "next-auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import { signIn } from "@/lib/auth";
import { getDictionary, getLocale } from "@/i18n";
import { schemasForLocale } from "@/lib/validations/auth";
import { sanitizeCallbackUrl } from "@/lib/safe-redirect";

type LoginState = {
  error?: string;
};

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const locale = await getLocale();
  const m = getDictionary(locale).validation;
  const limited = await enforceRateLimit("login", 10, 15 * 60 * 1000);
  if (!limited.ok) {
    return { error: m.rateLimited };
  }

  const parsed = schemasForLocale(locale).login.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: m.loginInvalidInput };
  }

  const callbackUrl = sanitizeCallbackUrl(formData.get("callbackUrl")?.toString());

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: callbackUrl,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: m.loginInvalid };
    }
    throw error;
  }

  return {};
}

export async function googleSignInAction(formData: FormData) {
  const callbackUrl = sanitizeCallbackUrl(formData.get("callbackUrl")?.toString());
  await signIn("google", { redirectTo: callbackUrl });
}
