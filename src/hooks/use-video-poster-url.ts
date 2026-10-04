"use client";

import { useEffect, useState } from "react";

const SEEK_SECONDS = 0.05;

/**
 * Captures a JPEG poster from the first frame of a same-origin product video.
 */
export function useVideoPosterUrl(videoUrl: string | null | undefined): string | undefined {
  const [posterUrl, setPosterUrl] = useState<string | undefined>();

  useEffect(() => {
    if (!videoUrl) {
      setPosterUrl(undefined);
      return;
    }

    const video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "metadata";

    let cancelled = false;

    const captureFrame = () => {
      if (cancelled || video.videoWidth === 0) return;
      try {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.drawImage(video, 0, 0);
        setPosterUrl(canvas.toDataURL("image/jpeg", 0.82));
      } catch {
        setPosterUrl(undefined);
      }
    };

    const onLoadedData = () => {
      const target = Number.isFinite(video.duration)
        ? Math.min(SEEK_SECONDS, video.duration * 0.02)
        : SEEK_SECONDS;
      video.currentTime = target;
    };

    video.addEventListener("loadeddata", onLoadedData);
    video.addEventListener("seeked", captureFrame);
    video.addEventListener("error", () => {
      if (!cancelled) setPosterUrl(undefined);
    });
    video.src = videoUrl;

    return () => {
      cancelled = true;
      video.removeEventListener("loadeddata", onLoadedData);
      video.removeEventListener("seeked", captureFrame);
      video.removeAttribute("src");
      video.load();
    };
  }, [videoUrl]);

  return posterUrl;
}
