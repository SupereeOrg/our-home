import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "is1-ssl.mzstatic.com" }],
  },
};

export default nextConfig;
