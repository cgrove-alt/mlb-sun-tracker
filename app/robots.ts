import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default: allow all search engines
      {
        userAgent: '*',
        allow: ['/', '/stadiums', '/guide', '/blog', '/faq', '/contact'],
        disallow: [
          '/admin',
          '/api/private',
          '/.env',
          '/config',
          '/_next/static',
          '/.git',
          '/node_modules',
          '/src',
          '/scripts',
          '/tests',
          '/temp',
          '/tmp',
          '/draft',
          '/staging',
          '/api/user/',
          '/api/auth/',
          '/api/analytics/',
        ],
      },
      // Google — no crawl delay
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      // Bing — no crawl delay
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
      // AI bots — explicitly allowed
      {
        userAgent: 'GPTBot',
        allow: '/',
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
      },
      {
        userAgent: 'PerplexityBot',
        allow: '/',
      },
      {
        userAgent: 'ClaudeBot',
        allow: '/',
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
      },
      // Block bad bots
      {
        userAgent: 'AhrefsBot',
        disallow: '/',
      },
      {
        userAgent: 'SemrushBot',
        disallow: '/',
      },
      {
        userAgent: 'MJ12bot',
        disallow: '/',
      },
      {
        userAgent: 'DotBot',
        disallow: '/',
      },
      {
        userAgent: 'MegaIndex',
        disallow: '/',
      },
      {
        userAgent: 'PetalBot',
        disallow: '/',
      },
      {
        userAgent: 'AspiegelBot',
        disallow: '/',
      },
      {
        userAgent: 'DataForSeoBot',
        disallow: '/',
      },
    ],
    sitemap: 'https://theshadium.com/sitemap.xml',
  };
}
