import { convertUploadToWebp } from "@/lib/image-processing";
import { convertUploadToMp4 } from "@/lib/video-processing";

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".heic",
  ".heif",
]);

const EXTENSION_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".heic": "image/heic",
  ".heif": "image/heif",
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

  const sniffedType = isHeicOrHeif(buffer) ? "image/heic" : detectImageTypeFromBuffer(buffer);
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
      error: "Only JPEG, PNG, WebP, GIF, and HEIC images are allowed.",
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
    return "Only JPEG, PNG, WebP, GIF, and HEIC images are allowed.";
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
    case "image/heic":
    case "image/heif":
      return ".heic";
    default:
      return null;
  }
}

type PreparedWebpResult = { ok: true; webp: Buffer } | { ok: false; error: string };

export async function prepareUploadWebp(
  buffer: Buffer,
  filename: string,
  reportedType = "",
): Promise<PreparedWebpResult> {
  const validation = validateImageBuffer(buffer, filename, reportedType);
  if (!validation.ok) {
    return validation;
  }

  try {
    const webp = await convertUploadToWebp(buffer, validation.mimeType);
    if (webp.length > MAX_FILE_SIZE_BYTES) {
      return { ok: false, error: "Processed image must be 10 MB or smaller." };
    }
    return { ok: true, webp };
  } catch {
    return { ok: false, error: "Could not process image. Try a different file." };
  }
}

/** @deprecated Use prepareUploadWebp */
export async function prepareUploadJpeg(
  buffer: Buffer,
  filename: string,
  reportedType = "",
): Promise<{ ok: true; jpeg: Buffer } | { ok: false; error: string }> {
  const result = await prepareUploadWebp(buffer, filename, reportedType);
  if (!result.ok) return result;
  return { ok: true, jpeg: result.webp };
}

type PreparedVideoResult =
  | { ok: true; data: Buffer; extension: string }
  | { ok: false; error: string };

const MAX_STORED_VIDEO_BYTES = 120 * 1024 * 1024;

/** Browser-friendly formats stored as-is (avoids slow re-encode behind Cloudflare ~100s limit). */
const PASSTHROUGH_VIDEO_EXTENSIONS = new Set([".webm", ".mp4", ".m4v", ".mov"]);

export async function prepareUploadVideo(
  buffer: Buffer,
  filename: string,
  reportedType = "",
): Promise<PreparedVideoResult> {
  const validation = validateVideoFile(buffer, filename, reportedType);
  if (!validation.ok) {
    return validation;
  }

  try {
    if (PASSTHROUGH_VIDEO_EXTENSIONS.has(validation.extension)) {
      if (buffer.length > MAX_STORED_VIDEO_BYTES) {
        return { ok: false, error: "Video is too large. Try a shorter clip or lower resolution." };
      }
      return { ok: true, data: buffer, extension: validation.extension };
    }

    const mp4 = await convertUploadToMp4(buffer, validation.extension);
    if (mp4.length > MAX_STORED_VIDEO_BYTES) {
      return { ok: false, error: "Converted video is too large. Try a shorter clip." };
    }
    return { ok: true, data: mp4, extension: ".mp4" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not process video.";
    return { ok: false, error: message };
  }
}

/** @deprecated Use prepareUploadVideo */
export async function prepareUploadWebm(
  buffer: Buffer,
  filename: string,
  reportedType = "",
): Promise<{ ok: true; webm: Buffer } | { ok: false; error: string }> {
  const result = await prepareUploadVideo(buffer, filename, reportedType);
  if (!result.ok) return result;
  return { ok: true, webm: result.data };
}

export function getSafeImageExtension(filename: string): string | null {
  const match = filename.toLowerCase().match(/\.[a-z0-9]+$/);
  const extension = match?.[0] ?? "";
  return ALLOWED_EXTENSIONS.has(extension) ? extension : null;
}

const ALLOWED_VIDEO_TYPES = new Set([
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-msvideo",
  "video/x-matroska",
  "video/ogg",
]);
const ALLOWED_VIDEO_EXTENSIONS = new Set([
  ".mp4",
  ".webm",
  ".mov",
  ".avi",
  ".mkv",
  ".ogv",
  ".m4v",
]);
const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;

type VideoValidationResult =
  | { ok: true; mimeType: string; extension: string }
  | { ok: false; error: string };

export function validateVideoFile(
  buffer: Buffer,
  filename: string,
  reportedType = "",
): VideoValidationResult {
  if (buffer.length > MAX_VIDEO_SIZE_BYTES) {
    return { ok: false, error: "Video must be 100 MB or smaller." };
  }

  const extMatch = filename.toLowerCase().match(/\.[a-z0-9]+$/);
  const extension = extMatch?.[0] ?? "";

  let mimeType = reportedType;
  if (!ALLOWED_VIDEO_TYPES.has(mimeType)) {
    if (ALLOWED_VIDEO_EXTENSIONS.has(extension)) {
      mimeType =
        extension === ".webm"
          ? "video/webm"
          : extension === ".mov"
            ? "video/quicktime"
            : "video/mp4";
    } else if (buffer.length >= 12 && buffer.subarray(4, 8).toString("ascii") === "ftyp") {
      mimeType = "video/mp4";
    } else if (buffer.length >= 4 && buffer.subarray(0, 4).toString("ascii") === "RIFF") {
      mimeType = "video/webm";
    } else {
      if (ALLOWED_VIDEO_EXTENSIONS.has(extension)) {
        mimeType = "video/mp4";
      } else {
        return {
          ok: false,
          error: "Unsupported video format. Upload MP4, MOV, WebM, AVI, or MKV.",
        };
      }
    }
  }

  const safeExt = ALLOWED_VIDEO_EXTENSIONS.has(extension)
    ? extension
    : mimeType === "video/webm"
      ? ".webm"
      : mimeType === "video/quicktime"
        ? ".mov"
        : mimeType === "video/x-msvideo"
          ? ".avi"
          : mimeType === "video/x-matroska"
            ? ".mkv"
            : ".mp4";

  return { ok: true, mimeType, extension: safeExt };
}
