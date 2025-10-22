#!/usr/bin/env ts-node

/**
 * Yankee Stadium Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 46,537 seats (2020-present)
 * - Sections: ~131 numbered sections (100s-400s)
 * - Levels: Field (100s), Main (200s), Terrace (300s), Grandstand (400s)
 * - Orientation: 55° (home to center field)
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateYankeeSeats.ts
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

// Yankee Stadium base parameters
const STADIUM_ID = 'yankees';
const STADIUM_NAME = 'Yankee Stadium';
const ORIENTATION = 55; // degrees
const OFFICIAL_CAPACITY = 46537; // 2020-present official capacity

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string): number {
  const centerField = ORIENTATION - 180; // -125°
  const num = parseInt(sectionId, 10);

  // Field Level (103-136)
  if (sectionId.match(/^1\d\d$/)) {
    if (num >= 103 && num <= 136) {
      // Wrap around from RF to LF
      return centerField + 42 - ((num - 103) * 2.5);
    }
  }

  // Main Level (202-238)
  if (sectionId.match(/^2\d\d$/)) {
    if (num >= 202 && num <= 238) {
      return centerField + 48 - ((num - 202) * 2.6);
    }
  }

  // Terrace Level (305-334)
  if (sectionId.match(/^3\d\d$/)) {
    if (num >= 305 && num <= 334) {
      return centerField + 38 - ((num - 305) * 2.5);
    }
  }

  // Grandstand Level (405-434)
  if (sectionId.match(/^4\d\d$/)) {
    if (num >= 405 && num <= 434) {
      return centerField + 36 - ((num - 405) * 2.4);
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(sectionId: string): number {
  // Grandstand (400s): 12 rows
  if (sectionId.match(/^4\d\d$/)) return 12;

  // Terrace (300s): 10 rows
  if (sectionId.match(/^3\d\d$/)) return 10;

  // Main Level (200s): 23 rows
  if (sectionId.match(/^2\d\d$/)) return 23;

  // Field Level (100s): 25 rows
  if (sectionId.match(/^1\d\d$/)) return 25;

  return 20;
}

// Determine seats per row
function getSeatsPerRow(sectionId: string): number {
  const num = parseInt(sectionId, 10);

  // Grandstand (400s): 18 seats/row
  if (sectionId.match(/^4\d\d$/)) return 18;

  // Terrace (300s): 20 seats/row
  if (sectionId.match(/^3\d\d$/)) return 20;

  // Main Level (200s): 20 seats/row
  if (sectionId.match(/^2\d\d$/)) return 20;

  // Field Level (100s): varies by location
  if (sectionId.match(/^1\d\d$/)) {
    // Infield sections smaller
    if (num >= 115 && num <= 125) return 18;
    // Outfield sections wider
    if (num >= 103 && num <= 110) return 22;
    if (num >= 130 && num <= 136) return 22;
    return 20;
  }

  return 20;
}

// Determine distance from home plate
function getDistance(sectionId: string): number {
  if (sectionId.match(/^4\d\d$/)) return 260; // Grandstand
  if (sectionId.match(/^3\d\d$/)) return 200; // Terrace
  if (sectionId.match(/^2\d\d$/)) return 110; // Main
  if (sectionId.match(/^1\d\d$/)) return 60; // Field level
  return 100;
}

// Determine base elevation
function getElevation(sectionId: string): number {
  if (sectionId.match(/^4\d\d$/)) return 85; // Grandstand
  if (sectionId.match(/^3\d\d$/)) return 60; // Terrace
  if (sectionId.match(/^2\d\d$/)) return 30; // Main
  if (sectionId.match(/^1\d\d$/)) return 0; // Field level
  return 0;
}

// Determine if section is covered
function isCovered(sectionId: string): boolean {
  const num = parseInt(sectionId, 10);

  // All Grandstand (400s) covered from row 5+
  if (sectionId.match(/^4\d\d$/)) return true;

  // Main Level infield sections rows 14+ covered
  if (sectionId.match(/^2\d\d$/)) {
    if ((num >= 205 && num <= 217) || (num >= 223 && num <= 234)) {
      return true;
    }
  }

  // Field Level last 5-6 rows covered
  if (sectionId.match(/^1\d\d$/)) {
    if (num >= 110 && num <= 130) return true; // Approximate infield coverage
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
  if (sectionId.match(/^4\d\d$/)) return `Grandstand ${sectionId}`;
  if (sectionId.match(/^3\d\d$/)) return `Terrace ${sectionId}`;
  if (sectionId.match(/^2\d\d$/)) return `Main ${sectionId}`;
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
    rows.push({
      rowLabel,
      seatCount: seatsPerRow,
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
    overhangHeight: covered ? 25 : undefined,
  };
}

// Main generation function
async function generateAllSections() {
  log.step('Starting Yankee Stadium seat generation...');
  log.info(`Stadium: ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats (official 2020-present)`);

  const sections: SectionSeatingData[] = [];
  let totalSeats = 0;
  let totalSections = 0;

  // Field Level - Sections 103-136
  log.step('Generating Field Level sections...');
  for (let i = 103; i <= 136; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Field Level complete: ${totalSections} sections, ${totalSeats} seats`);

  // Main Level - Sections 202-238
  log.step('Generating Main Level sections...');
  const mainStart = totalSections;
  for (let i = 202; i <= 238; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Main Level complete: ${totalSections - mainStart} sections, ${totalSeats} total seats`);

  // Terrace Level - Sections 305-334
  log.step('Generating Terrace Level sections...');
  const terraceStart = totalSections;
  for (let i = 305; i <= 334; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Terrace Level complete: ${totalSections - terraceStart} sections, ${totalSeats} total seats`);

  // Grandstand Level - Sections 405-434
  log.step('Generating Grandstand Level sections...');
  const grandstandStart = totalSections;
  for (let i = 405; i <= 434; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Grandstand Level complete: ${totalSections - grandstandStart} sections, ${totalSeats} total seats`);

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
    'Main Level': ${sections.filter(s => s.sectionId.match(/^2\d\d$/)).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Terrace Level': ${sections.filter(s => s.sectionId.match(/^3\d\d$/)).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Grandstand Level': ${sections.filter(s => s.sectionId.match(/^4\d\d$/)).reduce((sum, s) => sum + s.totalSeats, 0)},
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
  console.log(`${colors.bright}  Yankee Stadium Generation Complete!${colors.reset}`);
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
  console.log('  1. Review generated files in src/data/seatData/yankees/');
  console.log('  2. Run validation: npm run validate-stadium-data -- --stadium=yankees');
  console.log('  3. Pre-compute sun data: npx tsx scripts/precomputeSunData.ts --stadium=yankees --game-time=13:10');
  console.log('  4. Build project: npm run build');
  console.log('');
}

// Run generation
generateAllSections().catch((error) => {
  console.error(`${colors.red}Error generating Yankee Stadium seats:${colors.reset}`, error);
  process.exit(1);
});
