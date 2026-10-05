import type { NextConfig } from "next";

const extraDevOrigins =
  process.env.ALLOWED_DEV_ORIGINS?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // Product form: multiple images (10 MB each) + video (up to 100 MB).
      bodySizeLimit: "150mb",
    },
    proxyClientMaxBodySize: "150mb",
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  // Required when opening the dev server from another device (phone on LAN or tunnel).
  // Without this, client JS / hydration fails and buttons won't respond to taps.
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "10.107.145.3",
    ...extraDevOrigins,
  ],
  async redirects() {
    return [
      {
        source: "/track-order",
        destination: "/account/orders",
        permanent: true,
      },
      {
        source: "/collections/the-artist",
        destination: "/about",
        permanent: true,
      },
    ];
  },
  images: {
    localPatterns: [
      {
        pathname: "/uploads/**",
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
