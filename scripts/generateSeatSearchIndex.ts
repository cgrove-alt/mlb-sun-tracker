#!/usr/bin/env npx tsx

/**
 * Generate Per-Stadium Seat Search Indices
 *
 * This script creates individual search indices for each MLB stadium's seats.
 * Each stadium gets its own search index file for efficient client-side loading.
 * - Per-stadium files: public/data/search/{stadiumId}-seats.min.json
 * - Manifest file: public/data/search/seat-indices-manifest.json
 *
 * Enables fast, fuzzy search by:
 * - Seat ID (dodgers-101-G-12)
 * - Section number
 * - Row letter/number
 * - Seat number
 * - Characteristics (shaded, aisle, wheelchair, view quality)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MLB_STADIUMS } from '../src/data/stadiums.js';
import type { SectionSeatingData, Seat } from '../src/types/seat';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const SEAT_DATA_DIR = path.join(ROOT_DIR, 'public', 'data', 'seats');
const OUTPUT_DIR = path.join(ROOT_DIR, 'public', 'data', 'search');

interface SeatSearchEntry {
  id: string;
  sectionId: string;
  sectionName: string;
  row: string;
  seatNumber: string;
  covered: boolean;
  viewQuality?: string;
  seatType: string;
  wheelchairAccessible: boolean;
  isAisle: boolean;
  elevation?: number;
  keywords: string[];
  url: string;
}

interface StadiumSeatIndex {
  stadiumId: string;
  stadiumName: string;
  teamName: string;
  generated: string;
  version: string;
  totalSections: number;
  totalSeats: number;
  seats: SeatSearchEntry[];
}

interface SearchManifest {
  generated: string;
  version: string;
  totalStadiums: number;
  totalSeats: number;
  stadiums: Array<{
    id: string;
    name: string;
    team: string;
    seatCount: number;
    indexFile: string;
  }>;
}

interface Stats {
  totalStadiums: number;
  totalSections: number;
  totalSeats: number;
  stadiumSeats: Map<string, number>;
  errors: string[];
}

const stats: Stats = {
  totalStadiums: 0,
  totalSections: 0,
  totalSeats: 0,
  stadiumSeats: new Map(),
  errors: [],
};

/**
 * Generate keywords for seat searchability
 */
function generateKeywords(
  seat: Seat,
  section: SectionSeatingData
): string[] {
  const keywords: string[] = [];

  // Section keywords
  keywords.push(`section ${section.sectionId}`.toLowerCase());
  keywords.push(`sec ${section.sectionId}`.toLowerCase());
  if (section.sectionName && section.sectionName !== section.sectionId) {
    keywords.push(section.sectionName.toLowerCase());
    section.sectionName.split(/\s+/).forEach(word => keywords.push(word.toLowerCase()));
  }

  // Row keywords
  keywords.push(`row ${seat.row}`.toLowerCase());
  keywords.push(seat.row.toLowerCase());

  // Seat keywords
  keywords.push(`seat ${seat.seatNumber}`.toLowerCase());

  // Characteristic keywords
  if (seat.covered) {
    keywords.push('covered', 'roof', 'indoor', 'protected', 'shade', 'shaded');
  } else {
    keywords.push('uncovered', 'outdoor', 'open', 'sun', 'sunny');
  }

  if (seat.viewQuality) {
    keywords.push(seat.viewQuality);
    if (seat.viewQuality === 'excellent') {
      keywords.push('best', 'premium', 'great view');
    } else if (seat.viewQuality === 'obstructed') {
      keywords.push('blocked', 'partial view');
    }
  }

  if (seat.seatType === 'aisle') {
    keywords.push('aisle', 'aisle seat', 'easy access');
  }

  if (seat.accessibility.wheelchairAccessible) {
    keywords.push('wheelchair', 'accessible', 'ada', 'handicap');
  }

  if (seat.seatType === 'wheelchair') {
    keywords.push('wheelchair', 'accessible');
  }

  if (seat.seatType === 'companion') {
    keywords.push('companion', 'wheelchair companion');
  }

  // Level/location keywords based on section name
  const sectionLower = section.sectionName.toLowerCase();
  if (sectionLower.includes('field') || sectionLower.includes('box')) {
    keywords.push('field level', 'lower', 'box');
  }
  if (sectionLower.includes('club')) {
    keywords.push('club', 'premium');
  }
  if (sectionLower.includes('loge')) {
    keywords.push('loge', 'mezzanine');
  }
  if (sectionLower.includes('upper') || sectionLower.includes('terrace')) {
    keywords.push('upper', 'terrace', 'upper deck');
  }
  if (sectionLower.includes('pavilion')) {
    keywords.push('pavilion', 'bleachers');
  }

  // Remove duplicates and empty strings
  return [...new Set(keywords.filter(k => k && k.trim().length > 0))];
}

/**
 * Process a single seat and create search entry
 */
function processSeat(
  seat: Seat,
  section: SectionSeatingData,
  stadiumId: string
): SeatSearchEntry {
  const keywords = generateKeywords(seat, section);

  return {
    id: seat.id,
    sectionId: section.sectionId,
    sectionName: section.sectionName,
    row: seat.row,
    seatNumber: seat.seatNumber,
    covered: seat.covered,
    viewQuality: seat.viewQuality,
    seatType: seat.seatType,
    wheelchairAccessible: seat.accessibility.wheelchairAccessible,
    isAisle: seat.seatType === 'aisle',
    elevation: seat.elevation || undefined,
    keywords,
    url: `/seat/${stadiumId}/${section.sectionId}/${seat.row}/${seat.seatNumber}`,
  };
}

/**
 * Load a section's seat data from JSON
 */
function loadSectionData(
  stadiumId: string,
  sectionFile: string
): SectionSeatingData | null {
  try {
    const jsonPath = path.join(
      SEAT_DATA_DIR,
      stadiumId,
      sectionFile
    );

    // Read and parse JSON file
    const jsonData = fs.readFileSync(jsonPath, 'utf-8');
    return JSON.parse(jsonData) as SectionSeatingData;
  } catch (error) {
    console.error(`Error loading ${stadiumId}/${sectionFile}:`, error);
    return null;
  }
}

/**
 * Process all sections for a stadium and create stadium search index
 */
function processStadium(stadiumId: string, stadiumName: string, teamName: string): StadiumSeatIndex | null {
  const seats: SeatSearchEntry[] = [];

  // Map stadium ID to seat data directory name
  const seatDataStadiumId = stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;
  const stadiumDir = path.join(SEAT_DATA_DIR, seatDataStadiumId);

  if (!fs.existsSync(stadiumDir)) {
    console.warn(`⚠️  No seat data directory for ${stadiumName}`);
    return null;
  }

  const sectionFiles = fs
    .readdirSync(stadiumDir)
    .filter(f => f.endsWith('.json'))
    .sort();

  console.log(`\n📍 ${stadiumName}: Processing ${sectionFiles.length} sections...`);

  let sectionCount = 0;

  for (const sectionFile of sectionFiles) {
    const sectionData = loadSectionData(seatDataStadiumId, sectionFile);

    if (!sectionData) {
      stats.errors.push(`Failed to load ${stadiumId}/${sectionFile}`);
      continue;
    }

    sectionCount++;

    // Process each seat in each row
    for (const row of sectionData.rows) {
      for (const seat of row.seats) {
        const seatEntry = processSeat(seat, sectionData, stadiumId);
        seats.push(seatEntry);
      }
    }

    process.stdout.write('.');
  }

  const stadiumIndex: StadiumSeatIndex = {
    stadiumId,
    stadiumName,
    teamName,
    generated: new Date().toISOString(),
    version: '1.0.0',
    totalSections: sectionCount,
    totalSeats: seats.length,
    seats,
  };

  console.log(` ✅ ${seats.length.toLocaleString()} seats indexed`);

  return stadiumIndex;
}

/**
 * Main execution
 */
async function main() {
  console.log('🔍 Generating Per-Stadium Seat Search Indices...\n');
  console.log(`Source: ${SEAT_DATA_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const manifestStadiums: SearchManifest['stadiums'] = [];
  let totalSeats = 0;
  let totalSections = 0;

  // Process each MLB stadium
  for (const stadium of MLB_STADIUMS) {
    try {
      const stadiumIndex = processStadium(stadium.id, stadium.name, stadium.team);

      if (!stadiumIndex) {
        console.warn(`⚠️  Skipping ${stadium.name} - no data`);
        continue;
      }

      // Write stadium index to file
      const indexFile = `${stadium.id}-seats.min.json`;
      const indexPath = path.join(OUTPUT_DIR, indexFile);
      fs.writeFileSync(indexPath, JSON.stringify(stadiumIndex));

      // Calculate file size
      const fileStats = fs.statSync(indexPath);
      const fileSizeKB = (fileStats.size / 1024).toFixed(1);
      console.log(`   💾 ${fileSizeKB} KB`);

      // Update stats
      stats.totalStadiums++;
      totalSeats += stadiumIndex.totalSeats;
      totalSections += stadiumIndex.totalSections;
      stats.stadiumSeats.set(stadium.id, stadiumIndex.totalSeats);

      // Add to manifest
      manifestStadiums.push({
        id: stadium.id,
        name: stadium.name,
        team: stadium.team,
        seatCount: stadiumIndex.totalSeats,
        indexFile,
      });
    } catch (error) {
      console.error(`❌ Error processing ${stadium.name}:`, error);
      stats.errors.push(`Failed to process stadium: ${stadium.name}`);
    }
  }

  // Create and write manifest
  const manifest: SearchManifest = {
    generated: new Date().toISOString(),
    version: '1.0.0',
    totalStadiums: stats.totalStadiums,
    totalSeats,
    stadiums: manifestStadiums.sort((a, b) => b.seatCount - a.seatCount),
  };

  const manifestPath = path.join(OUTPUT_DIR, 'seat-indices-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  // Print summary
  console.log('\n' + '='.repeat(70));
  console.log('✅ SEAT SEARCH INDICES GENERATION COMPLETE');
  console.log('='.repeat(70));
  console.log(`📊 Stadiums:  ${stats.totalStadiums}`);
  console.log(`📊 Sections:  ${totalSections.toLocaleString()}`);
  console.log(`📊 Seats:     ${totalSeats.toLocaleString()}`);
  console.log(`📁 Output:    ${OUTPUT_DIR}`);
  console.log(`📄 Manifest:  ${manifestPath}`);

  // Per-stadium breakdown
  console.log('\n📈 Seats per Stadium:');
  manifestStadiums.forEach(({ name, seatCount, indexFile }) => {
    const fileSize = fs.statSync(path.join(OUTPUT_DIR, indexFile)).size;
    const fileSizeKB = (fileSize / 1024).toFixed(0);
    console.log(`  ${name.padEnd(35)} ${seatCount.toLocaleString().padStart(8)} seats  (${fileSizeKB.padStart(5)} KB)`);
  });

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors encountered: ${stats.errors.length}`);
    stats.errors.forEach(error => console.log(`  - ${error}`));
  }

  console.log('\n🚀 Seat search indices ready for use!\n');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
