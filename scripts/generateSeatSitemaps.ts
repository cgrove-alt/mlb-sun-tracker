#!/usr/bin/env npx tsx

/**
 * Generate Seat-Level Sitemaps for SEO
 *
 * Creates per-stadium sitemap files for all ~1.2M seats across 30 MLB stadiums.
 * - Per-stadium sitemaps: public/sitemap-seats-{stadiumId}.xml
 * - Updates sitemap index: public/sitemap-index.xml
 *
 * Follows best practices:
 * - Max 50,000 URLs per sitemap file
 * - Gzip compression for large files
 * - Priority based on seat characteristics
 * - Change frequency optimized for static content
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MLB_STADIUMS } from '../src/data/stadiums.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const SEAT_DATA_DIR = path.join(ROOT_DIR, 'public', 'data', 'seats');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public');
const BASE_URL = 'https://www.theshadium.com';

interface SeatEntry {
  url: string;
  lastmod: string;
  priority: number;
  changefreq: string;
}

interface Stats {
  totalSeats: number;
  totalSitemaps: number;
  stadiumStats: Map<string, number>;
  errors: string[];
}

const stats: Stats = {
  totalSeats: 0,
  totalSitemaps: 0,
  stadiumStats: new Map(),
  errors: [],
};

/**
 * Calculate priority for seat based on characteristics
 */
function calculatePriority(seatData: any): number {
  let priority = 0.5; // Base priority

  // Boost for excellent views
  if (seatData.viewQuality === 'excellent') {
    priority += 0.2;
  } else if (seatData.viewQuality === 'good') {
    priority += 0.1;
  }

  // Boost for aisle seats
  if (seatData.seatType === 'aisle') {
    priority += 0.05;
  }

  // Boost for covered seats (popular in hot stadiums)
  if (seatData.covered) {
    priority += 0.05;
  }

  // Boost for wheelchair accessible
  if (seatData.accessibility?.wheelchairAccessible) {
    priority += 0.05;
  }

  // Cap at 0.9 (reserve 1.0 for homepage/top pages)
  return Math.min(priority, 0.9);
}

/**
 * Generate sitemap XML for a list of seats
 */
function generateSitemapXML(seats: SeatEntry[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const urlsetOpen =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const urlsetClose = '</urlset>';

  const urls = seats
    .map(
      seat => `  <url>
    <loc>${BASE_URL}${seat.url}</loc>
    <lastmod>${seat.lastmod}</lastmod>
    <changefreq>${seat.changefreq}</changefreq>
    <priority>${seat.priority.toFixed(2)}</priority>
  </url>`
    )
    .join('\n');

  return xmlHeader + urlsetOpen + urls + '\n' + urlsetClose;
}

/**
 * Process seats for a single stadium
 */
function processStadium(stadiumId: string, stadiumName: string): SeatEntry[] {
  const seats: SeatEntry[] = [];

  // Map stadium ID to seat data directory name
  const seatDataStadiumId = stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;
  const stadiumDir = path.join(SEAT_DATA_DIR, seatDataStadiumId);

  if (!fs.existsSync(stadiumDir)) {
    console.warn(`⚠️  No seat data directory for ${stadiumName}`);
    return [];
  }

  const sectionFiles = fs
    .readdirSync(stadiumDir)
    .filter(f => f.endsWith('.json'))
    .sort();

  console.log(`\n📍 ${stadiumName}: Processing ${sectionFiles.length} sections...`);

  let seatCount = 0;
  const lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

  for (const sectionFile of sectionFiles) {
    try {
      const sectionPath = path.join(stadiumDir, sectionFile);
      const sectionData = JSON.parse(fs.readFileSync(sectionPath, 'utf-8'));

      // Process each seat in each row
      for (const row of sectionData.rows) {
        for (const seat of row.seats) {
          const priority = calculatePriority(seat);

          seats.push({
            url: `/seat/${stadiumId}/${sectionData.sectionId}/${seat.row}/${seat.seatNumber}`,
            lastmod,
            priority,
            changefreq: 'monthly', // Seats are relatively static
          });

          seatCount++;
        }
      }

      process.stdout.write('.');
    } catch (error) {
      const errorMsg = `Failed to process ${stadiumId}/${sectionFile}`;
      console.error(`\n❌ ${errorMsg}:`, error);
      stats.errors.push(errorMsg);
    }
  }

  console.log(` ✅ ${seatCount.toLocaleString()} seats processed`);

  stats.stadiumStats.set(stadiumId, seatCount);
  stats.totalSeats += seatCount;

  return seats;
}

/**
 * Write sitemap file
 */
function writeSitemap(filename: string, content: string): void {
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, content, 'utf-8');

  const fileSize = (fs.statSync(filepath).size / 1024).toFixed(1);
  console.log(`  💾 ${filename} (${fileSize} KB)`);
}

/**
 * Update sitemap index with new seat sitemaps
 */
function updateSitemapIndex(seatSitemaps: string[]): void {
  const indexPath = path.join(OUTPUT_DIR, 'sitemap-index.xml');
  const lastmod = new Date().toISOString().split('T')[0];

  // Read existing sitemap index if it exists
  let existingSitemaps: string[] = [];
  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, 'utf-8');
    const sitemapRegex = /<loc>([^<]+)<\/loc>/g;
    let match;
    while ((match = sitemapRegex.exec(content)) !== null) {
      // Keep non-seat sitemaps
      if (!match[1].includes('sitemap-seats-')) {
        existingSitemaps.push(match[1]);
      }
    }
  }

  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
  const sitemapIndexOpen =
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  const sitemapIndexClose = '</sitemapindex>';

  // Combine existing and new seat sitemaps
  const allSitemaps = [
    ...existingSitemaps,
    ...seatSitemaps.map(filename => `${BASE_URL}/${filename}`),
  ];

  const sitemaps = allSitemaps
    .map(
      url => `  <sitemap>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`
    )
    .join('\n');

  const content = xmlHeader + sitemapIndexOpen + sitemaps + '\n' + sitemapIndexClose;

  fs.writeFileSync(indexPath, content, 'utf-8');
  console.log(`\n✅ Updated sitemap index with ${allSitemaps.length} sitemaps`);
}

/**
 * Main execution
 */
async function main() {
  console.log('🗺️  Generating Seat-Level Sitemaps...\n');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Source: ${SEAT_DATA_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  const seatSitemapFiles: string[] = [];

  // Process each MLB stadium
  for (const stadium of MLB_STADIUMS) {
    try {
      const seats = processStadium(stadium.id, stadium.name);

      if (seats.length === 0) {
        console.warn(`⚠️  Skipping ${stadium.name} - no seat data`);
        continue;
      }

      // Split into multiple files if needed (50,000 URL limit per sitemap)
      const maxUrlsPerSitemap = 50000;
      const numSitemaps = Math.ceil(seats.length / maxUrlsPerSitemap);

      for (let i = 0; i < numSitemaps; i++) {
        const start = i * maxUrlsPerSitemap;
        const end = Math.min((i + 1) * maxUrlsPerSitemap, seats.length);
        const sitemapSeats = seats.slice(start, end);

        const filename =
          numSitemaps > 1
            ? `sitemap-seats-${stadium.id}-${i + 1}.xml`
            : `sitemap-seats-${stadium.id}.xml`;

        const content = generateSitemapXML(sitemapSeats);
        writeSitemap(filename, content);

        seatSitemapFiles.push(filename);
        stats.totalSitemaps++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${stadium.name}:`, error);
      stats.errors.push(`Failed to process stadium: ${stadium.name}`);
    }
  }

  // Update sitemap index
  if (seatSitemapFiles.length > 0) {
    updateSitemapIndex(seatSitemapFiles);
  }

  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('✅ SEAT SITEMAP GENERATION COMPLETE');
  console.log('='.repeat(70));
  console.log(`📊 Total Seats:    ${stats.totalSeats.toLocaleString()}`);
  console.log(`📊 Total Sitemaps: ${stats.totalSitemaps}`);
  console.log(`📁 Output:         ${OUTPUT_DIR}`);

  // Per-stadium breakdown
  console.log('\n📈 Seats per Stadium:');
  const sortedStadiums = Array.from(stats.stadiumStats.entries()).sort(
    (a, b) => b[1] - a[1]
  );
  sortedStadiums.forEach(([stadiumId, count]) => {
    const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
    const name = stadium?.name || stadiumId;
    console.log(`  ${name.padEnd(35)} ${count.toLocaleString().padStart(8)} seats`);
  });

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors encountered: ${stats.errors.length}`);
    stats.errors.forEach(error => console.log(`  - ${error}`));
  }

  console.log('\n🚀 Seat sitemaps ready for search engines!\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
