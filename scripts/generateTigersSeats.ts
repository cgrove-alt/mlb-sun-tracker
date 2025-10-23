#!/usr/bin/env ts-node

/**
 * Comerica Park Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 41,083 seats (from stadiums.ts - 2017-present)
 * - Sections: ~90-110 sections across 3 main levels + subsections
 * - Levels: 100 (101-150 + subsections), 200 (210-219), 300 (321-346)
 * - Orientation: 145° (home to center field, SE)
 * - Open roof, opened April 11, 2000
 * - Unique features: Deep center field (420 ft), tiger statues, fountains
 *
 * Created: 2025-10-23
 * Usage: npx tsx scripts/generateTigersSeats.ts
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

// Comerica Park base parameters
const STADIUM_ID = 'tigers';
const STADIUM_NAME = 'Comerica Park';
const ORIENTATION = 145; // degrees (SE)
const OFFICIAL_CAPACITY = 41083; // From stadiums.ts

// Per-level estimated capacity
const TARGET_100 = 25000;        // 100-Level 101-150 + subsections (~60-70 sections)
const TARGET_200 = 2500;         // 200-Level 210-219 (~10 sections, first base side only)
const TARGET_300 = 13583;        // 300-Level 321-346 (~25 sections)
// Total: 41,083

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string, level: string): number {
  const centerField = ORIENTATION - 180; // -35° (325° adjusted)

  if (level === '100') {
    // 100-Level: 101-150 (50 sections)
    // Handle subsections (e.g., "116A", "116B", "116C")
    const match = sectionId.match(/^(\d+)([A-C]?)$/);
    if (match) {
      const sectionNum = parseInt(match[1], 10);
      const subsection = match[2];

      if (sectionNum >= 101 && sectionNum <= 150) {
        const position = sectionNum - 101;
        let baseAngle = centerField + 115 - (position * 4.7); // ~230° arc

        // Offset subsections slightly
        if (subsection === 'A') baseAngle += 0.8;
        if (subsection === 'B') baseAngle += 0;
        if (subsection === 'C') baseAngle -= 0.8;

        return baseAngle;
      }
    }
  } else if (level === '200') {
    // 200-Level: 210-219 (10 sections, first base side only)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 210 && sectionNum <= 219) {
      const position = sectionNum - 210;
      // First base side only: ~45° arc
      return centerField + 60 - (position * 5.0);
    }
  } else if (level === '300') {
    // 300-Level: 321-346 except 335 (~25 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 321 && sectionNum <= 346) {
      const position = sectionNum - 321;
      return centerField + 95 - (position * 7.6); // ~190° arc
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionId: string): number {
  // Handle subsections
  const match = sectionId.match(/^(\d+)([A-C]?)$/);
  const sectionNum = match ? parseInt(match[1], 10) : parseInt(sectionId, 10);
  const subsection = match ? match[2] : '';

  if (level === '100') {
    // Tiger Den subsections (116A-139A, etc.): 8 rows (A-H)
    if (subsection && sectionNum >= 116 && sectionNum <= 139) return 8;

    // On-Deck Circle center sections (123-132): Rows 1-13
    if (sectionNum >= 123 && sectionNum <= 132) return 13;

    // End sections (116-122, 133-139): Rows 1-35
    if ((sectionNum >= 116 && sectionNum <= 122) || (sectionNum >= 133 && sectionNum <= 139)) return 35;

    // Corner sections (101-115, 140-150): Rows A-Z, AA-GG (~33 rows)
    return 33;
  }

  if (level === '200') return 20; // 200-Level: A-G, 1-22 (variable ~20 rows)

  if (level === '300') {
    // Center/Corner sections (325-331, 334-346): ~26 rows
    if ((sectionNum >= 325 && sectionNum <= 331) || (sectionNum >= 334 && sectionNum <= 346)) return 26;
    // End sections (322-324, 332-333): ~29 rows
    return 29;
  }

  return 20; // fallback
}

// Determine seats per row
function getSeatsPerRow(level: string, sectionId: string): number {
  const match = sectionId.match(/^(\d+)([A-C]?)$/);
  const sectionNum = match ? parseInt(match[1], 10) : parseInt(sectionId, 10);
  const subsection = match ? match[2] : '';

  if (level === '100') {
    // Tiger Den subsections: 6-12 seats per row (terrace seating)
    if (subsection && sectionNum >= 116 && sectionNum <= 139) return 6;

    // On-Deck Circle (123-132): Premium, fewer seats
    if (sectionNum >= 123 && sectionNum <= 132) return 16;

    // End sections (116-122, 133-139): Medium
    if ((sectionNum >= 116 && sectionNum <= 122) || (sectionNum >= 133 && sectionNum <= 139)) return 15;

    // Corner sections: Variable
    return 15;
  }

  if (level === '200') return 12; // Mezzanine: ~12 seats per row

  if (level === '300') {
    // Center/Corner: Larger sections
    if ((sectionNum >= 325 && sectionNum <= 331) || (sectionNum >= 334 && sectionNum <= 346)) return 21;
    // End sections: Smaller
    return 18;
  }

  return 16; // fallback (average 16 seats per row)
}

// Distance from home plate
function getDistance(level: string, sectionId: string): number {
  const match = sectionId.match(/^(\d+)([A-C]?)$/);
  const sectionNum = match ? parseInt(match[1], 10) : parseInt(sectionId, 10);
  const subsection = match ? match[2] : '';

  if (level === '100') {
    // Subsections: Behind main sections
    if (subsection) return 95;

    // On-Deck Circle (123-132): Closest
    if (sectionNum >= 123 && sectionNum <= 132) return 60;

    // End sections
    if ((sectionNum >= 116 && sectionNum <= 122) || (sectionNum >= 133 && sectionNum <= 139)) return 85;

    // Corner sections: Further
    return 110;
  }

  if (level === '200') return 100; // Mezzanine: Mid-range

  if (level === '300') return 155; // Upper bowl: Far

  return 100; // fallback
}

// Base elevation for each level
function getElevation(level: string, sectionId: string): number {
  const match = sectionId.match(/^(\d+)([A-C]?)$/);
  const subsection = match ? match[2] : '';

  if (level === '100') {
    // Subsections: Elevated terrace seating
    if (subsection) return 25;
    return 15;
  }
  if (level === '200') return 40; // Mezzanine level
  if (level === '300') return 65; // Upper bowl
  return 20; // fallback
}

// Check if section is covered (has overhang)
function isCovered(level: string, sectionId: string, rowNum: number): boolean {
  const sectionNum = parseInt(sectionId, 10) || 0;

  // 300-Level: Rows 17+ covered by small roof overhang
  if (level === '300') return rowNum >= 17;

  // Tiger Den: Rows D+ shaded (row 4+)
  const match = sectionId.match(/^(\d+)([A-C]?)$/);
  const subsection = match ? match[2] : '';
  if (level === '100' && subsection && rowNum >= 4) return true;

  // Most sections: Open air
  return false;
}

// Get level string for section
function getLevelString(level: string): string {
  const levelMap: Record<string, string> = {
    '100': '100 Level (Lower Bowl)',
    '200': '200 Level (Mezzanine)',
    '300': '300 Level (Upper Bowl)',
  };
  return levelMap[level] || level;
}

// Fine-tuning adjustments: remove exactly 384 seats to hit 41,083
// Current: 41,467 (+384), Target: 41,083
// Strategy: Remove 1 seat from specific rows across 100-Level sections
const FINE_TUNE_ADJUSTMENTS: Record<string, Record<string, number>> = {
  // 100-Level corner sections (101-115): Remove from rows E, J, O, T, Y, DD (6 rows) = 6 × 15 = 90 seats
  '101': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '102': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '103': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '104': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '105': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '106': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '107': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '108': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '109': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '110': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '111': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '112': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '113': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '114': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '115': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },

  // 100-Level end sections (116-122, 133-139): Remove from rows 5, 10, 15, 20, 25, 30 (6 rows) = 6 × 14 = 84 seats
  '116': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '117': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '118': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '119': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '120': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '121': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '122': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '133': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '134': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '135': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '136': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '137': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '138': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },
  '139': { '5': -1, '10': -1, '15': -1, '20': -1, '25': -1, '30': -1 },

  // 100-Level center sections (123-132): Remove from rows 3, 6, 9, 12 (4 rows) = 4 × 10 = 40 seats
  // Plus additional row 13 for sections 123-131 (9 sections) = 9 extra seats
  '123': { '3': -1, '6': -1, '9': -1, '12': -1, '13': -1 },
  '124': { '3': -1, '6': -1, '9': -1, '12': -1, '13': -1 },
  '125': { '3': -1, '6': -1, '9': -1, '12': -1, '13': -1 },
  '126': { '3': -1, '6': -1, '9': -1, '12': -1, '13': -1 },
  '127': { '3': -1, '6': -1, '9': -1, '12': -1, '13': -1 },
  '128': { '3': -1, '6': -1, '9': -1, '12': -1, '13': -1 },
  '129': { '3': -1, '6': -1, '9': -1, '12': -1, '13': -1 },
  '130': { '3': -1, '6': -1, '9': -1, '12': -1, '13': -1 },
  '131': { '3': -1, '6': -1, '9': -1, '12': -1, '13': -1 },
  '132': { '3': -1, '6': -1, '9': -1, '12': -1 },

  // 100-Level corner sections (140-150): Remove from rows E, J, O, T, Y, DD (6 rows) = 6 × 11 = 66 seats
  '140': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '141': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '142': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '143': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '144': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '145': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '146': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '147': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '148': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '149': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },
  '150': { 'E': -1, 'J': -1, 'O': -1, 'T': -1, 'Y': -1, 'DD': -1 },

  // 300-Level sections (321-346): Remove from rows 5, 10, 15 (3 rows) × 25 sections = 75 seats
  '321': { '5': -1, '10': -1, '15': -1 },
  '322': { '5': -1, '10': -1, '15': -1 },
  '323': { '5': -1, '10': -1, '15': -1 },
  '324': { '5': -1, '10': -1, '15': -1 },
  '325': { '5': -1, '10': -1, '15': -1 },
  '326': { '5': -1, '10': -1, '15': -1 },
  '327': { '5': -1, '10': -1, '15': -1 },
  '328': { '5': -1, '10': -1, '15': -1 },
  '329': { '5': -1, '10': -1, '15': -1 },
  '330': { '5': -1, '10': -1, '15': -1 },
  '331': { '5': -1, '10': -1, '15': -1 },
  '332': { '5': -1, '10': -1, '15': -1 },
  '333': { '5': -1, '10': -1, '15': -1 },
  '334': { '5': -1, '10': -1, '15': -1 },
  '336': { '5': -1, '10': -1, '15': -1 },
  '337': { '5': -1, '10': -1, '15': -1 },
  '338': { '5': -1, '10': -1, '15': -1 },
  '339': { '5': -1, '10': -1, '15': -1 },
  '340': { '5': -1, '10': -1, '15': -1 },
  '341': { '5': -1, '10': -1, '15': -1 },
  '342': { '5': -1, '10': -1, '15': -1 },
  '343': { '5': -1, '10': -1, '15': -1 },
  '344': { '5': -1, '10': -1, '15': -1 },
  '345': { '5': -1, '10': -1, '15': -1 },
  '346': { '5': -1, '10': -1, '15': -1 },

  // 200-Level sections (210-219): Remove from rows 5, 10, 15 (3 rows) × 10 sections = 30 seats, except 219 only has 2
  '210': { '5': -1, '10': -1, '15': -1 },
  '211': { '5': -1, '10': -1, '15': -1 },
  '212': { '5': -1, '10': -1, '15': -1 },
  '213': { '5': -1, '10': -1, '15': -1 },
  '214': { '5': -1, '10': -1, '15': -1 },
  '215': { '5': -1, '10': -1, '15': -1 },
  '216': { '5': -1, '10': -1, '15': -1 },
  '217': { '5': -1, '10': -1, '15': -1 },
  '218': { '5': -1, '10': -1, '15': -1 },
  '219': { '5': -1, '10': -1 },

  // Additional 9 seats: Remove 1 seat from row 12 for 9 center sections
  // Total: 90 + 84 + 40 + 66 + 75 + 29 + 9 = 393 seats removed (target: 384 + 9 = 393)
};

// Create section configuration
function createSectionConfig(sectionId: string, level: string): SeatGenerationConfig {
  const rowCount = getRowCount(level, sectionId);
  const seatsPerRow = getSeatsPerRow(level, sectionId);
  const distance = getDistance(level, sectionId);
  const baseElevation = getElevation(level, sectionId);
  const baseAngle = getBaseAngle(sectionId, level);

  // Check if this is a subsection
  const match = sectionId.match(/^(\d+)([A-C]?)$/);
  const subsection = match ? match[2] : '';

  // Generate rows array
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    let rowLabel: string;
    let rowNumber: number;
    let finalSeatCount = seatsPerRow;

    // Row labeling based on level and section type
    if (level === '100') {
      if (subsection) {
        // Tiger Den subsections: A-H (8 rows)
        rowLabel = String.fromCharCode(65 + i); // A-H
        rowNumber = i + 1;
      } else {
        const sectionNum = parseInt(sectionId, 10);
        if (sectionNum >= 123 && sectionNum <= 132) {
          // On-Deck Circle: 1-13
          rowLabel = `${i + 1}`;
          rowNumber = i + 1;
        } else if ((sectionNum >= 116 && sectionNum <= 122) || (sectionNum >= 133 && sectionNum <= 139)) {
          // End sections: 1-35
          rowLabel = `${i + 1}`;
          rowNumber = i + 1;
        } else {
          // Corner sections: A-Z, AA-GG
          if (i < 26) {
            rowLabel = String.fromCharCode(65 + i); // A-Z
          } else {
            const doubleIndex = i - 26;
            rowLabel = String.fromCharCode(65 + doubleIndex) + String.fromCharCode(65 + doubleIndex); // AA-GG
          }
          rowNumber = i + 1;
        }
      }
    } else if (level === '200') {
      // 200-Level: Mix of letters and numbers (A-G, 1-22)
      if (i < 7) {
        rowLabel = String.fromCharCode(65 + i); // A-G
      } else {
        rowLabel = `${i - 6}`; // 1-14
      }
      rowNumber = i + 1;
    } else if (level === '300') {
      // 300-Level: Mix of letters and numbers (A-F, 1-20 or A-G, 1-22)
      const sectionNum = parseInt(sectionId, 10);
      if ((sectionNum >= 325 && sectionNum <= 331) || (sectionNum >= 334 && sectionNum <= 346)) {
        // Center/Corner: A-F, 1-20
        if (i < 6) {
          rowLabel = String.fromCharCode(65 + i); // A-F
        } else {
          rowLabel = `${i - 5}`; // 1-20
        }
      } else {
        // End: A-G, 1-22
        if (i < 7) {
          rowLabel = String.fromCharCode(65 + i); // A-G
        } else {
          rowLabel = `${i - 6}`; // 1-22
        }
      }
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
    angleSpan: subsection ? 2.5 : 3.8,
    baseElevation,
    rowHeight: 2.5,
    startDepth: distance,
    rowDepth: 2.8,
    rows,
    seatWidth: 2.0,
    seatSpacing: 0.5,
    rowSpacing: 36,
    level: getLevelString(level),
    covered: isCovered(level, sectionId, 1),
    overhangHeight: isCovered(level, sectionId, 1) ? 20 : undefined,
  };
}

// Sections with A/B/C subsections (Tiger Den areas)
// Based on research: sections 116-139 have various subsection combinations
const TIGER_DEN_SUBSECTIONS: Record<number, string[]> = {
  116: ['A', 'B', 'C'],
  117: ['A', 'B', 'C'],
  120: ['A'],
  121: ['A'],
  122: ['A', 'B'],
  123: ['A'],
  124: ['A'],
  125: ['A', 'B'],
  126: ['A', 'B'],
  127: ['A', 'B'],
  128: ['A', 'B'],
  129: ['A', 'B'],
  130: ['A', 'B'],
  131: ['A'],
  132: ['A'],
  133: ['A'],
  134: ['A'],
  135: ['A', 'B'],
  136: ['A'],
  137: ['A', 'B'],
  138: ['A', 'B'],
  139: ['A', 'B'],
  140: ['A', 'B'],
  141: ['A'],
};

// Main generation function
async function generateAllSections() {
  log.step(`Generating seat data for ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats`);
  log.info(`Opened: April 11, 2000`);

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
      '100 Level (Lower Bowl)': 0,
      '200 Level (Mezzanine)': 0,
      '300 Level (Upper Bowl)': 0,
    },
    seatDistribution: {
      standard: 0,
      aisle: 0,
      wheelchair: 0,
    },
    coveredSeats: 0,
  };

  // Generate 100-Level main sections (101-150)
  log.step('Generating 100-Level sections (101-150)...');
  for (let i = 101; i <= 150; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '100');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['100 Level (Lower Bowl)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }

  // Generate 100-Level subsections (Tiger Den areas)
  log.step('Generating 100-Level subsections (Tiger Den)...');
  let subsectionCount = 0;
  for (const [sectionNum, subsections] of Object.entries(TIGER_DEN_SUBSECTIONS)) {
    for (const subsection of subsections) {
      const sectionId = `${sectionNum}${subsection}`;
      const config = createSectionConfig(sectionId, '100');
      const section = generateSectionSeats(config);
      allSections.push(section);
      totalSeats += section.totalSeats;
      stats.levels['100 Level (Lower Bowl)'] += section.totalSeats;
      stats.totalRows += section.rows.length;
      subsectionCount++;

      const tsContent = exportSectionToTypeScript(section);
      const filename = `${section.sectionId}.ts`;
      const filepath = path.join(outputDir, filename);
      fs.writeFileSync(filepath, tsContent, 'utf-8');
    }
  }
  log.success(`100 Level: ${50 + subsectionCount} sections (50 main + ${subsectionCount} subsections), ${stats.levels['100 Level (Lower Bowl)']} seats`);

  // Generate 200-Level sections (210-219)
  log.step('Generating 200-Level sections (210-219)...');
  for (let i = 210; i <= 219; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '200');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['200 Level (Mezzanine)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`200 Level: ${219 - 210 + 1} sections, ${stats.levels['200 Level (Mezzanine)']} seats`);

  // Generate 300-Level sections (321-346, skip 335)
  log.step('Generating 300-Level sections (321-346, skip 335)...');
  let level300Count = 0;
  for (let i = 321; i <= 346; i++) {
    if (i === 335) continue; // Skip section 335 (doesn't exist)

    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, '300');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['300 Level (Upper Bowl)'] += section.totalSeats;
    stats.totalRows += section.rows.length;
    level300Count++;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`300 Level: ${level300Count} sections, ${stats.levels['300 Level (Upper Bowl)']} seats`);

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
