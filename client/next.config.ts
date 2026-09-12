import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // These packages use Node.js-only APIs (native bindings, fs, etc.) and
  // must never be bundled by the browser-facing Webpack/Turbopack pass.
  serverExternalPackages: [
    "mongoose",
    "nodemailer",
    "googleapis",
    "bcryptjs",
    "jsonwebtoken",
    "google-auth-library",
  ],
  images: {
    remotePatterns: [
      // Blog/treatment images uploaded through the admin CMS are hosted on
      // Vercel Blob (see lib/server/services/media.service.ts) — without
      // this, next/image throws at render time for every uploaded image.
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
