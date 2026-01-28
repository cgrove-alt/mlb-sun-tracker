const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better debugging
  reactStrictMode: true,

  // Enable compression
  compress: true,

  // Optimize production builds
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle splitting
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          maxAsyncRequests: 25,
          minSize: 20000,
          cacheGroups: {
            default: false,
            vendors: false,
            // Split vendor code - only load when components need it
            vendor: {
              name: 'vendor',
              chunks: 'async', // Changed: only load vendor code for async chunks
              test: /node_modules/,
              priority: 20,
              maxSize: 200000, // Smaller chunks for better lazy loading
            },
            // Split large data files - only load when needed
            data: {
              name: 'data',
              test: /[\\/]src[\\/]data[\\/]/,
              chunks: 'async', // Changed from 'all' to 'async' - only load when needed
              priority: 25,
              enforce: true,
            },
            // Common chunks - shared between async loaded components
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'async', // Changed: only share between async chunks
              priority: 10,
              reuseExistingChunk: true,
              enforce: true,
              maxSize: 150000, // Smaller for faster loading
            },
            // React/Next.js framework chunks
            react: {
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
              name: 'react',
              chunks: 'all',
              priority: 30,
            },
          },
        },
        runtimeChunk: {
          name: 'runtime',
        },
        moduleIds: 'deterministic',
      };
    }
    
    // Reduce moment.js size by removing unused locales
    config.plugins = config.plugins || [];
    
    return config;
  },
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Experimental features for better performance
  experimental: {
    // Optimize package imports to reduce bundle size
    optimizePackageImports: ['lucide-react', 'date-fns'],
    // Enable optimized CSS with critters
    optimizeCss: true,
  },
  
  // Output configuration
  output: 'standalone',
  
  // Reduce build output verbosity
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Headers for caching and performance
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=10, stale-while-revalidate=59',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);