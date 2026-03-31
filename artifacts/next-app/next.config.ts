import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.replit.dev",
    "*.repl.co",
    "*.picard.replit.dev",
    process.env.REPLIT_DEV_DOMAIN ?? "",
    process.env.REPLIT_DOMAINS ?? "",
  ].filter(Boolean),
};

export default nextConfig;
