const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Blog posts that moved to a new slug: old slug -> new slug.
const RENAMED_POSTS = {
  'shaded-seats-minute-maid-park': 'shaded-seats-daikin-park',
  'shaded-seats-guaranteed-rate-field': 'shaded-seats-rate-field',
};

/**
 * 301s for the blog. An unpublished post (`draft: true` in its frontmatter)
 * redirects to its `redirectTo` page, and a renamed slug goes straight to
 * wherever its new slug ends up, so there are no redirect chains.
 */
function blogRedirects() {
  const dir = path.join(__dirname, 'content/blog');
  const unpublished = {};
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.mdx'))) {
    const { data } = matter(fs.readFileSync(path.join(dir, file), 'utf-8'));
    if (data.draft !== true) continue;
    if (typeof data.redirectTo !== 'string' || !data.redirectTo.startsWith('/')) {
      throw new Error(`content/blog/${file}: an unpublished post needs redirectTo (a site path)`);
    }
    unpublished[file.replace(/\.mdx$/, '')] = data.redirectTo;
  }
  const finalUrl = (slug) => unpublished[slug] ?? `/blog/${slug}`;
  return [
    ...Object.entries(unpublished).map(([slug, destination]) => ({ source: `/blog/${slug}`, destination, statusCode: 301 })),
    ...Object.entries(RENAMED_POSTS).map(([from, to]) => ({ source: `/blog/${from}`, destination: finalUrl(to), statusCode: 301 })),
  ];
}

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
      {
        source: '/faqs',
        destination: '/faq',
        statusCode: 301,
      },
      ...blogRedirects(),
    ];
  },

  // Headers for caching
  async headers() {
    return [
      // No Cache-Control for /_next/static here. In production Next.js
      // already serves those content-hashed files as immutable (and
      // vercel.json repeats it). In development the chunk names do not change
      // between edits (`layout.js`), so a year-long immutable header made the
      // browser keep stale or half-downloaded chunks: the page threw
      // "Invalid or unexpected token" and never hydrated.
      //
      // API handlers own their cache policy. A blanket public-cache header
      // here used to overwrite security- and trust-sensitive responses,
      // including the 409 that withholds unvalidated row-level shade data.
      // Weather and validated shade success responses set explicit public
      // caching in their route handlers; everything else stays fail-safe.
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
