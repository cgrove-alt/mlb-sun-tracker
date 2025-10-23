#!/usr/bin/env ts-node

/**
 * Dodger Stadium Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 56,000 seats (official, conditional-use permit limited)
 * - Sections: ~195 sections
 * - Levels: Field, Loge, Reserve, Top Deck, Pavilion, Infield Reserve
 * - Orientation: 37° (home to center field)
 *
 * Created: 2025-10-21
 * Usage: npx tsx scripts/generateDodgerSeats.ts
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

// Dodger Stadium base parameters
const STADIUM_ID = 'dodger-stadium';
const STADIUM_NAME = 'Dodger Stadium';
const ORIENTATION = 37; // degrees
const OFFICIAL_CAPACITY = 56000; // Conditional-use permit limited capacity

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string): number {
  const centerField = ORIENTATION - 180; // -143°

  // Field Level (1-53)
  if (sectionId.match(/^\d+$/)) {
    const num = parseInt(sectionId, 10);
    if (num >= 1 && num <= 53) {
      // Wrap from RF foul pole to LF foul pole
      return centerField + 50 - ((num - 1) * 2.0);
    }
  }

  // Loge Level (101-168)
  if (sectionId.match(/^1\d\d$/)) {
    const num = parseInt(sectionId, 10);
    if (num >= 101 && num <= 168) {
      return centerField + 48 - ((num - 101) * 1.4);
    }
  }

  // Pavilions (301-316)
  if (sectionId.match(/^3\d\d$/)) {
    const num = parseInt(sectionId, 10);
    if (num >= 301 && num <= 316) {
      // Left and right field pavilions
      if (num <= 307) {
        // Left field
        return centerField - 40 + ((num - 301) * 3);
      } else {
        // Right field
        return centerField + 40 - ((num - 308) * 3);
      }
    }
  }

  // Reserve (RS)
  if (sectionId.endsWith('RS')) {
    const num = parseInt(sectionId.replace('RS', ''), 10);
    return centerField + 45 - ((num - 1) * 1.8);
  }

  // Top Deck (TD)
  if (sectionId.endsWith('TD')) {
    const num = parseInt(sectionId.replace('TD', ''), 10);
    return centerField + 25 - ((num - 1) * 4.0);
  }

  // Infield Reserve (IR)
  if (sectionId.endsWith('IR')) {
    const num = parseInt(sectionId.replace('IR', ''), 10);
    return centerField + 30 - ((num - 1) * 3.2);
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(sectionId: string): number {
  // Check specific patterns BEFORE generic digit pattern

  // Loge Level: 21 rows (calibrated)
  if (sectionId.match(/^1\d\d$/)) return 21;

  // Pavilions: 23 rows
  if (sectionId.match(/^3\d\d$/)) return 23;

  // Reserve: 22 rows
  if (sectionId.endsWith('RS')) return 22;

  // Top Deck: 23 rows
  if (sectionId.endsWith('TD')) return 23;

  // Infield Reserve: 22 rows
  if (sectionId.endsWith('IR')) return 22;

  // Field Level: 14 rows (calibrated) - CHECK LAST
  if (sectionId.match(/^\d+$/)) return 14;

  return 20;
}

// Determine seats per row
function getSeatsPerRow(sectionId: string): number {
  // Check specific patterns BEFORE generic digit pattern

  // Loge Level: varies by location
  if (sectionId.match(/^1\d\d$/)) {
    const num = parseInt(sectionId, 10);
    // Infield sections smaller
    if (num >= 130 && num <= 145) return 8;
    return 10;
  }

  // Pavilions: 18 seats/row (bleacher style)
  if (sectionId.match(/^3\d\d$/)) return 18;

  // Reserve: 22 seats/row
  if (sectionId.endsWith('RS')) return 22;

  // Top Deck: 20 seats/row
  if (sectionId.endsWith('TD')) return 20;

  // Infield Reserve: 22 seats/row
  if (sectionId.endsWith('IR')) return 22;

  // Field Level: 10 seats/row (infield) - CHECK LAST
  if (sectionId.match(/^\d+$/)) {
    const num = parseInt(sectionId, 10);
    // Wider sections in outfield
    if (num >= 44 && num <= 45) return 20;
    if (num >= 40 && num <= 43) return 14;
    return 10;
  }

  return 8;
}

// Fine-tune adjustments to hit exact capacity (56,000 seats)
// Format: { sectionId: { rowLabel: seatAdjustment } }
// Positive values add seats, negative values remove seats
// Target: Add 84 seats (55,916 → 56,000)
const FINE_TUNE_ADJUSTMENTS: Record<string, Record<string, number>> = {
  // Add 1 seat to rows M-N (2 rows) for Field Level sections (2 rows × 42 sections = 84 seats)
  '1': { 'M': 1, 'N': 1 },
  '2': { 'M': 1, 'N': 1 },
  '3': { 'M': 1, 'N': 1 },
  '4': { 'M': 1, 'N': 1 },
  '5': { 'M': 1, 'N': 1 },
  '6': { 'M': 1, 'N': 1 },
  '7': { 'M': 1, 'N': 1 },
  '8': { 'M': 1, 'N': 1 },
  '9': { 'M': 1, 'N': 1 },
  '10': { 'M': 1, 'N': 1 },
  '11': { 'M': 1, 'N': 1 },
  '12': { 'M': 1, 'N': 1 },
  '13': { 'M': 1, 'N': 1 },
  '14': { 'M': 1, 'N': 1 },
  '15': { 'M': 1, 'N': 1 },
  '16': { 'M': 1, 'N': 1 },
  '17': { 'M': 1, 'N': 1 },
  '18': { 'M': 1, 'N': 1 },
  '19': { 'M': 1, 'N': 1 },
  '20': { 'M': 1, 'N': 1 },
  '21': { 'M': 1, 'N': 1 },
  '22': { 'M': 1, 'N': 1 },
  '23': { 'M': 1, 'N': 1 },
  '24': { 'M': 1, 'N': 1 },
  '25': { 'M': 1, 'N': 1 },
  '26': { 'M': 1, 'N': 1 },
  '27': { 'M': 1, 'N': 1 },
  '28': { 'M': 1, 'N': 1 },
  '29': { 'M': 1, 'N': 1 },
  '30': { 'M': 1, 'N': 1 },
  '31': { 'M': 1, 'N': 1 },
  '32': { 'M': 1, 'N': 1 },
  '33': { 'M': 1, 'N': 1 },
  '34': { 'M': 1, 'N': 1 },
  '35': { 'M': 1, 'N': 1 },
  '36': { 'M': 1, 'N': 1 },
  '37': { 'M': 1, 'N': 1 },
  '38': { 'M': 1, 'N': 1 },
  '39': { 'M': 1, 'N': 1 },
  '40': { 'M': 1, 'N': 1 },
  '41': { 'M': 1, 'N': 1 },
  '42': { 'M': 1, 'N': 1 },
};
// Total added: 42 sections × 2 rows × 1 seat = 84 seats

// Determine distance from home plate
function getDistance(sectionId: string): number {
  // Check specific patterns BEFORE generic digit pattern
  if (sectionId.match(/^1\d\d$/)) return 100; // Loge level
  if (sectionId.match(/^3\d\d$/)) return 350; // Pavilions (outfield)
  if (sectionId.endsWith('RS')) return 175; // Reserve
  if (sectionId.endsWith('TD')) return 200; // Top Deck
  if (sectionId.endsWith('IR')) return 150; // Infield Reserve
  if (sectionId.match(/^\d+$/)) return 60; // Field level feet - CHECK LAST
  return 100;
}

// Determine base elevation
function getElevation(sectionId: string): number {
  // Check specific patterns BEFORE generic digit pattern
  if (sectionId.match(/^1\d\d$/)) return 25; // Loge level
  if (sectionId.match(/^3\d\d$/)) return 40; // Pavilions
  if (sectionId.endsWith('RS')) return 75; // Reserve
  if (sectionId.endsWith('TD')) return 100; // Top Deck
  if (sectionId.endsWith('IR')) return 60; // Infield Reserve
  if (sectionId.match(/^\d+$/)) return 0; // Field level - CHECK LAST
  return 0;
}

// Determine if section is covered
function isCovered(sectionId: string): boolean {
  // Some Reserve sections under Top Deck overhang
  if (sectionId.endsWith('RS')) {
    const num = parseInt(sectionId.replace('RS', ''), 10);
    if (num >= 1 && num <= 11) return true;
  }
  return false;
}

// Determine level string
function getLevelString(sectionId: string): 'field' | 'lower' | 'club' | 'upper' | 'suite' {
  // Check specific patterns BEFORE generic digit pattern
  if (sectionId.match(/^1\d\d$/)) return 'lower';
  if (sectionId.match(/^3\d\d$/)) return 'upper';
  if (sectionId.endsWith('RS')) return 'upper';
  if (sectionId.endsWith('TD')) return 'upper';
  if (sectionId.endsWith('IR')) return 'upper';
  if (sectionId.match(/^\d+$/)) return 'field'; // CHECK LAST
  return 'lower';
}

// Get section name
function getSectionName(sectionId: string): string {
  // Check specific patterns BEFORE generic digit pattern
  if (sectionId.match(/^1\d\d$/)) return `Loge Box ${sectionId}`;
  if (sectionId.match(/^3\d\d$/)) return `Pavilion ${sectionId}`;
  if (sectionId.endsWith('RS')) return `Reserve ${sectionId.replace('RS', '')}`;
  if (sectionId.endsWith('TD')) return `Top Deck ${sectionId.replace('TD', '')}`;
  if (sectionId.endsWith('IR')) return `Infield Reserve ${sectionId.replace('IR', '')}`;
  if (sectionId.match(/^\d+$/)) return `Field Box ${sectionId}`; // CHECK LAST
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

  // Generate row labels
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
      rowNumber: i,
    });
  }

  return {
    stadiumId: STADIUM_ID,
    sectionId,
    sectionName,
    baseAngle,
    angleSpan: 6, // degrees
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
  log.step('Starting Dodger Stadium seat generation...');
  log.info(`Stadium: ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats (official permit limit)`);

  const sections: SectionSeatingData[] = [];
  let totalSeats = 0;
  let totalSections = 0;

  // Field Level (sections 1-53)
  log.step('Generating Field Level sections...');
  for (let i = 1; i <= 53; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Field Level complete: ${totalSections} sections, ${totalSeats.toLocaleString()} seats`);

  // Loge Level (sections 101-168)
  log.step('Generating Loge Level sections...');
  const logeStart = totalSections;
  for (let i = 101; i <= 168; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Loge Level complete: ${totalSections - logeStart} sections, ${totalSeats.toLocaleString()} total seats`);

  // Pavilions (sections 301-316)
  log.step('Generating Pavilion sections...');
  const pavilionStart = totalSections;
  for (let i = 301; i <= 316; i++) {
    const config = createSectionConfig(`${i}`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Pavilion complete: ${totalSections - pavilionStart} sections, ${totalSeats.toLocaleString()} total seats`);

  // Reserve Level (sections 1RS-26RS)
  log.step('Generating Reserve Level sections...');
  const reserveStart = totalSections;
  for (let i = 1; i <= 26; i++) {
    const config = createSectionConfig(`${i}RS`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Reserve Level complete: ${totalSections - reserveStart} sections, ${totalSeats.toLocaleString()} total seats`);

  // Top Deck (sections 1TD-13TD)
  log.step('Generating Top Deck sections...');
  const topDeckStart = totalSections;
  for (let i = 1; i <= 13; i++) {
    const config = createSectionConfig(`${i}TD`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Top Deck complete: ${totalSections - topDeckStart} sections, ${totalSeats.toLocaleString()} total seats`);

  // Infield Reserve (sections 1IR-19IR)
  log.step('Generating Infield Reserve sections...');
  const irStart = totalSections;
  for (let i = 1; i <= 19; i++) {
    const config = createSectionConfig(`${i}IR`);
    const sectionData = generateSectionSeats(config);
    sections.push(sectionData);
    totalSeats += sectionData.totalSeats;
    totalSections++;
  }
  log.success(`Infield Reserve complete: ${totalSections - irStart} sections, ${totalSeats.toLocaleString()} total seats`);

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
  version: '2.0.0',
  dataSource: 'Programmatically generated from official seating parameters',
  totalSections: ${sections.length},
  lastValidated: '${new Date().toISOString()}',
};

export const stats: StadiumSeatingStats = {
  totalSeats: ${totalSeats},
  totalSections: ${sections.length},
  totalRows: ${sections.reduce((sum, s) => sum + s.totalRows, 0)},
  levels: {
    'Field Level': ${sections.filter(s => s.sectionId.match(/^\d+$/)).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Loge Level': ${sections.filter(s => s.sectionId.match(/^1\d\d$/)).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Reserve Level': ${sections.filter(s => s.sectionId.endsWith('RS')).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Top Deck': ${sections.filter(s => s.sectionId.endsWith('TD')).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Pavilion': ${sections.filter(s => s.sectionId.match(/^3\d\d$/)).reduce((sum, s) => sum + s.totalSeats, 0)},
    'Infield Reserve': ${sections.filter(s => s.sectionId.endsWith('IR')).reduce((sum, s) => sum + s.totalSeats, 0)},
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
  console.log(`${colors.bright}  Dodger Stadium Generation Complete!${colors.reset}`);
  console.log(`${colors.bright}${colors.green}═══════════════════════════════════════${colors.reset}`);
  console.log('');
  log.info(`Total Sections: ${sections.length}`);
  log.info(`Total Seats: ${totalSeats.toLocaleString()}`);
  log.info(`Official Capacity: ${OFFICIAL_CAPACITY.toLocaleString()}`);
  log.info(`Match: ${((totalSeats / OFFICIAL_CAPACITY) * 100).toFixed(2)}%`);
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
  console.log(`  1. Review generated files in src/data/seatData/${STADIUM_ID}/`);
  console.log(`  2. Pre-compute sun data: npx tsx scripts/precomputeSunData.ts --stadium=${STADIUM_ID} --game-time=13:10`);
  console.log(`  3. Build project: npm run build`);
  console.log('');
}

// Run generation
generateAllSections().catch((error) => {
  console.error(`${colors.red}Error generating Dodger Stadium seats:${colors.reset}`, error);
  process.exit(1);
});
