import type { NextConfig } from "next";

/**
 * Remote images are only used for demo photography during development.
 * When product media moves to Heritage Loom's own object storage, add that
 * host here (e.g. "media.heritageloom.bt") and remove Unsplash.
 */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
