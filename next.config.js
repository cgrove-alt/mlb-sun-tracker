/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.DEPLOY_TARGET === 'github-pages';

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  // Add basePath for GitHub Pages
  basePath: isProd && isGitHubPages ? '/mlb-sun-tracker' : '',
  assetPrefix: isProd && isGitHubPages ? '/mlb-sun-tracker/' : '',
  // Static export for GitHub Pages
  output: 'export',
  // Image optimization now works with server deployment
  images: {
    domains: ['statsapi.mlb.com', 'api.open-meteo.com'],
    unoptimized: true,
  },
  // Compress output
  compress: true,
  // Compiler optimizations for modern browsers
  compiler: {
    // Remove console logs in production
    removeConsole: isProd,
  },
  // Experimental features to reduce bundle size
  experimental: {
    // Reduce the number of modules that Next.js processes
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  // Optimize webpack configuration
  webpack: (config, { isServer, webpack }) => {
    // Optimize CSS loading
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            styles: {
              name: 'styles',
              test: /\.(css|scss)$/,
              chunks: 'all',
              enforce: true,
              priority: 20,
            },
            // Separate critical CSS
            critical: {
              name: 'critical',
              test: /critical.*\.css$/,
              chunks: 'all',
              enforce: true,
              priority: 30,
            },
          },
        },
      };
      
      // Skip polyfills for modern JavaScript features
      config.resolve.alias = {
        ...config.resolve.alias,
        'core-js': false,
        '@babel/runtime': false,
      };
      
      // Exclude polyfills from bundle
      config.externals = {
        ...config.externals,
        'core-js': 'null',
        '@babel/runtime': 'null',
      };
      
      // Use modern JavaScript target
      config.target = ['web', 'es2020'];
      
      // Modify webpack to skip certain polyfills
      config.plugins.push(
        new webpack.NormalModuleReplacementPlugin(
          /\/polyfills\//,
          require.resolve('./scripts/empty.js')
        )
      );
    }
    
    // Add webpack plugin to analyze bundle
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      );
    }
    
    return config;
  },
  // Add cache headers for static assets
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
      {
        // Cache static assets for 1 year
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache _next static assets for 1 year
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache images for 1 year
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts for 1 year
        source: '/:all*(woff|woff2|ttf|eot)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache JavaScript and CSS for 1 year (with revalidation)
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Cache HTML pages for shorter time with revalidation
        source: '/:path*(html)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Service worker should not be cached
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Manifest should have short cache
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
};

// Import and configure next-pwa
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.open-meteo\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'weather-api-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 30 * 60, // 30 minutes
        },
      },
    },
    {
      urlPattern: /^https:\/\/statsapi\.mlb\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'mlb-api-cache',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 60 * 60, // 1 hour
        },
      },
    },
    {
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days (increased from 7)
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(woff|woff2|ttf|eot)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'font-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'next-static-cache',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days (increased from 1)
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
    {
      urlPattern: /\.(json)$/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'data-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 5 * 60, // 5 minutes
        },
        networkTimeoutSeconds: 3,
      },
    },
    {
      urlPattern: /\/stadium\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'stadium-pages-cache',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
        },
        networkTimeoutSeconds: 3,
      },
    },
  ],
});

module.exports = withPWA(nextConfig);