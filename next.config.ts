import type { NextConfig } from "next";

declare module "next" {
  interface NextConfig {
    eslint?: {
      ignoreDuringBuilds?: boolean;
    };
  }
}

const nextConfig: NextConfig = {
  /* config options here */
  
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
    unoptimized: true,
  }
};

export default nextConfig;
