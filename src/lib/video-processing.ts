import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const FFMPEG_TIMEOUT_MS = 5 * 60 * 1000;

async function runFfmpegToFile(
  inputBuffer: Buffer,
  inputExtension: string,
  outputPath: string,
  outputArgs: string[],
): Promise<void> {
  const workDir = await mkdtemp(join(tmpdir(), "sgp-video-"));
  const safeExt = inputExtension.startsWith(".") ? inputExtension : `.${inputExtension}`;
  const inputPath = join(workDir, `source${safeExt}`);

  try {
    await writeFile(inputPath, inputBuffer);
    await execFileAsync(
      "ffmpeg",
      ["-y", "-hide_banner", "-loglevel", "error", "-i", inputPath, ...outputArgs, outputPath],
      { timeout: FFMPEG_TIMEOUT_MS, maxBuffer: 10 * 1024 * 1024 },
    );
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}

/** Fast H.264 MP4 for formats browsers may not play (AVI, MKV, …). */
export async function convertUploadToMp4(
  inputBuffer: Buffer,
  inputExtension: string,
): Promise<Buffer> {
  const workDir = await mkdtemp(join(tmpdir(), "sgp-video-"));
  const outputPath = join(workDir, "output.mp4");

  try {
    await runFfmpegToFile(inputBuffer, inputExtension, outputPath, [
      "-c:v",
      "libx264",
      "-preset",
      "veryfast",
      "-crf",
      "23",
      "-c:a",
      "aac",
      "-b:a",
      "128k",
      "-movflags",
      "+faststart",
    ]);
    return await readFile(outputPath);
  } catch {
    throw new Error("Could not convert video to MP4. Try MP4 or WebM, or a shorter clip.");
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
