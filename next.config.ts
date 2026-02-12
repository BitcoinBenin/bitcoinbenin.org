import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Augmenter la limite à 10MB
    },
  },
  // Cible navigateurs modernes pour réduire les polyfills
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
    // Désactiver les polyfills SWC pour features modernes
    styledComponents: false,
    // Optimiser le chargement CSS
    emotion: false,
  },
  // Compression gzip
  compress: true,
  // Optimisation du chunking et réduction des polyfills
  webpack: (config, { isServer, dev }) => {
    // Réduire les polyfills côté client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
      
      // Ignorer les polyfills pour features modernes en production
      if (!dev) {
        config.resolve.alias = {
          ...config.resolve.alias,
          'core-js': false,
          'regenerator-runtime': false,
        };
      }
    }
    
    // Optimiser le CSS pour réduire le blocage
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        maxSize: 244000, // Limiter la taille des chunks CSS
        minSize: 20000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          styles: {
            name: 'styles',
            test: /\.(css|scss|sass)$/,
            chunks: 'all',
            enforce: true,
            priority: 20,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
          },
        },
      },
    };
    return config;
  },
};

export default nextConfig;
