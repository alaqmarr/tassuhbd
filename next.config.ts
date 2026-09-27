import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3'],
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-fc81bdfd2b07493ab3cae631121e4e99.r2.dev',
      },
    ],
  },
};

export default nextConfig;
