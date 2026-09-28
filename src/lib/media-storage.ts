import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prepareUploadWebp, prepareUploadWebm } from "@/lib/upload";

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
  const prepared = await prepareUploadWebm(buffer, file.name, file.type);
  if (!prepared.ok) {
    return { error: prepared.error };
  }

  await mkdir(absoluteDir, { recursive: true });
  const filename = `${randomUUID()}.webm`;
  await writeFile(path.join(absoluteDir, filename), prepared.webm);
  return { url: `${publicUrlPrefix}/${filename}` };
}
