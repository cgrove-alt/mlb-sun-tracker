const fs = require('fs');
const path = require('path');

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
  'seats-shade-finder'
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

// Generate main sitemap with static pages and league pages
let mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// Add static pages
staticPages.forEach(page => {
  const priority = page === '' ? '1.0' : page.startsWith('guide') ? '0.8' : '0.5';
  mainSitemap += `
  <url>
    <loc>${baseUrl}/${page}</loc>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${priority}</priority>
  </url>`;
});

// Add league pages
leaguePages.forEach(page => {
  mainSitemap += `
  <url>
    <loc>${baseUrl}/${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
});

mainSitemap += `
</urlset>`;

// Generate stadiums sitemap with all venue pages
let stadiumsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// Add MLB stadium pages (both old and new URLs)
mlbVenues.forEach(venue => {
  // Old URL structure
  stadiumsSitemap += `
  <url>
    <loc>${baseUrl}/stadium/${venue}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;

  // New URL structure
  stadiumsSitemap += `
  <url>
    <loc>${baseUrl}/venue/${venue}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
});

// Add NFL venue pages
nflVenues.forEach(venue => {
  stadiumsSitemap += `
  <url>
    <loc>${baseUrl}/venue/${venue}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

// Add MiLB venue pages
milbVenues.forEach(venue => {
  stadiumsSitemap += `
  <url>
    <loc>${baseUrl}/venue/${venue}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
});

stadiumsSitemap += `
</urlset>`;

// Generate guides sitemap
let guidesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// Add guide pages (already included in staticPages but separated here for the guides sitemap)
const guidePaths = staticPages.filter(page => page.startsWith('guide'));
guidePaths.forEach(page => {
  guidesSitemap += `
  <url>
    <loc>${baseUrl}/${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

// Add blog guide page
guidesSitemap += `
  <url>
    <loc>${baseUrl}/blog</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

guidesSitemap += `
</urlset>`;

// Generate sitemap index
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-stadiums.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-guides.xml</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </sitemap>
</sitemapindex>`;

// Write sitemaps
const publicDir = path.join(__dirname, '../public');
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainSitemap);
fs.writeFileSync(path.join(publicDir, 'sitemap-stadiums.xml'), stadiumsSitemap);
fs.writeFileSync(path.join(publicDir, 'sitemap-guides.xml'), guidesSitemap);
fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex);

// Calculate stats
const mainUrls = staticPages.length + leaguePages.length;
const stadiumUrls = (mlbVenues.length * 2) + nflVenues.length + milbVenues.length;
const guideUrls = guidePaths.length + 1; // +1 for /blog
const totalUrls = mainUrls + stadiumUrls + guideUrls;

console.log(`✓ Sitemaps generated with ${totalUrls} total URLs`);
console.log(`  Main sitemap: ${mainUrls} URLs (static + league pages)`);
console.log(`  Stadiums sitemap: ${stadiumUrls} URLs`);
console.log(`    - ${mlbVenues.length} MLB stadiums (x2 for old/new URLs)`);
console.log(`    - ${nflVenues.length} NFL venues`);
console.log(`    - ${milbVenues.length} MiLB stadiums`);
console.log(`  Guides sitemap: ${guideUrls} URLs`);
console.log(`✓ Saved to: ${publicDir}/`);
console.log(`  - sitemap.xml`);
console.log(`  - sitemap-stadiums.xml`);
console.log(`  - sitemap-guides.xml`);
console.log(`  - sitemap-index.xml`);