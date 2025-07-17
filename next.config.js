/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static export for GitHub Pages compatibility
  output: 'export',
  trailingSlash: true,
  basePath: '/mlb-sun-tracker',
  assetPrefix: '/mlb-sun-tracker/',
  // Disable image optimization for static export
  images: {
    unoptimized: true,
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
      urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'image-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: /\.(js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources',
        expiration: {
          maxEntries: 60,
          maxAgeSeconds: 24 * 60 * 60, // 1 day
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
      },
    },
  ],
});

module.exports = withPWA(nextConfig);