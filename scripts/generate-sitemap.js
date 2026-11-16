const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { execFileSync } = require('child_process');

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
      if (data.draft === true) return null; // unpublished: redirects elsewhere
      const slug = f.replace(/\.mdx$/, '');
      // Prefer dateModified (correction date) over the original publish date so
      // Google sees an accurate lastmod for posts we substantively updated.
      const effective = data.dateModified || data.date;
      const dateISO = effective
        ? new Date(effective).toISOString().split('T')[0]
        : new Date(fs.statSync(fullPath).mtime).toISOString().split('T')[0];
      return { slug, lastmod: dateISO, category: data.category || 'general' };
    })
    .filter(Boolean);
} catch (err) {
  console.warn('No blog posts found or error reading them:', err.message);
}

// Static pages
const staticPages = [
  '',
  'how-it-works',
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

// League pages. There are no per-level MiLB pages (/league/milb/aaa and so
// on 404), so only the three league hubs are listed.
const leaguePages = [
  'league/mlb',
  'league/nfl',
  'league/milb'
];

const baseUrl = 'https://theshadium.com';
const publicDir = path.join(__dirname, '../public');
const repoRoot = path.join(__dirname, '..');
const today = new Date().toISOString().split('T')[0];

// lastmod is the date a page's own source last changed, not the build date.
// That needs the full git history. Vercel builds from a shallow clone, where
// `git log` would date every file to the clone's oldest commit, so there we
// reuse the dates already in the committed sitemaps instead.
const git = (args) => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf-8' }).trim();
let fullHistory = false;
try {
  fullHistory = git(['rev-parse', '--is-shallow-repository']) === 'false';
} catch {
  fullHistory = false;
}

const committedLastmod = new Map();
for (const file of ['sitemap.xml', 'sitemap-stadiums.xml', 'sitemap-guides.xml', 'sitemap-blog.xml']) {
  try {
    const xml = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    for (const [, loc, lastmod] of xml.matchAll(/<loc>([^<]+)<\/loc>\s*<lastmod>([^<]+)<\/lastmod>/g)) {
      committedLastmod.set(loc, lastmod);
    }
  } catch {
    // No committed sitemap yet.
  }
}

/** Last change to any of `sources` (paths or git pathspecs), as YYYY-MM-DD. */
function sourceDate(loc, sources) {
  if (!fullHistory) return committedLastmod.get(loc);
  try {
    if (git(['status', '--porcelain', '--', ...sources])) return today; // edited, not yet committed
    return git(['log', '-1', '--format=%cs', '--', ...sources]) || committedLastmod.get(loc);
  } catch {
    return committedLastmod.get(loc);
  }
}

/** A route's own directory, without the routes nested inside it. */
const routeFiles = (dir) => `:(glob)${dir}/*.*`;

const urlEntry = (loc, { changefreq = 'weekly', priority = '0.5', lastmod } = {}) => `
  <url>
    <loc>${loc}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

const pageLastmod = (page) => {
  const loc = `${baseUrl}/${page}`;
  const sources = page === '' ? ['app/page.tsx', 'app/HomePage.tsx'] : [routeFiles(`app/${page}`)];
  return sourceDate(loc, sources);
};

const leagueLastmod = (page) => sourceDate(`${baseUrl}/${page}`, [routeFiles('app/league/[leagueId]')]);

/** A venue page changes with its template and with its own section data. */
const venueLastmod = (venue, league) => {
  const sources = [routeFiles('app/stadium/[stadiumId]')];
  const sectionFile = `src/data/sections/${league}/${venue}.ts`;
  if (fs.existsSync(path.join(repoRoot, sectionFile))) sources.push(sectionFile);
  return sourceDate(`${baseUrl}/stadium/${venue}`, sources);
};

/** The newest lastmod in a sitemap, for the index. */
const newest = (dates) => dates.filter(Boolean).sort().pop();

// Generate main sitemap with static pages and league pages
let mainSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
const mainDates = [];

// The blog index changes whenever a post does.
const newestPost = newest(blogPosts.map((post) => post.lastmod));
const lastmodFor = (page) => (page === 'blog' ? newest([pageLastmod(page), newestPost]) : pageLastmod(page));

staticPages.forEach(page => {
  const priority = page === '' ? '1.0' : page.startsWith('guide') ? '0.8' : '0.5';
  const changefreq = page === '' ? 'daily' : 'weekly';
  const lastmod = lastmodFor(page);
  mainDates.push(lastmod);
  mainSitemap += urlEntry(`${baseUrl}/${page}`, { changefreq, priority, lastmod });
});

leaguePages.forEach(page => {
  const lastmod = leagueLastmod(page);
  mainDates.push(lastmod);
  mainSitemap += urlEntry(`${baseUrl}/${page}`, { changefreq: 'weekly', priority: '0.7', lastmod });
});

mainSitemap += `
</urlset>`;

// Generate stadiums sitemap with all venue pages
let stadiumsSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
const stadiumDates = [];

// All venues live under the single canonical /stadium/ URL pattern.
// The former /venue/ URLs 301-redirect here and are intentionally omitted.
[[mlbVenues, 'mlb', '0.9'], [nflVenues, 'nfl', '0.8'], [milbVenues, 'milb', '0.7']].forEach(([venues, league, priority]) => {
  venues.forEach(venue => {
    const lastmod = venueLastmod(venue, league);
    stadiumDates.push(lastmod);
    stadiumsSitemap += urlEntry(`${baseUrl}/stadium/${venue}`, { changefreq: 'weekly', priority, lastmod });
  });
});

stadiumsSitemap += `
</urlset>`;

// Generate guides sitemap
let guidesSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;
const guideDates = [];

const guidePaths = staticPages.filter(page => page.startsWith('guide'));
[...guidePaths, 'blog'].forEach(page => {
  const lastmod = lastmodFor(page);
  guideDates.push(lastmod);
  guidesSitemap += urlEntry(`${baseUrl}/${page}`, { changefreq: page === 'blog' ? 'daily' : 'weekly', priority: '0.8', lastmod });
});

guidesSitemap += `
</urlset>`;

// Generate blog sitemap: every post, then each category page, dated by its
// newest post.
let blogSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

blogPosts.forEach(({ slug, lastmod }) => {
  blogSitemap += urlEntry(`${baseUrl}/blog/${slug}`, {
    changefreq: 'monthly',
    priority: '0.7',
    lastmod,
  });
});

const blogCategories = [...new Set(blogPosts.map((post) => post.category))].sort();
blogCategories.forEach(category => {
  const lastmod = newest(blogPosts.filter((post) => post.category === category).map((post) => post.lastmod));
  blogSitemap += urlEntry(`${baseUrl}/blog/category/${category}`, { changefreq: 'weekly', priority: '0.5', lastmod });
});

blogSitemap += `
</urlset>`;

// Generate sitemap index. Each child is dated by its newest page; the
// hand-written image sitemap by its own last commit.
const indexEntry = (file, lastmod) => `
  <sitemap>
    <loc>${baseUrl}/${file}</loc>${lastmod ? `
    <lastmod>${lastmod}</lastmod>` : ''}
  </sitemap>`;

let committedIndex = '';
try {
  committedIndex = fs.readFileSync(path.join(publicDir, 'sitemap-index.xml'), 'utf-8');
} catch {
  // No committed index yet.
}
const committedImagesDate = committedIndex.match(/sitemap-images\.xml<\/loc>\s*<lastmod>([^<]+)</)?.[1];
const imagesDate = fullHistory
  ? sourceDate(`${baseUrl}/sitemap-images.xml`, ['public/sitemap-images.xml']) || committedImagesDate
  : committedImagesDate;

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${
  indexEntry('sitemap.xml', newest(mainDates))}${
  indexEntry('sitemap-stadiums.xml', newest(stadiumDates))}${
  indexEntry('sitemap-guides.xml', newest(guideDates))}${
  indexEntry('sitemap-blog.xml', newestPost)}${
  indexEntry('sitemap-images.xml', imagesDate)}
</sitemapindex>`;

// Write sitemaps
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), mainSitemap);
fs.writeFileSync(path.join(publicDir, 'sitemap-stadiums.xml'), stadiumsSitemap);
fs.writeFileSync(path.join(publicDir, 'sitemap-guides.xml'), guidesSitemap);
fs.writeFileSync(path.join(publicDir, 'sitemap-blog.xml'), blogSitemap);
fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndex);

// Calculate stats
const mainUrls = staticPages.length + leaguePages.length;
const stadiumUrls = mlbVenues.length + nflVenues.length + milbVenues.length;
const guideUrls = guidePaths.length + 1; // +1 for /blog
const blogUrls = blogPosts.length + blogCategories.length;
const totalUrls = mainUrls + stadiumUrls + guideUrls + blogUrls;

console.log(`✓ Sitemaps generated with ${totalUrls} total URLs (dates from ${fullHistory ? 'git history' : 'the committed sitemaps'})`);
console.log(`  Main sitemap: ${mainUrls} URLs (static + league pages)`);
console.log(`  Stadiums sitemap: ${stadiumUrls} URLs`);
console.log(`    - ${mlbVenues.length} MLB stadiums (/stadium/)`);
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
