const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export function validateImageUpload(file: File): string | null {
  if (file.size <= 0) {
    return "File is empty.";
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return "File must be 10 MB or smaller.";
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Only JPEG, PNG, WebP, and GIF images are allowed.";
  }

  const extension = getSafeImageExtension(file.name);
  if (!extension) {
    return "Unsupported file extension.";
  }

  return null;
}

export function getSafeImageExtension(filename: string): string | null {
  const match = filename.toLowerCase().match(/\.[a-z0-9]+$/);
  const extension = match?.[0] ?? "";
  return ALLOWED_EXTENSIONS.has(extension) ? extension : null;
}
