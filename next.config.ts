import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb"
    }
  },
  crossOrigin: "anonymous"
};

export default nextConfig;
