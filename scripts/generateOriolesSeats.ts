#!/usr/bin/env ts-node

/**
 * Oriole Park at Camden Yards Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 45,971 seats (from stadiums.ts - 2011-2021 configuration)
 * - Sections: ~140 sections across 4 main levels
 * - Levels: Field (even/odd), Club (200s), Terrace, Upper (300s)
 * - Orientation: 58° (home to center field, NE)
 * - Open roof
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generateOriolesSeats.ts
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

// Oriole Park base parameters
const STADIUM_ID = 'orioles';
const STADIUM_NAME = 'Oriole Park at Camden Yards';
const ORIENTATION = 58; // degrees (NE orientation)
const OFFICIAL_CAPACITY = 45971; // From stadiums.ts (2011-2021)

// Per-level estimated capacity
const TARGET_FIELD = 24000;    // Field level (even + odd sections)
const TARGET_CLUB = 10000;     // Club level (200s)
const TARGET_TERRACE = 4000;   // Terrace
const TARGET_UPPER = 7971;     // Upper level (300s)
// Total: 45,971

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string, level: string): number {
  const centerField = ORIENTATION - 180; // -122° (238° adjusted)
  const sectionNum = parseInt(sectionId, 10);

  if (level === 'field-even' || level === 'field-odd') {
    // Field level: 4-98 (wraps around stadium)
    if (sectionNum >= 4 && sectionNum <= 98) {
      const position = (sectionNum - 4) / 2; // Normalize to 0-47
      return centerField + 80 - (position * 3.4); // ~160° arc
    }
  } else if (level === 'club') {
    // Club level: 204-288
    if (sectionNum >= 204 && sectionNum <= 288) {
      const position = sectionNum - 204;
      return centerField + 75 - (position * 3.5); // ~150° arc
    }
  } else if (level === 'terrace') {
    // Terrace: 31-43
    if (sectionNum >= 31 && sectionNum <= 43) {
      const position = sectionNum - 31;
      return centerField + 30 - (position * 5.0); // ~60° arc (infield only)
    }
  } else if (level === 'upper') {
    // Upper: 306-388
    if (sectionNum >= 306 && sectionNum <= 388) {
      const position = sectionNum - 306;
      return centerField + 70 - (position * 3.4); // ~140° arc
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10);

  if (level === 'field-even') {
    // Field box sections
    if (sectionNum >= 16 && sectionNum <= 58) return 18; // Infield
    return 17; // Corners/outfield
  }

  if (level === 'field-odd') {
    // Lower reserve
    if (sectionNum >= 15 && sectionNum <= 59) return 18; // Infield
    return 16; // Corners/outfield
  }

  if (level === 'club') return 10;

  if (level === 'terrace') return 13;

  if (level === 'upper') {
    // Upper level varies
    if (sectionNum >= 322 && sectionNum <= 346) return 13; // Center
    return 15; // Corners/ends
  }

  return 20; // fallback
}

// Determine seats per row
function getSeatsPerRow(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10);

  if (level === 'field-even') {
    // Field box
    if (sectionNum >= 20 && sectionNum <= 54) return 17; // Infield
    if (sectionNum >= 90 && sectionNum <= 98) return 11; // Eutaw Street
    return 15; // Corners/outfield
  }

  if (level === 'field-odd') {
    // Lower reserve
    if (sectionNum >= 19 && sectionNum <= 55) return 16; // Infield
    return 14; // Corners/outfield
  }

  if (level === 'club') {
    // Club level
    if (sectionNum >= 240 && sectionNum <= 250) return 10; // Infield center
    return 8; // Corners/ends
  }

  if (level === 'terrace') return 13;

  if (level === 'upper') {
    // Upper level
    if (sectionNum >= 322 && sectionNum <= 346) return 12; // Center
    return 10; // Corners/ends
  }

  return 18; // fallback
}

// Distance from home plate
function getDistance(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10);

  if (level === 'field-even' || level === 'field-odd') {
    if (sectionNum >= 20 && sectionNum <= 54) return 70; // Infield
    if (sectionNum >= 90 && sectionNum <= 98) return 90; // Eutaw Street (farther)
    return 80; // Corners/outfield
  }

  if (level === 'club') return 100;
  if (level === 'terrace') return 85; // Between field and club
  if (level === 'upper') return 140;

  return 80; // fallback
}

// Base elevation for each level
function getElevation(level: string): number {
  if (level === 'field-even' || level === 'field-odd') return 10;
  if (level === 'terrace') return 25;
  if (level === 'club') return 40;
  if (level === 'upper') return 70;
  return 10; // fallback
}

// Check if section is covered (has overhang)
function isCovered(level: string, sectionId: string, rowNum: number): boolean {
  const sectionNum = parseInt(sectionId, 10);

  // Terrace level: all covered except 1-7
  if (level === 'terrace') {
    if (sectionNum >= 1 && sectionNum <= 7) return false;
    return true;
  }

  // Upper level provides coverage
  if (level === 'upper') return rowNum >= 12; // Back rows covered

  // Field level back rows under upper deck
  if (level === 'field-even' || level === 'field-odd') {
    if (rowNum >= 20) return true; // Back rows
  }

  return false;
}

// Get level string for section
function getLevelString(level: string): string {
  const levelMap: Record<string, string> = {
    'field-even': 'Field Box',
    'field-odd': 'Lower Reserve',
    'club': 'Club Level',
    'terrace': 'Terrace Level',
    'upper': 'Upper Level',
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
    const rowLabel = `${i + 1}`; // Simple numeric rows

    rows.push({
      rowLabel,
      seatCount: seatsPerRow,
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
      'Field Box': 0,
      'Lower Reserve': 0,
      'Club Level': 0,
      'Terrace Level': 0,
      'Upper Level': 0,
    },
    seatDistribution: {
      standard: 0,
      aisle: 0,
      wheelchair: 0,
    },
    coveredSeats: 0,
  };

  // Generate Field Box sections (even numbers 4-98)
  log.step('Generating Field Box sections (4-98, even numbers)...');
  for (let i = 4; i <= 98; i += 2) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'field-even');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Field Box'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  const fieldBoxCount = (98 - 4) / 2 + 1;
  log.success(`Field Box: ${fieldBoxCount} sections, ${stats.levels['Field Box']} seats`);

  // Generate Lower Reserve sections (odd numbers 1-87)
  log.step('Generating Lower Reserve sections (1-87, odd numbers)...');
  for (let i = 1; i <= 87; i += 2) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'field-odd');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Lower Reserve'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  const lowerReserveCount = (87 - 1) / 2 + 1;
  log.success(`Lower Reserve: ${lowerReserveCount} sections, ${stats.levels['Lower Reserve']} seats`);

  // Generate Club Level sections (204-288)
  log.step('Generating Club Level sections (204-288)...');
  for (let i = 204; i <= 288; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'club');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Club Level'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Club Level: ${288 - 204 + 1} sections, ${stats.levels['Club Level']} seats`);

  // Generate Terrace sections (31-43)
  log.step('Generating Terrace Level sections (31-43)...');
  for (let i = 31; i <= 43; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'terrace');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Terrace Level'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Terrace Level: ${43 - 31 + 1} sections, ${stats.levels['Terrace Level']} seats`);

  // Generate Upper Level sections (306-388)
  log.step('Generating Upper Level sections (306-388)...');
  for (let i = 306; i <= 388; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'upper');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Upper Level'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Upper Level: ${388 - 306 + 1} sections, ${stats.levels['Upper Level']} seats`);

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
  console.log(`  ${colors.cyan}Field Box:${colors.reset} ${stats.levels['Field Box'].toLocaleString()} seats`);
  console.log(`  ${colors.cyan}Lower Reserve:${colors.reset} ${stats.levels['Lower Reserve'].toLocaleString()} seats`);
  console.log(`  ${colors.cyan}Club Level:${colors.reset} ${stats.levels['Club Level'].toLocaleString()} seats`);
  console.log(`  ${colors.cyan}Terrace Level:${colors.reset} ${stats.levels['Terrace Level'].toLocaleString()} seats`);
  console.log(`  ${colors.cyan}Upper Level:${colors.reset} ${stats.levels['Upper Level'].toLocaleString()} seats`);
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
