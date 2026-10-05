/**
 * MyMemory REST API client.
 * @see https://mymemory.translated.net/doc/spec.php
 * @see https://mymemory.translated.net/doc/usagelimits.php
 */

const MYMEMORY_GET_URL = "https://api.mymemory.translated.net/get";
/** Max UTF-8 bytes per `q` parameter (MyMemory spec). */
export const MYMEMORY_MAX_QUERY_BYTES = 500;

export type MyMemoryTargetLocale = "en" | "nl";

export const MYMEMORY_SOURCE_LOCALE = "fr";

type MyMemoryGetResponse = {
  responseData?: {
    translatedText?: string;
    match?: number;
  };
  responseStatus?: number | string;
  responseDetails?: string;
  quotaFinished?: boolean | null;
  exception_code?: string | null;
};

export class MyMemoryTranslationError extends Error {
  constructor(
    message: string,
    readonly code?: "quota" | "limit" | "api" | "empty",
  ) {
    super(message);
    this.name = "MyMemoryTranslationError";
  }
}

function utf8ByteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

/**
 * Split text into segments each ≤ maxBytes UTF-8 (per MyMemory `q` limit).
 * Prefers breaks at paragraph and sentence boundaries when possible.
 */
export function splitTextForMyMemory(
  text: string,
  maxBytes = MYMEMORY_MAX_QUERY_BYTES,
): string[] {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (utf8ByteLength(trimmed) <= maxBytes) return [trimmed];

  const chunks: string[] = [];
  const paragraphs = trimmed.split(/(\n{2,})/);

  let buffer = "";
  for (const part of paragraphs) {
    if (!part) continue;
    const candidate = buffer ? buffer + part : part;
    if (utf8ByteLength(candidate) <= maxBytes) {
      buffer = candidate;
      continue;
    }
    if (buffer) {
      chunks.push(...splitSegmentForMyMemory(buffer, maxBytes));
      buffer = "";
    }
    if (utf8ByteLength(part) <= maxBytes) {
      buffer = part;
    } else {
      chunks.push(...splitSegmentForMyMemory(part, maxBytes));
    }
  }
  if (buffer) {
    chunks.push(...splitSegmentForMyMemory(buffer, maxBytes));
  }
  return chunks;
}

function splitSegmentForMyMemory(text: string, maxBytes: number): string[] {
  if (utf8ByteLength(text) <= maxBytes) return [text];

  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let buffer = "";

  for (const sentence of sentences) {
    const candidate = buffer ? `${buffer} ${sentence}` : sentence;
    if (utf8ByteLength(candidate) <= maxBytes) {
      buffer = candidate;
      continue;
    }
    if (buffer) {
      chunks.push(...hardSplitUtf8(buffer, maxBytes));
      buffer = "";
    }
    if (utf8ByteLength(sentence) <= maxBytes) {
      buffer = sentence;
    } else {
      chunks.push(...hardSplitUtf8(sentence, maxBytes));
    }
  }
  if (buffer) chunks.push(...hardSplitUtf8(buffer, maxBytes));
  return chunks;
}

function hardSplitUtf8(text: string, maxBytes: number): string[] {
  const chunks: string[] = [];
  let remaining = text;
  while (remaining.length > 0) {
    if (utf8ByteLength(remaining) <= maxBytes) {
      chunks.push(remaining);
      break;
    }
    let end = Math.min(remaining.length, maxBytes);
    while (end > 0 && utf8ByteLength(remaining.slice(0, end)) > maxBytes) {
      end -= 1;
    }
    if (end === 0) {
      throw new MyMemoryTranslationError(
        "Could not split text for translation.",
        "limit",
      );
    }
    let sliceEnd = end;
    const lastSpace = remaining.lastIndexOf(" ", end);
    if (lastSpace > end * 0.5) {
      sliceEnd = lastSpace;
    }
    chunks.push(remaining.slice(0, sliceEnd).trimEnd());
    remaining = remaining.slice(sliceEnd).trimStart();
  }
  return chunks.filter((c) => c.length > 0);
}

function langPair(target: MyMemoryTargetLocale): string {
  return `${MYMEMORY_SOURCE_LOCALE}|${target}`;
}

function parseMyMemoryResponse(data: MyMemoryGetResponse): string {
  const status = Number(data.responseStatus);
  if (data.quotaFinished) {
    throw new MyMemoryTranslationError(
      "Daily translation quota reached. Try again tomorrow.",
      "quota",
    );
  }
  if (status === 403 || data.responseDetails?.includes("QUERY LENGTH")) {
    throw new MyMemoryTranslationError(
      "Text segment exceeded MyMemory size limit.",
      "limit",
    );
  }
  if (status !== 200) {
    throw new MyMemoryTranslationError(
      data.responseDetails || "Translation service error.",
      "api",
    );
  }

  const translated = data.responseData?.translatedText?.trim() ?? "";
  if (!translated) {
    throw new MyMemoryTranslationError("Empty translation result.", "api");
  }
  if (
    translated.includes("QUERY LENGTH LIMIT EXCEEDED") ||
    translated.includes("MYMEMORY WARNING")
  ) {
    throw new MyMemoryTranslationError(translated, "api");
  }

  return translated;
}

export async function translateSegmentWithMyMemory(
  text: string,
  target: MyMemoryTargetLocale,
  contactEmail?: string | null,
): Promise<string> {
  const segment = text.trim();
  if (!segment) return "";

  const params = new URLSearchParams({
    q: segment,
    langpair: langPair(target),
    mt: "1",
  });
  if (contactEmail?.trim()) {
    params.set("de", contactEmail.trim());
  }

  const response = await fetch(`${MYMEMORY_GET_URL}?${params.toString()}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new MyMemoryTranslationError(
      `Translation HTTP ${response.status}`,
      "api",
    );
  }

  const data = (await response.json()) as MyMemoryGetResponse;
  return parseMyMemoryResponse(data);
}

export async function translateTextWithMyMemory(
  text: string,
  target: MyMemoryTargetLocale,
  contactEmail?: string | null,
): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed) return "";

  const paragraphs = trimmed.split(/\n{2,}/);
  const translatedParagraphs: string[] = [];

  for (const paragraph of paragraphs) {
    const segments = splitTextForMyMemory(paragraph);
    const parts: string[] = [];
    for (const segment of segments) {
      parts.push(
        await translateSegmentWithMyMemory(segment, target, contactEmail),
      );
    }
    translatedParagraphs.push(parts.join(""));
  }

  return translatedParagraphs.join("\n\n");
}

export function getMyMemoryContactEmail(): string | null {
  return process.env.MYMEMORY_CONTACT_EMAIL?.trim() || null;
}
