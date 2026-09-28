import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const FFMPEG_TIMEOUT_MS = 5 * 60 * 1000;

export async function convertUploadToWebm(
  inputBuffer: Buffer,
  inputExtension: string,
): Promise<Buffer> {
  const workDir = await mkdtemp(join(tmpdir(), "sgp-video-"));
  const safeExt = inputExtension.startsWith(".") ? inputExtension : `.${inputExtension}`;
  const inputPath = join(workDir, `source${safeExt}`);
  const outputPath = join(workDir, "output.webm");

  try {
    await writeFile(inputPath, inputBuffer);

    await execFileAsync(
      "ffmpeg",
      [
        "-y",
        "-hide_banner",
        "-loglevel",
        "error",
        "-i",
        inputPath,
        "-c:v",
        "libvpx-vp9",
        "-crf",
        "32",
        "-b:v",
        "0",
        "-row-mt",
        "1",
        "-c:a",
        "libopus",
        "-b:a",
        "96k",
        outputPath,
      ],
      { timeout: FFMPEG_TIMEOUT_MS, maxBuffer: 10 * 1024 * 1024 },
    );

    return await readFile(outputPath);
  } catch {
    throw new Error("Could not convert video to WebM. Try a different file or format.");
  } finally {
    await rm(workDir, { recursive: true, force: true });
  }
}
