import convert from "heic-convert";
import sharp from "sharp";

const WEBP_QUALITY = 88;

const HEIC_MIME_TYPES = new Set(["image/heic", "image/heif"]);

export async function convertUploadToWebp(buffer: Buffer, mimeType: string): Promise<Buffer> {
  let input = buffer;

  if (HEIC_MIME_TYPES.has(mimeType)) {
    const output = await convert({
      buffer,
      format: "JPEG",
      quality: 0.92,
    });
    input = Buffer.from(output);
  }

  return sharp(input)
    .rotate()
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();
}

/** @deprecated Use convertUploadToWebp — uploads are stored as WebP only. */
export async function convertUploadToJpeg(buffer: Buffer, mimeType: string): Promise<Buffer> {
  return convertUploadToWebp(buffer, mimeType);
}
