type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const store = new Map<string, RateLimitEntry>();

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  if (entry.count >= limit) {
    return {
      ok: false,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  store.set(key, entry);
  return { ok: true };
}

export async function enforceRateLimit(
  scope: string,
  limit = 10,
  windowMs = 15 * 60 * 1000,
): Promise<RateLimitResult> {
  const { getClientIp } = await import("@/lib/client-ip");
  const ip = await getClientIp();
  return checkRateLimit(`${scope}:${ip}`, limit, windowMs);
}
