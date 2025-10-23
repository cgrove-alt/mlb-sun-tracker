#!/usr/bin/env ts-node

/**
 * loanDepot park Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 37,446 seats (from stadiums.ts configuration)
 * - Sections: ~130 sections across 3 main levels + suites
 * - Levels: Promenade (Field), Legends (Club), Vista (Upper), Suites
 * - Orientation: 40° (home to center field, NE)
 * - Retractable roof (full coverage)
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateMarlinsSeats.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import type { SectionSeatingData, StadiumSeatingStats } from '../src/types/seat';
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
  warning: (msg: string) => console.log(`${colors.yellow}⚠️${colors.reset}  ${msg}`),
};

// loanDepot park base parameters
const STADIUM_ID = 'marlins';
const STADIUM_NAME = 'loanDepot park';
const ORIENTATION = 40; // degrees (NE orientation)
const OFFICIAL_CAPACITY = 37446; // From stadiums.ts

// Per-level estimated capacity
const TARGET_PROMENADE = 16000; // Field/Lower bowl
const TARGET_LEGENDS = 8000;    // Club/Mid level
const TARGET_VISTA = 13500;     // Upper deck
// Total: 37,500 (allowing for small adjustment to hit exact capacity)

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionNum: number, level: string): number {
  const centerField = ORIENTATION - 180; // -140° (220° adjusted)

  if (level === 'promenade') {
    // Promenade: 1-40 (main bowl), 134-141 (bullpen)
    if (sectionNum >= 1 && sectionNum <= 40) {
      const position = sectionNum - 1;
      return centerField + 70 - (position * 3.5); // ~140° arc
    }
    // Bullpen sections in outfield
    if (sectionNum >= 134 && sectionNum <= 141) {
      const position = sectionNum - 134;
      return centerField + 85 - (position * 3.0); // LF outfield
    }
  } else if (level === 'legends') {
    // Legends: 201-228
    if (sectionNum >= 201 && sectionNum <= 228) {
      const position = sectionNum - 201;
      return centerField + 60 - (position * 4.4); // ~120° arc
    }
  } else if (level === 'vista') {
    // Vista: 302-327
    if (sectionNum >= 302 && sectionNum <= 327) {
      const position = sectionNum - 302;
      return centerField + 55 - (position * 4.2); // ~110° arc
    }
  } else if (level === 'suite') {
    // Suites S15-S42: distributed around stadium
    if (sectionNum >= 15 && sectionNum <= 42) {
      const position = sectionNum - 15;
      return centerField + 50 - (position * 3.7); // ~100° arc
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionNum: number): number {
  if (level === 'promenade') {
    // Dugout Club sections (AA-DD rows)
    if ((sectionNum >= 1 && sectionNum <= 3) || (sectionNum >= 9 && sectionNum <= 11)) {
      return 4; // AA, BB, CC, DD
    }
    // Diamond Club sections
    if (sectionNum >= 4 && sectionNum <= 8) {
      return 8; // Premium seating (increased from 6)
    }
    // Bullpen sections
    if (sectionNum >= 134 && sectionNum <= 141) {
      return 18; // Bleacher-style (increased from 12)
    }
    // Regular promenade sections
    return 24; // Reduced from 30, was 20
  }

  if (level === 'legends') {
    // Club level: consistent rows
    return 16; // Increased from 15 to add ~450 seats
  }

  if (level === 'vista') {
    // Upper deck: more rows
    return 23; // Increased from 22 to add ~520 seats
  }

  if (level === 'suite') {
    // Suites: small exclusive areas
    return 2; // Reduced from 3
  }

  return 20; // fallback
}

// Determine seats per row
function getSeatsPerRow(level: string, sectionNum: number): number {
  if (level === 'promenade') {
    // Dugout Club sections (wider seats, fewer per row)
    if ((sectionNum >= 1 && sectionNum <= 3) || (sectionNum >= 9 && sectionNum <= 11)) {
      return 22; // Increased from 18
    }
    // Diamond Club sections
    if (sectionNum >= 4 && sectionNum <= 8) {
      return 24; // Increased from 20
    }
    // Clubhouse Box sections
    if ((sectionNum >= 8 && sectionNum <= 10) || (sectionNum >= 19 && sectionNum <= 21)) {
      return 18; // Reduced from 20, was 16
    }
    // Home Run Porch sections
    if (sectionNum >= 38 && sectionNum <= 40) {
      return 14; // Reduced from 16, was 14
    }
    // Bullpen sections (bench-style)
    if (sectionNum >= 134 && sectionNum <= 141) {
      return 18; // Reduced from 22, was 18
    }
    // Behind home plate (sections 11-30)
    if (sectionNum >= 11 && sectionNum <= 20) {
      return 18; // Increase half back (+120 seats)
    }
    if (sectionNum >= 21 && sectionNum <= 30) {
      return 17; // Keep reduced
    }
    // Corners and ends
    return 16; // Keep same
  }

  if (level === 'legends') {
    // Club level - premium spacing
    if (sectionNum >= 210 && sectionNum <= 215) {
      return 20; // Increase half back (+96 seats)
    }
    if (sectionNum >= 216 && sectionNum <= 220) {
      return 19; // Keep reduced
    }
    return 16; // Keep same
  }

  if (level === 'vista') {
    // Upper deck - more seats per row (further back)
    if (sectionNum >= 310 && sectionNum <= 320) {
      return 24; // Reduced from 26, was 22
    }
    return 20; // Reduced from 22, was 18
  }

  if (level === 'suite') {
    // Suites: exclusive, fewer seats
    return 16; // Reduced from 18, was 16
  }

  return 18; // fallback
}

// Determine distance from home plate
function getDistance(level: string, sectionNum?: number): number {
  if (level === 'promenade') {
    // Bullpen sections far out
    if (sectionNum && sectionNum >= 134 && sectionNum <= 141) return 320;
    // Diamond Club closest
    if (sectionNum && sectionNum >= 4 && sectionNum <= 8) return 50;
    // Dugout Club
    if (sectionNum && ((sectionNum >= 1 && sectionNum <= 3) || (sectionNum >= 9 && sectionNum <= 11))) return 60;
    // Regular promenade
    return 75;
  }
  if (level === 'legends') return 110; // Club level elevated
  if (level === 'vista') return 200; // Upper deck far back
  if (level === 'suite') return 95; // Suites on club level
  return 100;
}

// Determine base elevation
function getElevation(level: string): number {
  if (level === 'promenade') return 0; // Field level
  if (level === 'legends') return 30; // Club level
  if (level === 'vista') return 65; // Upper deck
  if (level === 'suite') return 30; // Suite level (same as club)
  return 0;
}

// Determine if section is covered (retractable roof scenario)
function isCovered(level: string, sectionNum: number, rowNum: number): boolean {
  // loanDepot park has retractable roof with overhang when open

  if (level === 'suite') {
    return true; // Suites are enclosed
  }

  if (level === 'promenade') {
    // Right field sections 34-40 have overhang coverage in back rows
    if (sectionNum >= 34 && sectionNum <= 40 && rowNum >= 15) return true;
    // Bullpen sections not covered
    if (sectionNum >= 134 && sectionNum <= 141) return false;
    return false;
  }

  if (level === 'legends') {
    // Club level: some back rows under overhang
    if (rowNum >= 10) return true;
    return false;
  }

  if (level === 'vista') {
    // Upper deck: sections 304-309 (1st base line) covered
    if (sectionNum >= 304 && sectionNum <= 309) return true;
    // Other upper sections: back rows covered
    if (rowNum >= 15) return true;
    return false;
  }

  return false;
}

// Determine level string from level
function getLevelString(level: string): 'field' | 'lower' | 'club' | 'upper' | 'suite' {
  if (level === 'suite') return 'suite';
  if (level === 'promenade') return 'lower'; // Field/lower bowl
  if (level === 'legends') return 'club'; // Club level
  if (level === 'vista') return 'upper'; // Upper deck
  return 'lower';
}

// Create section configuration with all required parameters
function createSectionConfig(sectionId: string, level: string): SeatGenerationConfig {
  const sectionNum = parseInt(sectionId.replace(/[^0-9]/g, ''), 10);

  // Generate section name
  let sectionName: string;
  if (level === 'promenade') {
    if ((sectionNum >= 1 && sectionNum <= 3) || (sectionNum >= 9 && sectionNum <= 11)) {
      sectionName = `Dugout Club ${sectionId}`;
    } else if (sectionNum >= 4 && sectionNum <= 8) {
      sectionName = `Diamond Club ${sectionId}`;
    } else if (sectionNum >= 134 && sectionNum <= 141) {
      sectionName = `Bullpen ${sectionId}`;
    } else {
      sectionName = `Promenade ${sectionId}`;
    }
  } else if (level === 'legends') {
    sectionName = `Legends ${sectionId}`;
  } else if (level === 'vista') {
    sectionName = `Vista ${sectionId}`;
  } else if (level === 'suite') {
    sectionName = `Suite ${sectionId}`;
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
    // Dugout Club uses AA, BB, CC, DD
    let rowLabel: string;
    if (level === 'promenade' && ((sectionNum >= 1 && sectionNum <= 3) || (sectionNum >= 9 && sectionNum <= 11))) {
      const letters = ['AA', 'BB', 'CC', 'DD'];
      rowLabel = letters[i] || `${i + 1}`;
    } else {
      rowLabel = `${i + 1}`;
    }

    rows.push({
      rowLabel,
      seatCount: seatsPerRow,
      rowNumber: i,
    });
  }

  // Determine angle span based on level
  let angleSpan: number;
  if (level === 'promenade') {
    if (sectionNum >= 134 && sectionNum <= 141) {
      angleSpan = 2.8; // Bullpen sections wider
    } else {
      angleSpan = 3.0; // Regular promenade
    }
  } else if (level === 'legends') {
    angleSpan = 3.8;
  } else if (level === 'vista') {
    angleSpan = 3.6;
  } else if (level === 'suite') {
    angleSpan = 3.2;
  } else {
    angleSpan = 3.0;
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
    promenade: 0,
    legends: 0,
    vista: 0,
    suites: 0,
  };

  log.step(`Generating sections for ${STADIUM_NAME}...`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats`);

  // Generate Promenade Level (Field/Lower): Sections 1-40
  log.step('Generating Promenade Level (1-40)...');
  for (let sectionNum = 1; sectionNum <= 40; sectionNum++) {
    const config = createSectionConfig(`${sectionNum}`, 'promenade');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.promenade += section.totalSeats;

    // Export section file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Promenade 1-40: ${stats.promenade.toLocaleString()} seats (40 sections)`);

  // Generate Promenade Bullpen Sections: 134-141
  log.step('Generating Bullpen Sections (134-141)...');
  const bullpenStart = totalSeats;
  for (let sectionNum = 134; sectionNum <= 141; sectionNum++) {
    const config = createSectionConfig(`${sectionNum}`, 'promenade');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.promenade += section.totalSeats;

    // Export section file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Bullpen 134-141: ${(totalSeats - bullpenStart).toLocaleString()} seats (8 sections)`);
  log.info(`Total Promenade: ${stats.promenade.toLocaleString()} seats (target: ${TARGET_PROMENADE.toLocaleString()})`);

  // Generate Legends Level (Club): Sections 201-228
  log.step('Generating Legends Level (201-228)...');
  for (let sectionNum = 201; sectionNum <= 228; sectionNum++) {
    const config = createSectionConfig(`${sectionNum}`, 'legends');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.legends += section.totalSeats;

    // Export section file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Legends 201-228: ${stats.legends.toLocaleString()} seats (28 sections)`);
  log.info(`Target: ${TARGET_LEGENDS.toLocaleString()} seats`);

  // Generate Vista Level (Upper): Sections 302-327
  log.step('Generating Vista Level (302-327)...');
  for (let sectionNum = 302; sectionNum <= 327; sectionNum++) {
    const config = createSectionConfig(`${sectionNum}`, 'vista');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.vista += section.totalSeats;

    // Export section file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Vista 302-327: ${stats.vista.toLocaleString()} seats (26 sections)`);
  log.info(`Target: ${TARGET_VISTA.toLocaleString()} seats`);

  // Generate Suite Level: S15-S42
  log.step('Generating Suites (S15-S42)...');
  for (let sectionNum = 15; sectionNum <= 42; sectionNum++) {
    const config = createSectionConfig(`S${sectionNum}`, 'suite');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.suites += section.totalSeats;

    // Export section file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `S${sectionNum}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Suites S15-S42: ${stats.suites.toLocaleString()} seats (28 sections)`);

  // Final statistics
  const totalSections = allSections.length;
  const accuracy = ((totalSeats / OFFICIAL_CAPACITY) * 100).toFixed(2);
  const difference = totalSeats - OFFICIAL_CAPACITY;
  const diffSign = difference >= 0 ? '+' : '';

  console.log('');
  log.success(`Generation complete!`);
  log.info(`Total sections: ${totalSections}`);
  log.info(`Total seats: ${totalSeats.toLocaleString()} (${diffSign}${difference}, ${accuracy}%)`);
  log.info(`Target: ${OFFICIAL_CAPACITY.toLocaleString()} seats`);

  console.log('');
  log.info(`Per-level breakdown:`);
  log.info(`  Promenade: ${stats.promenade.toLocaleString()} seats (48 sections)`);
  log.info(`  Legends:   ${stats.legends.toLocaleString()} seats (28 sections)`);
  log.info(`  Vista:     ${stats.vista.toLocaleString()} seats (26 sections)`);
  log.info(`  Suites:    ${stats.suites.toLocaleString()} seats (28 sections)`);

  // Create metadata file
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
  totalSections: ${totalSections},
  lastValidated: '${new Date().toISOString()}',
};

export const stats: StadiumSeatingStats = {
  totalSeats: ${totalSeats},
  totalSections: ${totalSections},
  totalRows: ${allSections.reduce((sum, s) => sum + s.totalRows, 0)},
  levels: {
    'Promenade Level (Field/Lower)': ${stats.promenade},
    'Legends Level (Club)': ${stats.legends},
    'Vista Level (Upper)': ${stats.vista},
    'Suites': ${stats.suites},
  },
  seatDistribution: {
    standard: ${Math.floor(totalSeats * 0.88)},
    aisle: ${Math.floor(totalSeats * 0.08)},
    wheelchair: ${Math.floor(totalSeats * 0.04)},
  },
  coveredSeats: ${Math.floor(totalSeats * 0.25)},
};
`;

  fs.writeFileSync(metadataPath, metadataContent, 'utf-8');
  log.success(`Metadata file created: metadata.ts`);

  console.log('');
  if (Math.abs(difference) <= 100) {
    log.success(`Capacity accuracy excellent: ${accuracy}% (${diffSign}${difference} seats)`);
  } else {
    log.warning(`Capacity needs adjustment: ${accuracy}% (${diffSign}${difference} seats)`);
    log.info(`Consider tuning getSeatsPerRow() and getRowCount() functions`);
  }
}

// Execute
generateAllSections().catch((error) => {
  console.error(`${colors.red}Error:${colors.reset}`, error);
  process.exit(1);
});
