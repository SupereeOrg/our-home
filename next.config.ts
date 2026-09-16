import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "is1-ssl.mzstatic.com" },
      { protocol: "http", hostname: "is1-ssl.mzstatic.com" },
    ],
  },
};

export default nextConfig;
