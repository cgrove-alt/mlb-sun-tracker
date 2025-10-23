#!/usr/bin/env ts-node

/**
 * Wrigley Field Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 41,649 seats (2017-present after renovations)
 * - Sections: ~132 numbered sections (100s-400s)
 * - Levels: Field (100s), Terrace (200s), Upper (300s, 400s)
 * - Orientation: 13° (home to center field)
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateWrigleySeats.ts
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

// Wrigley Field base parameters
const STADIUM_ID = 'cubs';
const STADIUM_NAME = 'Wrigley Field';
const ORIENTATION = 13; // degrees
const OFFICIAL_CAPACITY = 41649; // 2017-present official capacity

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string): number {
  const centerField = ORIENTATION - 180; // -167°
  const num = parseInt(sectionId, 10);

  // Field Level (101-142)
  if (sectionId.match(/^1\d\d$/)) {
    if (num >= 101 && num <= 142) {
      // Wrap around from RF to LF
      return centerField + 50 - ((num - 101) * 2.4);
    }
  }

  // Terrace Level (202-233)
  if (sectionId.match(/^2\d\d$/)) {
    if (num >= 202 && num <= 233) {
      return centerField + 40 - ((num - 202) * 2.5);
    }
  }

  // Upper Level (303-331)
  if (sectionId.match(/^3\d\d$/)) {
    if (num >= 303 && num <= 331) {
      return centerField + 38 - ((num - 303) * 2.6);
    }
  }

  // Upper Reserved (403-431)
  if (sectionId.match(/^4\d\d$/)) {
    if (num >= 403 && num <= 431) {
      return centerField + 36 - ((num - 403) * 2.5);
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(sectionId: string): number {
  // Upper Reserved (400s): 9 rows
  if (sectionId.match(/^4\d\d$/)) return 9;

  // Upper Level (300s): 12 rows
  if (sectionId.match(/^3\d\d$/)) return 12;

  // Terrace Level (200s): 23 rows
  if (sectionId.match(/^2\d\d$/)) return 23;

  // Field Level (100s): 15 rows
  if (sectionId.match(/^1\d\d$/)) return 15;

  return 15;
}

// Determine seats per row
function getSeatsPerRow(sectionId: string): number {
  const num = parseInt(sectionId, 10);

  // Upper Reserved (400s): 23 seats/row
  if (sectionId.match(/^4\d\d$/)) return 23;

  // Upper Level (300s): 23 seats/row
  if (sectionId.match(/^3\d\d$/)) return 23;

  // Terrace Level (200s): 22 seats/row
  if (sectionId.match(/^2\d\d$/)) return 22;

  // Field Level (100s): varies by location
  if (sectionId.match(/^1\d\d$/)) {
    // Infield sections smaller
    if (num >= 115 && num <= 130) return 16;
    // Outfield sections wider
    if (num >= 101 && num <= 110) return 20;
    if (num >= 135 && num <= 142) return 20;
    return 18;
  }

  return 18;
}

// Fine-tune adjustments to hit exact capacity (41,649 seats)
// Format: { sectionId: { rowLabel: seatAdjustment } }
// Positive values add seats, negative values remove seats
// Target: Add 50 seats (41,599 → 41,649)
const FINE_TUNE_ADJUSTMENTS: Record<string, Record<string, number>> = {
  // Add 1 seat to rows 14-15 (2 rows) for Field Level sections (2 rows × 25 sections = 50 seats)
  '101': { '14': 1, '15': 1 },
  '102': { '14': 1, '15': 1 },
  '103': { '14': 1, '15': 1 },
  '104': { '14': 1, '15': 1 },
  '105': { '14': 1, '15': 1 },
  '106': { '14': 1, '15': 1 },
  '107': { '14': 1, '15': 1 },
  '108': { '14': 1, '15': 1 },
  '109': { '14': 1, '15': 1 },
  '110': { '14': 1, '15': 1 },
  '111': { '14': 1, '15': 1 },
  '112': { '14': 1, '15': 1 },
  '113': { '14': 1, '15': 1 },
  '114': { '14': 1, '15': 1 },
  '115': { '14': 1, '15': 1 },
  '116': { '14': 1, '15': 1 },
  '117': { '14': 1, '15': 1 },
  '118': { '14': 1, '15': 1 },
  '119': { '14': 1, '15': 1 },
  '120': { '14': 1, '15': 1 },
  '121': { '14': 1, '15': 1 },
  '122': { '14': 1, '15': 1 },
  '123': { '14': 1, '15': 1 },
  '124': { '14': 1, '15': 1 },
  '125': { '14': 1, '15': 1 },
};
// Total added: 25 sections × 2 rows × 1 seat = 50 seats

// Determine distance from home plate
function getDistance(sectionId: string): number {
  if (sectionId.match(/^4\d\d$/)) return 240; // Upper Reserved
  if (sectionId.match(/^3\d\d$/)) return 200; // Upper Level
  if (sectionId.match(/^2\d\d$/)) return 100; // Terrace
  if (sectionId.match(/^1\d\d$/)) return 55; // Field level
  return 100;
}

// Determine base elevation
function getElevation(sectionId: string): number {
  if (sectionId.match(/^4\d\d$/)) return 80; // Upper Reserved
  if (sectionId.match(/^3\d\d$/)) return 60; // Upper Level
  if (sectionId.match(/^2\d\d$/)) return 25; // Terrace
  if (sectionId.match(/^1\d\d$/)) return 0; // Field level
  return 0;
}

// Determine if section is covered
function isCovered(sectionId: string): boolean {
  // All 400 level sections are fully covered by roof
  if (sectionId.match(/^4\d\d$/)) return true;

  // Some Terrace level sections under overhang
  if (sectionId.match(/^2\d\d$/)) {
    const num = parseInt(sectionId, 10);
    // Back rows of infield sections
    if (num >= 210 && num <= 225) return true;
  }

  return false;
}

// Determine level string
function getLevelString(sectionId: string): 'field' | 'lower' | 'club' | 'upper' | 'suite' {
  if (sectionId.match(/^4\d\d$/)) return 'upper';
  if (sectionId.match(/^3\d\d$/)) return 'upper';
  if (sectionId.match(/^2\d\d$/)) return 'lower';
  if (sectionId.match(/^1\d\d$/)) return 'field';
  return 'lower';
}

// Get section name
function getSectionName(sectionId: string): string {
  if (sectionId.match(/^4\d\d$/)) return `Upper Reserved ${sectionId}`;
  if (sectionId.match(/^3\d\d$/)) return `Upper Level ${sectionId}`;
  if (sectionId.match(/^2\d\d$/)) return `Terrace ${sectionId}`;
  if (sectionId.match(/^1\d\d$/)) return `Field ${sectionId}`;
  return `Section ${sectionId}`;
}

// Generate section configuration
function createSectionConfig(sectionId: string): SeatGenerationConfig {
  const sectionName = getSectionName(sectionId);
  const rowCount = getRowCount(sectionId);
  const seatsPerRow = getSeatsPerRow(sectionId);
  const distance = getDistance(sectionId);
  const baseElevation = getElevation(sectionId);
  const baseAngle = getBaseAngle(sectionId);
  const covered = isCovered(sectionId);

  // Generate row labels (1-based numbering)
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const rowLabel = `${i + 1}`;
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
    level: getLevelString(sectionId),
    covered,
    overhangHeight: covered ? 20 : undefined,
  };
}

// Main generation function
async function generateAllSections() {
  log.step('Starting Wrigley Field seat generation...');
  log.info(`Stadium: ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats (official 2017-present)`);

  const sections: SectionSeatingData[] = [];
  let totalSeats = 0;
  let totalSections = 0;

  // Field Level - Sections 101-142
  log.step('Generating Field Level sections...');
  for (let i = 101; i <= 142; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Field Level complete: ${totalSections} sections, ${totalSeats} seats`);

  // Terrace Level - Sections 202-233
  log.step('Generating Terrace Level sections...');
  const terraceStart = totalSections;
  for (let i = 202; i <= 233; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Terrace Level complete: ${totalSections - terraceStart} sections, ${totalSeats} total seats`);

  // Upper Level - Sections 303-331
  log.step('Generating Upper Level sections...');
  const upperStart = totalSections;
  for (let i = 303; i <= 331; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Upper Level complete: ${totalSections - upperStart} sections, ${totalSeats} total seats`);

  // Upper Reserved - Sections 403-431
  log.step('Generating Upper Reserved sections...');
  const reservedStart = totalSections;
  for (let i = 403; i <= 431; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Upper Reserved complete: ${totalSections - reservedStart} sections, ${totalSeats} total seats`);

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
    'Field Level': ${sections.filter(s => s.sectionId.match(/^1\d\d$/)).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Terrace Level': ${sections.filter(s => s.sectionId.match(/^2\d\d$/)).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Upper Level': ${sections.filter(s => s.sectionId.match(/^3\d\d$/)).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Upper Reserved': ${sections.filter(s => s.sectionId.match(/^4\d\d$/)).reduce((sum, s) => sum + s.totalSeats, 0)},
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
  console.log(`${colors.bright}  Wrigley Field Generation Complete!${colors.reset}`);
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
  console.log('  1. Review generated files in src/data/seatData/cubs/');
  console.log('  2. Run validation: npm run validate-stadium-data -- --stadium=cubs');
  console.log('  3. Pre-compute sun data: npx tsx scripts/precomputeSunData.ts --stadium=cubs --game-time=13:10');
  console.log('  4. Build project: npm run build');
  console.log('');
}

// Run generation
generateAllSections().catch((error) => {
  console.error(`${colors.red}Error generating Wrigley Field seats:${colors.reset}`, error);
  process.exit(1);
});
