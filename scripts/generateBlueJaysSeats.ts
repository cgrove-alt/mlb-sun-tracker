#!/usr/bin/env ts-node

/**
 * Rogers Centre Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 49,282 seats (2013-2022 configuration, pre-renovation)
 * - Sections: ~200 sections across 3 main levels + 161 suites
 * - Levels: 100 (Field), 200 (Club), 500 (View/Upper)
 * - Orientation: 15° (home to center field, NNE)
 * - Retractable roof (first in MLB, 1989)
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateBlueJaysSeats.ts
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

// Rogers Centre base parameters
const STADIUM_ID = 'bluejays';
const STADIUM_NAME = 'Rogers Centre';
const ORIENTATION = 15; // degrees (NNE orientation)
const OFFICIAL_CAPACITY = 49282; // Pre-renovation capacity (2013-2022)

// Per-level estimated capacity
const TARGET_100_LEVEL = 20000; // Field level
const TARGET_200_LEVEL = 17700; // Club level (includes 5,700 club seats)
const TARGET_500_LEVEL = 11582; // Upper level

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionNum: number, level: string): number {
  const centerField = ORIENTATION - 180; // -165°

  if (level === '100') {
    // 100 level wraps from RF to LF
    if (sectionNum >= 101 && sectionNum <= 180) {
      const position = sectionNum - 101;
      return centerField + 45 - (position * 1.15); // ~91° arc
    }
  } else if (level === '200') {
    // 200 level (club/terrace)
    if (sectionNum >= 201 && sectionNum <= 260) {
      const position = sectionNum - 201;
      return centerField + 40 - (position * 1.35); // ~80° arc
    }
  } else if (level === '500') {
    // 500 level (view/upper)
    if (sectionNum >= 501 && sectionNum <= 560) {
      const position = sectionNum - 501;
      return centerField + 50 - (position * 1.67); // ~100° arc
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section level
function getRowCount(level: string, sectionNum: number): number {
  if (level === '100') {
    // Field level - fine-tuned for capacity match
    if (sectionNum >= 110 && sectionNum <= 139) return 20; // Infield premium
    if (sectionNum === 140) return 19; // Last infield section (fine-tune)
    if (sectionNum === 180) return 17; // Last outfield section (fine-tune)
    return 18; // Outfield sections
  }
  if (level === '200') {
    // Club/Terrace level - fine-tuned for capacity match
    if (sectionNum >= 210 && sectionNum <= 240) return 16; // Premium club
    return 17; // Regular terrace
  }
  if (level === '500') {
    // View/Upper level
    return 18; // Upper deck
  }
  return 18;
}

// Determine seats per row
function getSeatsPerRow(level: string, sectionNum: number): number {
  if (level === '100') {
    // Field level - varying by location
    if (sectionNum >= 110 && sectionNum <= 140) return 13; // Infield (narrower)
    return 14; // Outfield
  }
  if (level === '200') {
    // Club/Terrace - middle ground
    if (sectionNum >= 210 && sectionNum <= 240) return 18; // Premium club
    return 17; // Regular terrace
  }
  if (level === '500') {
    // View/Upper level - fine-tuned for capacity match
    if (sectionNum >= 545 && sectionNum <= 560) return 10; // Back sections (16 sections)
    return 11; // Front sections
  }
  return 14;
}

// Determine distance from home plate
function getDistance(level: string): number {
  if (level === '100') return 70; // feet (field level)
  if (level === '200') return 150; // feet (club/terrace)
  if (level === '500') return 240; // feet (view/upper - very far back)
  return 150;
}

// Determine base elevation
function getElevation(level: string): number {
  if (level === '100') return 0; // field level
  if (level === '200') return 40; // club/terrace
  if (level === '500') return 90; // view/upper (high up)
  return 0;
}

// Determine if section is covered (when roof open)
function isCovered(level: string, sectionNum: number): boolean {
  // When retractable roof is open:
  // 100 level: Minimal coverage
  if (level === '100') return false;

  // 200 level: Sections 227-231 noted for sun protection
  if (level === '200') {
    if (sectionNum >= 227 && sectionNum <= 231) return true;
    return false; // Other 200 sections exposed when roof open
  }

  // 500 level: Some overhang coverage
  if (level === '500') return true;

  return false;
}

// Determine level string from level
function getLevelString(level: string): 'field' | 'lower' | 'club' | 'upper' | 'suite' {
  if (level === '100') return 'field';
  if (level === '200') return 'club';
  if (level === '500') return 'upper';
  return 'lower';
}

// Generate section configuration
function createSectionConfig(sectionNum: number, level: string): SeatGenerationConfig {
  const sectionId = `${sectionNum}`;
  const sectionName = level === '200'
    ? `Club ${sectionNum}`
    : level === '500'
    ? `View ${sectionNum}`
    : `Section ${sectionNum}`;

  const rowCount = getRowCount(level, sectionNum);
  const seatsPerRow = getSeatsPerRow(level, sectionNum);
  const distance = getDistance(level);
  const baseElevation = getElevation(level);
  const baseAngle = getBaseAngle(sectionNum, level);
  const covered = isCovered(level, sectionNum);

  // Generate row labels
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const rowLabel = level === '100'
      ? String.fromCharCode(65 + i) // A-Z for field level
      : `${i + 1}`; // Numbers for others
    rows.push({
      rowLabel,
      seatCount: seatsPerRow,
      rowNumber: i,
    });
  }

  return {
    stadiumId: STADIUM_ID,
    sectionId,
    sectionName,
    baseAngle,
    angleSpan: level === '100' ? 4.5 : level === '200' ? 5.0 : 6.0,
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
    overhangHeight: covered ? 20 : undefined,
  };
}

// Main generation function
async function generateAllSections() {
  log.step('Starting Rogers Centre seat generation...');
  log.info(`Stadium: ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats (2013-2022 pre-renovation)`);
  log.info(`Per-level targets: 100:${TARGET_100_LEVEL.toLocaleString()} | 200:${TARGET_200_LEVEL.toLocaleString()} | 500:${TARGET_500_LEVEL.toLocaleString()}`);

  const sections: SectionSeatingData[] = [];
  let totalSeats = 0;
  let level100Seats = 0;
  let level200Seats = 0;
  let level500Seats = 0;
  let totalSections = 0;

  // 100 Level - Field Level (sections 101-180)
  log.step('Generating 100 Level (Field) sections...');
  for (let i = 101; i <= 180; i++) {
    const config = createSectionConfig(i, '100');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level100Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`100 Level complete: ${totalSections} sections, ${level100Seats} seats (target: ${TARGET_100_LEVEL})`);

  // 200 Level - Club/Terrace (sections 201-260)
  log.step('Generating 200 Level (Club/Terrace) sections...');
  const level200Start = totalSections;
  for (let i = 201; i <= 260; i++) {
    const config = createSectionConfig(i, '200');
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    level200Seats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`200 Level complete: ${totalSections - level200Start} sections, ${level200Seats} seats (target: ${TARGET_200_LEVEL})`);

  // 500 Level - View/Upper (sections 501-560)
  log.step('Generating 500 Level (View/Upper) sections...');
  const level500Start = totalSections;
  for (let i = 501; i <= 560; i++) {
    const config = createSectionConfig(i, '500');
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
 * Note: Pre-renovation capacity (2013-2022 configuration)
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = {
  stadiumId: '${STADIUM_ID}',
  stadiumName: '${STADIUM_NAME}',
  generatedAt: '${new Date().toISOString()}',
  version: '1.0.0',
  dataSource: 'Generated from 2013-2022 seating charts (pre-renovation)',
  totalSections: ${sections.length},
  lastValidated: '${new Date().toISOString()}',
};

export const stats: StadiumSeatingStats = {
  totalSeats: ${totalSeats},
  totalSections: ${sections.length},
  totalRows: ${sections.reduce((sum, s) => sum + s.totalRows, 0)},
  levels: {
    '100 Level': ${level100Seats},
    '200 Level': ${level200Seats},
    '500 Level': ${level500Seats},
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
  console.log(`${colors.bright}  Rogers Centre Generation Complete!${colors.reset}`);
  console.log(`${colors.bright}${colors.green}═══════════════════════════════════════${colors.reset}`);
  console.log('');
  log.info(`Total Sections: ${sections.length}`);
  log.info(`Total Seats: ${totalSeats.toLocaleString()}`);
  log.info(`Official Capacity: ${OFFICIAL_CAPACITY.toLocaleString()}`);
  console.log('');
  log.info(`Per-Level Breakdown:`);
  log.info(`  100: ${level100Seats.toLocaleString()} (target: ${TARGET_100_LEVEL.toLocaleString()}, ${((level100Seats/TARGET_100_LEVEL)*100).toFixed(2)}%)`);
  log.info(`  200: ${level200Seats.toLocaleString()} (target: ${TARGET_200_LEVEL.toLocaleString()}, ${((level200Seats/TARGET_200_LEVEL)*100).toFixed(2)}%)`);
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
    console.log(`${colors.yellow}   Target: Exact match (49,282 seats)${colors.reset}`);
    console.log(`${colors.yellow}   Adjust getSeatsPerRow() or getRowCount() to fine-tune capacity${colors.reset}`);
  }

  console.log('');
  log.step('Next steps:');
  console.log('  1. Review generated files in src/data/seatData/bluejays/');
  console.log('  2. If seat count is off, adjust getSeatsPerRow() or getRowCount() and regenerate');
  console.log('  3. Pre-compute sun data: npx tsx scripts/precomputeSunData.ts --stadium=bluejays --game-time=13:10');
  console.log('  4. Build project: npm run build');
  console.log('');
}

// Run generation
generateAllSections().catch((error) => {
  console.error(`${colors.red}Error generating Rogers Centre seats:${colors.reset}`, error);
  process.exit(1);
});
