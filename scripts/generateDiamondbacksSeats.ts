#!/usr/bin/env ts-node

/**
 * Chase Field Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 48,686 seats (from stadiums.ts configuration)
 * - Sections: ~102 sections across 3 main levels plus suites
 * - Levels: 100 (Lower), 200 (Club), 300 (Upper)
 * - Suites: A, B, C-Q, R, S (lettered sections)
 * - Special: 100W (Diamond Club), 145W (Picnic Pavilion)
 * - Orientation: 23° (home to center field, NNE)
 * - Retractable roof (4.5 minutes operation)
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateDiamondbacksSeats.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import type { SectionSeatingData } from '../src/types/seat';
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
};

// Chase Field base parameters
const STADIUM_ID = 'diamondbacks';
const STADIUM_NAME = 'Chase Field';
const ORIENTATION = 23; // degrees (NNE orientation)
const OFFICIAL_CAPACITY = 48686; // From stadiums.ts

// Per-level estimated capacity
const TARGET_100_LEVEL = 24000; // Lower level (including suites)
const TARGET_200_LEVEL = 11000; // Club level
const TARGET_300_LEVEL = 13686; // Upper level

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionNum: number, level: string, sectionId?: string): number {
  const centerField = ORIENTATION - 180; // -157°

  // Suite sections (lettered)
  if (sectionId && /^[A-S]$/.test(sectionId)) {
    const letterCode = sectionId.charCodeAt(0) - 65; // A=0, B=1, etc.
    // Suites A-S wrap around infield
    return centerField + 40 - (letterCode * 4.5); // ~85° arc for 19 suites
  }

  if (level === '100') {
    // 100 level: 101-145 (45 sections)
    if (sectionNum >= 101 && sectionNum <= 145) {
      const position = sectionNum - 101;
      return centerField + 55 - (position * 2.5); // ~110° arc
    }
  } else if (level === '200') {
    // 200 level: 200-224 (25 sections)
    if (sectionNum >= 200 && sectionNum <= 224) {
      const position = sectionNum - 200;
      return centerField + 45 - (position * 3.75); // ~90° arc
    }
  } else if (level === '300') {
    // 300 level: 300-332 (33 sections)
    if (sectionNum >= 300 && sectionNum <= 332) {
      const position = sectionNum - 300;
      return centerField + 50 - (position * 3.0); // ~96° arc
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionNum: number, sectionId?: string): number {
  // Suite sections (lettered)
  if (sectionId && /^[A-S]$/.test(sectionId)) {
    // A, B, R, S: 7 rows; C-Q: 13 rows
    if (['A', 'B', 'R', 'S'].includes(sectionId)) return 7;
    return 13; // C-Q
  }

  if (level === '100') {
    // Lower level - varying by location
    if (sectionNum >= 116 && sectionNum <= 128) return 20; // Center (infield, rows 21-40)
    if (sectionNum >= 101 && sectionNum <= 110) return 27; // End (LF, rows 14-40)
    if (sectionNum >= 134 && sectionNum <= 143) return 27; // End (RF, rows 14-40)
    if (sectionNum >= 111 && sectionNum <= 115) return 40; // Corner (3B, rows 1-40)
    if (sectionNum >= 129 && sectionNum <= 133) return 40; // Corner (1B, rows 1-40)
    if (sectionNum === 144 || sectionNum === 145) return 25; // Special sections near pavilion
    return 25; // default
  }
  if (level === '200') {
    // Club level - all 11 rows (rows 1-11)
    return 11;
  }
  if (level === '300') {
    // Upper level
    if (sectionNum >= 313 && sectionNum <= 319) return 40; // Center (rows 1-40)
    if (sectionNum >= 310 && sectionNum <= 312) return 40; // Corner 3B (rows 1-40)
    if (sectionNum >= 320 && sectionNum <= 322) return 40; // Corner 1B (rows 1-40)
    return 32; // End sections (rows 1-32)
  }
  return 20;
}

// Fine-tune adjustments: Add/subtract seats to specific section rows for exact capacity match
// Key format: "SECTION-ROW" (e.g., "101-5" = Section 101, Row 5)
// Value: Number of seats to add (+1) or remove (-1)
const FINE_TUNE_ADJUSTMENTS: Record<string, number> = {
  '120-10': +1, // Add 1 seat to Section 120, Row 10
  '125-15': +1, // Add 1 seat to Section 125, Row 15
};

// Determine seats per row
function getSeatsPerRow(level: string, sectionNum: number, sectionId?: string): number {
  // Suite sections (lettered)
  if (sectionId && /^[A-S]$/.test(sectionId)) {
    return 16; // Suites typically 16 seats/row
  }

  if (level === '100') {
    // Lower level - varying by location
    if (sectionNum >= 116 && sectionNum <= 128) return 18; // Center (infield)
    if (sectionNum === 101) return 15; // Section 101 (fine-tuned)
    if (sectionNum >= 102 && sectionNum <= 110) return 16; // End (LF)
    if (sectionNum >= 134 && sectionNum <= 143) return 16; // End (RF)
    if (sectionNum >= 111 && sectionNum <= 115) return 14; // Corner (3B)
    if (sectionNum >= 129 && sectionNum <= 133) return 14; // Corner (1B)
    return 15; // Special sections (144, 145, 100W, 145W)
  }
  if (level === '200') {
    // Club level - fine-tuned for exact capacity
    if (sectionNum >= 207 && sectionNum <= 214) return 49; // Center (infield)
    if (sectionNum >= 205 && sectionNum <= 206) return 45; // Corner (3B)
    if (sectionNum >= 215 && sectionNum <= 217) return 45; // Corner (1B)
    return 38; // End sections
  }
  if (level === '300') {
    // Upper level - increased for capacity
    if (sectionNum >= 313 && sectionNum <= 319) return 13; // Center (MVP boxes)
    if (sectionNum >= 310 && sectionNum <= 312) return 12; // Corner (3B)
    if (sectionNum >= 320 && sectionNum <= 322) return 12; // Corner (1B)
    return 10; // End sections
  }
  return 15;
}

// Determine distance from home plate
function getDistance(level: string, sectionId?: string): number {
  // Suite sections
  if (sectionId && /^[A-S]$/.test(sectionId)) {
    return 60; // Suites very close to field
  }

  if (level === '100') return 75; // feet (lower level)
  if (level === '200') return 140; // feet (club level)
  if (level === '300') return 220; // feet (upper level)
  return 120;
}

// Determine base elevation
function getElevation(level: string, sectionId?: string): number {
  // Suite sections
  if (sectionId && /^[A-S]$/.test(sectionId)) {
    return 15; // Suites slightly elevated
  }

  if (level === '100') return 0; // lower level
  if (level === '200') return 35; // club level
  if (level === '300') return 85; // upper level (high up)
  return 0;
}

// Determine if section is covered (when roof open)
function isCovered(level: string, sectionNum: number, rowNum: number, sectionId?: string): boolean {
  // Suite sections - mostly covered
  if (sectionId && /^[A-S]$/.test(sectionId)) {
    return true;
  }

  // When retractable roof is open:
  if (level === '100') {
    // Lower level: Corner infield sections
    if (sectionNum >= 106 && sectionNum <= 109) return true; // 3B corner
    if (sectionNum === 111) return true; // 3B corner
    if (sectionNum >= 135 && sectionNum <= 138) return true; // 1B corner
    return false;
  }

  if (level === '200') {
    // Club level: Some corner sections
    if (sectionNum >= 220 && sectionNum <= 223) return true;
    return false;
  }

  if (level === '300') {
    // Upper level: Best shade from upper deck overhang
    if (sectionNum >= 300 && sectionNum <= 302) return true; // LF end (best shade)
    if (sectionNum >= 330 && sectionNum <= 332) return true; // RF end (best shade)
    // Back rows of center and corner sections
    if (sectionNum >= 314 && sectionNum <= 327 && rowNum >= 25) return true;
    if (sectionNum >= 328 && sectionNum <= 332 && rowNum >= 20) return true;
    return false;
  }

  return false;
}

// Determine level string from level
function getLevelString(level: string, sectionId?: string): 'field' | 'lower' | 'club' | 'upper' | 'suite' {
  if (sectionId && /^[A-S]$/.test(sectionId)) return 'suite';
  if (level === '100') return 'lower';
  if (level === '200') return 'club';
  if (level === '300') return 'upper';
  return 'lower';
}

// Generate section configuration
function createSectionConfig(sectionId: string, level: string): SeatGenerationConfig {
  const sectionNum = parseInt(sectionId, 10);
  const isLettered = /^[A-S]$/.test(sectionId);

  let sectionName: string;
  if (isLettered) {
    const suiteNames: Record<string, string> = {
      'A': 'Third Base Box A',
      'B': 'Third Base Box B',
      'R': 'First Base Box R',
      'S': 'First Base Box S',
    };
    sectionName = suiteNames[sectionId] || `Infield Suite ${sectionId}`;
  } else if (sectionId === '100W') {
    sectionName = 'Diamond Club';
  } else if (sectionId === '145W') {
    sectionName = 'Picnic Pavilion';
  } else if (level === '200') {
    sectionName = `Club ${sectionId}`;
  } else if (level === '300') {
    sectionName = `Upper ${sectionId}`;
  } else {
    sectionName = `Section ${sectionId}`;
  }

  const rowCount = getRowCount(level, sectionNum, sectionId);
  const seatsPerRow = getSeatsPerRow(level, sectionNum, sectionId);
  const distance = getDistance(level, sectionId);
  const baseElevation = getElevation(level, sectionId);
  const baseAngle = getBaseAngle(sectionNum, level, sectionId);

  // Generate row labels
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const rowLabel = isLettered
      ? String.fromCharCode(65 + i) // A-Z for suites
      : `${i + 1}`; // Numbers for regular sections
    const covered = isCovered(level, sectionNum, i + 1, sectionId);

    // Apply fine-tune adjustments if applicable
    const adjustmentKey = `${sectionId}-${i + 1}`;
    const adjustment = FINE_TUNE_ADJUSTMENTS[adjustmentKey] || 0;
    const adjustedSeatCount = seatsPerRow + adjustment;

    rows.push({
      rowLabel,
      seatCount: adjustedSeatCount,
      rowNumber: i,
    });
  }

  return {
    stadiumId: STADIUM_ID,
    sectionId,
    sectionName,
    baseAngle,
    angleSpan: level === '100' ? 5.0 : level === '200' ? 6.0 : 7.0,
    baseElevation,
    rowHeight: 2.5,
    startDepth: distance,
    rowDepth: 2.8,
    rows,
    seatWidth: 2.0,
    seatSpacing: 0.5,
    rowSpacing: 36,
    level: getLevelString(level, sectionId),
    covered: isCovered(level, sectionNum, 1, sectionId),
    overhangHeight: isCovered(level, sectionNum, 1, sectionId) ? 20 : undefined,
  };
}

// Main generation function
async function generateAllSections() {
  log.step('Starting Chase Field seat generation...');
  log.info(`Stadium: ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats`);
  log.info(`Per-level targets: 100:${TARGET_100_LEVEL.toLocaleString()} | 200:${TARGET_200_LEVEL.toLocaleString()} | 300:${TARGET_300_LEVEL.toLocaleString()}`);

  const sections: SectionSeatingData[] = [];
  let totalSeats = 0;
  let level100Seats = 0;
  let level200Seats = 0;
  let level300Seats = 0;
  let totalSections = 0;

  // Suite Sections (A, B, C-Q, R, S)
  log.step('Generating Suite sections...');
  const suiteLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'];
  for (const letter of suiteLetters) {
    const config = createSectionConfig(letter, '100');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level100Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Suites complete: ${suiteLetters.length} sections, ${level100Seats} seats (part of 100 level)`);

  // 100 Level - Lower Bowl (sections 101-145, plus 100W, 145W)
  log.step('Generating 100 Level (Lower Bowl) sections...');
  for (let i = 101; i <= 145; i++) {
    const config = createSectionConfig(`${i}`, '100');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level100Seats += sectionData.totalSeats;
    totalSections++;
  }
  // Special sections 100W and 145W
  for (const special of ['100W', '145W']) {
    const config = createSectionConfig(special, '100');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level100Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`100 Level complete: ${totalSections - suiteLetters.length} sections, ${level100Seats - sections[0].totalSeats * suiteLetters.length} seats (excluding suites)`);
  log.info(`100 Level total (with suites): ${level100Seats} seats (target: ${TARGET_100_LEVEL})`);

  // 200 Level - Club Level (sections 200-224)
  log.step('Generating 200 Level (Club) sections...');
  const level200Start = totalSections;
  for (let i = 200; i <= 224; i++) {
    const config = createSectionConfig(`${i}`, '200');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level200Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`200 Level complete: ${totalSections - level200Start} sections, ${level200Seats} seats (target: ${TARGET_200_LEVEL})`);

  // 300 Level - Upper Deck (sections 300-332)
  log.step('Generating 300 Level (Upper Deck) sections...');
  const level300Start = totalSections;
  for (let i = 300; i <= 332; i++) {
    const config = createSectionConfig(`${i}`, '300');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level300Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`300 Level complete: ${totalSections - level300Start} sections, ${level300Seats} seats (target: ${TARGET_300_LEVEL})`);

  // Export all sections
  log.step('Exporting section files...');
  const outputDir = path.join(process.cwd(), 'src', 'data', 'seatData', STADIUM_ID, 'sections');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const section of sections) {
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }

  log.success(`Exported ${sections.length} section files to ${outputDir}`);

  // Create metadata file
  log.step('Creating stadium metadata...');

  const metadataPath = path.join(process.cwd(), 'src', 'data', 'seatData', STADIUM_ID, 'metadata.ts');
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
  totalSections: ${sections.length},
  lastValidated: '${new Date().toISOString()}',
};

export const stats: StadiumSeatingStats = {
  totalSeats: ${totalSeats},
  totalSections: ${sections.length},
  totalRows: ${sections.reduce((sum, s) => sum + s.totalRows, 0)},
  levels: {
    '100 Level (Lower + Suites)': ${level100Seats},
    '200 Level (Club)': ${level200Seats},
    '300 Level (Upper)': ${level300Seats},
  },
  seatDistribution: {
    standard: ${Math.floor(totalSeats * 0.90)},
    aisle: ${Math.floor(totalSeats * 0.07)},
    wheelchair: ${Math.floor(totalSeats * 0.03)},
  },
  coveredSeats: ${sections.reduce((sum, s) => sum + (s.rows[0]?.seats[0]?.covered ? s.totalSeats : 0), 0)},
};
`;

  fs.writeFileSync(metadataPath, metadataContent);
  log.success(`Created metadata file: ${metadataPath}`);

  // Final summary
  console.log('');
  console.log(`${colors.bright}${colors.green}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}  Chase Field Generation Complete!${colors.reset}`);
  console.log(`${colors.bright}${colors.green}═══════════════════════════════════════${colors.reset}`);
  console.log('');
  log.info(`Total Sections: ${sections.length}`);
  log.info(`Total Seats: ${totalSeats.toLocaleString()}`);
  log.info(`Official Capacity: ${OFFICIAL_CAPACITY.toLocaleString()}`);
  console.log('');
  log.info(`Per-Level Breakdown:`);
  log.info(`  100: ${level100Seats.toLocaleString()} (target: ${TARGET_100_LEVEL.toLocaleString()}, ${((level100Seats/TARGET_100_LEVEL)*100).toFixed(2)}%)`);
  log.info(`  200: ${level200Seats.toLocaleString()} (target: ${TARGET_200_LEVEL.toLocaleString()}, ${((level200Seats/TARGET_200_LEVEL)*100).toFixed(2)}%)`);
  log.info(`  300: ${level300Seats.toLocaleString()} (target: ${TARGET_300_LEVEL.toLocaleString()}, ${((level300Seats/TARGET_300_LEVEL)*100).toFixed(2)}%)`);

  const diff = totalSeats - OFFICIAL_CAPACITY;
  const diffSign = diff >= 0 ? '+' : '';
  log.info(`Match: ${((totalSeats / OFFICIAL_CAPACITY) * 100).toFixed(2)}% (${diffSign}${diff} seats)`);
  console.log('');
  log.info(`Output Directory: ${outputDir}`);
  log.info(`Files Created: ${sections.length + 1} (${sections.length} sections + metadata)`);
  console.log('');

  if (totalSeats === OFFICIAL_CAPACITY) {
    log.success(`✨ PERFECT MATCH! Seat count exactly matches official capacity (${OFFICIAL_CAPACITY.toLocaleString()} seats)`);
  } else {
    const percentDiff = Math.abs(totalSeats - OFFICIAL_CAPACITY) / OFFICIAL_CAPACITY;
    console.log(`${colors.yellow}⚠️  Warning: Seat count differs by ${diff} seats (${(percentDiff * 100).toFixed(3)}%)${colors.reset}`);
    console.log(`${colors.yellow}   Target: Exact match (48,686 seats)${colors.reset}`);
    console.log(`${colors.yellow}   Adjust getSeatsPerRow() or getRowCount() to fine-tune capacity${colors.reset}`);
  }

  console.log('');
  log.step('Next steps:');
  console.log('  1. Review generated files in src/data/seatData/diamondbacks/');
  console.log('  2. If seat count is off, adjust getSeatsPerRow() or getRowCount() and regenerate');
  console.log('  3. Pre-compute sun data: npx tsx scripts/precomputeSunData.ts --stadium=diamondbacks --game-time=13:10');
  console.log('  4. Build project: npm run build');
  console.log('');
}

// Run generation
generateAllSections().catch((error) => {
  console.error(`${colors.red}Error generating Chase Field seats:${colors.reset}`, error);
  process.exit(1);
});
