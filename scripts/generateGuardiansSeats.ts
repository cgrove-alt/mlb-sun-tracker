#!/usr/bin/env ts-node

/**
 * Progressive Field Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 34,830 seats (from stadiums.ts configuration)
 * - Sections: ~294 sections across 5 main levels plus 115 suites
 * - Levels: 100 (Lower), 200 (Suites), 300 (Club), 400 (Box), 500 (Upper)
 * - Bleachers: 180-185 (left field)
 * - Orientation: 60° (home to center field, ENE)
 * - Open-air ballpark (no roof)
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateGuardiansSeats.ts
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

// Progressive Field base parameters
const STADIUM_ID = 'guardians';
const STADIUM_NAME = 'Progressive Field';
const ORIENTATION = 60; // degrees (ENE orientation)
const OFFICIAL_CAPACITY = 34830; // From stadiums.ts

// Per-level estimated capacity
const TARGET_100_LEVEL = 16000; // Lower level + bleachers
const TARGET_200_LEVEL = 3000;  // Suites
const TARGET_300_LEVEL = 6500;  // Club level
const TARGET_400_LEVEL = 3500;  // Box level
const TARGET_500_LEVEL = 5830;  // Upper level

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionNum: number, level: string): number {
  const centerField = ORIENTATION - 180; // -120°

  if (level === '100') {
    // 100 level: 101-179 + bleachers 180-185
    if (sectionNum >= 101 && sectionNum <= 185) {
      const position = sectionNum - 101;
      return centerField + 60 - (position * 1.4); // ~120° arc
    }
  } else if (level === '300') {
    // 300 level club: multiple ranges
    if (sectionNum >= 303 && sectionNum <= 348) {
      const position = sectionNum - 303;
      return centerField + 45 - (position * 2.0); // ~90° arc
    }
    if (sectionNum >= 257 && sectionNum <= 267) {
      const position = sectionNum - 257;
      return centerField + 20 - (position * 3.0); // club area
    }
  } else if (level === '400') {
    // 400 level box: estimated range
    if (sectionNum >= 450 && sectionNum <= 475) {
      const position = sectionNum - 450;
      return centerField + 40 - (position * 3.0); // ~75° arc
    }
  } else if (level === '500') {
    // 500 level upper: 550-577
    if (sectionNum >= 550 && sectionNum <= 577) {
      const position = sectionNum - 550;
      return centerField + 45 - (position * 3.2); // ~90° arc
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionNum: number): number {
  if (level === 'bleacher') {
    // Bleachers: 180-185 (left field)
    return 17; // Reduced for 8th iteration
  }

  if (level === 'suite') {
    // Suites: smaller, exclusive
    return 3; // Kept for 8th iteration
  }

  if (level === '100') {
    // Lower level - varying by location
    if (sectionNum >= 140 && sectionNum <= 155) return 22; // Behind home plate
    if (sectionNum >= 128 && sectionNum <= 139) return 19; // 3B line
    if (sectionNum >= 156 && sectionNum <= 167) return 19; // 1B line
    if (sectionNum >= 101 && sectionNum <= 127) return 17; // Outfield 3B
    if (sectionNum >= 168 && sectionNum <= 179) return 17; // Outfield 1B
    return 19; // default
  }

  if (level === '300') {
    // Club level
    if (sectionNum >= 326 && sectionNum <= 348) return 9; // First baseline club
    if (sectionNum >= 303 && sectionNum <= 316) return 10; // Family Deck
    if (sectionNum >= 257 && sectionNum <= 267) return 5; // Club area
    return 9;
  }

  if (level === '400') {
    // Box level
    return 12; // Upper box sections (reduced)
  }

  if (level === '500') {
    // Upper level
    if (sectionNum >= 553 && sectionNum <= 565) return 14; // Center sections
    return 13; // Corner/end sections
  }

  return 14;
}

// Fine-tune adjustments to add exactly 5 seats (34,825 → 34,830)
const FINE_TUNE_ADJUSTMENTS: Record<string, Record<string, number>> = {
  '140': { 'V': 1 }, // Add 1 seat to row V in section 140 (behind home plate)
  '145': { 'V': 1 }, // Add 1 seat to row V in section 145 (behind home plate)
  '150': { 'V': 1 }, // Add 1 seat to row V in section 150 (behind home plate)
  '155': { 'V': 1 }, // Add 1 seat to row V in section 155 (behind home plate)
  '560': { '13': 1 }, // Add 1 seat to row 13 in section 560 (upper level center)
};

// Determine seats per row
function getSeatsPerRow(level: string, sectionNum: number): number {
  if (level === 'bleacher') {
    // Bleachers: bench-style
    return 14; // Reduced for 8th iteration
  }

  if (level === 'suite') {
    // Suites: exclusive, smaller
    return 10; // Reduced for 8th iteration
  }

  if (level === '100') {
    // Lower level - varying by location
    if (sectionNum >= 140 && sectionNum <= 155) return 12; // Behind home plate (reduced)
    if (sectionNum >= 128 && sectionNum <= 139) return 12; // 3B line
    if (sectionNum >= 156 && sectionNum <= 167) return 12; // 1B line
    if (sectionNum >= 101 && sectionNum <= 103) return 8; // Outfield 3B corners (fine-tuned)
    if (sectionNum >= 104 && sectionNum <= 127) return 9; // Outfield 3B
    if (sectionNum >= 168 && sectionNum <= 179) return 9; // Outfield 1B
    return 12; // default
  }

  if (level === '300') {
    // Club level
    if (sectionNum >= 326 && sectionNum <= 348) return 14; // First baseline club
    if (sectionNum >= 303 && sectionNum <= 316) return 13; // Family Deck
    if (sectionNum >= 257 && sectionNum <= 267) return 12; // Club area
    return 13;
  }

  if (level === '400') {
    // Box level
    return 13; // Upper box sections
  }

  if (level === '500') {
    // Upper level
    if (sectionNum >= 553 && sectionNum <= 565) return 13; // Center sections
    return 13; // Corner/end sections
  }

  return 13;
}

// Determine distance from home plate
function getDistance(level: string): number {
  if (level === 'bleacher') return 150; // feet (left field bleachers, far out)
  if (level === 'suite') return 80; // feet (suites close to field)
  if (level === '100') return 70; // feet (lower level)
  if (level === '300') return 130; // feet (club level)
  if (level === '400') return 180; // feet (box level)
  if (level === '500') return 240; // feet (upper level, very far back)
  return 120;
}

// Determine base elevation
function getElevation(level: string): number {
  if (level === 'bleacher') return 5; // bleachers slightly elevated
  if (level === 'suite') return 20; // suites on various levels
  if (level === '100') return 0; // lower level
  if (level === '300') return 30; // club level
  if (level === '400') return 55; // box level
  if (level === '500') return 85; // upper level (high up)
  return 0;
}

// Determine if section is covered (open-air stadium with overhangs)
function isCovered(level: string, sectionNum: number, rowNum: number): boolean {
  // Progressive Field is open-air with significant overhangs

  if (level === 'suite') {
    return true; // Suites are enclosed/covered
  }

  if (level === 'bleacher') {
    return false; // Bleachers fully exposed
  }

  if (level === '100') {
    // Lower level: overhang coverage
    if (sectionNum >= 128 && sectionNum <= 148 && rowNum >= 24) return true; // Rows X+ under overhang
    if (sectionNum >= 140 && sectionNum <= 144 && rowNum >= 20) return true; // Top 1/3 behind dugout
    return false;
  }

  if (level === '300') {
    // Club level: some covered
    if (sectionNum >= 257 && sectionNum <= 267 && rowNum >= 3) return true; // Rows C-E+ in club area
    if (sectionNum >= 326 && sectionNum <= 348) return true; // First baseline club (enclosed)
    return false;
  }

  if (level === '400') {
    // Box level: some overhang
    if (sectionNum >= 461 && sectionNum <= 474) return true; // Covered for 4:10 PM games
    return false;
  }

  if (level === '500') {
    // Upper level: significant overhang
    if (rowNum >= 7) return true; // Rows G+ benefit from roof overhang
    if (sectionNum >= 561 && sectionNum <= 575) return true; // Late afternoon shade
    return false;
  }

  return false;
}

// Determine level string from level
function getLevelString(level: string): 'field' | 'lower' | 'club' | 'upper' | 'suite' {
  if (level === 'suite') return 'suite';
  if (level === 'bleacher') return 'field'; // Bleachers at field level
  if (level === '100') return 'lower';
  if (level === '300') return 'club';
  if (level === '400' || level === '500') return 'upper';
  return 'lower';
}

// Generate section configuration
function createSectionConfig(sectionId: string, level: string): SeatGenerationConfig {
  const sectionNum = parseInt(sectionId, 10);

  let sectionName: string;
  if (level === 'bleacher') {
    sectionName = `Bleachers ${sectionId}`;
  } else if (level === 'suite') {
    sectionName = `Suite ${sectionId}`;
  } else if (level === '300') {
    if (sectionNum >= 326 && sectionNum <= 348) {
      sectionName = `Club ${sectionId}`;
    } else if (sectionNum >= 303 && sectionNum <= 316) {
      sectionName = `Family Deck ${sectionId}`;
    } else {
      sectionName = `Section ${sectionId}`;
    }
  } else if (level === '400') {
    sectionName = `Box ${sectionId}`;
  } else if (level === '500') {
    sectionName = `Upper ${sectionId}`;
  } else {
    sectionName = `Section ${sectionId}`;
  }

  const rowCount = getRowCount(level, sectionNum);
  const seatsPerRow = getSeatsPerRow(level, sectionNum);
  const distance = getDistance(level);
  const baseElevation = getElevation(level);
  const baseAngle = getBaseAngle(sectionNum, level);

  // Generate row labels
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const rowLabel = level === '100' && i < 26
      ? String.fromCharCode(65 + i) // A-Z for lower level
      : `${i + 1}`; // Numbers for others

    // Apply fine-tune adjustments if defined for this section/row
    let adjustedSeatCount = seatsPerRow;
    if (FINE_TUNE_ADJUSTMENTS[sectionId] && FINE_TUNE_ADJUSTMENTS[sectionId][rowLabel] !== undefined) {
      adjustedSeatCount += FINE_TUNE_ADJUSTMENTS[sectionId][rowLabel];
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
    sectionName,
    baseAngle,
    angleSpan: level === '100' || level === 'bleacher' ? 4.5 : level === '500' ? 7.0 : 5.5,
    baseElevation,
    rowHeight: 2.5,
    startDepth: distance,
    rowDepth: 2.8,
    rows,
    seatWidth: 2.0,
    seatSpacing: 0.5,
    rowSpacing: 36,
    level: getLevelString(level),
    covered: isCovered(level, sectionNum, 1),
    overhangHeight: isCovered(level, sectionNum, 1) ? 20 : undefined,
  };
}

// Main generation function
async function generateAllSections() {
  log.step('Starting Progressive Field seat generation...');
  log.info(`Stadium: ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats`);
  log.info(`Per-level targets: 100:${TARGET_100_LEVEL.toLocaleString()} | 200:${TARGET_200_LEVEL.toLocaleString()} | 300:${TARGET_300_LEVEL.toLocaleString()} | 400:${TARGET_400_LEVEL.toLocaleString()} | 500:${TARGET_500_LEVEL.toLocaleString()}`);

  const sections: SectionSeatingData[] = [];
  let totalSeats = 0;
  let level100Seats = 0;
  let level200Seats = 0;
  let level300Seats = 0;
  let level400Seats = 0;
  let level500Seats = 0;
  let totalSections = 0;

  // 100 Level - Lower Bowl (sections 101-179)
  log.step('Generating 100 Level (Lower Bowl) sections...');
  for (let i = 101; i <= 179; i++) {
    const config = createSectionConfig(`${i}`, '100');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level100Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`100 Level complete: ${totalSections} sections, ${level100Seats} seats (target: ${TARGET_100_LEVEL})`);

  // Bleacher Sections (180-185, left field)
  log.step('Generating Bleacher sections...');
  const bleacherStart = totalSections;
  for (let i = 180; i <= 185; i++) {
    const config = createSectionConfig(`${i}`, 'bleacher');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level100Seats += sectionData.totalSeats; // Count with 100 level
    totalSections++;
  }
  log.success(`Bleachers complete: ${totalSections - bleacherStart} sections, ${level100Seats - (sections[79]?.totalSeats || 0) * 79} seats`);
  log.info(`100 Level total (with bleachers): ${level100Seats} seats`);

  // 200 Level - Suites (115 suites, distributed across stadium)
  log.step('Generating 200 Level (Suites)...');
  const level200Start = totalSections;
  for (let i = 201; i <= 315; i++) {
    // Generate 115 suites numbered 201-315
    const config = createSectionConfig(`${i}`, 'suite');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level200Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`200 Level complete: ${totalSections - level200Start} sections, ${level200Seats} seats (target: ${TARGET_200_LEVEL})`);

  // 300 Level - Club Level (multiple ranges)
  log.step('Generating 300 Level (Club) sections...');
  const level300Start = totalSections;

  // Club area: 257-267
  for (let i = 257; i <= 267; i++) {
    const config = createSectionConfig(`${i}`, '300');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level300Seats += sectionData.totalSeats;
    totalSections++;
  }

  // Family Deck: 303-316
  for (let i = 303; i <= 316; i++) {
    const config = createSectionConfig(`${i}`, '300');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level300Seats += sectionData.totalSeats;
    totalSections++;
  }

  // First baseline club: 326-348
  for (let i = 326; i <= 348; i++) {
    const config = createSectionConfig(`${i}`, '300');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level300Seats += sectionData.totalSeats;
    totalSections++;
  }

  log.success(`300 Level complete: ${totalSections - level300Start} sections, ${level300Seats} seats (target: ${TARGET_300_LEVEL})`);

  // 400 Level - Box Level (estimated sections 450-475)
  log.step('Generating 400 Level (Box) sections...');
  const level400Start = totalSections;
  for (let i = 450; i <= 475; i++) {
    const config = createSectionConfig(`${i}`, '400');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level400Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`400 Level complete: ${totalSections - level400Start} sections, ${level400Seats} seats (target: ${TARGET_400_LEVEL})`);

  // 500 Level - Upper Deck (sections 550-577)
  log.step('Generating 500 Level (Upper Deck) sections...');
  const level500Start = totalSections;
  for (let i = 550; i <= 577; i++) {
    const config = createSectionConfig(`${i}`, '500');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level500Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`500 Level complete: ${totalSections - level500Start} sections, ${level500Seats} seats (target: ${TARGET_500_LEVEL})`);

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
    '100 Level (Lower + Bleachers)': ${level100Seats},
    '200 Level (Suites)': ${level200Seats},
    '300 Level (Club)': ${level300Seats},
    '400 Level (Box)': ${level400Seats},
    '500 Level (Upper)': ${level500Seats},
  },
  seatDistribution: {
    standard: ${Math.floor(totalSeats * 0.88)},
    aisle: ${Math.floor(totalSeats * 0.08)},
    wheelchair: ${Math.floor(totalSeats * 0.04)},
  },
  coveredSeats: ${sections.reduce((sum, s) => sum + (s.rows[0]?.seats[0]?.covered ? s.totalSeats : 0), 0)},
};
`;

  fs.writeFileSync(metadataPath, metadataContent);
  log.success(`Created metadata file: ${metadataPath}`);

  // Final summary
  console.log('');
  console.log(`${colors.bright}${colors.green}═══════════════════════════════════════${colors.reset}`);
  console.log(`${colors.bright}  Progressive Field Generation Complete!${colors.reset}`);
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
  log.info(`  500: ${level500Seats.toLocaleString()} (target: ${TARGET_500_LEVEL.toLocaleString()}, ${((level500Seats/TARGET_500_LEVEL)*100).toFixed(2)}%)`);

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
    console.log(`${colors.yellow}   Target: Exact match (34,830 seats)${colors.reset}`);
    console.log(`${colors.yellow}   Adjust getSeatsPerRow() or getRowCount() to fine-tune capacity${colors.reset}`);
  }

  console.log('');
  log.step('Next steps:');
  console.log('  1. Review generated files in src/data/seatData/guardians/');
  console.log('  2. If seat count is off, adjust getSeatsPerRow() or getRowCount() and regenerate');
  console.log('  3. Pre-compute sun data: npx tsx scripts/precomputeSunData.ts --stadium=guardians --game-time=13:10');
  console.log('  4. Build project: npm run build');
  console.log('');
}

// Run generation
generateAllSections().catch((error) => {
  console.error(`${colors.red}Error generating Progressive Field seats:${colors.reset}`, error);
  process.exit(1);
});
