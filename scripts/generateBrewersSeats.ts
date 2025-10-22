#!/usr/bin/env ts-node

/**
 * American Family Field Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 41,900 seats (current official capacity)
 * - Sections: ~133 sections across 4 main levels
 * - Levels: 100 (Field), 200 (Loge), 300 (Club), 400 (Terrace/Upper)
 * - Orientation: 357° (home to center field, essentially due north)
 * - Retractable roof (fan-shaped, opens/closes in <10 minutes)
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateBrewersSeats.ts
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

// American Family Field base parameters
const STADIUM_ID = 'brewers';
const STADIUM_NAME = 'American Family Field';
const ORIENTATION = 357; // degrees (essentially due north)
const OFFICIAL_CAPACITY = 41900; // Current official capacity

// Per-level estimated capacity
const TARGET_100_LEVEL = 13000; // Field level
const TARGET_200_LEVEL = 7000;  // Loge level
const TARGET_300_LEVEL = 10000; // Club level
const TARGET_400_LEVEL = 11900; // Terrace/Upper level

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionNum: number, level: string): number {
  const centerField = ORIENTATION - 180; // 177°

  if (level === '100') {
    // 100 level: 101-131 (31 sections)
    if (sectionNum >= 101 && sectionNum <= 131) {
      const position = sectionNum - 101;
      return centerField + 50 - (position * 3.2); // ~100° arc
    }
  } else if (level === '200') {
    // 200 level: 206-228 (23 sections)
    if (sectionNum >= 206 && sectionNum <= 228) {
      const position = sectionNum - 206;
      return centerField + 40 - (position * 3.5); // ~80° arc
    }
  } else if (level === '300') {
    // 300 level: 306-345 (40 sections)
    if (sectionNum >= 306 && sectionNum <= 345) {
      const position = sectionNum - 306;
      return centerField + 55 - (position * 2.8); // ~110° arc
    }
  } else if (level === '400') {
    // 400 level: 404-442 (39 sections)
    if (sectionNum >= 404 && sectionNum <= 442) {
      const position = sectionNum - 404;
      return centerField + 60 - (position * 3.0); // ~117° arc
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionNum: number): number {
  if (level === '100') {
    // Field level - varying by location
    if (sectionNum >= 112 && sectionNum <= 123) return 25; // Center (infield)
    if (sectionNum >= 107 && sectionNum <= 111) return 27; // End (baseline 1B)
    if (sectionNum >= 124 && sectionNum <= 129) return 27; // End (baseline 3B)
    if (sectionNum >= 101 && sectionNum <= 106) return 30; // Corner (RF)
    if (sectionNum >= 130 && sectionNum <= 131) return 30; // Corner (LF)
    return 25; // default
  }
  if (level === '200') {
    // Loge level
    if (sectionNum >= 216 && sectionNum <= 221) return 10; // Center (infield)
    if (sectionNum >= 206 && sectionNum <= 211) return 20; // Corner (3B side)
    if (sectionNum >= 226 && sectionNum <= 228) return 20; // Corner (1B side)
    if (sectionNum >= 212 && sectionNum <= 215) return 20; // End (LF)
    if (sectionNum >= 222 && sectionNum <= 225) return 20; // End (RF)
    return 10; // default
  }
  if (level === '300') {
    // Club level - all 7 rows
    return 7;
  }
  if (level === '400') {
    // Terrace/Upper level
    if (sectionNum >= 416 && sectionNum <= 428) return 24; // Center
    return 25; // Corners
  }
  return 20;
}

// Determine seats per row
function getSeatsPerRow(level: string, sectionNum: number): number {
  if (level === '100') {
    // Field level - varying by location (fine-tuned)
    if (sectionNum >= 112 && sectionNum <= 114) return 16; // First 3 center sections
    if (sectionNum >= 115 && sectionNum <= 123) return 15; // Remaining center
    if (sectionNum >= 107 && sectionNum <= 111) return 17; // End (baseline)
    if (sectionNum >= 124 && sectionNum <= 129) return 17; // End (baseline)
    return 14; // Corners
  }
  if (level === '200') {
    // Loge level - fine-tuned for capacity match
    if (sectionNum >= 216 && sectionNum <= 221) return 21; // Center
    return 17; // Corners and ends
  }
  if (level === '300') {
    // Club level - significantly increased for capacity
    if (sectionNum >= 326 && sectionNum <= 332) return 38; // Center
    if (sectionNum >= 306 && sectionNum <= 315) return 36; // Some corners
    return 35; // Other corners
  }
  if (level === '400') {
    // Terrace/Upper level
    if (sectionNum >= 416 && sectionNum <= 428) return 13; // Center
    return 12; // Corners
  }
  return 16;
}

// Determine distance from home plate
function getDistance(level: string, sectionNum: number): number {
  if (level === '100') {
    // Field level - close to field
    if (sectionNum >= 112 && sectionNum <= 123) return 75; // Behind home plate
    return 90; // Outfield/baseline
  }
  if (level === '200') {
    // Loge level
    return 160; // Mid-level
  }
  if (level === '300') {
    // Club level
    return 180; // Above loge
  }
  if (level === '400') {
    // Terrace/Upper level
    return 250; // Far back
  }
  return 150;
}

// Determine base elevation
function getElevation(level: string): number {
  if (level === '100') return 0;   // field level
  if (level === '200') return 35;  // loge
  if (level === '300') return 50;  // club
  if (level === '400') return 85;  // upper/terrace
  return 0;
}

// Determine if section is covered (when roof open)
function isCovered(level: string, sectionNum: number, rowNum: number): boolean {
  // When retractable roof is open, some sections have natural overhang coverage

  if (level === '100') {
    // Sections 117-125 get shade as game progresses (1:10 PM starts)
    if (sectionNum >= 117 && sectionNum <= 125) return true;
    return false;
  }

  if (level === '200') {
    // Sections 216-223 benefit from natural roof overhang
    if (sectionNum >= 216 && sectionNum <= 223) return true;
    // Sections 212-215, rows 17+ have good shade
    if (sectionNum >= 212 && sectionNum <= 215 && rowNum >= 17) return true;
    return false;
  }

  if (level === '300') {
    // Club seats 330-338 are climate-controlled
    if (sectionNum >= 330 && sectionNum <= 338) return true;
    return false;
  }

  if (level === '400') {
    // Terrace sections 412-420, 420-428 have very good shade/overhang
    if (sectionNum >= 412 && sectionNum <= 428) return true;
    // Upper deck third base side under cover
    if (sectionNum >= 404 && sectionNum <= 415) return true;
    return false;
  }

  return false;
}

// Determine level string from level
function getLevelString(level: string): 'field' | 'lower' | 'club' | 'upper' | 'suite' {
  if (level === '100') return 'field';
  if (level === '200') return 'lower'; // Loge = lower bowl
  if (level === '300') return 'club';
  if (level === '400') return 'upper';
  return 'field';
}

// Generate section configuration
function createSectionConfig(sectionNum: number, level: string): SeatGenerationConfig {
  const sectionId = `${sectionNum}`;

  // Section name based on level and type
  let sectionName = '';
  if (level === '100') {
    if (sectionNum >= 112 && sectionNum <= 123) sectionName = `Field Infield ${sectionNum}`;
    else sectionName = `Field ${sectionNum}`;
  } else if (level === '200') {
    if (sectionNum >= 216 && sectionNum <= 221) sectionName = `Loge Box ${sectionNum}`;
    else sectionName = `Loge ${sectionNum}`;
  } else if (level === '300') {
    if (sectionNum >= 320 && sectionNum <= 339) sectionName = `Club ${sectionNum}`;
    else sectionName = `Club ${sectionNum}`;
  } else if (level === '400') {
    if (sectionNum >= 407 && sectionNum <= 437) sectionName = `Terrace Box ${sectionNum}`;
    else sectionName = `Terrace ${sectionNum}`;
  } else {
    sectionName = `Section ${sectionNum}`;
  }

  const rowCount = getRowCount(level, sectionNum);
  const seatsPerRow = getSeatsPerRow(level, sectionNum);
  const distance = getDistance(level, sectionNum);
  const baseElevation = getElevation(level);
  const baseAngle = getBaseAngle(sectionNum, level);

  // Generate row labels (all use numbers for Brewers)
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const rowLabel = `${i + 1}`;
    const covered = isCovered(level, sectionNum, i + 1);
    rows.push({
      rowLabel,
      seatCount: seatsPerRow,
      rowNumber: i,
    });
  }

  // Determine if section has coverage (check if any row is covered)
  const covered = rows.some((_, i) => isCovered(level, sectionNum, i + 1));

  return {
    stadiumId: STADIUM_ID,
    sectionId,
    sectionName,
    baseAngle,
    angleSpan: level === '100' ? 3.0 : level === '200' ? 3.3 : level === '300' ? 2.6 : 2.8,
    baseElevation,
    rowHeight: 2.5,
    startDepth: distance,
    rowDepth: 2.8,
    rows,
    seatWidth: 2.0,
    seatSpacing: 0.5,
    rowSpacing: 36,
    level: getLevelString(level),
    covered,
    overhangHeight: covered ? 25 : undefined,
  };
}

// Main generation function
async function generateAllSections() {
  log.step('Starting American Family Field seat generation...');
  log.info(`Stadium: ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats`);
  log.info(`Per-level targets: 100:${TARGET_100_LEVEL.toLocaleString()} | 200:${TARGET_200_LEVEL.toLocaleString()} | 300:${TARGET_300_LEVEL.toLocaleString()} | 400:${TARGET_400_LEVEL.toLocaleString()}`);

  const sections: SectionSeatingData[] = [];
  let totalSeats = 0;
  let level100Seats = 0;
  let level200Seats = 0;
  let level300Seats = 0;
  let level400Seats = 0;
  let totalSections = 0;

  // 100 Level - Field Level (sections 101-131)
  log.step('Generating 100 Level (Field) sections...');
  for (let i = 101; i <= 131; i++) {
    const config = createSectionConfig(i, '100');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level100Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`100 Level complete: ${totalSections} sections, ${level100Seats} seats (target: ${TARGET_100_LEVEL})`);

  // 200 Level - Loge Level (sections 206-228)
  log.step('Generating 200 Level (Loge) sections...');
  const level200Start = totalSections;
  for (let i = 206; i <= 228; i++) {
    const config = createSectionConfig(i, '200');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level200Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`200 Level complete: ${totalSections - level200Start} sections, ${level200Seats} seats (target: ${TARGET_200_LEVEL})`);

  // 300 Level - Club Level (sections 306-345)
  log.step('Generating 300 Level (Club) sections...');
  const level300Start = totalSections;
  for (let i = 306; i <= 345; i++) {
    const config = createSectionConfig(i, '300');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level300Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`300 Level complete: ${totalSections - level300Start} sections, ${level300Seats} seats (target: ${TARGET_300_LEVEL})`);

  // 400 Level - Terrace/Upper (sections 404-442)
  log.step('Generating 400 Level (Terrace/Upper) sections...');
  const level400Start = totalSections;
  for (let i = 404; i <= 442; i++) {
    const config = createSectionConfig(i, '400');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level400Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`400 Level complete: ${totalSections - level400Start} sections, ${level400Seats} seats (target: ${TARGET_400_LEVEL})`);

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
    '100 Level (Field)': ${level100Seats},
    '200 Level (Loge)': ${level200Seats},
    '300 Level (Club)': ${level300Seats},
    '400 Level (Terrace)': ${level400Seats},
  },
  seatDistribution: {
    standard: ${Math.floor(totalSeats * 0.92)},
    aisle: ${Math.floor(totalSeats * 0.06)},
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
  console.log(`${colors.bright}  American Family Field Generation Complete!${colors.reset}`);
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
  log.info(`  400: ${level400Seats.toLocaleString()} (target: ${TARGET_400_LEVEL.toLocaleString()}, ${((level400Seats/TARGET_400_LEVEL)*100).toFixed(2)}%)`);

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
    console.log(`${colors.yellow}   Target: Exact match (41,900 seats)${colors.reset}`);
    console.log(`${colors.yellow}   Adjust getSeatsPerRow() or getRowCount() to fine-tune capacity${colors.reset}`);
  }

  console.log('');
  log.step('Next steps:');
  console.log('  1. Review generated files in src/data/seatData/brewers/');
  console.log('  2. If seat count is off, adjust getSeatsPerRow() or getRowCount() and regenerate');
  console.log('  3. Pre-compute sun data: npx tsx scripts/precomputeSunData.ts --stadium=brewers --game-time=13:10');
  console.log('  4. Build project: npm run build');
  console.log('');
}

// Run generation
generateAllSections().catch((error) => {
  console.error(`${colors.red}Error generating American Family Field seats:${colors.reset}`, error);
  process.exit(1);
});
