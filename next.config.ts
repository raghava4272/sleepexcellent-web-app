import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.SLEEPEXCELLENT_DIST_DIR ?? ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fwbictbkdlqywhzrcdjq.supabase.co",
        pathname: "/storage/v1/object/public/product-media/**",
      },
    ],
  },
};

export default nextConfig;
