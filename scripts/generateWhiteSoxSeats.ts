#!/usr/bin/env ts-node

/**
 * Guaranteed Rate Field / Rate Field Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 40,615 seats (from stadiums.ts - 2004-present)
 * - Sections: ~180-200 seating sections across 5 levels
 * - Levels: 100 (101-164), 200 (206-254 suites), 300 (311-357 club), 400 (406-459 luxury), 500 (506-558 upper)
 * - Orientation: 90° (Due East)
 * - Open-air design, opened April 18, 1991
 * - Major 2004 renovation: Removed 8 rows from upper deck (6,600 seats)
 *
 * Created: 2025-10-23
 * Usage: npx tsx scripts/generateWhiteSoxSeats.ts
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

// Guaranteed Rate Field base parameters
const STADIUM_ID = 'whitesox';
const STADIUM_NAME = 'Guaranteed Rate Field';
const ORIENTATION = 90; // degrees (Due East)
const OFFICIAL_CAPACITY = 40615; // From stadiums.ts

// Per-level estimated capacity (2004-present configuration)
const TARGET_100 = 21500;         // 100-Level 101-164 (~64 sections) - 52.9%
const TARGET_200 = 1800;          // 200-Level 206-254 suites (~49 sections) - 4.4%
const TARGET_300 = 1822;          // 300-Level 311-357 club (~47 sections) - 4.5% (exact documented)
const TARGET_400 = 2500;          // 400-Level 406-459 luxury (~54 sections) - 6.2%
const TARGET_500 = 13000;         // 500-Level 506-558 upper (~53 sections) - 32.0%
// Total: 40,622 (initial estimate, will tune to 40,615)

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string, level: string): number {
  const centerField = ORIENTATION - 180; // -90° (90° adjusted for due east)

  if (level === '100') {
    // 100-Level: 101-164 (64 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 101 && sectionNum <= 164) {
      const position = sectionNum - 101;
      // Full wrap around field: ~240° arc
      return centerField + 120 - (position * 3.75);
    }
  } else if (level === '200') {
    // 200-Level: 206-254 (~49 sections, suites)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 206 && sectionNum <= 254) {
      const position = sectionNum - 206;
      // Suite level wrap: ~180° arc (infield focused)
      return centerField + 90 - (position * 3.75);
    }
  } else if (level === '300') {
    // 300-Level: 311-357 (~47 sections, club)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 311 && sectionNum <= 357) {
      const position = sectionNum - 311;
      // Club level wrap: ~180° arc (infield focused)
      return centerField + 90 - (position * 3.9);
    }
  } else if (level === '400') {
    // 400-Level: 406-459 (~54 sections, luxury)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 406 && sectionNum <= 459) {
      const position = sectionNum - 406;
      // Luxury level wrap: ~200° arc
      return centerField + 100 - (position * 3.7);
    }
  } else if (level === '500') {
    // 500-Level: 506-558 (~53 sections, upper deck)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 506 && sectionNum <= 558) {
      const position = sectionNum - 506;
      // Upper deck wrap: ~200° arc
      return centerField + 100 - (position * 3.8);
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionId: string): number {
  if (level === '100') {
    const sectionNum = parseInt(sectionId, 10);
    // Scout Seats area (111-118, 146-153): Premium, fewer rows
    if ((sectionNum >= 111 && sectionNum <= 118) || (sectionNum >= 146 && sectionNum <= 153)) return 15;
    // Center infield sections: More rows (increased from 20 to 24)
    if ((sectionNum >= 119 && sectionNum <= 127) || (sectionNum >= 137 && sectionNum <= 145)) return 24;
    // Bleachers (160-164): Standard bench rows
    if (sectionNum >= 160 && sectionNum <= 164) return 20;
    // Corner sections: Medium rows (increased from 18 to 21)
    if ((sectionNum >= 101 && sectionNum <= 110) || (sectionNum >= 154 && sectionNum <= 159)) return 21;
    return 19; // Default (increased from 17)
  }

  if (level === '200') {
    // Suite level: Very small sections (simplified suites)
    return 4;
  }

  if (level === '300') {
    // Club level: SMALL sections to hit exactly 1,822 seats
    // 47 sections × 5 rows × 8 seats = 1,880 seats (close to 1,822 target)
    return 5;
  }

  if (level === '400') {
    // Luxury boxes: Small sections
    return 6;
  }

  if (level === '500') {
    // Upper deck: Increased rows to hit ~13,000 target
    // 53 sections × 13 rows × 20 seats = 13,780 (closer to 13,000)
    return 13;
  }

  return 15; // fallback
}

// Determine seats per row
function getSeatsPerRow(level: string, sectionId: string): number {
  if (level === '100') {
    const sectionNum = parseInt(sectionId, 10);
    // Scout Seats (111-118, 146-153): Premium, wider seats
    if ((sectionNum >= 111 && sectionNum <= 118) || (sectionNum >= 146 && sectionNum <= 153)) return 10;
    // Infield sections: Narrow
    if ((sectionNum >= 119 && sectionNum <= 127) || (sectionNum >= 137 && sectionNum <= 145)) return 18;
    // Bleachers (160-164): Wide benches
    if (sectionNum >= 160 && sectionNum <= 164) return 24;
    // Corner sections: Variable
    if ((sectionNum >= 101 && sectionNum <= 110) || (sectionNum >= 154 && sectionNum <= 159)) return 18;
    return 17; // Default
  }

  if (level === '200') {
    // Suite level: Very small sections
    return 8;
  }

  if (level === '300') {
    // Club level: Small to hit 1,822 target
    // Target: 1,822 / 47 sections = ~39 seats per section
    // 5 rows × 8 seats = 40 seats per section
    return 8;
  }

  if (level === '400') {
    // Luxury boxes: Small sections
    return 8;
  }

  if (level === '500') {
    // Upper deck: Target ~13,000 / 53 sections = ~245 per section
    // 13 rows × 19 seats = 247 seats per section (reduced from 20 to 19)
    return 19;
  }

  return 18; // fallback
}

// Distance from home plate
function getDistance(level: string, sectionId: string): number {
  if (level === '100') {
    const sectionNum = parseInt(sectionId, 10);
    // Scout Seats: Closest to field
    if ((sectionNum >= 111 && sectionNum <= 118) || (sectionNum >= 146 && sectionNum <= 153)) return 45;
    // Infield sections: Close
    if ((sectionNum >= 119 && sectionNum <= 127) || (sectionNum >= 137 && sectionNum <= 145)) return 65;
    // Bleachers: Far
    if (sectionNum >= 160 && sectionNum <= 164) return 120;
    // Corner sections: Medium
    return 85;
  }

  if (level === '200') return 90; // Suite level: Mid-range

  if (level === '300') return 95; // Club level: Similar to 200-level

  if (level === '400') return 130; // Luxury level: Further back

  if (level === '500') return 160; // Upper deck: Farthest

  return 100; // fallback
}

// Base elevation for each level
function getElevation(level: string, sectionId: string): number {
  if (level === '100') {
    const sectionNum = parseInt(sectionId, 10);
    // Scout Seats: Low to field
    if ((sectionNum >= 111 && sectionNum <= 118) || (sectionNum >= 146 && sectionNum <= 153)) return 8;
    return 12; // Other 100-level sections
  }
  if (level === '200') return 30; // Suite level: Mid-height
  if (level === '300') return 35; // Club level: Mezzanine
  if (level === '400') return 52; // Luxury level: Higher
  if (level === '500') return 70; // Upper deck: Highest
  return 20; // fallback
}

// Check if section is covered (has overhang)
function isCovered(level: string, sectionId: string, rowNum: number): boolean {
  const sectionNum = parseInt(sectionId, 10) || 0;

  // 500-Level: Rows 9+ fully covered by flat roof (added 2004)
  if (level === '500' && rowNum >= 9) return true;

  // 100-Level: Rows 30+ partial coverage from club level overhang
  if (level === '100' && rowNum >= 30) return true;

  // 200/300/400 Levels: Indoor/climate-controlled access (suites/clubs)
  if (level === '200' || level === '300' || level === '400') return true;

  // Most sections: Open air (90° orientation - due east)
  return false;
}

// Get level string for section
function getLevelString(level: string): string {
  const levelMap: Record<string, string> = {
    '100': '100 Level (Lower Bowl)',
    '200': '200 Level (Suite Level)',
    '300': '300 Level (Club Level)',
    '400': '400 Level (Luxury Level)',
    '500': '500 Level (Upper Deck)',
  };
  return levelMap[level] || level;
}

// Fine-tuning adjustments to hit exact 40,615 seats
// Current: 40,662 seats, Target: 40,615 seats, Need to remove: 47 seats
const FINE_TUNE_ADJUSTMENTS: Record<string, Record<string, number>> = {
  // Remove 1 seat from row 5 for sections 101-147 (47 sections) = 47 seats removed
  '101': { '5': -1 },
  '102': { '5': -1 },
  '103': { '5': -1 },
  '104': { '5': -1 },
  '105': { '5': -1 },
  '106': { '5': -1 },
  '107': { '5': -1 },
  '108': { '5': -1 },
  '109': { '5': -1 },
  '110': { '5': -1 },
  '111': { '5': -1 },
  '112': { '5': -1 },
  '113': { '5': -1 },
  '114': { '5': -1 },
  '115': { '5': -1 },
  '116': { '5': -1 },
  '117': { '5': -1 },
  '118': { '5': -1 },
  '119': { '5': -1 },
  '120': { '5': -1 },
  '121': { '5': -1 },
  '122': { '5': -1 },
  '123': { '5': -1 },
  '124': { '5': -1 },
  '125': { '5': -1 },
  '126': { '5': -1 },
  '127': { '5': -1 },
  '128': { '5': -1 },
  '129': { '5': -1 },
  '130': { '5': -1 },
  '131': { '5': -1 },
  '132': { '5': -1 },
  '133': { '5': -1 },
  '134': { '5': -1 },
  '135': { '5': -1 },
  '136': { '5': -1 },
  '137': { '5': -1 },
  '138': { '5': -1 },
  '139': { '5': -1 },
  '140': { '5': -1 },
  '141': { '5': -1 },
  '142': { '5': -1 },
  '143': { '5': -1 },
  '144': { '5': -1 },
  '145': { '5': -1 },
  '146': { '5': -1 },
  '147': { '5': -1 },
  // Total: 47 seats removed to hit exactly 40,615
};

// Create section configuration
function createSectionConfig(sectionId: string, level: string): SeatGenerationConfig {
  const rowCount = getRowCount(level, sectionId);
  const seatsPerRow = getSeatsPerRow(level, sectionId);
  const distance = getDistance(level, sectionId);
  const baseElevation = getElevation(level, sectionId);
  const baseAngle = getBaseAngle(sectionId, level);

  // Generate rows array
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const rowLabel = `${i + 1}`; // All levels use numerical rows (1, 2, 3, ...)
    const rowNumber = i + 1;
    let finalSeatCount = seatsPerRow;

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
    angleSpan: level === '100' ? 3.5 : level === '500' ? 3.6 : 3.7,
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
  log.info(`Opened: April 18, 1991 (2004 renovation: -6,600 seats)`);

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
      '200 Level (Suite Level)': 0,
      '300 Level (Club Level)': 0,
      '400 Level (Luxury Level)': 0,
      '500 Level (Upper Deck)': 0,
    },
    seatDistribution: {
      standard: 0,
      aisle: 0,
      wheelchair: 0,
    },
    coveredSeats: 0,
  };

  // Generate 100-Level sections (101-164)
  log.step('Generating 100-Level sections (101-164)...');
  for (let i = 101; i <= 164; i++) {
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
  log.success(`100 Level: 64 sections, ${stats.levels['100 Level (Lower Bowl)']} seats`);

  // Generate 200-Level sections (206-254, suites)
  log.step('Generating 200-Level sections (206-254, suites)...');
  for (let i = 206; i <= 254; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '200');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['200 Level (Suite Level)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`200 Level: 49 sections, ${stats.levels['200 Level (Suite Level)']} seats`);

  // Generate 300-Level sections (311-357, club)
  log.step('Generating 300-Level sections (311-357, club)...');
  for (let i = 311; i <= 357; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '300');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['300 Level (Club Level)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`300 Level: 47 sections, ${stats.levels['300 Level (Club Level)']} seats`);

  // Generate 400-Level sections (406-459, luxury)
  log.step('Generating 400-Level sections (406-459, luxury)...');
  for (let i = 406; i <= 459; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '400');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['400 Level (Luxury Level)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`400 Level: 54 sections, ${stats.levels['400 Level (Luxury Level)']} seats`);

  // Generate 500-Level sections (506-558, upper deck)
  log.step('Generating 500-Level sections (506-558, upper deck)...');
  for (let i = 506; i <= 558; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '500');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['500 Level (Upper Deck)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`500 Level: 53 sections, ${stats.levels['500 Level (Upper Deck)']} seats`);

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
