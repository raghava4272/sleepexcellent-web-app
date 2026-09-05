import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.SLEEPEXCELLENT_DIST_DIR ?? ".next",
};

export default nextConfig;
