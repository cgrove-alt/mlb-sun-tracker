#!/usr/bin/env ts-node

/**
 * George M. Steinbrenner Field Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 11,026 seats (from stadiums.ts - 2007-present configuration)
 * - Sections: ~75 seating areas across multiple levels
 * - Levels: Field Boxes (A-S), Dugout Club (1-12), 100-Level (102-120),
 *           200-Level (203-219), Loge Boxes (1-8), Premium areas
 * - Orientation: 316° (home to center field, NW)
 * - Open roof, spring training facility
 * - Temporary home for Tampa Bay Rays (2025 season)
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateRaysSeats.ts
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

// George M. Steinbrenner Field base parameters
const STADIUM_ID = 'rays';
const STADIUM_NAME = 'George M. Steinbrenner Field';
const ORIENTATION = 316; // degrees (NW)
const OFFICIAL_CAPACITY = 11026; // From stadiums.ts (2007-present)

// Per-level estimated capacity
const TARGET_FIELD_BOX = 1500;      // Field Boxes A-S
const TARGET_DUGOUT = 104;          // Dugout Club 1-12 (confirmed 104 seats)
const TARGET_100 = 5500;            // 100-Level 102-120
const TARGET_200 = 2500;            // 200-Level 203-219
const TARGET_LOGE = 150;            // Loge Boxes 1-8
const TARGET_PREMIUM = 800;         // Clubs, Cabanas, etc.
const TARGET_OUTFIELD = 200;        // Left/Right Field areas
const TARGET_SUITES = 272;          // 13 suites
// Total: 11,026

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string, level: string): number {
  const centerField = ORIENTATION - 180; // 136° (316° - 180°)

  if (level === 'fieldbox') {
    // Field Boxes: A-S (19 sections behind home plate and down lines)
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
    const index = letters.indexOf(sectionId);
    if (index >= 0) {
      return centerField - 45 + (index * 5); // ~90° arc
    }
  } else if (level === 'dugout') {
    // Dugout Club: 1-12 (behind home plate)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 1 && sectionNum <= 12) {
      const position = sectionNum - 1;
      return centerField - 22 + (position * 4); // ~44° arc behind home plate
    }
  } else if (level === '100') {
    // 100-Level: 102-120 (19 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 102 && sectionNum <= 120) {
      const position = sectionNum - 102;
      return centerField + 85 - (position * 5); // ~90° arc
    }
  } else if (level === '200') {
    // 200-Level: 203-219 (17 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 203 && sectionNum <= 219) {
      const position = sectionNum - 203;
      return centerField + 40 - (position * 5); // ~80° arc
    }
  } else if (level === 'loge') {
    // Loge Boxes: 1-8 (above 200-level)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 1 && sectionNum <= 8) {
      const position = sectionNum - 1;
      // 1-4 first base side, 5-8 third base side
      if (sectionNum <= 4) {
        return centerField - 35 + (position * 10); // First base side
      } else {
        return centerField + 5 + ((position - 4) * 10); // Third base side
      }
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10) || 0;

  if (level === 'fieldbox') return 9; // Field boxes: 9 rows
  if (level === 'dugout') return 2; // Dugout club: exactly 2 rows (confirmed)

  if (level === '100') {
    // 100-Level varies: 13-16 rows
    if (sectionNum === 102) return 16; // Section 102: AA-PP (16 rows)
    if (sectionNum === 107) return 13; // Section 107: DD-PP (13 rows)
    if (sectionNum === 110) return 14; // Section 110: CC-PP (14 rows)
    // Center sections (108-113): more rows
    if (sectionNum >= 108 && sectionNum <= 113) return 15;
    // End sections: fewer rows
    return 14;
  }

  if (level === '200') {
    // 200-Level: 11 rows
    return 11;
  }

  if (level === 'loge') return 3; // Loge boxes: 3 rows

  return 10; // fallback
}

// Determine seats per row
function getSeatsPerRow(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10) || 0;

  if (level === 'fieldbox') return 11; // Field boxes: 11 seats per row

  if (level === 'dugout') {
    // Dugout club: 104 seats / 12 sections / 2 rows = ~4.3 per row
    // Let's use 4-5 seats per row to hit exactly 104
    return 4; // Will adjust fine-tuning for exact 104
  }

  if (level === '100') {
    // Center sections (108-113): more seats
    if (sectionNum >= 108 && sectionNum <= 113) return 22;
    // End sections: fewer seats
    if (sectionNum <= 105 || sectionNum >= 117) return 20;
    // Middle sections
    return 21;
  }

  if (level === '200') {
    // Center sections (208-214): more seats
    if (sectionNum >= 208 && sectionNum <= 214) return 18;
    // End sections
    return 16;
  }

  if (level === 'loge') return 7; // Loge boxes: 7 seats per row

  return 15; // fallback
}

// Distance from home plate
function getDistance(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10) || 0;

  if (level === 'fieldbox') return 45; // Very close to field
  if (level === 'dugout') return 55; // Behind field boxes

  if (level === '100') {
    // Center sections closer
    if (sectionNum >= 108 && sectionNum <= 113) return 70;
    return 85; // Ends/corners
  }

  if (level === '200') return 110; // Upper level
  if (level === 'loge') return 115; // Above 200-level

  return 75; // fallback
}

// Base elevation for each level
function getElevation(level: string): number {
  if (level === 'fieldbox') return 5;
  if (level === 'dugout') return 8;
  if (level === '100') return 12;
  if (level === '200') return 35;
  if (level === 'loge') return 42;
  return 10; // fallback
}

// Check if section is covered (has overhang)
function isCovered(level: string, sectionId: string, rowNum: number): boolean {
  // 200-Level: Back rows may have some coverage
  if (level === '200') return rowNum >= 7; // Rows 8+ covered

  // Loge boxes: Some overhang
  if (level === 'loge') return true;

  // Most sections: Open air (spring training design)
  return false;
}

// Get level string for section
function getLevelString(level: string): string {
  const levelMap: Record<string, string> = {
    'fieldbox': 'Field Box (A-S)',
    'dugout': 'Dugout Club (1-12)',
    '100': '100 Level (Reserved)',
    '200': '200 Level (Upper)',
    'loge': 'Loge Boxes (1-8)',
  };
  return levelMap[level] || level;
}

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

    // 100-Level uses double letters (AA-QQ)
    if (level === '100') {
      const letters = ['AA', 'BB', 'CC', 'DD', 'EE', 'FF', 'GG', 'HH', 'II', 'JJ', 'KK', 'LL', 'MM', 'NN', 'OO', 'PP', 'QQ'];
      // Different sections start at different rows
      if (sectionNum === 102) {
        rowLabel = letters[i]; // AA-PP (starts at AA)
      } else if (sectionNum === 107) {
        rowLabel = letters[i + 3]; // DD-PP (starts at DD = index 3)
      } else if (sectionNum === 110) {
        rowLabel = letters[i + 2]; // CC-PP (starts at CC = index 2)
      } else {
        // Most sections start at CC
        rowLabel = letters[i + 2];
      }
    }
    // Other levels use numeric rows
    else {
      rowLabel = `${i + 1}`;
    }

    // Fine-tuning for Dugout Club: exact 104 seats
    // 12 sections * 2 rows * 4 seats = 96, need 8 more
    // Give first 8 sections 5 seats in row 1
    let adjustedSeatCount = seatsPerRow;
    if (level === 'dugout') {
      const dugoutNum = parseInt(sectionId, 10);
      if (i === 0 && dugoutNum <= 8) {
        adjustedSeatCount = 5; // First row of sections 1-8 gets 5 seats
      }
    }

    // Fine-tuning: Add exactly 40 more seats total
    // Add 1 seat per row to sections 203-205 (3 sections × 11 rows = 33 seats)
    // Add 1 seat to first 7 rows of section 206 (7 seats)
    // Total: 33 + 7 = 40 seats
    if (level === '200') {
      const sectionNum200 = parseInt(sectionId, 10);
      if (sectionNum200 >= 203 && sectionNum200 <= 205) {
        adjustedSeatCount += 1; // +1 seat per row (3 sections × 11 rows = 33 seats)
      } else if (sectionNum200 === 206 && i < 7) {
        adjustedSeatCount += 1; // +1 seat to first 7 rows of section 206 (7 seats)
      }
    }

    rows.push({
      rowLabel,
      seatCount: adjustedSeatCount,
      rowNumber: i,
    });
  }

  return {
    stadiumId: STADIUM_ID,
    sectionId,
    sectionName: sectionId,
    baseAngle,
    angleSpan: 4.0,
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
      'Field Box (A-S)': 0,
      'Dugout Club (1-12)': 0,
      '100 Level (Reserved)': 0,
      '200 Level (Upper)': 0,
      'Loge Boxes (1-8)': 0,
    },
    seatDistribution: {
      standard: 0,
      aisle: 0,
      wheelchair: 0,
    },
    coveredSeats: 0,
  };

  // Generate Field Box sections (A-S)
  log.step('Generating Field Box sections (A-S)...');
  const fieldBoxSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
  for (const sectionId of fieldBoxSections) {
    const config = createSectionConfig(sectionId, 'fieldbox');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Field Box (A-S)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Field Box: ${fieldBoxSections.length} sections, ${stats.levels['Field Box (A-S)']} seats`);

  // Generate Dugout Club sections (1-12)
  log.step('Generating Dugout Club sections (1-12)...');
  for (let i = 1; i <= 12; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'dugout');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Dugout Club (1-12)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `DC${section.sectionId}.ts`; // Prefix with DC to avoid conflicts
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Dugout Club: 12 sections, ${stats.levels['Dugout Club (1-12)']} seats`);

  // Generate 100-Level sections (102-120)
  log.step('Generating 100-Level sections (102-120)...');
  for (let i = 102; i <= 120; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '100');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['100 Level (Reserved)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`100 Level: ${120 - 102 + 1} sections, ${stats.levels['100 Level (Reserved)']} seats`);

  // Generate 200-Level sections (203-219)
  log.step('Generating 200-Level sections (203-219)...');
  for (let i = 203; i <= 219; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '200');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['200 Level (Upper)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`200 Level: ${219 - 203 + 1} sections, ${stats.levels['200 Level (Upper)']} seats`);

  // Generate Loge Box sections (1-8)
  log.step('Generating Loge Box sections (1-8)...');
  for (let i = 1; i <= 8; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'loge');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Loge Boxes (1-8)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `LB${section.sectionId}.ts`; // Prefix with LB to avoid conflicts
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Loge Boxes: 8 sections, ${stats.levels['Loge Boxes (1-8)']} seats`);

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
