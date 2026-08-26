import Image, { type ImageProps } from "next/image";

function shouldBypassOptimizer(src: ImageProps["src"]): boolean {
  return typeof src === "string" && src.startsWith("/uploads/");
}

/** User uploads are served by nginx; skip /_next/image so new files work without restarting Next. */
export function StoreImage({ unoptimized, src, ...props }: ImageProps) {
  return <Image src={src} unoptimized={unoptimized ?? shouldBypassOptimizer(src)} {...props} />;
}
