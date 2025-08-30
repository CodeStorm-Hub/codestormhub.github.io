import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { 
    unoptimized: true 
  },
  basePath: "/codestormhub.github.io",
  assetPrefix: "/codestormhub.github.io",
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
