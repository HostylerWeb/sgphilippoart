/**
 * Validates redirect targets to prevent open redirects.
 */
export function sanitizeCallbackUrl(
  url: string | null | undefined,
  fallback = "/account",
): string {
  if (!url) return fallback;

  const trimmed = url.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  if (trimmed.includes("://") || trimmed.includes("\\")) {
    return fallback;
  }

  return trimmed;
}
