import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // Only run ESLint in strict mode, skip during builds to avoid Vercel issues
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
