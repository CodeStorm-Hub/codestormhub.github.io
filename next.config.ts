import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { 
    unoptimized: true 
  },
  // Only use basePath in production
  ...(process.env.NODE_ENV === 'production' && {
    basePath: "/codestormhub.github.io",
    assetPrefix: "/codestormhub.github.io",
  }),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
