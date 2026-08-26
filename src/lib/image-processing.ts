import convert from "heic-convert";
import sharp from "sharp";

const JPEG_QUALITY = 90;

const HEIC_MIME_TYPES = new Set(["image/heic", "image/heif"]);

export async function convertUploadToJpeg(buffer: Buffer, mimeType: string): Promise<Buffer> {
  if (HEIC_MIME_TYPES.has(mimeType)) {
    const output = await convert({
      buffer,
      format: "JPEG",
      quality: JPEG_QUALITY / 100,
    });
    return Buffer.from(output);
  }

  return sharp(buffer)
    .rotate()
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();
}
