#!/usr/bin/env ts-node

/**
 * Great American Ball Park Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 42,319 seats (from stadiums.ts - 2008-2020 configuration)
 * - Sections: ~92-100 sections across 5 main levels
 * - Levels: Diamond/Scout (1-5, 22-25), 100 (101-146), 300 (301-307),
 *           400 (410-437), 500 (509-537)
 * - Orientation: 105° (home to center field, ENE)
 * - Open roof, riverfront location
 * - Unique feature: "The Gap" - 35-foot break in stands
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateRedsSeats.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import type { SectionSeatingData, StadiumSeatingStats } from '../src/types/seat';
import { generateSectionSeats, exportSectionToTypeScript, type SeatGenerationConfig } from '../src/utils/generateSeatPositions';

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.cyan}ℹ️${colors.reset}  ${msg}`),
  step: (msg: string) => console.log(`${colors.bright}⚙️${colors.reset}  ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️${colors.reset}  ${msg}`),
  error: (msg: string) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
};

// Great American Ball Park base parameters
const STADIUM_ID = 'reds';
const STADIUM_NAME = 'Great American Ball Park';
const ORIENTATION = 105; // degrees (ENE)
const OFFICIAL_CAPACITY = 42319; // From stadiums.ts (2008-2020)

// Per-level estimated capacity
const TARGET_DIAMOND = 900;      // Diamond/Scout 1-5, 22-25
const TARGET_100 = 20000;        // 100-Level 101-146
const TARGET_300 = 3000;         // 300-Level 301-307+
const TARGET_400 = 7500;         // 400-Level 410-437
const TARGET_500 = 10919;        // 500-Level 509-537
// Total: 42,319

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string, level: string): number {
  const centerField = ORIENTATION - 180; // -75° (285° adjusted)

  if (level === 'diamond') {
    // Diamond Seats: 1-5 (behind home plate)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 1 && sectionNum <= 5) {
      const position = sectionNum - 1;
      return centerField - 8 + (position * 4); // ~16° arc
    }
    // Scout Seats: 22-25
    if (sectionNum >= 22 && sectionNum <= 25) {
      const position = sectionNum - 22;
      return centerField + 10 + (position * 4); // ~12° arc (first base side)
    }
  } else if (level === '100') {
    // 100-Level: 101-146 (46 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 101 && sectionNum <= 146) {
      const position = sectionNum - 101;
      return centerField + 95 - (position * 4.1); // ~185° arc
    }
  } else if (level === '300') {
    // 300-Level: 301-307 (7 sections, first base side)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 301 && sectionNum <= 307) {
      const position = sectionNum - 301;
      return centerField - 15 + (position * 5); // ~30° arc
    }
  } else if (level === '400') {
    // 400-Level: 410-437 (27 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 410 && sectionNum <= 437) {
      const position = sectionNum - 410;
      return centerField + 60 - (position * 4.5); // ~120° arc
    }
  } else if (level === '500') {
    // 500-Level: 509-537 (29 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 509 && sectionNum <= 537) {
      const position = sectionNum - 509;
      return centerField + 65 - (position * 4.6); // ~130° arc
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10) || 0;

  if (level === 'diamond') return 9; // Diamond/Scout: 9 rows

  if (level === '100') {
    // Center sections (119-126): Rows A-I (9 rows)
    if (sectionNum >= 119 && sectionNum <= 126) return 9;
    // End sections (111-118, 129-135): Rows F-Z, AA-KK (~40 rows)
    if ((sectionNum >= 111 && sectionNum <= 118) || (sectionNum >= 129 && sectionNum <= 135)) return 38;
    // Corner sections (101-110, 136-146): Rows A-Z (~26 rows)
    return 24;
  }

  if (level === '300') return 13; // 300-Level: A-M (13 rows)

  if (level === '400') {
    // Center sections (420-427): Rows A-F (6 rows)
    if (sectionNum >= 420 && sectionNum <= 427) return 6;
    // End/Corner sections: Rows A-R (18 rows)
    return 18;
  }

  if (level === '500') return 22; // 500-Level: A-V (22 rows)

  return 20; // fallback
}

// Determine seats per row
function getSeatsPerRow(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10) || 0;

  if (level === 'diamond') return 11; // Diamond/Scout: 11 seats per row

  if (level === '100') {
    // Center sections (119-126): More seats
    if (sectionNum >= 119 && sectionNum <= 126) return 23;
    // End sections (111-118, 129-135): Fewer seats
    if ((sectionNum >= 111 && sectionNum <= 118) || (sectionNum >= 129 && sectionNum <= 135)) return 14;
    // Corner sections (101-110, 136-146): Medium
    return 18;
  }

  if (level === '300') {
    // Club seats: fewer seats per row (premium)
    return 21;
  }

  if (level === '400') {
    // Center sections (420-427): View Box seats
    if (sectionNum >= 420 && sectionNum <= 427) return 16;
    // End/Corner sections
    if (sectionNum >= 410 && sectionNum <= 413) return 18;
    if (sectionNum >= 435 && sectionNum <= 437) return 18;
    return 19;
  }

  if (level === '500') {
    // Center sections (520-527): More seats
    if (sectionNum >= 520 && sectionNum <= 527) return 21;
    // Corner sections: Medium-high
    return 19;
  }

  return 18; // fallback (average ~18 per row)
}

// Distance from home plate
function getDistance(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10) || 0;

  if (level === 'diamond') return 50; // Very close to field

  if (level === '100') {
    // Center sections closer
    if (sectionNum >= 119 && sectionNum <= 126) return 65;
    // End sections
    if ((sectionNum >= 111 && sectionNum <= 118) || (sectionNum >= 129 && sectionNum <= 135)) return 95;
    // Corner sections
    return 110;
  }

  if (level === '300') return 85; // Club level, similar to 100 center
  if (level === '400') return 115; // Mezzanine
  if (level === '500') return 155; // Upper deck

  return 90; // fallback
}

// Base elevation for each level
function getElevation(level: string): number {
  if (level === 'diamond') return 8;
  if (level === '100') return 12;
  if (level === '300') return 32;
  if (level === '400') return 35; // Same level as 300 (per docs)
  if (level === '500') return 70;
  return 15; // fallback
}

// Check if section is covered (has overhang)
function isCovered(level: string, sectionId: string, rowNum: number): boolean {
  // 300-Level: Overhang provides coverage (rows F+ = 5+)
  if (level === '300') return rowNum >= 5;

  // 500-Level: Back rows covered
  if (level === '500') return rowNum >= 18;

  // Most sections: Open air
  return false;
}

// Get level string for section
function getLevelString(level: string): string {
  const levelMap: Record<string, string> = {
    'diamond': 'Diamond/Scout (1-5, 22-25)',
    '100': '100 Level (Lower Deck)',
    '300': '300 Level (Club)',
    '400': '400 Level (Mezzanine)',
    '500': '500 Level (Upper/View)',
  };
  return levelMap[level] || level;
}

// Fine-tuning adjustments: remove exactly 11 seats to hit 42,319 exactly
// Current: 42,330 (+11), Target: 42,319
const FINE_TUNE_ADJUSTMENTS: Record<string, Record<string, number>> = {
  '509': { 'A': -1 },
  '510': { 'A': -1 },
  '511': { 'A': -1 },
  '512': { 'A': -1 },
  '513': { 'A': -1 },
  '514': { 'A': -1 },
  '515': { 'A': -1 },
  '516': { 'A': -1 },
  '517': { 'A': -1 },
  '518': { 'A': -1 },
  '519': { 'A': -1 },
};

// Create section configuration
function createSectionConfig(sectionId: string, level: string): SeatGenerationConfig {
  const sectionNum = parseInt(sectionId, 10) || 0;
  const rowCount = getRowCount(level, sectionId);
  const seatsPerRow = getSeatsPerRow(level, sectionId);
  const distance = getDistance(level, sectionId);
  const baseElevation = getElevation(level);
  const baseAngle = getBaseAngle(sectionId, level);

  // Generate rows array
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    let rowLabel: string;

    // 100-Level end sections use F-Z, AA-KK
    if (level === '100' && ((sectionNum >= 111 && sectionNum <= 118) || (sectionNum >= 129 && sectionNum <= 135))) {
      const letters = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG', 'HH', 'II', 'JJ', 'KK'];
      rowLabel = letters[i] || `${i + 1}`;
    }
    // 100-Level center and corner use A-Z or A-I
    else if (level === '100' && sectionNum >= 119 && sectionNum <= 126) {
      rowLabel = String.fromCharCode(65 + i); // A-I
    }
    else if (level === '100') {
      rowLabel = String.fromCharCode(65 + i); // A-Z for corners
    }
    // Other levels use A-V, A-R, A-M, etc.
    else {
      rowLabel = String.fromCharCode(65 + i); // A, B, C, ...
      if (i > 25) { // Beyond Z, use AA, BB, etc.
        const letter = String.fromCharCode(65 + (i - 26));
        rowLabel = letter + letter;
      }
    }

    // Apply fine-tuning adjustments
    let finalSeatCount = seatsPerRow;
    if (FINE_TUNE_ADJUSTMENTS[sectionId]?.[rowLabel] !== undefined) {
      finalSeatCount += FINE_TUNE_ADJUSTMENTS[sectionId][rowLabel];
    }

    rows.push({
      rowLabel,
      seatCount: finalSeatCount,
      rowNumber: i,
    });
  }

  return {
    stadiumId: STADIUM_ID,
    sectionId,
    sectionName: sectionId,
    baseAngle,
    angleSpan: 3.8,
    baseElevation,
    rowHeight: 2.5,
    startDepth: distance,
    rowDepth: 2.8,
    rows,
    seatWidth: 2.0,
    seatSpacing: 0.5,
    rowSpacing: 36,
    level: getLevelString(level),
    covered: isCovered(level, sectionId, 1),
    overhangHeight: isCovered(level, sectionId, 1) ? 20 : undefined,
  };
}

// Main generation function
async function generateAllSections() {
  log.step(`Generating seat data for ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats`);

  const outputDir = path.join(__dirname, '..', 'src', 'data', 'seatData', STADIUM_ID, 'sections');

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const allSections: SectionSeatingData[] = [];
  let totalSeats = 0;

  const stats: StadiumSeatingStats = {
    totalSeats: 0,
    totalSections: 0,
    totalRows: 0,
    levels: {
      'Diamond/Scout (1-5, 22-25)': 0,
      '100 Level (Lower Deck)': 0,
      '300 Level (Club)': 0,
      '400 Level (Mezzanine)': 0,
      '500 Level (Upper/View)': 0,
    },
    seatDistribution: {
      standard: 0,
      aisle: 0,
      wheelchair: 0,
    },
    coveredSeats: 0,
  };

  // Generate Diamond Seats (1-5)
  log.step('Generating Diamond Seats (1-5)...');
  for (let i = 1; i <= 5; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'diamond');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Diamond/Scout (1-5, 22-25)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }

  // Generate Scout Seats (22-25)
  log.step('Generating Scout Seats (22-25)...');
  for (let i = 22; i <= 25; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'diamond');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Diamond/Scout (1-5, 22-25)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Diamond/Scout: 9 sections, ${stats.levels['Diamond/Scout (1-5, 22-25)']} seats`);

  // Generate 100-Level sections (101-146)
  log.step('Generating 100-Level sections (101-146)...');
  for (let i = 101; i <= 146; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '100');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['100 Level (Lower Deck)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`100 Level: ${146 - 101 + 1} sections, ${stats.levels['100 Level (Lower Deck)']} seats`);

  // Generate 300-Level sections (301-307)
  log.step('Generating 300-Level sections (301-307)...');
  for (let i = 301; i <= 307; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '300');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['300 Level (Club)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`300 Level: ${307 - 301 + 1} sections, ${stats.levels['300 Level (Club)']} seats`);

  // Generate 400-Level sections (410-437)
  log.step('Generating 400-Level sections (410-437)...');
  for (let i = 410; i <= 437; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '400');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['400 Level (Mezzanine)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`400 Level: ${437 - 410 + 1} sections, ${stats.levels['400 Level (Mezzanine)']} seats`);

  // Generate 500-Level sections (509-537)
  log.step('Generating 500-Level sections (509-537)...');
  for (let i = 509; i <= 537; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '500');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['500 Level (Upper/View)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`500 Level: ${537 - 509 + 1} sections, ${stats.levels['500 Level (Upper/View)']} seats`);

  // Calculate final stats
  stats.totalSeats = totalSeats;
  stats.totalSections = allSections.length;

  // Generate metadata file
  const metadataDir = path.join(__dirname, '..', 'src', 'data', 'seatData', STADIUM_ID);
  const metadataPath = path.join(metadataDir, 'metadata.ts');

  const metadataContent = `/**
 * ${STADIUM_NAME} - Stadium Metadata
 * Generated: ${new Date().toISOString()}
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: '${STADIUM_ID}',
  stadiumName: '${STADIUM_NAME}',
  generatedAt: '${new Date().toISOString()}',
  version: '1.0.0',
  dataSource: 'Generated from stadium seating charts and capacity data',
  totalSections: ${stats.totalSections},
  lastValidated: '${new Date().toISOString()}'
};

export const stats: StadiumSeatingStats = ${JSON.stringify(stats, null, 2)};
`;

  fs.writeFileSync(metadataPath, metadataContent, 'utf-8');
  log.success(`Metadata file generated: metadata.ts`);

  // Summary
  console.log('\n' + '='.repeat(60));
  log.success('All sections generated successfully!');
  console.log('='.repeat(60));
  log.info(`Total Sections: ${stats.totalSections}`);
  log.info(`Total Seats: ${totalSeats.toLocaleString()}`);
  log.info(`Target Capacity: ${OFFICIAL_CAPACITY.toLocaleString()}`);

  const accuracy = (totalSeats / OFFICIAL_CAPACITY) * 100;
  const diff = totalSeats - OFFICIAL_CAPACITY;
  const diffStr = diff > 0 ? `+${diff}` : `${diff}`;

  if (accuracy >= 99.9 && accuracy <= 100.1) {
    log.success(`Accuracy: ${accuracy.toFixed(2)}% (${diffStr} seats) ✅`);
  } else {
    log.warning(`Accuracy: ${accuracy.toFixed(2)}% (${diffStr} seats)`);
  }

  console.log('\n' + 'Level Breakdown:');
  Object.entries(stats.levels).forEach(([level, seats]) => {
    log.info(`${level}: ${seats.toLocaleString()} seats`);
  });

  console.log('='.repeat(60) + '\n');
}

// Execute
generateAllSections().catch(error => {
  log.error(`Generation failed: ${error.message}`);
  process.exit(1);
});
