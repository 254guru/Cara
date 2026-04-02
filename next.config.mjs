import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.dummyjson.com',
      },
      {
        protocol: 'https',
        hostname: 'fakestoreapi.com',
      },
      {
        protocol: 'https',
        hostname: 'i.dummyjson.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (config) => {
    config.resolve.alias['.prisma/client'] = path.resolve(
      __dirname,
      'node_modules/.prisma/client',
    );
    return config;
  },
};

export default nextConfig;
