const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const EXTENSION_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

const GENERIC_MIME_TYPES = new Set([
  "",
  "application/octet-stream",
  "binary/octet-stream",
]);

type ImageValidationResult =
  | { ok: true; mimeType: string; extension: string }
  | { ok: false; error: string };

function detectImageTypeFromBuffer(buffer: Buffer): string | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "image/png";
  }

  if (
    buffer.length >= 6 &&
    (buffer.subarray(0, 6).toString("ascii") === "GIF87a" ||
      buffer.subarray(0, 6).toString("ascii") === "GIF89a")
  ) {
    return "image/gif";
  }

  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

function isHeicOrHeif(buffer: Buffer): boolean {
  if (buffer.length < 12 || buffer.subarray(4, 8).toString("ascii") !== "ftyp") {
    return false;
  }

  const brand = buffer.subarray(8, 12).toString("ascii").toLowerCase();
  return brand.startsWith("hei") || brand === "mif1" || brand === "msf1" || brand === "hevc";
}

export function validateImageBuffer(
  buffer: Buffer,
  filename: string,
  reportedType = "",
): ImageValidationResult {
  if (buffer.length <= 0) {
    return { ok: false, error: "File is empty." };
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: "File must be 10 MB or smaller." };
  }

  if (isHeicOrHeif(buffer)) {
    return {
      ok: false,
      error: "HEIC/HEIF images are not supported. Please export the photo as JPEG or PNG first.",
    };
  }

  const sniffedType = detectImageTypeFromBuffer(buffer);
  const extension = getSafeImageExtension(filename);
  const normalizedReportedType = reportedType.trim().toLowerCase();
  const extensionMime = extension ? EXTENSION_TO_MIME[extension] : null;

  let mimeType = sniffedType;

  if (!mimeType && ALLOWED_IMAGE_TYPES.has(normalizedReportedType)) {
    mimeType = normalizedReportedType;
  }

  if (!mimeType && extensionMime && GENERIC_MIME_TYPES.has(normalizedReportedType)) {
    mimeType = extensionMime;
  }

  if (!mimeType || !ALLOWED_IMAGE_TYPES.has(mimeType)) {
    return {
      ok: false,
      error: "Only JPEG, PNG, WebP, and GIF images are allowed.",
    };
  }

  const resolvedExtension = getExtensionFromMimeType(mimeType) ?? extension;
  if (!resolvedExtension) {
    return { ok: false, error: "Unsupported file extension." };
  }

  return { ok: true, mimeType, extension: resolvedExtension };
}

/** @deprecated Use validateImageBuffer after reading the file bytes. */
export function validateImageUpload(file: File): string | null {
  if (file.size <= 0) {
    return "File is empty.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File must be 10 MB or smaller.";
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type) && !GENERIC_MIME_TYPES.has(file.type)) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed.";
  }

  const extension = getSafeImageExtension(file.name);
  if (!extension) {
    return "Unsupported file extension.";
  }

  return null;
}

export function getExtensionFromMimeType(type: string): string | null {
  switch (type) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return null;
  }
}

export function getSafeImageExtension(filename: string): string | null {
  const match = filename.toLowerCase().match(/\.[a-z0-9]+$/);
  const extension = match?.[0] ?? "";
  return ALLOWED_EXTENSIONS.has(extension) ? extension : null;
}
