const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Read venues from the generated unifiedVenues.ts file
const unifiedVenuesPath = path.join(__dirname, '../src/data/unifiedVenues.ts');
const unifiedVenuesContent = fs.readFileSync(unifiedVenuesPath, 'utf-8');

// Extract the venues array from the TypeScript file
const venuesMatch = unifiedVenuesContent.match(/export const ALL_UNIFIED_VENUES: UnifiedVenue\[\] = (\[[\s\S]*?\]);/);
if (!venuesMatch) {
  console.error('Could not parse venues from unifiedVenues.ts');
  process.exit(1);
}

// Parse the venues array
const venuesArray = eval(venuesMatch[1]);

// Group venues by league
const mlbVenues = venuesArray.filter(v => v.league === 'MLB').map(v => v.id);
const nflVenues = venuesArray.filter(v => v.league === 'NFL').map(v => v.id);
const milbVenues = venuesArray.filter(v => v.league === 'MiLB').map(v => v.id);

// Read blog posts from content/blog
const blogDir = path.join(__dirname, '../content/blog');
let blogPosts = [];
try {
  blogPosts = fs.readdirSync(blogDir)
    .filter(f => f.endsWith('.mdx'))
    .map(f => {
      const fullPath = path.join(blogDir, f);
      const raw = fs.readFileSync(fullPath, 'utf-8');
      const { data } = matter(raw);
      const slug = f.replace(/\.mdx$/, '');
      const dateISO = data.date
        ? new Date(data.date).toISOString().split('T')[0]
        : new Date(fs.statSync(fullPath).mtime).toISOString().split('T')[0];
      return { slug, lastmod: dateISO };
    });
} catch (err) {
  console.warn('No blog posts found or error reading them:', err.message);
}

// Static pages
const staticPages = [
  '',
  'faq',
  'privacy',
  'terms',
  'guide',
  'guide/best-shaded-seats-mlb',
  'guide/how-to-find-shaded-seats',
  'guide/avoid-sun-baseball-games',
  'seats-shade-finder',
  'accessibility',
  'do-not-sell',
  'privacy-rights',
  'blog'
];

// League pages
const leaguePages = [
  'league/mlb',
  'league/nfl',
  'league/milb',
  'league/milb/aaa',
  'league/milb/aa',
  'league/milb/a+',
  'league/milb/a'
];

const baseUrl = 'https://theshadium.com';
const buildDate = new Date().toISOString().split('T')[0];

const urlEntry = (loc, { changefreq = 'weekly', priority = '0.5', lastmod = buildDate } = {}) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

// Generate main sitemap with static pages and league pages
let mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

staticPages.forEach(page => {
  const priority = page === '' ? '1.0' : page.startsWith('guide') ? '0.8' : '0.5';
  const changefreq = page === '' ? 'daily' : 'weekly';
  mainSitemap += urlEntry(`${baseUrl}/${page}`, { changefreq, priority });
});

leaguePages.forEach(page => {
  mainSitemap += urlEntry(`${baseUrl}/${page}`, { changefreq: 'weekly', priority: '0.7' });
});

mainSitemap += `
</urlset>`;

// Generate stadiums sitemap with all venue pages
let stadiumsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

mlbVenues.forEach(venue => {
  stadiumsSitemap += urlEntry(`${baseUrl}/stadium/${venue}`, { changefreq: 'weekly', priority: '0.9' });
  stadiumsSitemap += urlEntry(`${baseUrl}/venue/${venue}`, { changefreq: 'weekly', priority: '0.9' });
});

nflVenues.forEach(venue => {
  stadiumsSitemap += urlEntry(`${baseUrl}/venue/${venue}`, { changefreq: 'weekly', priority: '0.8' });
});

milbVenues.forEach(venue => {
  stadiumsSitemap += urlEntry(`${baseUrl}/venue/${venue}`, { changefreq: 'weekly', priority: '0.7' });
});

stadiumsSitemap += `
</urlset>`;

// Generate guides sitemap
let guidesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

const guidePaths = staticPages.filter(page => page.startsWith('guide'));
guidePaths.forEach(page => {
  guidesSitemap += urlEntry(`${baseUrl}/${page}`, { changefreq: 'weekly', priority: '0.8' });
});

guidesSitemap += urlEntry(`${baseUrl}/blog`, { changefreq: 'daily', priority: '0.8' });

guidesSitemap += `
</urlset>`;

// Generate blog sitemap
let blogSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

blogPosts.forEach(({ slug, lastmod }) => {
  blogSitemap += urlEntry(`${baseUrl}/blog/${slug}`, {
    changefreq: 'monthly',
    priority: '0.7',
    lastmod,
  });
});

blogSitemap += `
</urlset>`;

// Generate sitemap index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${buildDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-stadiums.xml</loc>
    <lastmod>${buildDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-guides.xml</loc>
    <lastmod>${buildDate}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-blog.xml</loc>
    <lastmod>${buildDate}</lastmod>
  </sitemap>
</sitemapindex>`;

// Write sitemaps
const publicDir = path.join(__dirname, '../public');
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainSitemap);
fs.writeFileSync(path.join(publicDir, 'sitemap-stadiums.xml'), stadiumsSitemap);
fs.writeFileSync(path.join(publicDir, 'sitemap-guides.xml'), guidesSitemap);
fs.writeFileSync(path.join(publicDir, 'sitemap-blog.xml'), blogSitemap);
fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex);

// Calculate stats
const mainUrls = staticPages.length + leaguePages.length;
const stadiumUrls = (mlbVenues.length * 2) + nflVenues.length + milbVenues.length;
const guideUrls = guidePaths.length + 1; // +1 for /blog
const blogUrls = blogPosts.length;
const totalUrls = mainUrls + stadiumUrls + guideUrls + blogUrls;

console.log(`✓ Sitemaps generated with ${totalUrls} total URLs (build date: ${buildDate})`);
console.log(`  Main sitemap: ${mainUrls} URLs (static + league pages)`);
console.log(`  Stadiums sitemap: ${stadiumUrls} URLs`);
console.log(`    - ${mlbVenues.length} MLB stadiums (x2 for old/new URLs)`);
console.log(`    - ${nflVenues.length} NFL venues`);
console.log(`    - ${milbVenues.length} MiLB stadiums`);
console.log(`  Guides sitemap: ${guideUrls} URLs`);
console.log(`  Blog sitemap: ${blogUrls} URLs`);
console.log(`✓ Saved to: ${publicDir}/`);
console.log(`  - sitemap.xml`);
console.log(`  - sitemap-stadiums.xml`);
console.log(`  - sitemap-guides.xml`);
console.log(`  - sitemap-blog.xml`);
console.log(`  - sitemap-index.xml`);
