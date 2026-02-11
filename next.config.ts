import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Augmenter la limite à 10MB
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qa0fgt7tclbmfqew.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      { protocol: 'https', hostname: 'localhost' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'hgnwadiljauqbhsbtxkk.supabase.co' },
    ],
    // Optimiser le format des images
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 85],
  },
  // Optimisations de performance
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  // Compression gzip
  compress: true,
  // Optimisation du chunking
  webpack: (config) => {
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    };
    return config;
  },
};

export default nextConfig;
