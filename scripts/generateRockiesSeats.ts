#!/usr/bin/env ts-node

/**
 * Coors Field Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 50,144 seats (from stadiums.ts - 2018-present with standing room)
 * - Sections: ~139 sections across 4 main levels
 * - Levels: 100 (105-160), 200 (201-247 with gaps), 300 (301-347), 400 (401-403)
 * - Orientation: 40° (home to center field, NE)
 * - Open roof, highest MLB stadium at 5,200 feet elevation
 * - Unique feature: The Rockpile (sections 401-403) - 2,300 fixed seats
 *
 * Created: 2025-10-23
 * Usage: npx tsx scripts/generateRockiesSeats.ts
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

// Coors Field base parameters
const STADIUM_ID = 'rockies';
const STADIUM_NAME = 'Coors Field';
const ORIENTATION = 40; // degrees (NE)
const OFFICIAL_CAPACITY = 50144; // From stadiums.ts

// Per-level estimated capacity
const TARGET_100 = 30000;        // 100-Level 105-160 (56 sections)
const TARGET_200 = 6000;         // 200-Level 201-247 with gaps (~33 sections)
const TARGET_300 = 11844;        // 300-Level 301-347 (47 sections)
const TARGET_400 = 2300;         // 400-Level 401-403 (3 sections) - FIXED
// Total: 50,144

// 200-Level section ranges (non-continuous)
const LEVEL_200_SECTIONS = [
  ...Array.from({ length: 9 }, (_, i) => 201 + i),     // 201-209
  ...Array.from({ length: 6 }, (_, i) => 214 + i),     // 214-219
  ...Array.from({ length: 3 }, (_, i) => 221 + i),     // 221-223
  ...Array.from({ length: 3 }, (_, i) => 225 + i),     // 225-227
  ...Array.from({ length: 3 }, (_, i) => 234 + i),     // 234-236
  ...Array.from({ length: 2 }, (_, i) => 238 + i),     // 238-239
  ...Array.from({ length: 7 }, (_, i) => 241 + i),     // 241-247
];

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string, level: string): number {
  const centerField = ORIENTATION - 180; // -140° (220° adjusted)

  if (level === '100') {
    // 100-Level: 105-160 (56 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 105 && sectionNum <= 160) {
      const position = sectionNum - 105;
      return centerField + 100 - (position * 3.6); // ~200° arc
    }
  } else if (level === '200') {
    // 200-Level: 201-247 with gaps (~33 sections)
    const sectionNum = parseInt(sectionId, 10);
    const index = LEVEL_200_SECTIONS.indexOf(sectionNum);
    if (index >= 0) {
      return centerField + 70 - (index * 4.2); // ~135° arc
    }
  } else if (level === '300') {
    // 300-Level: 301-347 (47 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 301 && sectionNum <= 347) {
      const position = sectionNum - 301;
      return centerField + 85 - (position * 3.8); // ~175° arc
    }
  } else if (level === '400') {
    // 400-Level: 401-403 (3 sections - The Rockpile)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 401 && sectionNum <= 403) {
      const position = sectionNum - 401;
      return centerField + 2 - (position * 2); // ~4° arc (center field)
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10) || 0;

  if (level === '100') {
    // Center sections (123-138): Rows 5-39 (35 rows)
    if (sectionNum >= 123 && sectionNum <= 138) return 35;
    // End sections (116-122, 139-144): Rows 1-39 (39 rows)
    if ((sectionNum >= 116 && sectionNum <= 122) || (sectionNum >= 139 && sectionNum <= 144)) return 39;
    // Corner sections (105-115, 145-160): Rows 12-39 (28 rows)
    return 28;
  }

  if (level === '200') return 13; // 200-Level: 1-13 (13 rows all sections)
  if (level === '300') return 25; // 300-Level: 1-25 (25 rows all sections)
  if (level === '400') return 32; // 400-Level: 1-32 (32 rows - The Rockpile)

  return 20; // fallback
}

// Determine seats per row
function getSeatsPerRow(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10) || 0;

  if (level === '100') {
    // Center sections (123-138): More seats
    if (sectionNum >= 123 && sectionNum <= 138) return 19;
    // End sections (116-122, 139-144): Medium
    if ((sectionNum >= 116 && sectionNum <= 122) || (sectionNum >= 139 && sectionNum <= 144)) return 14;
    // Corner sections (105-115, 145-160): Fewer seats
    return 16;
  }

  if (level === '200') {
    // Club seating: 14 seats per row (premium)
    return 14;
  }

  if (level === '300') {
    // Upper reserved: 10 seats per row
    if (sectionNum >= 301 && sectionNum <= 310) return 11; // First 10 sections
    return 10;
  }

  if (level === '400') {
    // The Rockpile: Bleacher seating
    // Section 403 last row has 20 seats to hit exactly 2,300 for Rockpile
    return 24;
  }

  return 20; // fallback
}

// Distance from home plate
function getDistance(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10) || 0;

  if (level === '100') {
    // Center sections closer
    if (sectionNum >= 123 && sectionNum <= 138) return 75;
    // End sections
    if ((sectionNum >= 116 && sectionNum <= 122) || (sectionNum >= 139 && sectionNum <= 144)) return 105;
    // Corner sections
    return 125;
  }

  if (level === '200') return 90; // Club level
  if (level === '300') return 140; // Upper reserved
  if (level === '400') return 205; // The Rockpile (600 ft from home plate)

  return 100; // fallback
}

// Base elevation for each level
function getElevation(level: string): number {
  if (level === '100') return 15;
  if (level === '200') return 35; // Club level
  if (level === '300') return 65; // Upper reserved
  if (level === '400') return 80; // The Rockpile (highest)
  return 20; // fallback
}

// Check if section is covered (has overhang)
function isCovered(level: string, sectionId: string, rowNum: number): boolean {
  const sectionNum = parseInt(sectionId, 10) || 0;

  // 300-Level: Rows 19+ guaranteed shade
  if (level === '300') return rowNum >= 19;

  // 200-Level: Club areas have indoor/outdoor access (partial coverage)
  if (level === '200') return rowNum >= 10;

  // Most sections: Open air (high elevation = intense sun)
  return false;
}

// Get level string for section
function getLevelString(level: string): string {
  const levelMap: Record<string, string> = {
    '100': '100 Level (Lower Bowl)',
    '200': '200 Level (Club)',
    '300': '300 Level (Upper Reserved)',
    '400': '400 Level (Rockpile)',
  };
  return levelMap[level] || level;
}

// Fine-tuning adjustments: add exactly 4 seats to hit 50,144 exactly
// Current: 50,140 (-4), Target: 50,144
// Sections 130-133 are center sections (123-138) which start at row 5
const FINE_TUNE_ADJUSTMENTS: Record<string, Record<string, number>> = {
  '130': { '5': +1 },
  '131': { '5': +1 },
  '132': { '5': +1 },
  '133': { '5': +1 },
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
    let rowNumber: number;
    let finalSeatCount = seatsPerRow;

    // 100-Level center sections start at row 5
    if (level === '100' && sectionNum >= 123 && sectionNum <= 138) {
      rowLabel = `${i + 5}`;
      rowNumber = i + 5;
    }
    // 100-Level corner sections start at row 12
    else if (level === '100' && ((sectionNum >= 105 && sectionNum <= 115) || (sectionNum >= 145 && sectionNum <= 160))) {
      rowLabel = `${i + 12}`;
      rowNumber = i + 12;
    }
    // All other levels use 1-based numbering
    else {
      rowLabel = `${i + 1}`;
      rowNumber = i + 1;
    }

    // Special case: The Rockpile section 403 last row has 20 seats to hit exactly 2,300 total
    if (level === '400' && sectionNum === 403 && i === rowCount - 1) {
      finalSeatCount = 20;
    }

    // Apply fine-tuning adjustments
    if (FINE_TUNE_ADJUSTMENTS[sectionId]?.[rowLabel] !== undefined) {
      finalSeatCount += FINE_TUNE_ADJUSTMENTS[sectionId][rowLabel];
    }

    rows.push({
      rowLabel,
      seatCount: finalSeatCount,
      rowNumber,
    });
  }

  return {
    stadiumId: STADIUM_ID,
    sectionId,
    sectionName: sectionId,
    baseAngle,
    angleSpan: 3.4,
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
  log.info(`Elevation: 5,200 feet (highest in MLB)`);

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
      '100 Level (Lower Bowl)': 0,
      '200 Level (Club)': 0,
      '300 Level (Upper Reserved)': 0,
      '400 Level (Rockpile)': 0,
    },
    seatDistribution: {
      standard: 0,
      aisle: 0,
      wheelchair: 0,
    },
    coveredSeats: 0,
  };

  // Generate 100-Level sections (105-160)
  log.step('Generating 100-Level sections (105-160)...');
  for (let i = 105; i <= 160; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '100');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['100 Level (Lower Bowl)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`100 Level: ${160 - 105 + 1} sections, ${stats.levels['100 Level (Lower Bowl)']} seats`);

  // Generate 200-Level sections (with gaps)
  log.step('Generating 200-Level sections (201-247 with gaps)...');
  for (const sectionNum of LEVEL_200_SECTIONS) {
    const sectionId = `${sectionNum}`;
    const config = createSectionConfig(sectionId, '200');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['200 Level (Club)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`200 Level: ${LEVEL_200_SECTIONS.length} sections, ${stats.levels['200 Level (Club)']} seats`);

  // Generate 300-Level sections (301-347)
  log.step('Generating 300-Level sections (301-347)...');
  for (let i = 301; i <= 347; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '300');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['300 Level (Upper Reserved)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`300 Level: ${347 - 301 + 1} sections, ${stats.levels['300 Level (Upper Reserved)']} seats`);

  // Generate 400-Level sections (401-403 - The Rockpile)
  log.step('Generating 400-Level sections (401-403 - The Rockpile)...');
  for (let i = 401; i <= 403; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '400');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['400 Level (Rockpile)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`400 Level (Rockpile): ${403 - 401 + 1} sections, ${stats.levels['400 Level (Rockpile)']} seats (FIXED)`);

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
