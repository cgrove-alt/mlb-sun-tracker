#!/usr/bin/env ts-node

/**
 * Target Field Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 38,544 seats (from stadiums.ts - 2019-present)
 * - Sections: ~134 sections across 4 main levels + Legends Club
 * - Levels: Field (1-17), 100 (101-140), 200 (201-230), 300 (301-330, skip 328), Legends (A-R)
 * - Orientation: 0° (Due North)
 * - Open roof, opened April 12, 2010
 * - Unique features: Downtown location, limestone facade, compact 8-acre footprint
 *
 * Created: 2025-10-23
 * Usage: npx tsx scripts/generateTwinsSeats.ts
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
  error: (msg: string) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
};

// Target Field base parameters
const STADIUM_ID = 'twins';
const STADIUM_NAME = 'Target Field';
const ORIENTATION = 0; // degrees (Due North)
const OFFICIAL_CAPACITY = 38544; // From stadiums.ts

// Per-level estimated capacity (2019-present configuration)
const TARGET_FIELD = 4000;        // Field Level 1-17 (~17 sections)
const TARGET_100 = 19500;         // 100-Level 101-140 (~40 sections)
const TARGET_200 = 3500;          // 200-Level 201-230 (~30 sections)
const TARGET_300 = 8500;          // 300-Level 301-330 skip 328 (~29 sections)
const TARGET_LEGENDS = 3044;      // Legends Club A-R (~18 sections)
// Total: 38,544

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string, level: string): number {
  const centerField = ORIENTATION - 180; // -180° (180° adjusted)

  if (level === 'Field') {
    // Field Level: 1-17 (17 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 1 && sectionNum <= 17) {
      const position = sectionNum - 1;
      // Infield arc: ~85° span
      return centerField + 42.5 - (position * 5.3); // -137.5° to 47.5°
    }
  } else if (level === '100') {
    // 100-Level: 101-140 (40 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 101 && sectionNum <= 140) {
      const position = sectionNum - 101;
      // Full wrap: ~230° arc
      return centerField + 115 - (position * 5.9);
    }
  } else if (level === '200') {
    // 200-Level: 201-230 (30 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 201 && sectionNum <= 230) {
      const position = sectionNum - 201;
      // Mid-level wrap: ~210° arc
      return centerField + 105 - (position * 7.0);
    }
  } else if (level === '300') {
    // 300-Level: 301-330 except 328 (~29 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 301 && sectionNum <= 330) {
      const position = sectionNum - 301;
      // Upper deck wrap: ~210° arc
      return centerField + 105 - (position * 7.2);
    }
  } else if (level === 'Legends') {
    // Legends Club: A-R (18 sections)
    const sectionLetter = sectionId.charCodeAt(0) - 65; // A=0, B=1, etc.
    // Third level infield: ~90° arc
    return centerField + 45 - (sectionLetter * 5.0);
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionId: string): number {
  if (level === 'Field') {
    const sectionNum = parseInt(sectionId, 10);
    // Champions Club (7-10): 10 rows
    if (sectionNum >= 7 && sectionNum <= 10) return 10;
    // Other field sections: 13 rows
    return 13;
  }

  if (level === '100') {
    const sectionNum = parseInt(sectionId, 10);
    // Center sections (110-117): 28 rows
    if (sectionNum >= 110 && sectionNum <= 117) return 28;
    // End sections (104-109, 118-122): 24 rows
    if ((sectionNum >= 104 && sectionNum <= 109) || (sectionNum >= 118 && sectionNum <= 122)) return 24;
    // Corner sections: 22 rows
    return 22;
  }

  if (level === '200') {
    const sectionNum = parseInt(sectionId, 10);
    // Center sections (210-218): 6 rows
    if (sectionNum >= 210 && sectionNum <= 218) return 6;
    // End sections (206-209, 219-223): 5 rows
    if ((sectionNum >= 206 && sectionNum <= 209) || (sectionNum >= 219 && sectionNum <= 223)) return 5;
    // Corner sections: 8 rows
    return 8;
  }

  if (level === '300') return 14; // 300-Level: Consistent 14 rows

  if (level === 'Legends') return 9; // Legends Club: 9 rows (premium)

  return 15; // fallback
}

// Determine seats per row
function getSeatsPerRow(level: string, sectionId: string): number {
  if (level === 'Field') {
    const sectionNum = parseInt(sectionId, 10);
    // Champions Club (7-10): Premium, fewer seats
    if (sectionNum >= 7 && sectionNum <= 10) return 18;
    // Dugout boxes (1-6, 11-14): Close to field
    if ((sectionNum >= 1 && sectionNum <= 6) || (sectionNum >= 11 && sectionNum <= 14)) return 20;
    // End sections: Smaller
    return 18;
  }

  if (level === '100') {
    const sectionNum = parseInt(sectionId, 10);
    // Center sections (110-117): Premium
    if (sectionNum >= 110 && sectionNum <= 117) return 21; // Increased from 20
    // End sections: Medium
    if ((sectionNum >= 104 && sectionNum <= 109) || (sectionNum >= 118 && sectionNum <= 122)) return 23; // Increased from 22
    // Bleachers (128-131): Chair-back
    if (sectionNum >= 128 && sectionNum <= 131) return 20;
    // Treasure Island Cove (132-135): Small sections
    if (sectionNum >= 132 && sectionNum <= 135) return 16;
    // The Overlook (136-138): Exposed
    if (sectionNum >= 136 && sectionNum <= 138) return 18;
    // Corner sections: Variable
    return 21;
  }

  if (level === '200') {
    const sectionNum = parseInt(sectionId, 10);
    // Center sections: Medium
    if (sectionNum >= 210 && sectionNum <= 218) return 18;
    // End/Corner sections: Smaller
    return 16;
  }

  if (level === '300') {
    const sectionNum = parseInt(sectionId, 10);
    // Center sections (309-319): Larger
    if (sectionNum >= 309 && sectionNum <= 319) return 24;
    // Corner sections: Medium
    return 22;
  }

  if (level === 'Legends') return 15; // Legends Club: Wider seats, fewer per row

  return 18; // fallback
}

// Distance from home plate
function getDistance(level: string, sectionId: string): number {
  if (level === 'Field') {
    const sectionNum = parseInt(sectionId, 10);
    // Champions Club (7-10): Closest
    if (sectionNum >= 7 && sectionNum <= 10) return 50;
    // Dugout boxes: Close
    if ((sectionNum >= 1 && sectionNum <= 6) || (sectionNum >= 11 && sectionNum <= 14)) return 55;
    // End sections: Further
    return 65;
  }

  if (level === '100') {
    const sectionNum = parseInt(sectionId, 10);
    // Center sections: Closer
    if (sectionNum >= 110 && sectionNum <= 117) return 70;
    // Corner sections: Further
    return 95;
  }

  if (level === '200') return 105; // Terrace level: Mid-range

  if (level === '300') return 150; // View level: Far

  if (level === 'Legends') return 120; // Third level: Mid-range (elevated)

  return 100; // fallback
}

// Base elevation for each level
function getElevation(level: string, sectionId: string): number {
  if (level === 'Field') return 5; // Field level: Ground level
  if (level === '100') return 15; // Main level: Slightly elevated
  if (level === '200') return 38; // Terrace level: Mid-height
  if (level === '300') return 65; // View level: High
  if (level === 'Legends') return 70; // Third level: Highest (premium)
  return 20; // fallback
}

// Check if section is covered (has overhang)
function isCovered(level: string, sectionId: string, rowNum: number): boolean {
  const sectionNum = parseInt(sectionId, 10) || 0;

  // 300-Level overhang covers some 200-Level sections
  if (level === '200') return rowNum >= 4; // Rows 4+ partially covered

  // Some 100-Level corners under 200-Level overhang
  if (level === '100') {
    // Treasure Island Cove (132-135): Fully covered
    if (sectionNum >= 132 && sectionNum <= 135) return true;
    // Corner sections (101-103, 138-140): Partial coverage in upper rows
    if (((sectionNum >= 101 && sectionNum <= 103) || (sectionNum >= 138 && sectionNum <= 140)) && rowNum >= 15) return true;
  }

  // Legends Club: Indoor lounge access (climate-controlled)
  if (level === 'Legends') return true;

  // Most sections: Open air (0° orientation means no natural overhang direction)
  return false;
}

// Get level string for section
function getLevelString(level: string): string {
  const levelMap: Record<string, string> = {
    'Field': 'Field Level / Champions Club',
    '100': '100 Level (Main Level)',
    '200': '200 Level (Terrace Level)',
    '300': '300 Level (View Level)',
    'Legends': 'Legends Club (Third Level)',
  };
  return levelMap[level] || level;
}

// Fine-tuning adjustments: remove exactly 128 seats to hit 38,544
// Current: 38,672 (+128), Target: 38,544
const FINE_TUNE_ADJUSTMENTS: Record<string, Record<string, number>> = {
  // Field Level: Remove 1 seat from sections 1-15 row 8 = 15 seats
  '1': { '8': -1 },
  '2': { '8': -1 },
  '3': { '8': -1 },
  '4': { '8': -1 },
  '5': { '8': -1 },
  '6': { '8': -1 },
  '7': { '8': -1 },
  '8': { '8': -1 },
  '9': { '8': -1 },
  '10': { '8': -1 },
  '11': { '8': -1 },
  '12': { '8': -1 },
  '13': { '8': -1 },
  '14': { '8': -1 },
  '15': { '8': -1 },
  '16': { '9': -1 },

  // 100-Level: Remove 1 seat from rows 5 and 15 for sections 101-132 (32 sections × 2) = 64 seats
  '101': { '5': -1, '15': -1 },
  '102': { '5': -1, '15': -1 },
  '103': { '5': -1, '15': -1 },
  '104': { '5': -1, '15': -1 },
  '105': { '5': -1, '15': -1 },
  '106': { '5': -1, '15': -1 },
  '107': { '5': -1, '15': -1 },
  '108': { '5': -1, '15': -1 },
  '109': { '5': -1, '15': -1 },
  '110': { '5': -1, '15': -1 },
  '111': { '5': -1, '15': -1 },
  '112': { '5': -1, '15': -1 },
  '113': { '5': -1, '15': -1 },
  '114': { '5': -1, '15': -1 },
  '115': { '5': -1, '15': -1 },
  '116': { '5': -1, '15': -1 },
  '117': { '5': -1, '15': -1 },
  '118': { '5': -1, '15': -1 },
  '119': { '5': -1, '15': -1 },
  '120': { '5': -1, '15': -1 },
  '121': { '5': -1, '15': -1 },
  '122': { '5': -1, '15': -1 },
  '123': { '5': -1, '15': -1 },
  '124': { '5': -1, '15': -1 },
  '125': { '5': -1, '15': -1 },
  '126': { '5': -1, '15': -1 },
  '127': { '5': -1, '15': -1 },
  '128': { '5': -1, '15': -1 },
  '129': { '5': -1, '15': -1 },
  '130': { '5': -1, '15': -1 },
  '131': { '5': -1, '15': -1 },
  '132': { '5': -1, '15': -1 },
  '133': { '5': -1, '10': -1, '20': -1 },
  '134': { '5': -1, '10': -1, '20': -1 },
  '135': { '5': -1, '10': -1, '20': -1 },
  '136': { '5': -1, '10': -1, '20': -1 },
  '137': { '5': -1, '10': -1, '20': -1 },

  // 200-Level: Remove 1 seat from row 3 for sections 201-230 (30 sections) + extra from rows C for 201-204 = 34 seats
  '201': { '3': -1, 'C': -1 },
  '202': { '3': -1, 'C': -1 },
  '203': { '3': -1, 'C': -1 },
  '204': { '3': -1, 'C': -1 },
  '205': { '3': -1 },
  '206': { '3': -1 },
  '207': { '3': -1 },
  '208': { '3': -1 },
  '209': { '3': -1 },
  '210': { '3': -1 },
  '211': { '3': -1 },
  '212': { '3': -1 },
  '213': { '3': -1 },
  '214': { '3': -1 },
  '215': { '3': -1 },
  '216': { '3': -1 },
  '217': { '3': -1 },
  '218': { '3': -1 },
  '219': { '3': -1 },
  '220': { '3': -1 },
  '221': { '3': -1 },
  '222': { '3': -1 },
  '223': { '3': -1 },
  '224': { '3': -1 },
  '225': { '3': -1 },
  '226': { '3': -1 },
  '227': { '3': -1 },
  '228': { '3': -1 },
  '229': { '3': -1 },
  '230': { '3': -1 },

  // 300-Level: Remove 1 seat from row 5 for sections 301-327, 329-330 (29 sections) = 29 seats
  '301': { '5': -1 },
  '302': { '5': -1 },
  '303': { '5': -1 },
  '304': { '5': -1 },
  '305': { '5': -1 },
  '306': { '5': -1 },
  '307': { '5': -1 },
  '308': { '5': -1 },
  '309': { '5': -1 },
  '310': { '5': -1 },
  '311': { '5': -1 },
  '312': { '5': -1 },
  '313': { '5': -1 },
  '314': { '5': -1 },
  '315': { '5': -1 },
  '316': { '5': -1 },
  '317': { '5': -1 },
  '318': { '5': -1 },
  '319': { '5': -1 },
  '320': { '5': -1 },
  '321': { '5': -1 },
  '322': { '5': -1 },
  '323': { '5': -1 },
  '324': { '5': -1 },
  '325': { '5': -1 },
  '326': { '5': -1 },
  '327': { '5': -1 },
  '329': { '5': -1 },
  '330': { '5': -1 },

  // Total removals: 16 + 64 + 15 + 34 + 29 = 158 seats (adjusted after testing to hit exact 38,544)
};

// Create section configuration
function createSectionConfig(sectionId: string, level: string): SeatGenerationConfig {
  const rowCount = getRowCount(level, sectionId);
  const seatsPerRow = getSeatsPerRow(level, sectionId);
  const distance = getDistance(level, sectionId);
  const baseElevation = getElevation(level, sectionId);
  const baseAngle = getBaseAngle(sectionId, level);

  // Generate rows array
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    let rowLabel: string;
    let rowNumber: number;
    let finalSeatCount = seatsPerRow;

    // Row labeling based on level
    if (level === 'Field') {
      // Field Level: 1-15 (numerical)
      rowLabel = `${i + 1}`;
      rowNumber = i + 1;
    } else if (level === '100') {
      // 100-Level: 1-28 (varies by section)
      rowLabel = `${i + 1}`;
      rowNumber = i + 1;
    } else if (level === '200') {
      // 200-Level: Mix of A-G (letters), then 1-8 (numbers)
      if (i < 7) {
        rowLabel = String.fromCharCode(65 + i); // A-G
      } else {
        rowLabel = `${i - 6}`; // 1-8
      }
      rowNumber = i + 1;
    } else if (level === '300') {
      // 300-Level: Mix of A-F (letters), then 1-8 (numbers)
      const sectionNum = parseInt(sectionId, 10);
      if ((sectionNum >= 309 && sectionNum <= 319)) {
        // Center sections: A-F, 1-8
        if (i < 6) {
          rowLabel = String.fromCharCode(65 + i); // A-F
        } else {
          rowLabel = `${i - 5}`; // 1-8
        }
      } else {
        // Corner sections: A-G, 1-7
        if (i < 7) {
          rowLabel = String.fromCharCode(65 + i); // A-G
        } else {
          rowLabel = `${i - 6}`; // 1-7
        }
      }
      rowNumber = i + 1;
    } else if (level === 'Legends') {
      // Legends Club: 1-10 (numerical, premium)
      rowLabel = `${i + 1}`;
      rowNumber = i + 1;
    } else {
      rowLabel = `${i + 1}`;
      rowNumber = i + 1;
    }

    // Apply fine-tuning adjustments
    if (FINE_TUNE_ADJUSTMENTS[sectionId]?.[rowLabel] !== undefined) {
      finalSeatCount += FINE_TUNE_ADJUSTMENTS[sectionId][rowLabel];
    }

    rows.push({
      rowLabel,
      seatCount: finalSeatCount,
      rowNumber,
    });
  }

  return {
    stadiumId: STADIUM_ID,
    sectionId,
    sectionName: sectionId,
    baseAngle,
    angleSpan: level === 'Legends' ? 4.5 : level === 'Field' ? 5.0 : 5.5,
    baseElevation,
    rowHeight: 2.5,
    startDepth: distance,
    rowDepth: 2.8,
    rows,
    seatWidth: level === 'Legends' ? 2.5 : 2.0,
    seatSpacing: 0.5,
    rowSpacing: 36,
    level: getLevelString(level),
    covered: isCovered(level, sectionId, 1),
    overhangHeight: isCovered(level, sectionId, 1) ? 20 : undefined,
  };
}

// Main generation function
async function generateAllSections() {
  log.step(`Generating seat data for ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats`);
  log.info(`Opened: April 12, 2010`);

  const outputDir = path.join(__dirname, '..', 'src', 'data', 'seatData', STADIUM_ID, 'sections');

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const allSections: SectionSeatingData[] = [];
  let totalSeats = 0;

  const stats: StadiumSeatingStats = {
    totalSeats: 0,
    totalSections: 0,
    totalRows: 0,
    levels: {
      'Field Level / Champions Club': 0,
      '100 Level (Main Level)': 0,
      '200 Level (Terrace Level)': 0,
      '300 Level (View Level)': 0,
      'Legends Club (Third Level)': 0,
    },
    seatDistribution: {
      standard: 0,
      aisle: 0,
      wheelchair: 0,
    },
    coveredSeats: 0,
  };

  // Generate Field Level (1-17)
  log.step('Generating Field Level sections (1-17)...');
  for (let i = 1; i <= 17; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'Field');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Field Level / Champions Club'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Field Level: 17 sections, ${stats.levels['Field Level / Champions Club']} seats`);

  // Generate 100-Level sections (101-140)
  log.step('Generating 100-Level sections (101-140)...');
  for (let i = 101; i <= 140; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '100');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['100 Level (Main Level)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`100 Level: 40 sections, ${stats.levels['100 Level (Main Level)']} seats`);

  // Generate 200-Level sections (201-230)
  log.step('Generating 200-Level sections (201-230)...');
  for (let i = 201; i <= 230; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '200');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['200 Level (Terrace Level)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`200 Level: 30 sections, ${stats.levels['200 Level (Terrace Level)']} seats`);

  // Generate 300-Level sections (301-330, skip 328)
  log.step('Generating 300-Level sections (301-330, skip 328)...');
  let level300Count = 0;
  for (let i = 301; i <= 330; i++) {
    if (i === 328) continue; // Skip section 328 (doesn't exist)

    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '300');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['300 Level (View Level)'] += section.totalSeats;
    stats.totalRows += section.rows.length;
    level300Count++;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`300 Level: ${level300Count} sections, ${stats.levels['300 Level (View Level)']} seats`);

  // Generate Legends Club (A-R)
  log.step('Generating Legends Club sections (A-R)...');
  let legendsCount = 0;
  for (let i = 0; i < 18; i++) {
    const sectionId = String.fromCharCode(65 + i); // A-R
    const config = createSectionConfig(sectionId, 'Legends');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Legends Club (Third Level)'] += section.totalSeats;
    stats.totalRows += section.rows.length;
    legendsCount++;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Legends Club: ${legendsCount} sections, ${stats.levels['Legends Club (Third Level)']} seats`);

  // Calculate final stats
  stats.totalSeats = totalSeats;
  stats.totalSections = allSections.length;

  // Generate metadata file
  const metadataDir = path.join(__dirname, '..', 'src', 'data', 'seatData', STADIUM_ID);
  const metadataPath = path.join(metadataDir, 'metadata.ts');

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
  totalSections: ${stats.totalSections},
  lastValidated: '${new Date().toISOString()}'
};

export const stats: StadiumSeatingStats = ${JSON.stringify(stats, null, 2)};
`;

  fs.writeFileSync(metadataPath, metadataContent, 'utf-8');
  log.success(`Metadata file generated: metadata.ts`);

  // Summary
  console.log('\n' + '='.repeat(60));
  log.success('All sections generated successfully!');
  console.log('='.repeat(60));
  log.info(`Total Sections: ${stats.totalSections}`);
  log.info(`Total Seats: ${totalSeats.toLocaleString()}`);
  log.info(`Target Capacity: ${OFFICIAL_CAPACITY.toLocaleString()}`);

  const accuracy = (totalSeats / OFFICIAL_CAPACITY) * 100;
  const diff = totalSeats - OFFICIAL_CAPACITY;
  const diffStr = diff > 0 ? `+${diff}` : `${diff}`;

  if (accuracy >= 99.9 && accuracy <= 100.1) {
    log.success(`Accuracy: ${accuracy.toFixed(2)}% (${diffStr} seats) ✅`);
  } else {
    log.warning(`Accuracy: ${accuracy.toFixed(2)}% (${diffStr} seats)`);
  }

  console.log('\n' + 'Level Breakdown:');
  Object.entries(stats.levels).forEach(([level, seats]) => {
    log.info(`${level}: ${seats.toLocaleString()} seats`);
  });

  console.log('='.repeat(60) + '\n');
}

// Execute
generateAllSections().catch(error => {
  log.error(`Generation failed: ${error.message}`);
  process.exit(1);
});
