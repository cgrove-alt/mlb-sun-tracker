#!/usr/bin/env ts-node

/**
 * Sutter Health Park Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 14,014 seats (Oakland Athletics 2025-2027 temporary home)
 * - Sections: 11 main bowl sections (101-111) + 36 suites
 * - Level: Single-level bowl (minor league stadium)
 * - Orientation: 330° (home to center field, NNW)
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateAthleticsSeats.ts
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

// Sutter Health Park base parameters
const STADIUM_ID = 'athletics';
const STADIUM_NAME = 'Sutter Health Park';
const ORIENTATION = 330; // degrees (NNW orientation)
const OFFICIAL_CAPACITY = 14014; // Current official capacity (A's configuration)

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionNum: number): number {
  const centerField = ORIENTATION - 180; // 150°

  // Single-level bowl wraps from RF to LF
  // Sections 101-111 (11 sections)
  if (sectionNum >= 101 && sectionNum <= 111) {
    const position = sectionNum - 101;
    return centerField + 45 - (position * 9); // ~90° arc
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(sectionNum: number): number {
  // Section 101: Add 1 row for fine-tuning
  if (sectionNum === 101) return 29;

  // Sections 102-103: Right field outfield sections
  if (sectionNum >= 102 && sectionNum <= 103) return 28;

  // Sections 104-106: Senate sections (infield)
  if (sectionNum >= 104 && sectionNum <= 106) return 34;

  // Section 107: Reduce 1 row for capacity balance
  if (sectionNum === 107) return 33;

  // Sections 108-111: Senate sections (outfield)
  if (sectionNum >= 108 && sectionNum <= 111) return 34;

  return 28;
}

// Determine seats per row
function getSeatsPerRow(sectionNum: number): number {
  // Sections 101-103: Right field outfield
  if (sectionNum >= 101 && sectionNum <= 103) return 37;

  // Section 104: Senate section
  if (sectionNum === 104) return 41;

  // Sections 105-111: Senate sections (wider, more seats)
  if (sectionNum >= 105 && sectionNum <= 111) return 40;

  return 36;
}

// Determine distance from home plate
function getDistance(sectionNum: number): number {
  // Minor league stadium - closer to field
  if (sectionNum >= 104 && sectionNum <= 108) return 60; // Behind home plate
  if (sectionNum >= 101 && sectionNum <= 103) return 80; // Right field
  if (sectionNum >= 109 && sectionNum <= 111) return 80; // Left field
  return 70;
}

// Determine base elevation
function getElevation(): number {
  return 0; // Single-level stadium, all at field level
}

// Determine if section is covered
function isCovered(sectionNum: number): boolean {
  // Open-air stadium with minimal coverage
  // Some back rows may have overhang protection
  return false; // Most seats uncovered
}

// Determine level string
function getLevelString(): 'field' | 'lower' | 'club' | 'upper' | 'suite' {
  return 'field'; // All main bowl at field level
}

// Generate section configuration
function createSectionConfig(sectionNum: number): SeatGenerationConfig {
  const sectionId = `${sectionNum}`;
  const isSenate = sectionNum >= 104 && sectionNum <= 111;
  const sectionName = isSenate
    ? `Senate ${sectionNum}`
    : `Section ${sectionNum}`;

  const rowCount = getRowCount(sectionNum);
  const seatsPerRow = getSeatsPerRow(sectionNum);
  const distance = getDistance(sectionNum);
  const baseElevation = getElevation();
  const baseAngle = getBaseAngle(sectionNum);
  const covered = isCovered(sectionNum);

  // Generate row labels (minor league typically uses letters)
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const rowLabel = String.fromCharCode(65 + i); // A, B, C, etc.
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
    angleSpan: 8.0, // Wider sections for minor league bowl
    baseElevation,
    rowHeight: 2.5,
    startDepth: distance,
    rowDepth: 2.8,
    rows,
    seatWidth: 2.0,
    seatSpacing: 0.5,
    rowSpacing: 36,
    level: getLevelString(),
    covered,
    overhangHeight: covered ? 20 : undefined,
  };
}

// Main generation function
async function generateAllSections() {
  log.step('Starting Sutter Health Park seat generation...');
  log.info(`Stadium: ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats (official current)`);

  const sections: SectionSeatingData[] = [];
  let totalSeats = 0;
  let totalSections = 0;

  // Main Bowl - Single Level (sections 101-111)
  log.step('Generating Main Bowl sections...');
  for (let i = 101; i <= 111; i++) {
    const config = createSectionConfig(i);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Main Bowl complete: ${totalSections} sections, ${totalSeats} seats`);

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
  dataSource: 'Generated from stadium specifications and capacity data',
  totalSections: ${sections.length},
  lastValidated: '${new Date().toISOString()}',
};

export const stats: StadiumSeatingStats = {
  totalSeats: ${totalSeats},
  totalSections: ${sections.length},
  totalRows: ${sections.reduce((sum, s) => sum + s.totalRows, 0)},
  levels: {
    'Main Bowl': ${totalSeats},
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
  console.log(`${colors.bright}  Sutter Health Park Generation Complete!${colors.reset}`);
  console.log(`${colors.bright}${colors.green}═══════════════════════════════════════${colors.reset}`);
  console.log('');
  log.info(`Total Sections: ${sections.length}`);
  log.info(`Total Seats: ${totalSeats.toLocaleString()}`);
  log.info(`Official Capacity: ${OFFICIAL_CAPACITY.toLocaleString()}`);

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
    console.log(`${colors.yellow}   Target: Exact match (14,014 seats)${colors.reset}`);
    console.log(`${colors.yellow}   Adjust getSeatsPerRow() or getRowCount() to fine-tune capacity${colors.reset}`);
  }

  console.log('');
  log.step('Next steps:');
  console.log('  1. Review generated files in src/data/seatData/athletics/');
  console.log('  2. If seat count is off, adjust getSeatsPerRow() or getRowCount() and regenerate');
  console.log('  3. Pre-compute sun data: npx tsx scripts/precomputeSunData.ts --stadium=athletics --game-time=13:10');
  console.log('  4. Build project: npm run build');
  console.log('');
}

// Run generation
generateAllSections().catch((error) => {
  console.error(`${colors.red}Error generating Sutter Health Park seats:${colors.reset}`, error);
  process.exit(1);
});
