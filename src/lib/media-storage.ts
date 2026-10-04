import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prepareUploadVideo, prepareUploadWebp } from "@/lib/upload";

export async function saveUploadedImageFile(
  file: File,
  absoluteDir: string,
  publicUrlPrefix: string,
): Promise<{ url: string } | { error: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const prepared = await prepareUploadWebp(buffer, file.name, file.type);
  if (!prepared.ok) {
    return { error: prepared.error };
  }

  await mkdir(absoluteDir, { recursive: true });
  const filename = `${randomUUID()}.webp`;
  await writeFile(path.join(absoluteDir, filename), prepared.webp);
  return { url: `${publicUrlPrefix}/${filename}` };
}

export async function saveUploadedVideoFile(
  file: File,
  absoluteDir: string,
  publicUrlPrefix: string,
): Promise<{ url: string } | { error: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const prepared = await prepareUploadVideo(buffer, file.name, file.type);
  if (!prepared.ok) {
    return { error: prepared.error };
  }

  await mkdir(absoluteDir, { recursive: true });
  const filename = `${randomUUID()}${prepared.extension}`;
  await writeFile(path.join(absoluteDir, filename), prepared.data);
  return { url: `${publicUrlPrefix}/${filename}` };
}
