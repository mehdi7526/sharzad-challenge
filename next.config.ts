import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  output: 'standalone',
};

export default nextConfig;
