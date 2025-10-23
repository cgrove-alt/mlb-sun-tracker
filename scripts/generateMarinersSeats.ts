#!/usr/bin/env ts-node

/**
 * T-Mobile Park Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 47,929 seats (from stadiums.ts configuration)
 * - Sections: ~140 sections across 5 main levels
 * - Levels: 100 (Main), 200 (Club), 300 (Upper), Bleachers, Suites
 * - Bleachers: 180-195 (outfield)
 * - Orientation: 318° (home to center field, NW)
 * - Retractable roof (partial coverage)
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateMarinersSeats.ts
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

// T-Mobile Park base parameters
const STADIUM_ID = 'mariners';
const STADIUM_NAME = 'T-Mobile Park';
const ORIENTATION = 318; // degrees (NW orientation)
const OFFICIAL_CAPACITY = 47929; // From stadiums.ts

// Per-level estimated capacity
const TARGET_100_LEVEL = 20634; // Main concourse
const TARGET_200_LEVEL = 4585;  // Club/Terrace level
const TARGET_300_LEVEL = 15955; // Upper concourse/view level
const TARGET_BLEACHERS = 3706;  // Outfield bleachers
const TARGET_SUITES = 1945;     // Suite level
const TARGET_MISC = 2104;       // Diamond Club and other premium

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionNum: number, level: string): number {
  const centerField = ORIENTATION - 180; // 138°

  if (level === '100') {
    // 100 level: 102-151
    if (sectionNum >= 102 && sectionNum <= 151) {
      const position = sectionNum - 102;
      return centerField + 65 - (position * 2.65); // ~130° arc
    }
    // Diamond Club sections
    if (sectionNum === 25 || sectionNum === 35) {
      return centerField; // Behind home plate
    }
  } else if (level === '200') {
    // 200 level club: 211-226 (3B), 233-249 (1B)
    if (sectionNum >= 211 && sectionNum <= 226) {
      const position = sectionNum - 211;
      return centerField + 40 - (position * 2.0); // 3B side
    }
    if (sectionNum >= 233 && sectionNum <= 249) {
      const position = sectionNum - 233;
      return centerField - 10 - (position * 2.0); // 1B side
    }
  } else if (level === '300') {
    // 300 level upper: 306-347
    if (sectionNum >= 306 && sectionNum <= 347) {
      const position = sectionNum - 306;
      return centerField + 55 - (position * 2.68); // ~110° arc
    }
  } else if (level === 'bleacher') {
    // Bleachers: 180-195
    if (sectionNum >= 180 && sectionNum <= 187) {
      const position = sectionNum - 180;
      return centerField + 80 - (position * 3.0); // LF bleachers
    }
    if (sectionNum >= 188 && sectionNum <= 195) {
      const position = sectionNum - 188;
      return centerField - 60 - (position * 3.0); // RF bleachers
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionNum: number): number {
  if (level === 'bleacher') {
    // Bleachers: different rows for LF vs RF
    if (sectionNum >= 180 && sectionNum <= 187) return 12; // LF bleachers
    if (sectionNum >= 188 && sectionNum <= 195) return 17; // RF bleachers
    return 12;
  }

  if (level === 'suite') {
    // Suites: smaller, exclusive
    return 3;
  }

  if (level === 'diamond-club') {
    // Diamond Club: premium seating
    return 10;
  }

  if (level === '100') {
    // Main concourse: most have 41 rows
    // Some start at row 4 or 5 (behind dugouts)
    if (sectionNum >= 121 && sectionNum <= 124) return 37; // Mariners dugout (start at row 5)
    if (sectionNum >= 136 && sectionNum <= 139) return 37; // Visitors dugout (start at row 5)
    if (sectionNum >= 115 && sectionNum <= 146) return 41; // Behind netting
    return 41; // Default 41 rows
  }

  if (level === '200') {
    // Club/Terrace level: 12 rows all sections
    return 12;
  }

  if (level === '300') {
    // Upper concourse/view level: 25 rows all sections
    return 25;
  }

  return 20;
}

// Determine seats per row
function getSeatsPerRow(level: string, sectionNum: number): number {
  if (level === 'bleacher') {
    // Bleachers: bench-style
    return 16; // Reduced from 24 to hit target
  }

  if (level === 'suite') {
    // Suites: exclusive, smaller
    return 12;
  }

  if (level === 'diamond-club') {
    // Diamond Club: premium seating
    return 18;
  }

  if (level === '100') {
    // Main concourse - varying by location
    if (sectionNum >= 125 && sectionNum <= 135) return 12; // Behind home plate
    if (sectionNum >= 115 && sectionNum <= 124) return 10; // 3B side
    if (sectionNum >= 130 && sectionNum <= 151) return 11; // Center/1B/RF (increased to add ~900 seats)
    if (sectionNum >= 136 && sectionNum <= 146) return 10; // 1B side (overlapped by above)
    if (sectionNum >= 102 && sectionNum <= 114) return 9; // LF sections
    if (sectionNum >= 147 && sectionNum <= 151) return 10; // RF sections (overlapped by above)
    return 10; // default
  }

  if (level === '200') {
    // Club/Terrace level
    if (sectionNum >= 221 && sectionNum <= 226) return 13; // Center sections 3B (reduced from 14)
    if (sectionNum >= 238 && sectionNum <= 244) return 13; // Center sections 1B (reduced from 14)
    return 11; // Corner/end sections (reduced from 12)
  }

  if (level === '300') {
    // Upper concourse - varying by location
    if (sectionNum >= 320 && sectionNum <= 335) return 17; // Center sections (keep same)
    if (sectionNum >= 306 && sectionNum <= 319) return 14; // RF corner/end (keep same)
    if (sectionNum >= 336 && sectionNum <= 347) return 14; // LF corner/end (keep same)
    return 15;
  }

  return 12;
}

// Determine distance from home plate
function getDistance(level: string, sectionNum?: number): number {
  if (level === 'bleacher') return 330; // feet (outfield bleachers)
  if (level === 'suite') return 90; // feet (suites close to field)
  if (level === 'diamond-club') return 55; // feet (premium behind home plate)
  if (level === '100') return 75; // feet (main concourse)
  if (level === '200') return 120; // feet (club level)
  if (level === '300') return 220; // feet (upper level, far back)
  return 120;
}

// Determine base elevation
function getElevation(level: string): number {
  if (level === 'bleacher') return 3; // bleachers slightly elevated
  if (level === 'suite') return 25; // suites on various levels
  if (level === 'diamond-club') return 0; // at field level
  if (level === '100') return 0; // main concourse
  if (level === '200') return 35; // club level
  if (level === '300') return 75; // upper level (high up)
  return 0;
}

// Determine if section is covered (retractable roof with overhangs)
function isCovered(level: string, sectionNum: number, rowNum: number): boolean {
  // T-Mobile Park has retractable roof with significant overhangs when roof is open

  if (level === 'suite') {
    return true; // Suites are enclosed/covered
  }

  if (level === 'diamond-club') {
    return false; // Diamond Club exposed to elements
  }

  if (level === 'bleacher') {
    return false; // Bleachers fully exposed
  }

  if (level === '100') {
    // Main concourse: overhang coverage at row 35+
    if (sectionNum >= 116 && sectionNum <= 144 && rowNum >= 35) return true; // Rows 35+ under overhang
    if (sectionNum >= 127 && sectionNum <= 133 && rowNum >= 30) return true; // Below press box
    return false;
  }

  if (level === '200') {
    // Club level: last 2-3 rows below overhang
    if (rowNum >= 10) return true; // Last 2-3 rows
    return false;
  }

  if (level === '300') {
    // Upper level: significant coverage
    if (sectionNum >= 326 && sectionNum <= 335) return true; // Center sections always covered
    if (sectionNum >= 333 && sectionNum <= 344 && rowNum >= 10) return true; // Good coverage
    if (rowNum >= 15) return true; // Upper rows covered by roof
    return false;
  }

  return false;
}

// Determine level string from level
function getLevelString(level: string): 'field' | 'lower' | 'club' | 'upper' | 'suite' {
  if (level === 'suite') return 'suite';
  if (level === 'bleacher') return 'field'; // Bleachers at field level
  if (level === 'diamond-club') return 'field'; // Diamond Club at field level
  if (level === '100') return 'lower';
  if (level === '200') return 'club';
  if (level === '300') return 'upper';
  return 'lower';
}

// Create section configuration with all required parameters
function createSectionConfig(sectionId: string, level: string): SeatGenerationConfig {
  const sectionNum = parseInt(sectionId, 10);

  // Generate section name
  let sectionName: string;
  if (level === 'bleacher') {
    sectionName = `Bleachers ${sectionId}`;
  } else if (level === 'suite') {
    sectionName = `Suite ${sectionId}`;
  } else if (level === 'diamond-club') {
    sectionName = `Diamond Club ${sectionId}`;
  } else if (level === '200') {
    sectionName = `Club ${sectionId}`;
  } else if (level === '300') {
    sectionName = `Upper ${sectionId}`;
  } else {
    sectionName = `Section ${sectionId}`;
  }

  const rowCount = getRowCount(level, sectionNum);
  const seatsPerRow = getSeatsPerRow(level, sectionNum);
  const distance = getDistance(level, sectionNum);
  const baseElevation = getElevation(level);
  const baseAngle = getBaseAngle(sectionNum, level);

  // Generate rows array
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    const rowLabel = `${i + 1}`; // All sections use numeric row labels
    rows.push({
      rowLabel,
      seatCount: seatsPerRow,
      rowNumber: i,
    });
  }

  // Determine angle span based on level
  let angleSpan: number;
  if (level === 'bleacher') {
    angleSpan = 2.5;
  } else if (level === '100') {
    angleSpan = 2.0;
  } else if (level === '200') {
    angleSpan = 1.8;
  } else if (level === '300') {
    angleSpan = 2.2;
  } else if (level === 'diamond-club') {
    angleSpan = 1.5;
  } else {
    angleSpan = 2.0;
  }

  return {
    stadiumId: STADIUM_ID,
    sectionId,
    sectionName,
    baseAngle,
    angleSpan,
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
  const allSections: SectionSeatingData[] = [];
  let totalSeats = 0;

  // Create output directory
  const outputDir = path.join(process.cwd(), 'src', 'data', 'seatData', STADIUM_ID, 'sections');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Statistics tracking
  let stats = {
    level100: 0,
    level200: 0,
    level300: 0,
    bleachers: 0,
    suites: 0,
    diamondClub: 0,
    sectionCount100: 0,
    sectionCount200: 0,
    sectionCount300: 0,
    sectionCountBleachers: 0,
    sectionCountSuites: 0,
    sectionCountDiamondClub: 0,
  };

  // Generate 100 Level sections (102-151)
  log.step('Generating 100 Level (Main Concourse) sections...');
  for (let sectionNum = 102; sectionNum <= 151; sectionNum++) {
    const config = createSectionConfig(`${sectionNum}`, '100');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.level100 += section.totalSeats;
    stats.sectionCount100++;

    // Export section file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`100 Level complete: ${stats.sectionCount100} sections, ${stats.level100} seats (target: ${TARGET_100_LEVEL})`);

  // Generate Diamond Club sections (25, 35)
  log.step('Generating Diamond Club sections...');
  for (const sectionNum of [25, 35]) {
    const config = createSectionConfig(`${sectionNum}`, 'diamond-club');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.diamondClub += section.totalSeats;
    stats.sectionCountDiamondClub++;

    // Export section file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Diamond Club complete: ${stats.sectionCountDiamondClub} sections, ${stats.diamondClub} seats`);

  // Generate 200 Level sections (211-226, 233-249)
  log.step('Generating 200 Level (Club/Terrace) sections...');
  const level200Sections = [
    ...Array.from({ length: 16 }, (_, i) => 211 + i), // 211-226 (3B side)
    ...Array.from({ length: 17 }, (_, i) => 233 + i), // 233-249 (1B side)
  ];

  for (const sectionNum of level200Sections) {
    const config = createSectionConfig(`${sectionNum}`, '200');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.level200 += section.totalSeats;
    stats.sectionCount200++;

    // Export section file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`200 Level complete: ${stats.sectionCount200} sections, ${stats.level200} seats (target: ${TARGET_200_LEVEL})`);

  // Generate 300 Level sections (306-347)
  log.step('Generating 300 Level (Upper Concourse) sections...');
  for (let sectionNum = 306; sectionNum <= 347; sectionNum++) {
    const config = createSectionConfig(`${sectionNum}`, '300');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.level300 += section.totalSeats;
    stats.sectionCount300++;

    // Export section file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`300 Level complete: ${stats.sectionCount300} sections, ${stats.level300} seats (target: ${TARGET_300_LEVEL})`);

  // Generate Bleacher sections (180-195)
  log.step('Generating Bleacher sections...');
  for (let sectionNum = 180; sectionNum <= 195; sectionNum++) {
    const config = createSectionConfig(`${sectionNum}`, 'bleacher');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.bleachers += section.totalSeats;
    stats.sectionCountBleachers++;

    // Export section file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Bleachers complete: ${stats.sectionCountBleachers} sections, ${stats.bleachers} seats (target: ${TARGET_BLEACHERS})`);

  // Generate Suite sections (distributed around stadium)
  log.step('Generating Suite sections...');
  const suiteStart = 501;
  const suiteEnd = 558; // 58 suites total (changed from 201-258 to avoid overlap with 200 level)
  for (let sectionNum = suiteStart; sectionNum <= suiteEnd; sectionNum++) {
    const config = createSectionConfig(`${sectionNum}`, 'suite');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.suites += section.totalSeats;
    stats.sectionCountSuites++;

    // Export section file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Suites complete: ${stats.sectionCountSuites} sections, ${stats.suites} seats (target: ${TARGET_SUITES})`);

  // Export section files
  const totalSections = stats.sectionCount100 + stats.sectionCount200 + stats.sectionCount300 + stats.sectionCountBleachers + stats.sectionCountDiamondClub + stats.sectionCountSuites;
  log.success(`Exported ${totalSections} section files to ${outputDir}`);

  // Create metadata file
  log.step('Creating stadium metadata...');
  const metadata = {
    stadiumId: STADIUM_ID,
    stadiumName: STADIUM_NAME,
    generatedAt: new Date().toISOString(),
    version: '1.0.0',
    dataSource: 'Generated from stadium seating charts and capacity data',
    totalSections: totalSections,
    lastValidated: new Date().toISOString(),
  };

  const stats_export = {
    totalSeats: totalSeats,
    totalSections: totalSections,
    totalRows: allSections.reduce((sum, s) => sum + s.rows.length, 0),
    levels: {
      '100 Level (Main Concourse)': stats.level100,
      '200 Level (Club/Terrace)': stats.level200,
      '300 Level (Upper Concourse)': stats.level300,
      'Bleachers': stats.bleachers,
      'Diamond Club': stats.diamondClub,
      'Suites': stats.suites,
    },
    seatDistribution: {
      standard: Math.floor(totalSeats * 0.90),
      aisle: Math.floor(totalSeats * 0.07),
      wheelchair: Math.floor(totalSeats * 0.03),
    },
    coveredSeats: allSections.reduce((sum, s) => sum + (s.rows[0]?.seats[0]?.covered ? s.totalSeats : 0), 0),
  };

  const metadataPath = path.join(process.cwd(), 'src', 'data', 'seatData', STADIUM_ID, 'metadata.ts');
  const metadataContent = `/**
 * ${STADIUM_NAME} - Stadium Metadata
 * Generated: ${metadata.generatedAt}
 */

import type { SeatDataMetadata, StadiumSeatingStats } from '@/types/seat';

export const metadata: SeatDataMetadata = ${JSON.stringify(metadata, null, 2)};

export const stats: StadiumSeatingStats = ${JSON.stringify(stats_export, null, 2)};
`;

  fs.writeFileSync(metadataPath, metadataContent);
  log.success(`Created metadata file: ${metadataPath}`);

  // Summary
  console.log('');
  console.log(`${colors.bright}${colors.green}${'='.repeat(39)}${colors.reset}`);
  console.log(`${colors.bright}  ${STADIUM_NAME} Generation Complete!${colors.reset}`);
  console.log(`${colors.bright}${colors.green}${'='.repeat(39)}${colors.reset}`);
  console.log('');
  log.info(`Total Sections: ${totalSections}`);
  log.info(`Total Seats: ${totalSeats.toLocaleString()}`);
  log.info(`Official Capacity: ${OFFICIAL_CAPACITY.toLocaleString()}`);
  console.log('');
  log.info(`Per-Level Breakdown:`);
  log.info(`  100: ${stats.level100.toLocaleString()} (target: ${TARGET_100_LEVEL.toLocaleString()}, ${((stats.level100 / TARGET_100_LEVEL) * 100).toFixed(2)}%)`);
  log.info(`  200: ${stats.level200.toLocaleString()} (target: ${TARGET_200_LEVEL.toLocaleString()}, ${((stats.level200 / TARGET_200_LEVEL) * 100).toFixed(2)}%)`);
  log.info(`  300: ${stats.level300.toLocaleString()} (target: ${TARGET_300_LEVEL.toLocaleString()}, ${((stats.level300 / TARGET_300_LEVEL) * 100).toFixed(2)}%)`);
  log.info(`  Bleachers: ${stats.bleachers.toLocaleString()} (target: ${TARGET_BLEACHERS.toLocaleString()}, ${((stats.bleachers / TARGET_BLEACHERS) * 100).toFixed(2)}%)`);
  log.info(`  Suites: ${stats.suites.toLocaleString()} (target: ${TARGET_SUITES.toLocaleString()}, ${((stats.suites / TARGET_SUITES) * 100).toFixed(2)}%)`);
  log.info(`  Diamond Club: ${stats.diamondClub.toLocaleString()}`);
  const diff = totalSeats - OFFICIAL_CAPACITY;
  const diffPercent = ((totalSeats / OFFICIAL_CAPACITY) * 100).toFixed(2);
  log.info(`Match: ${diffPercent}% (${diff >= 0 ? '+' : ''}${diff} seats)`);
  console.log('');
  log.info(`Output Directory: ${outputDir}`);
  log.info(`Files Created: ${totalSections + 1} (${totalSections} sections + metadata)`);
  console.log('');

  if (Math.abs(diff) > OFFICIAL_CAPACITY * 0.01) {
    console.log(`${colors.yellow}⚠️  Warning: Seat count differs by ${Math.abs(diff)} seats (${Math.abs(100 - parseFloat(diffPercent)).toFixed(3)}%)${colors.reset}`);
    console.log(`${colors.yellow}   Target: Exact match (${OFFICIAL_CAPACITY.toLocaleString()} seats)${colors.reset}`);
    console.log(`${colors.yellow}   Adjust getSeatsPerRow() or getRowCount() to fine-tune capacity${colors.reset}`);
    console.log('');
  }

  log.step('Next steps:');
  console.log('  1. Review generated files in src/data/seatData/mariners/');
  console.log('  2. If seat count is off, adjust getSeatsPerRow() or getRowCount() and regenerate');
  console.log('  3. Pre-compute sun data: npx tsx scripts/precomputeSunData.ts --stadium=mariners --game-time=13:10');
  console.log('  4. Build project: npm run build');
  console.log('');
}

// Run generation
generateAllSections().catch(console.error);
