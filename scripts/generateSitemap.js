const { MLB_STADIUMS } = require('../src/data/stadiums');

const baseUrl = 'https://theshadium.com';
const today = new Date().toISOString().split('T')[0];

const staticPages = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/guide', priority: '0.9', changefreq: 'monthly' },
  { path: '/guide/how-to-find-shaded-seats', priority: '0.8', changefreq: 'monthly' },
  { path: '/guide/best-shaded-seats-mlb', priority: '0.8', changefreq: 'monthly' },
  { path: '/guide/avoid-sun-baseball-games', priority: '0.8', changefreq: 'monthly' },
  { path: '/faq', priority: '0.8', changefreq: 'monthly' },
];

const stadiumPages = MLB_STADIUMS.map(stadium => ({
  path: `/stadium/${stadium.id}`,
  priority: '0.8',
  changefreq: 'monthly'
}));

const allPages = [...staticPages, ...stadiumPages];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map(page => `  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

console.log(sitemap);