#!/usr/bin/env ts-node

/**
 * Nationals Park Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 41,313 seats (from stadiums.ts configuration)
 * - Sections: ~127 sections across 5 main levels
 * - Levels: Presidents Club (A-E), Field (100s), Club (200s), Gallery (300s), Upper Gallery (400s)
 * - Orientation: 87° (home to center field, nearly due East)
 * - Open roof
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateNationalsSeats.ts
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

// Nationals Park base parameters
const STADIUM_ID = 'nationals';
const STADIUM_NAME = 'Nationals Park';
const ORIENTATION = 87; // degrees (nearly due East)
const OFFICIAL_CAPACITY = 41313; // From stadiums.ts

// Per-level estimated capacity
const TARGET_PRESIDENTS = 500;    // Presidents Club A-E
const TARGET_FIELD = 18000;       // 100 Level
const TARGET_CLUB = 10000;        // 200 Level
const TARGET_GALLERY = 7500;      // 300 Level
const TARGET_UPPER = 5313;        // 400 Level
// Total: 41,313

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string, level: string): number {
  const centerField = ORIENTATION - 180; // -93° (267° adjusted)

  if (level === 'presidents') {
    // Presidents Club: A-E (behind home plate)
    const letters = ['A', 'B', 'C', 'D', 'E'];
    const index = letters.indexOf(sectionId);
    if (index >= 0) {
      return centerField - 10 + (index * 5); // Small arc behind home plate
    }
  } else if (level === 'field') {
    // Field level: 100-143 (44 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 100 && sectionNum <= 143) {
      const position = sectionNum - 100;
      return centerField + 75 - (position * 3.4); // ~150° arc
    }
  } else if (level === 'club') {
    // Club level: 201-243 (not all numbers, ~42 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 201 && sectionNum <= 243) {
      const position = sectionNum - 201;
      return centerField + 70 - (position * 3.3); // ~140° arc
    }
  } else if (level === 'gallery') {
    // Gallery: 301-321 (21 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 301 && sectionNum <= 321) {
      const position = sectionNum - 301;
      return centerField + 45 - (position * 4.3); // ~90° arc
    }
  } else if (level === 'upper') {
    // Upper Gallery: 401-409, 416-420 (15 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 401 && sectionNum <= 409) {
      const position = sectionNum - 401;
      return centerField + 35 - (position * 4.4); // First part
    }
    if (sectionNum >= 416 && sectionNum <= 420) {
      const position = sectionNum - 416;
      return centerField - 15 - (position * 4.4); // Second part (after press box gap)
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10);

  if (level === 'presidents') return 8; // Reduced from 12

  if (level === 'field') {
    // Center sections (114-131): Reduced significantly
    if (sectionNum >= 114 && sectionNum <= 131) return 25;
    // End/Corner sections: Reduced significantly
    return 24;
  }

  if (level === 'club') return 16; // A-P
  if (level === 'gallery') return 16; // A-P
  if (level === 'upper') return 14; // A-N

  return 20; // fallback
}

// Fine-tune adjustments to hit exact capacity (41,313 seats)
// Format: { sectionId: { rowLabel: seatAdjustment } }
// Positive values add seats, negative values remove seats
// Target: Remove 11 seats (41,324 → 41,313)
const FINE_TUNE_ADJUSTMENTS: Record<string, Record<string, number>> = {
  // Remove 1 seat from row P (last row) for 11 Club Level sections (11 sections × 1 seat = 11 seats)
  '201': { 'P': -1 },
  '202': { 'P': -1 },
  '203': { 'P': -1 },
  '204': { 'P': -1 },
  '205': { 'P': -1 },
  '206': { 'P': -1 },
  '207': { 'P': -1 },
  '208': { 'P': -1 },
  '209': { 'P': -1 },
  '210': { 'P': -1 },
  '211': { 'P': -1 },
};
// Total removed: 11 sections × 1 seat = 11 seats

// Determine seats per row
function getSeatsPerRow(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10);

  if (level === 'presidents') return 17; // Fine-tuned for final accuracy

  if (level === 'field') {
    // Diamond Club (119-126, between dugouts)
    if (sectionNum >= 119 && sectionNum <= 126) return 18;
    // Center sections
    if (sectionNum >= 114 && sectionNum <= 131) return 18;
    // Corners/ends
    return 16;
  }

  if (level === 'club') {
    // Champions Club sections (206-221)
    if (sectionNum >= 206 && sectionNum <= 221) return 17;
    // Other club sections
    if (sectionNum >= 210 && sectionNum <= 217) return 20;
    return 16;
  }

  if (level === 'gallery') {
    // Center sections
    if (sectionNum >= 310 && sectionNum <= 317) return 21;
    return 20;
  }

  if (level === 'upper') return 24;

  return 18; // fallback
}

// Distance from home plate
function getDistance(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10);

  if (level === 'presidents') return 55; // Very close
  if (level === 'field') {
    if (sectionNum >= 114 && sectionNum <= 131) return 65; // Center
    return 75; // Corners/ends
  }
  if (level === 'club') return 95;
  if (level === 'gallery') return 125;
  if (level === 'upper') return 155;

  return 80; // fallback
}

// Base elevation for each level
function getElevation(level: string): number {
  if (level === 'presidents') return 5;
  if (level === 'field') return 8;
  if (level === 'club') return 35;
  if (level === 'gallery') return 60;
  if (level === 'upper') return 85;
  return 10; // fallback
}

// Check if section is covered (has overhang)
function isCovered(level: string, sectionId: string, rowNum: number): boolean {
  const sectionNum = parseInt(sectionId, 10);

  // Upper Gallery (400): Some coverage
  if (level === 'upper') return rowNum >= 7; // Back rows covered

  // Gallery (300): Partial coverage
  if (level === 'gallery') {
    if (sectionNum >= 305 && sectionNum <= 318) return rowNum >= 10; // Back rows
  }

  return false;
}

// Get level string for section
function getLevelString(level: string): string {
  const levelMap: Record<string, string> = {
    'presidents': 'Presidents Club',
    'field': '100 Level (Field)',
    'club': '200 Level (Club)',
    'gallery': '300 Level (Gallery)',
    'upper': '400 Level (Upper Gallery)',
  };
  return levelMap[level] || level;
}

// Create section configuration
function createSectionConfig(sectionId: string, level: string): SeatGenerationConfig {
  const sectionNum = parseInt(sectionId, 10) || 0;
  const rowCount = getRowCount(level, sectionId);
  const seatsPerRow = getSeatsPerRow(level, sectionId);
  const distance = getDistance(level, sectionId);
  const baseElevation = getElevation(level);
  const baseAngle = getBaseAngle(sectionId, level);

  // Generate rows array
  const rows = [];
  for (let i = 0; i < rowCount; i++) {
    let rowLabel: string;

    // Field level center sections start at D
    if (level === 'field' && sectionNum >= 114 && sectionNum <= 131) {
      if (i < 23) {
        rowLabel = String.fromCharCode(68 + i); // D-Z (23 rows)
      } else {
        const aaStart = i - 23;
        rowLabel = `${String.fromCharCode(65 + aaStart)}${String.fromCharCode(65 + aaStart)}`; // AA-YY
      }
    }
    // Field level other sections start at A
    else if (level === 'field') {
      if (i < 26) {
        rowLabel = String.fromCharCode(65 + i); // A-Z (26 rows)
      } else {
        const aaStart = i - 26;
        rowLabel = `${String.fromCharCode(65 + aaStart)}${String.fromCharCode(65 + aaStart)}`; // AA-WW
      }
    }
    // All other levels use A-N or A-P
    else {
      rowLabel = String.fromCharCode(65 + i); // A-N or A-P
    }

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
    sectionName: sectionId,
    baseAngle,
    angleSpan: 3.5,
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

// Main generation function
async function generateAllSections() {
  log.step(`Generating seat data for ${STADIUM_NAME}`);
  log.info(`Target capacity: ${OFFICIAL_CAPACITY.toLocaleString()} seats`);

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
      'Presidents Club': 0,
      '100 Level (Field)': 0,
      '200 Level (Club)': 0,
      '300 Level (Gallery)': 0,
      '400 Level (Upper Gallery)': 0,
    },
    seatDistribution: {
      standard: 0,
      aisle: 0,
      wheelchair: 0,
    },
    coveredSeats: 0,
  };

  // Generate Presidents Club sections (A-E)
  log.step('Generating Presidents Club sections (A-E)...');
  const presidentsSections = ['A', 'B', 'C', 'D', 'E'];
  for (const sectionId of presidentsSections) {
    const config = createSectionConfig(sectionId, 'presidents');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Presidents Club'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    // Export to file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Presidents Club: ${presidentsSections.length} sections, ${stats.levels['Presidents Club']} seats`);

  // Generate 100 Level sections (100-143)
  log.step('Generating 100 Level sections (100-143)...');
  for (let i = 100; i <= 143; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'field');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['100 Level (Field)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`100 Level: ${143 - 100 + 1} sections, ${stats.levels['100 Level (Field)']} seats`);

  // Generate 200 Level sections (201-243, not all exist)
  log.step('Generating 200 Level sections (201-243)...');
  const club200Sections = [
    ...Array.from({ length: 43 }, (_, i) => 201 + i), // 201-243
  ].filter(num => num !== 222); // Exclude section 222 if it doesn't exist

  for (const sectionNum of club200Sections) {
    const sectionId = `${sectionNum}`;
    const config = createSectionConfig(sectionId, 'club');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['200 Level (Club)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`200 Level: ${club200Sections.length} sections, ${stats.levels['200 Level (Club)']} seats`);

  // Generate 300 Level sections (301-321)
  log.step('Generating 300 Level sections (301-321)...');
  for (let i = 301; i <= 321; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'gallery');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['300 Level (Gallery)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`300 Level: ${321 - 301 + 1} sections, ${stats.levels['300 Level (Gallery)']} seats`);

  // Generate 400 Level sections (401-409, 416-420)
  log.step('Generating 400 Level sections (401-409, 416-420)...');
  const upper400Sections = [
    ...Array.from({ length: 9 }, (_, i) => 401 + i), // 401-409
    ...Array.from({ length: 5 }, (_, i) => 416 + i), // 416-420
  ];

  for (const sectionNum of upper400Sections) {
    const sectionId = `${sectionNum}`;
    const config = createSectionConfig(sectionId, 'upper');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['400 Level (Upper Gallery)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`400 Level: ${upper400Sections.length} sections, ${stats.levels['400 Level (Upper Gallery)']} seats`);

  // Calculate seat distribution
  for (const section of allSections) {
    for (const row of section.rows) {
      stats.seatDistribution.standard += row.seats.filter(s => s.type === 'standard').length;
      stats.seatDistribution.aisle += row.seats.filter(s => s.type === 'aisle').length;
      stats.seatDistribution.wheelchair += row.seats.filter(s => s.type === 'wheelchair').length;

      if (section.covered) {
        stats.coveredSeats += row.seats.length;
      }
    }
  }

  stats.totalSeats = totalSeats;
  stats.totalSections = allSections.length;

  // Write metadata file
  const metadataPath = path.join(__dirname, '..', 'src', 'data', 'seatData', STADIUM_ID, 'metadata.ts');
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
  log.success(`Metadata written to metadata.ts`);

  // Summary
  console.log('');
  log.step('Generation Summary:');
  console.log(`  ${colors.bright}Total Sections:${colors.reset} ${stats.totalSections}`);
  console.log(`  ${colors.bright}Total Seats:${colors.reset} ${totalSeats.toLocaleString()}`);
  console.log(`  ${colors.bright}Target Capacity:${colors.reset} ${OFFICIAL_CAPACITY.toLocaleString()}`);
  const accuracy = ((totalSeats / OFFICIAL_CAPACITY) * 100).toFixed(2);
  const diff = totalSeats - OFFICIAL_CAPACITY;
  const diffColor = Math.abs(diff) <= 100 ? colors.green : Math.abs(diff) <= 500 ? colors.yellow : colors.red;
  console.log(`  ${colors.bright}Accuracy:${colors.reset} ${diffColor}${accuracy}%${colors.reset} (${diff >= 0 ? '+' : ''}${diff} seats)`);

  console.log('');
  console.log(`  ${colors.cyan}Presidents Club:${colors.reset} ${stats.levels['Presidents Club'].toLocaleString()} seats`);
  console.log(`  ${colors.cyan}100 Level:${colors.reset} ${stats.levels['100 Level (Field)'].toLocaleString()} seats`);
  console.log(`  ${colors.cyan}200 Level:${colors.reset} ${stats.levels['200 Level (Club)'].toLocaleString()} seats`);
  console.log(`  ${colors.cyan}300 Level:${colors.reset} ${stats.levels['300 Level (Gallery)'].toLocaleString()} seats`);
  console.log(`  ${colors.cyan}400 Level:${colors.reset} ${stats.levels['400 Level (Upper Gallery)'].toLocaleString()} seats`);
  console.log('');

  if (Math.abs(diff) > OFFICIAL_CAPACITY * 0.01) {
    log.warning(`Capacity difference is ${Math.abs(diff)} seats (${((Math.abs(diff) / OFFICIAL_CAPACITY) * 100).toFixed(2)}%)`);
    log.warning('Consider adjusting row counts or seats per row to match target capacity');
  } else {
    log.success('Capacity match is excellent!');
  }

  log.success(`All ${stats.totalSections} sections generated successfully!`);
}

// Run generation
generateAllSections().catch(error => {
  log.error(`Generation failed: ${error.message}`);
  process.exit(1);
});
