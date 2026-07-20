const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better debugging
  reactStrictMode: true,
  
  // Optimize production builds
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Bundle splitting: use Next.js's built-in splitChunks defaults.
    //
    // The previous hand-rolled cacheGroups forced EVERY src/data/* module into a
    // single enforced `data` chunk (`name:'data'`, `enforce:true`) and hoisted
    // any module shared by ≥2 chunks into an enforced global `common` chunk.
    // Because a few always-needed data files (e.g. venueCount) load on first
    // paint, webpack marked the whole merged blob — all ~240 venues' section and
    // guide data — as a first-load dependency, defeating the per-venue dynamic
    // imports in getStadiumSections.ts. Deleting the custom group but keeping the
    // greedy `common` group just relocated the bloat into `common` (first-load on
    // every page, including static ones). Next's default splitChunks keeps
    // dynamic imports as on-demand async chunks and only hoists genuinely-shared,
    // size-appropriate modules, so a page loads only the venue data it needs
    // without taxing unrelated static pages.
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
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
    // Three.js removed from codebase
  },
  
  // Output configuration
  output: 'standalone',
  
  // Reduce build output verbosity
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Permanent 301 redirects — /venue/* was consolidated into the single
  // canonical /stadium/* URL pattern (audit Phase 1). statusCode: 301 is used
  // explicitly instead of `permanent: true` (which emits 308) to match the
  // audit's requirement and long-standing SEO expectations.
  async redirects() {
    return [
      {
        source: '/venue/:venueId',
        destination: '/stadium/:venueId',
        statusCode: 301,
      },
    ];
  },

  // Headers for caching
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
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);