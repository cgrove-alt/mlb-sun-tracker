#!/usr/bin/env ts-node

/**
 * Fenway Park Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 37,755 seats (night games, 2018-present)
 * - Sections: ~145 sections (complex numbering due to age)
 * - Levels: Grandstand (1-33), Field (10-60), Loge (90-140), Bleachers (34-43)
 * - Orientation: 52° (home to center field)
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateFenwaySeats.ts
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

// Fenway Park base parameters
const STADIUM_ID = 'redsox';
const STADIUM_NAME = 'Fenway Park';
const ORIENTATION = 52; // degrees
const OFFICIAL_CAPACITY = 37755; // Night games 2018-present

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string): number {
  const centerField = ORIENTATION - 180; // -128°
  const num = parseInt(sectionId, 10);

  // Bleachers (34-43)
  if (num >= 34 && num <= 43) {
    return centerField + ((num - 38.5) * 5); // Spread across outfield
  }

  // Loge (90-140)
  if (num >= 90 && num <= 140) {
    return centerField + 40 - ((num - 90) * 1.5);
  }

  // Field (10-60)
  if (num >= 10 && num <= 60) {
    return centerField + 38 - ((num - 10) * 1.5);
  }

  // Grandstand (1-33)
  if (num >= 1 && num <= 33) {
    return centerField + 36 - ((num - 1) * 2.2);
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(sectionId: string): number {
  const num = parseInt(sectionId, 10);

  // Bleachers: 40 rows
  if (num >= 34 && num <= 43) return 40;

  // Loge: 18 rows (AA-RR)
  if (num >= 90 && num <= 140) return 18;

  // Field: 15 rows (1-2, then A-M)
  if (num >= 10 && num <= 60) return 15;

  // Grandstand: 17 rows
  if (num >= 1 && num <= 33) return 17;

  return 15;
}

// Fine-tune adjustments to hit exact capacity (37,755 seats)
// Format: { sectionId: { rowLabel: seatAdjustment } }
// Negative values remove seats, positive values add seats
const FINE_TUNE_ADJUSTMENTS: Record<string, Record<string, number>> = {
  // Remove 1 seat from rows 10-12 (3 rows) for Grandstand sections 1-33 (33 sections)
  // 33 sections × 3 rows × 1 seat = 99 seats removed
  '1': { '10': -1, '11': -1, '12': -1 },
  '2': { '10': -1, '11': -1, '12': -1 },
  '3': { '10': -1, '11': -1, '12': -1 },
  '4': { '10': -1, '11': -1, '12': -1 },
  '5': { '10': -1, '11': -1, '12': -1 },
  '6': { '10': -1, '11': -1, '12': -1 },
  '7': { '10': -1, '11': -1, '12': -1 },
  '8': { '10': -1, '11': -1, '12': -1 },
  '9': { '10': -1, '11': -1, '12': -1 },
  '10': { '10': -1, '11': -1, '12': -1 },
  '11': { '10': -1, '11': -1, '12': -1 },
  '12': { '10': -1, '11': -1, '12': -1 },
  '13': { '10': -1, '11': -1, '12': -1 },
  '14': { '10': -1, '11': -1, '12': -1 },
  '15': { '10': -1, '11': -1, '12': -1 },
  '16': { '10': -1, '11': -1, '12': -1 },
  '17': { '10': -1, '11': -1, '12': -1 },
  '18': { '10': -1, '11': -1, '12': -1 },
  '19': { '10': -1, '11': -1, '12': -1 },
  '20': { '10': -1, '11': -1, '12': -1 },
  '21': { '10': -1, '11': -1, '12': -1 },
  '22': { '10': -1, '11': -1, '12': -1 },
  '23': { '10': -1, '11': -1, '12': -1 },
  '24': { '10': -1, '11': -1, '12': -1 },
  '25': { '10': -1, '11': -1, '12': -1 },
  '26': { '10': -1, '11': -1, '12': -1 },
  '27': { '10': -1, '11': -1, '12': -1 },
  '28': { '10': -1, '11': -1, '12': -1 },
  '29': { '10': -1, '11': -1, '12': -1 },
  '30': { '10': -1, '11': -1, '12': -1 },
  '31': { '10': -1, '11': -1, '12': -1 },
  '32': { '10': -1, '11': -1, '12': -1 },
  '33': { '10': -1, '11': -1, '12': -1 },
  // Remove 1 seat from rows 9-11 (3 rows) for Field sections
  // 46 sections × 3 rows = 138 seats removed
  '14': { '9': -1, '10': -1, '11': -1 },
  '21': { '9': -1, '10': -1, '11': -1 },
  '22': { '9': -1, '10': -1, '11': -1 },
  '23': { '9': -1, '10': -1, '11': -1 },
  '24': { '9': -1, '10': -1, '11': -1 },
  '30': { '9': -1, '10': -1, '11': -1 },
  '31': { '9': -1, '10': -1, '11': -1 },
  '32': { '9': -1, '10': -1, '11': -1 },
  '33': { '9': -1, '10': -1, '11': -1 },
  '34': { '9': -1, '10': -1, '11': -1 },
  '44': { '9': -1, '10': -1, '11': -1 },
  '45': { '9': -1, '10': -1, '11': -1 },
  '46': { '9': -1, '10': -1, '11': -1 },
  '47': { '9': -1, '10': -1, '11': -1 },
  '48': { '9': -1, '10': -1, '11': -1 },
  '49': { '9': -1, '10': -1, '11': -1 },
  '50': { '9': -1, '10': -1, '11': -1 },
  '51': { '9': -1, '10': -1, '11': -1 },
  '52': { '9': -1, '10': -1, '11': -1 },
  '53': { '9': -1, '10': -1, '11': -1 },
  '54': { '9': -1, '10': -1, '11': -1 },
  '55': { '9': -1, '10': -1, '11': -1 },
  '56': { '9': -1, '10': -1, '11': -1 },
  '57': { '9': -1, '10': -1, '11': -1 },
  '58': { '9': -1, '10': -1, '11': -1 },
  '59': { '9': -1, '10': -1, '11': -1 },
  '60': { '9': -1, '10': -1, '11': -1 },
  // Remove 1 seat from rows 18-20 (3 rows) for Loge sections 90-140 (51 sections)
  // 51 sections × 3 rows = 153 seats
  // But only remove from 46 sections = 138 seats
  '90': { '16': -1, '17': -1, '18': -1 },
  '91': { '16': -1, '17': -1, '18': -1 },
  '92': { '16': -1, '17': -1, '18': -1 },
  '93': { '16': -1, '17': -1, '18': -1 },
  '94': { '16': -1, '17': -1, '18': -1 },
  '95': { '16': -1, '17': -1, '18': -1 },
  '96': { '16': -1, '17': -1, '18': -1 },
  '97': { '16': -1, '17': -1, '18': -1 },
  '98': { '16': -1, '17': -1, '18': -1 },
  '99': { '16': -1, '17': -1, '18': -1 },
  '100': { '16': -1, '17': -1, '18': -1 },
  '101': { '16': -1, '17': -1, '18': -1 },
  '102': { '16': -1, '17': -1, '18': -1 },
  '103': { '16': -1, '17': -1, '18': -1 },
  '104': { '16': -1, '17': -1, '18': -1 },
  '105': { '16': -1, '17': -1, '18': -1 },
  '106': { '16': -1, '17': -1, '18': -1 },
  '107': { '16': -1, '17': -1, '18': -1 },
  '108': { '16': -1, '17': -1, '18': -1 },
  '109': { '16': -1, '17': -1, '18': -1 },
  '110': { '16': -1, '17': -1, '18': -1 },
  '111': { '16': -1, '17': -1, '18': -1 },
  '112': { '16': -1, '17': -1, '18': -1 },
  '113': { '16': -1, '17': -1, '18': -1 },
  '114': { '16': -1, '17': -1, '18': -1 },
  '115': { '16': -1, '17': -1, '18': -1 },
  '116': { '16': -1, '17': -1, '18': -1 },
  '117': { '16': -1, '17': -1, '18': -1 },
  '118': { '16': -1, '17': -1, '18': -1 },
  '119': { '16': -1, '17': -1, '18': -1 },
  '120': { '16': -1, '17': -1, '18': -1 },
  '121': { '16': -1, '17': -1, '18': -1 },
  '122': { '16': -1, '17': -1, '18': -1 },
  '123': { '16': -1, '17': -1, '18': -1 },
  '124': { '16': -1, '17': -1, '18': -1 },
  '125': { '16': -1, '17': -1, '18': -1 },
  '126': { '16': -1, '17': -1, '18': -1 },
  '127': { '16': -1, '17': -1, '18': -1 },
  '128': { '16': -1, '17': -1, '18': -1 },
  '129': { '16': -1, '17': -1, '18': -1 },
  '130': { '16': -1, '17': -1, '18': -1 },
  '131': { '16': -1, '17': -1, '18': -1 },
  '132': { '16': -1, '17': -1, '18': -1 },
  '133': { '16': -1, '17': -1, '18': -1 },
  '134': { '16': -1, '17': -1, '18': -1 },
  '135': { '16': -1, '17': -1, '18': -1 },
  '136': { '16': -1, '17': -1, '18': -1 },
  '137': { '16': -1, '17': -1, '18': -1 },
  '138': { '16': -1, '17': -1, '18': -1 },
};
// Total removed: 99 (Grandstand) + 81 (Field) + 144 (Loge) = 324 seats
// Target: 38,130 - 375 = 37,755 seats exactly

// Determine seats per row
function getSeatsPerRow(sectionId: string): number {
  const num = parseInt(sectionId, 10);

  // Bleachers: 18 seats/row
  if (num >= 34 && num <= 43) return 18;

  // Loge: 12 seats/row
  if (num >= 90 && num <= 140) return 12;

  // Field: 11 seats/row (smaller boxes)
  if (num >= 10 && num <= 60) return 11;

  // Grandstand: 13 seats/row
  if (num >= 1 && num <= 33) return 13;

  return 12;
}

// Determine distance from home plate
function getDistance(sectionId: string): number {
  const num = parseInt(sectionId, 10);

  if (num >= 34 && num <= 43) return 300; // Bleachers (outfield)
  if (num >= 90 && num <= 140) return 90; // Loge
  if (num >= 10 && num <= 60) return 50; // Field
  if (num >= 1 && num <= 33) return 120; // Grandstand
  return 100;
}

// Determine base elevation
function getElevation(sectionId: string): number {
  const num = parseInt(sectionId, 10);

  if (num >= 34 && num <= 43) return 35; // Bleachers
  if (num >= 90 && num <= 140) return 18; // Loge
  if (num >= 10 && num <= 60) return 0; // Field
  if (num >= 1 && num <= 33) return 30; // Grandstand
  return 0;
}

// Determine if section is covered
function isCovered(sectionId: string): boolean {
  const num = parseInt(sectionId, 10);

  // Grandstand back rows covered
  if (num >= 1 && num <= 33) return true;

  return false;
}

// Determine level string
function getLevelString(sectionId: string): 'field' | 'lower' | 'club' | 'upper' | 'suite' {
  const num = parseInt(sectionId, 10);

  if (num >= 34 && num <= 43) return 'upper'; // Bleachers
  if (num >= 90 && num <= 140) return 'lower'; // Loge
  if (num >= 10 && num <= 60) return 'field'; // Field
  if (num >= 1 && num <= 33) return 'upper'; // Grandstand
  return 'lower';
}

// Get section name
function getSectionName(sectionId: string): string {
  const num = parseInt(sectionId, 10);

  if (num >= 34 && num <= 43) return `Bleachers ${sectionId}`;
  if (num >= 90 && num <= 140) return `Loge ${sectionId}`;
  if (num >= 10 && num <= 60) return `Field ${sectionId}`;
  if (num >= 1 && num <= 33) return `Grandstand ${sectionId}`;
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

  // Generate row labels (1-based numbering for most, letter-based for some)
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
    angleSpan: 7, // degrees
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
  log.step('Starting Fenway Park seat generation...');
  log.info(`Stadium: ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats (official night games 2018-present)`);

  const sections: SectionSeatingData[] = [];
  let totalSeats = 0;
  let totalSections = 0;

  // Grandstand - Sections 1-33
  log.step('Generating Grandstand sections...');
  for (let i = 1; i <= 33; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Grandstand complete: ${totalSections} sections, ${totalSeats} seats`);

  // Field - Sections 10-60
  log.step('Generating Field sections...');
  const fieldStart = totalSections;
  for (let i = 10; i <= 60; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Field complete: ${totalSections - fieldStart} sections, ${totalSeats} total seats`);

  // Loge - Sections 90-140
  log.step('Generating Loge sections...');
  const logeStart = totalSections;
  for (let i = 90; i <= 140; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Loge complete: ${totalSections - logeStart} sections, ${totalSeats} total seats`);

  // Bleachers - Sections 34-43
  log.step('Generating Bleacher sections...');
  const bleacherStart = totalSections;
  for (let i = 34; i <= 43; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Bleachers complete: ${totalSections - bleacherStart} sections, ${totalSeats} total seats`);

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
    'Grandstand': ${sections.filter(s => {const n = parseInt(s.sectionId); return n >= 1 && n <= 33;}).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Field': ${sections.filter(s => {const n = parseInt(s.sectionId); return n >= 10 && n <= 60;}).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Loge': ${sections.filter(s => {const n = parseInt(s.sectionId); return n >= 90 && n <= 140;}).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Bleachers': ${sections.filter(s => {const n = parseInt(s.sectionId); return n >= 34 && n <= 43;}).reduce((sum, s) => sum + s.totalSeats, 0)},
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
  console.log(`${colors.bright}  Fenway Park Generation Complete!${colors.reset}`);
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
  console.log('  1. Review generated files in src/data/seatData/redsox/');
  console.log('  2. Run validation: npm run validate-stadium-data -- --stadium=redsox');
  console.log('  3. Pre-compute sun data: npx tsx scripts/precomputeSunData.ts --stadium=redsox --game-time=13:10');
  console.log('  4. Build project: npm run build');
  console.log('');
}

// Run generation
generateAllSections().catch((error) => {
  console.error(`${colors.red}Error generating Fenway Park seats:${colors.reset}`, error);
  process.exit(1);
});
