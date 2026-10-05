import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { enforceRateLimit } from "@/lib/rate-limit";
import {
  getMyMemoryContactEmail,
  MyMemoryTranslationError,
  translateTextWithMyMemory,
  type MyMemoryTargetLocale,
} from "@/lib/translation/mymemory";

const TARGET_LOCALES: MyMemoryTargetLocale[] = ["en", "nl"];
const MAX_FIELDS = 12;
const MAX_FIELD_CHARS = 20_000;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = await enforceRateLimit("admin-translate", 40, 15 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      {
        error: `Too many translation requests. Try again in ${limited.retryAfterSeconds}s.`,
      },
      { status: 429 },
    );
  }

  let body: { targetLocale?: string; fields?: Record<string, string> };
  try {
    body = (await request.json()) as {
      targetLocale?: string;
      fields?: Record<string, string>;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const targetLocale = body.targetLocale;
  if (!targetLocale || !TARGET_LOCALES.includes(targetLocale as MyMemoryTargetLocale)) {
    return NextResponse.json({ error: "Invalid target locale." }, { status: 400 });
  }

  const fields = body.fields;
  if (!fields || typeof fields !== "object") {
    return NextResponse.json({ error: "Missing fields." }, { status: 400 });
  }

  const entries = Object.entries(fields).filter(
    ([, value]) => typeof value === "string" && value.trim().length > 0,
  );
  if (entries.length === 0) {
    return NextResponse.json(
      { error: "No French source text to translate." },
      { status: 400 },
    );
  }
  if (entries.length > MAX_FIELDS) {
    return NextResponse.json({ error: "Too many fields." }, { status: 400 });
  }

  for (const [, value] of entries) {
    if (value.length > MAX_FIELD_CHARS) {
      return NextResponse.json(
        { error: "A field is too long to translate." },
        { status: 400 },
      );
    }
  }

  const contactEmail = getMyMemoryContactEmail();
  const translated: Record<string, string> = {};

  try {
    for (const [key, value] of entries) {
      translated[key] = await translateTextWithMyMemory(
        value,
        targetLocale as MyMemoryTargetLocale,
        contactEmail,
      );
    }
  } catch (error) {
    if (error instanceof MyMemoryTranslationError) {
      const status =
        error.code === "quota" ? 429 : error.code === "limit" ? 413 : 502;
      return NextResponse.json({ error: error.message }, { status });
    }
    console.error("[admin/translate]", error);
    return NextResponse.json(
      { error: "Translation failed. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ translated });
}
