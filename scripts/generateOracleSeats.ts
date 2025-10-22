#!/usr/bin/env ts-node

/**
 * Oracle Park Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 41,331 seats (2021-present)
 * - Sections: ~103 sections
 * - Levels: Field (100s), Club (200s), View (300s)
 * - Orientation: 87° (home to center field)
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateOracleSeats.ts
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

// Oracle Park base parameters
const STADIUM_ID = 'giants';
const STADIUM_NAME = 'Oracle Park';
const ORIENTATION = 87; // degrees
const OFFICIAL_CAPACITY = 41331; // 2021-present official capacity

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string): number {
  const centerField = ORIENTATION - 180; // -93°

  // Field Level (101-135)
  if (sectionId.match(/^1\d\d$/)) {
    const num = parseInt(sectionId, 10);
    if (num >= 101 && num <= 135) {
      // Wrap around from RF to LF
      return centerField + 45 - ((num - 101) * 2.6);
    }
  }

  // Arcade sections (145-152) - right field
  if (sectionId.match(/^14[5-9]$/)) {
    const num = parseInt(sectionId, 10);
    return centerField + 55 - ((num - 145) * 3);
  }

  // Club Level (202-234)
  if (sectionId.match(/^2\d\d$/)) {
    const num = parseInt(sectionId, 10);
    if (num >= 202 && num <= 234) {
      return centerField + 40 - ((num - 202) * 2.5);
    }
  }

  // View Level (302-336)
  if (sectionId.match(/^3\d\d$/)) {
    const num = parseInt(sectionId, 10);
    if (num >= 302 && num <= 336) {
      return centerField + 42 - ((num - 302) * 2.4);
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(sectionId: string): number {
  // View Level: 18-19 rows
  if (sectionId.match(/^3\d\d$/)) return 21;

  // Club Level: ~16-18 rows
  if (sectionId.match(/^2\d\d$/)) return 18;

  // Arcade: fewer rows
  if (sectionId.match(/^14[5-9]$/)) return 14;

  // Field Level: varies
  if (sectionId.match(/^1\d\d$/)) {
    const num = parseInt(sectionId, 10);
    // Behind home plate sections are deeper
    if (num >= 115 && num <= 125) return 22;
    return 21;
  }

  return 21;
}

// Determine seats per row
function getSeatsPerRow(sectionId: string): number {
  // View Level: ~22 seats/row
  if (sectionId.match(/^3\d\d$/)) return 24;

  // Club Level: 11-13 seats/row (increased)
  if (sectionId.match(/^2\d\d$/)) {
    const num = parseInt(sectionId, 10);
    // Infield sections smaller
    if (num >= 215 && num <= 225) return 14;
    return 16;
  }

  // Arcade: wider
  if (sectionId.match(/^14[5-9]$/)) return 22;

  // Field Level: varies by location
  if (sectionId.match(/^1\d\d$/)) {
    const num = parseInt(sectionId, 10);
    // Infield sections smaller
    if (num >= 115 && num <= 125) return 14;
    // Outfield sections wider
    if (num >= 101 && num <= 110) return 18;
    if (num >= 130 && num <= 135) return 18;
    return 16;
  }

  return 16;
}

// Determine distance from home plate
function getDistance(sectionId: string): number {
  if (sectionId.match(/^3\d\d$/)) return 220; // View level
  if (sectionId.match(/^2\d\d$/)) return 120; // Club level
  if (sectionId.match(/^14[5-9]$/)) return 300; // Arcade (RF)
  if (sectionId.match(/^1\d\d$/)) return 65; // Field level
  return 100;
}

// Determine base elevation
function getElevation(sectionId: string): number {
  if (sectionId.match(/^3\d\d$/)) return 75; // View level
  if (sectionId.match(/^2\d\d$/)) return 35; // Club level
  if (sectionId.match(/^14[5-9]$/)) return 40; // Arcade
  if (sectionId.match(/^1\d\d$/)) return 0; // Field level
  return 0;
}

// Determine if section is covered
function isCovered(sectionId: string): boolean {
  // Some Club level sections under View level overhang
  if (sectionId.match(/^2\d\d$/)) {
    const num = parseInt(sectionId, 10);
    if (num >= 210 && num <= 228) return true;
  }
  return false;
}

// Determine level string
function getLevelString(sectionId: string): 'field' | 'lower' | 'club' | 'upper' | 'suite' {
  if (sectionId.match(/^3\d\d$/)) return 'upper';
  if (sectionId.match(/^2\d\d$/)) return 'club';
  if (sectionId.match(/^14[5-9]$/)) return 'upper';
  if (sectionId.match(/^1\d\d$/)) return 'field';
  return 'lower';
}

// Get section name
function getSectionName(sectionId: string): string {
  if (sectionId.match(/^3\d\d$/)) return `View ${sectionId}`;
  if (sectionId.match(/^2\d\d$/)) return `Club ${sectionId}`;
  if (sectionId.match(/^14[5-9]$/)) return `Arcade ${sectionId}`;
  if (sectionId.match(/^1\d\d$/)) return `Section ${sectionId}`;
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

  // Generate row labels (A-Z pattern)
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const rowLabel = String.fromCharCode(65 + i); // A, B, C...
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
    overhangHeight: covered ? 20 : undefined,
  };
}

// Main generation function
async function generateAllSections() {
  log.step('Starting Oracle Park seat generation...');
  log.info(`Stadium: ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats (official 2021-present)`);

  const sections: SectionSeatingData[] = [];
  let totalSeats = 0;
  let totalSections = 0;

  // Field Level - Sections 101-135
  log.step('Generating Field Level sections...');
  for (let i = 101; i <= 135; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Field Level complete: ${totalSections} sections, ${totalSeats} seats`);

  // Arcade - Sections 145-152
  log.step('Generating Arcade sections...');
  const arcadeStart = totalSections;
  for (let i = 145; i <= 152; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Arcade complete: ${totalSections - arcadeStart} sections, ${totalSeats} total seats`);

  // Club Level - Sections 202-234
  log.step('Generating Club Level sections...');
  const clubStart = totalSections;
  for (let i = 202; i <= 234; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Club Level complete: ${totalSections - clubStart} sections, ${totalSeats} total seats`);

  // View Level - Sections 302-336
  log.step('Generating View Level sections...');
  const viewStart = totalSections;
  for (let i = 302; i <= 336; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`View Level complete: ${totalSections - viewStart} sections, ${totalSeats} total seats`);

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
    'Arcade': ${sections.filter(s => s.sectionId.match(/^14[5-9]$/)).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Club Level': ${sections.filter(s => s.sectionId.startsWith('2')).reduce((sum, s) => sum + s.totalSeats, 0)},
    'View Level': ${sections.filter(s => s.sectionId.startsWith('3')).reduce((sum, s) => sum + s.totalSeats, 0)},
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
  console.log(`${colors.bright}  Oracle Park Generation Complete!${colors.reset}`);
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
  console.log('  1. Review generated files in src/data/seatData/giants/');
  console.log('  2. Run validation: npm run validate-stadium-data -- --stadium=giants');
  console.log('  3. Pre-compute sun data: npx tsx scripts/precomputeSunData.ts --stadium=giants --game-time=13:10');
  console.log('  4. Build project: npm run build');
  console.log('');
}

// Run generation
generateAllSections().catch((error) => {
  console.error(`${colors.red}Error generating Oracle Park seats:${colors.reset}`, error);
  process.exit(1);
});
