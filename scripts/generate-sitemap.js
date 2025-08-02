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
const mlsVenues = venuesArray.filter(v => v.league === 'MLS').map(v => v.id);
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
  'league/mls',
  'league/milb',
  'league/milb/aaa',
  'league/milb/aa',
  'league/milb/a+',
  'league/milb/a'
];

const baseUrl = 'https://mlbsuntracker.com';

// Generate sitemap entries
let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

// Add static pages
staticPages.forEach(page => {
  const priority = page === '' ? '1.0' : page.startsWith('guide') ? '0.8' : '0.5';
  sitemap += `
  <url>
    <loc>${baseUrl}/${page}</loc>
    <changefreq>${page === '' ? 'daily' : 'weekly'}</changefreq>
    <priority>${priority}</priority>
  </url>`;
});

// Add league pages
leaguePages.forEach(page => {
  sitemap += `
  <url>
    <loc>${baseUrl}/${page}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
});

// Add MLB stadium pages (both old and new URLs)
mlbVenues.forEach(venue => {
  // Old URL structure
  sitemap += `
  <url>
    <loc>${baseUrl}/stadium/${venue}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
  
  // New URL structure
  sitemap += `
  <url>
    <loc>${baseUrl}/venue/${venue}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
});

// Add NFL venue pages
nflVenues.forEach(venue => {
  sitemap += `
  <url>
    <loc>${baseUrl}/venue/${venue}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

// Add MLS venue pages
mlsVenues.forEach(venue => {
  sitemap += `
  <url>
    <loc>${baseUrl}/venue/${venue}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
});

// Add MiLB venue pages
milbVenues.forEach(venue => {
  sitemap += `
  <url>
    <loc>${baseUrl}/venue/${venue}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
});

sitemap += `
</urlset>`;

// Write sitemap
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
fs.writeFileSync(sitemapPath, sitemap);

// Calculate stats
const totalUrls = staticPages.length + leaguePages.length + 
                 (mlbVenues.length * 2) + // MLB has both /stadium and /venue URLs
                 nflVenues.length + 
                 mlsVenues.length + 
                 milbVenues.length;

console.log(`✓ Sitemap generated with ${totalUrls} URLs`);
console.log(`  - ${mlbVenues.length} MLB stadiums`);
console.log(`  - ${nflVenues.length} NFL venues`);
console.log(`  - ${mlsVenues.length} MLS venues`);
console.log(`  - ${milbVenues.length} MiLB stadiums`);
console.log(`  - ${staticPages.length} static pages`);
console.log(`  - ${leaguePages.length} league/level pages`);
console.log(`✓ Saved to: ${sitemapPath}`);