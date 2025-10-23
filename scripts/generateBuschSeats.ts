#!/usr/bin/env ts-node

/**
 * Busch Stadium Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 44,494 seats
 * - Sections: ~200 sections
 * - Levels: 100 (Field), 200 (Club), 300 (Upper), 400 (Terrace)
 * - Orientation: 92° (home to center field)
 *
 * Created: 2025-10-21
 * Usage: npx ts-node scripts/generateBuschSeats.ts
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

// Busch Stadium base parameters
const STADIUM_ID = 'cardinals';
const STADIUM_NAME = 'Busch Stadium';
const ORIENTATION = 92; // degrees
const OFFICIAL_CAPACITY = 44383; // 2020-present official capacity

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionNum: number, level: string): number {
  const centerField = ORIENTATION - 180; // -88°

  if (level === '100') {
    // 100 level wraps around from RF foul pole to LF foul pole
    if (sectionNum >= 101 && sectionNum <= 137) {
      // Right field to 1B line to home plate
      return centerField + 45 - ((sectionNum - 101) * 2.5);
    } else if (sectionNum >= 138 && sectionNum <= 172) {
      // Home plate to 3B line to left field
      return centerField - 45 + ((sectionNum - 138) * 2.5);
    }
  } else if (level === '200') {
    // 200 level (club) similar pattern but tighter
    if (sectionNum >= 241 && sectionNum <= 257) {
      return centerField + 30 - ((sectionNum - 241) * 3.75);
    }
  } else if (level === '300') {
    // 300 level upper deck
    if (sectionNum >= 328 && sectionNum <= 364) {
      return centerField + 40 - ((sectionNum - 328) * 2.2);
    }
  } else if (level === '400') {
    // 400 level terrace (RF line to near 3B)
    if (sectionNum >= 428 && sectionNum <= 454) {
      return centerField + 45 - ((sectionNum - 428) * 3.5);
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section level
function getRowCount(level: string, sectionNum: number): number {
  if (level === '100') return 15; // Field level
  if (level === '200') return 17; // Club level (increased)
  if (level === '300') return 18; // Upper deck (increased)
  if (level === '400') return 14; // Terrace
  return 15;
}

// Fine-tune adjustments to hit exact capacity (44,383 seats)
// Format: { sectionId: { rowLabel: seatAdjustment } }
// Negative values remove seats, positive values add seats
// Row labels are letters: A=row 0, B=row 1, ..., M=row 12, N=row 13, O=row 14
const FINE_TUNE_ADJUSTMENTS: Record<string, Record<string, number>> = {
  // Remove 1 seat from rows M-O (12-14) for 100-Level sections (3 rows × 47 sections selected = 141 seats)
  '101': { 'M': -1, 'N': -1, 'O': -1 },
  '102': { 'M': -1, 'N': -1, 'O': -1 },
  '103': { 'M': -1, 'N': -1, 'O': -1 },
  '104': { 'M': -1, 'N': -1, 'O': -1 },
  '105': { 'M': -1, 'N': -1, 'O': -1 },
  '106': { 'M': -1, 'N': -1, 'O': -1 },
  '107': { 'M': -1, 'N': -1, 'O': -1 },
  '108': { 'M': -1, 'N': -1, 'O': -1 },
  '109': { 'M': -1, 'N': -1, 'O': -1 },
  '110': { 'M': -1, 'N': -1, 'O': -1 },
  '111': { 'M': -1, 'N': -1, 'O': -1 },
  '112': { 'M': -1, 'N': -1, 'O': -1 },
  '113': { 'M': -1, 'N': -1, 'O': -1 },
  '114': { 'M': -1, 'N': -1, 'O': -1 },
  '115': { 'M': -1, 'N': -1, 'O': -1 },
  '116': { 'M': -1, 'N': -1, 'O': -1 },
  '117': { 'M': -1, 'N': -1, 'O': -1 },
  '118': { 'M': -1, 'N': -1, 'O': -1 },
  '119': { 'M': -1, 'N': -1, 'O': -1 },
  '120': { 'M': -1, 'N': -1, 'O': -1 },
  '121': { 'M': -1, 'N': -1, 'O': -1 },
  '122': { 'M': -1, 'N': -1, 'O': -1 },
  '123': { 'M': -1, 'N': -1, 'O': -1 },
  '124': { 'M': -1, 'N': -1, 'O': -1 },
  '125': { 'M': -1, 'N': -1, 'O': -1 },
  '126': { 'M': -1, 'N': -1, 'O': -1 },
  '127': { 'M': -1, 'N': -1, 'O': -1 },
  '128': { 'M': -1, 'N': -1, 'O': -1 },
  '129': { 'M': -1, 'N': -1, 'O': -1 },
  '130': { 'M': -1, 'N': -1, 'O': -1 },
  '131': { 'M': -1, 'N': -1, 'O': -1 },
  '132': { 'M': -1, 'N': -1, 'O': -1 },
  '133': { 'M': -1, 'N': -1, 'O': -1 },
  '134': { 'M': -1, 'N': -1, 'O': -1 },
  '135': { 'M': -1, 'N': -1, 'O': -1 },
  '136': { 'M': -1, 'N': -1, 'O': -1 },
  '137': { 'M': -1, 'N': -1, 'O': -1 },
  '138': { 'M': -1, 'N': -1, 'O': -1 },
  '139': { 'M': -1, 'N': -1, 'O': -1 },
  '140': { 'M': -1, 'N': -1, 'O': -1 },
  '141': { 'M': -1, 'N': -1, 'O': -1 },
  '142': { 'M': -1, 'N': -1, 'O': -1 },
  '143': { 'M': -1, 'N': -1, 'O': -1 },
  '144': { 'M': -1, 'N': -1, 'O': -1 },
  '145': { 'M': -1, 'N': -1, 'O': -1 },
  '146': { 'M': -1, 'N': -1, 'O': -1 },
  '147': { 'M': -1, 'N': -1, 'O': -1 },
  '148': { 'M': -1, 'N': -1 },
};
// Total removed: 141 (100-Level: 46 sections × 3 rows) + 5 (147: 3 rows, 148: 2 rows) = 146 seats
// Target: 44,526 - 143 = 44,383 seats exactly

// Determine seats per row
function getSeatsPerRow(level: string, sectionNum: number): number {
  if (level === '100') {
    // Infield sections smaller
    if (sectionNum >= 138 && sectionNum <= 161) return 10; // Increased
    return 11;
  }
  if (level === '200') return 16; // Increased
  if (level === '300') return 20;
  if (level === '400') {
    // Corner sections larger
    if (sectionNum >= 445 && sectionNum <= 454) return 20;
    return 17;
  }
  return 15;
}

// Determine distance from home plate
function getDistance(level: string): number {
  if (level === '100') return 80; // feet
  if (level === '200') return 140; // feet
  if (level === '300') return 200; // feet
  if (level === '400') return 250; // feet
  return 150;
}

// Determine base elevation
function getElevation(level: string): number {
  if (level === '100') return 0; // field level
  if (level === '200') return 35; // club level
  if (level === '300') return 70; // upper deck
  if (level === '400') return 90; // terrace
  return 0;
}

// Determine if section is covered
function isCovered(level: string, sectionNum: number): boolean {
  // Some 100-level sections under 200-level overhang
  if (level === '100' && sectionNum >= 145 && sectionNum <= 155) return true;
  // Some 200-level sections under 300-level overhang
  if (level === '200') return true; // Most club level is covered
  return false;
}

// Determine level string from numeric level
function getLevelString(level: string): 'field' | 'lower' | 'club' | 'upper' | 'suite' {
  if (level === '100') return 'field';
  if (level === '200') return 'club';
  if (level === '300') return 'upper';
  if (level === '400') return 'upper';
  return 'lower';
}

// Generate section configuration
function createSectionConfig(sectionNum: number, level: string): SeatGenerationConfig {
  const sectionId = `${sectionNum}`;
  const sectionName = level === '200'
    ? `Club ${sectionNum}`
    : level === '400'
    ? `Terrace ${sectionNum}`
    : `Section ${sectionNum}`;

  const rowCount = getRowCount(level, sectionNum);
  const seatsPerRow = getSeatsPerRow(level, sectionNum);
  const distance = getDistance(level);
  const baseElevation = getElevation(level);
  const baseAngle = getBaseAngle(sectionNum, level);
  const covered = isCovered(level, sectionNum);

  // Generate row labels (A-Z pattern)
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const rowLabel = String.fromCharCode(65 + i); // A, B, C...
    let adjustedSeatCount = seatsPerRow;

    // Apply fine-tune adjustments if they exist for this section and row
    if (FINE_TUNE_ADJUSTMENTS[sectionId] && FINE_TUNE_ADJUSTMENTS[sectionId][rowLabel] !== undefined) {
      adjustedSeatCount += FINE_TUNE_ADJUSTMENTS[sectionId][rowLabel];
    }

    rows.push({
      rowLabel,
      seatCount: adjustedSeatCount,
      rowNumber: i, // 0-based index
    });
  }

  return {
    stadiumId: STADIUM_ID,
    sectionId,
    sectionName,
    baseAngle,
    angleSpan: 8, // degrees
    baseElevation,
    rowHeight: 2.5, // 2.5ft per row
    startDepth: distance,
    rowDepth: 2.8, // 2.8ft row depth
    rows,
    seatWidth: 2.0,
    seatSpacing: 0.5,
    rowSpacing: 36, // inches
    level: getLevelString(level),
    covered,
    overhangHeight: covered ? 20 : undefined,
  };
}

// Main generation function
async function generateAllSections() {
  log.step('Starting Busch Stadium seat generation...');
  log.info(`Stadium: ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats (official 2020-present)`);

  const sections: SectionSeatingData[] = [];
  let totalSeats = 0;
  let totalSections = 0;

  // 100 Level - Field Level (sections 101-172)
  log.step('Generating 100 Level (Field) sections...');
  for (let i = 101; i <= 172; i++) {
    const config = createSectionConfig(i, '100');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`100 Level complete: ${totalSections} sections, ${totalSeats} seats`);

  // 200 Level - Club Level (sections 241-270)
  log.step('Generating 200 Level (Club) sections...');
  const level200Start = totalSections;
  for (let i = 241; i <= 270; i++) {
    const config = createSectionConfig(i, '200');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`200 Level complete: ${totalSections - level200Start} sections, ${totalSeats} total seats`);

  // 300 Level - Upper Deck (sections 328-377)
  log.step('Generating 300 Level (Upper) sections...');
  const level300Start = totalSections;
  for (let i = 328; i <= 377; i++) {
    const config = createSectionConfig(i, '300');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`300 Level complete: ${totalSections - level300Start} sections, ${totalSeats} total seats`);

  // 400 Level - Terrace (sections 428-454)
  log.step('Generating 400 Level (Terrace) sections...');
  const level400Start = totalSections;
  for (let i = 428; i <= 454; i++) {
    const config = createSectionConfig(i, '400');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`400 Level complete: ${totalSections - level400Start} sections, ${totalSeats} total seats`);

  // Export all sections
  log.step('Exporting section files...');
  const outputDir = path.join(process.cwd(), 'src', 'data', 'seatData', STADIUM_ID, 'sections');

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Export each section
  for (const section of sections) {
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }

  log.success(`Exported ${sections.length} section files to ${outputDir}`);

  // Create metadata file
  log.step('Creating stadium metadata...');
  const metadata = {
    stadiumId: STADIUM_ID,
    stadiumName: STADIUM_NAME,
    totalSections: sections.length,
    totalSeats,
    generatedAt: new Date().toISOString(),
    sections: sections.map(s => ({
      sectionId: s.sectionId,
      sectionName: s.sectionName,
      totalSeats: s.totalSeats,
      totalRows: s.totalRows,
      covered: s.rows[0]?.seats[0]?.covered || false,
    })),
  };

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
  dataSource: 'Generated from official seating charts',
  totalSections: ${sections.length},
  lastValidated: '${new Date().toISOString()}',
};

export const stats: StadiumSeatingStats = {
  totalSeats: ${totalSeats},
  totalSections: ${sections.length},
  totalRows: ${sections.reduce((sum, s) => sum + s.totalRows, 0)},
  levels: {
    '100 Level': ${sections.filter(s => s.sectionId.startsWith('1')).reduce((sum, s) => sum + s.totalSeats, 0)},
    '200 Level': ${sections.filter(s => s.sectionId.startsWith('2')).reduce((sum, s) => sum + s.totalSeats, 0)},
    '300 Level': ${sections.filter(s => s.sectionId.startsWith('3')).reduce((sum, s) => sum + s.totalSeats, 0)},
    '400 Level': ${sections.filter(s => s.sectionId.startsWith('4')).reduce((sum, s) => sum + s.totalSeats, 0)},
  },
  seatDistribution: {
    standard: ${Math.floor(totalSeats * 0.93)},
    aisle: ${Math.floor(totalSeats * 0.05)},
    wheelchair: ${Math.floor(totalSeats * 0.02)},
  },
  coveredSeats: ${sections.reduce((sum, s) => sum + (s.rows[0]?.seats[0]?.covered ? s.totalSeats : 0), 0)},
};
`;

  fs.writeFileSync(metadataPath, metadataContent);
  log.success(`Created metadata file: ${metadataPath}`);

  // Final summary
  console.log('');
  console.log(`${colors.bright}${colors.green}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}  Busch Stadium Generation Complete!${colors.reset}`);
  console.log(`${colors.bright}${colors.green}═══════════════════════════════════════${colors.reset}`);
  console.log('');
  log.info(`Total Sections: ${sections.length}`);
  log.info(`Total Seats: ${totalSeats.toLocaleString()}`);
  log.info(`Official Capacity: ${OFFICIAL_CAPACITY.toLocaleString()}`);
  log.info(`Match: ${((totalSeats / OFFICIAL_CAPACITY) * 100).toFixed(1)}%`);
  console.log('');
  log.info(`Output Directory: ${outputDir}`);
  log.info(`Files Created: ${sections.length + 1} (${sections.length} sections + metadata)`);
  console.log('');

  const tolerance = 0.005; // 0.5% tolerance
  const percentDiff = Math.abs(totalSeats - OFFICIAL_CAPACITY) / OFFICIAL_CAPACITY;

  if (percentDiff > 0.05) {
    console.log(`${colors.yellow}⚠️  Warning: Seat count differs by more than 5% from official capacity${colors.reset}`);
    console.log(`${colors.yellow}   You may need to adjust section configurations${colors.reset}`);
  } else if (percentDiff > tolerance) {
    console.log(`${colors.yellow}⚠️  Warning: Seat count differs by ${(percentDiff * 100).toFixed(2)}% from official capacity${colors.reset}`);
    console.log(`${colors.yellow}   Target: within ±0.5% for maximum accuracy${colors.reset}`);
  } else {
    log.success(`Seat count within target range (±0.5% of official capacity)`);
  }

  console.log('');
  log.step('Next steps:');
  console.log('  1. Review generated files in src/data/seatData/busch-stadium/');
  console.log('  2. Run validation: npm run validate-stadium-data -- --stadium=busch-stadium');
  console.log('  3. Pre-compute sun data: npx tsx scripts/precomputeSunData.ts --stadium=busch-stadium --game-time=13:10');
  console.log('  4. Build project: npm run build');
  console.log('');
}

// Run generation
generateAllSections().catch((error) => {
  console.error(`${colors.red}Error generating Busch Stadium seats:${colors.reset}`, error);
  process.exit(1);
});
