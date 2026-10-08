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
  // Lets the dev server's hot-reload work when previewing on another device
  // on the same network (e.g. testing on a phone via the LAN IP).
  allowedDevOrigins: ["192.168.233.1"],
};

export default nextConfig;
