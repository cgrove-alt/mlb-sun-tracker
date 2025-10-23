#!/usr/bin/env ts-node

/**
 * Petco Park Seat Generation Script
 * Generates comprehensive seat data for all sections
 *
 * Stadium Info:
 * - Capacity: 40,209 seats (from stadiums.ts - 2017-2018 configuration)
 * - Sections: ~113 sections across 4 main levels
 * - Levels: Premium Club (A-L), Field (100s), Club (200s), Upper (300s)
 * - Orientation: 25° (home to center field, NE)
 * - Open roof
 *
 * Created: 2025-10-22
 * Usage: npx tsx scripts/generatePadresSeats.ts
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

// Petco Park base parameters
const STADIUM_ID = 'padres';
const STADIUM_NAME = 'Petco Park';
const ORIENTATION = 25; // degrees (NE)
const OFFICIAL_CAPACITY = 40209; // From stadiums.ts (2017-2018 configuration)

// Per-level estimated capacity
const TARGET_PREMIUM = 1500;     // Premium Club A-L
const TARGET_FIELD = 12000;      // 100 Level
const TARGET_CLUB = 11000;       // 200 Level
const TARGET_UPPER = 15709;      // 300 Level
// Total: 40,209

// Angular positions for sections around stadium
// 0° = center field, positive angles clockwise
function getBaseAngle(sectionId: string, level: string): number {
  const centerField = ORIENTATION - 180; // -155° (205° adjusted)

  if (level === 'premium') {
    // Premium Club: A-L (behind home plate)
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    const index = letters.indexOf(sectionId);
    if (index >= 0) {
      return centerField - 22 + (index * 4); // ~44° arc behind home plate
    }
  } else if (level === 'field') {
    // Field level: 101-137 (37 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 101 && sectionNum <= 137) {
      const position = sectionNum - 101;
      return centerField + 85 - (position * 4.7); // ~170° arc
    }
  } else if (level === 'club') {
    // Club level: 201-235 (35 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 201 && sectionNum <= 235) {
      const position = sectionNum - 201;
      return centerField + 75 - (position * 4.4); // ~150° arc
    }
  } else if (level === 'upper') {
    // Upper level: 300-328 (29 sections)
    const sectionNum = parseInt(sectionId, 10);
    if (sectionNum >= 300 && sectionNum <= 328) {
      const position = sectionNum - 300;
      return centerField + 60 - (position * 4.3); // ~120° arc
    }
  }

  return centerField; // fallback
}

// Determine number of rows for each section
function getRowCount(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10);

  if (level === 'premium') return 10;

  if (level === 'field') {
    // Center sections (101-111): Letter rows A-I
    if (sectionNum >= 101 && sectionNum <= 111) return 9; // A-I
    // End sections (118-137): Rows 1-25
    if (sectionNum >= 118 && sectionNum <= 137) return 18; // Reduced
    // Corner sections (113-119)
    return 15; // Reduced
  }

  if (level === 'club') {
    // Center sections: Rows 1-15
    if (sectionNum >= 201 && sectionNum <= 208) return 15;
    // End/corner: Rows 1-13
    return 14;
  }

  if (level === 'upper') return 22; // Fine-tuned

  return 20; // fallback
}

// Determine seats per row
function getSeatsPerRow(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10);

  if (level === 'premium') return 13;

  if (level === 'field') {
    // Center sections (101-111): More seats
    if (sectionNum >= 101 && sectionNum <= 111) return 25; // Reduced
    // Corner sections
    if (sectionNum >= 113 && sectionNum <= 119) return 23; // Reduced
    // End sections (118-137)
    return 21; // Reduced
  }

  if (level === 'club') {
    // Center sections: More seats
    if (sectionNum >= 201 && sectionNum <= 208) return 24;
    // Corner sections
    if (sectionNum >= 210 && sectionNum <= 218) return 23; // Adjusted range
    // End sections
    return 21; // Fine-tuned for accuracy
  }

  if (level === 'upper') {
    // Center sections
    if (sectionNum >= 300 && sectionNum <= 302) return 26; // Reduced
    // Corner/end sections
    return 24; // Reduced
  }

  return 26; // fallback (average ~26 per row)
}

// Distance from home plate
function getDistance(level: string, sectionId: string): number {
  const sectionNum = parseInt(sectionId, 10);

  if (level === 'premium') return 60; // Very close
  if (level === 'field') {
    if (sectionNum >= 101 && sectionNum <= 111) return 70; // Center
    return 85; // Corners/ends
  }
  if (level === 'club') return 100;
  if (level === 'upper') return 140;

  return 80; // fallback
}

// Base elevation for each level
function getElevation(level: string): number {
  if (level === 'premium') return 12;
  if (level === 'field') return 8;
  if (level === 'club') return 38;
  if (level === 'upper') return 70;
  return 10; // fallback
}

// Check if section is covered (has overhang)
function isCovered(level: string, sectionId: string, rowNum: number): boolean {
  const sectionNum = parseInt(sectionId, 10);

  // Upper level: Rows 19+ typically covered
  if (level === 'upper') return rowNum >= 18; // Rows 19+ (0-indexed 18+)

  // Club level: Some partial coverage in back rows
  if (level === 'club') {
    if (sectionNum >= 205 && sectionNum <= 225) return rowNum >= 10;
  }

  return false;
}

// Get level string for section
function getLevelString(level: string): string {
  const levelMap: Record<string, string> = {
    'premium': 'Premium Club (A-L)',
    'field': '100 Level (Field)',
    'club': '200 Level (Club)',
    'upper': '300 Level (Upper)',
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

    // Field level center sections use letter rows A-I
    if (level === 'field' && sectionNum >= 101 && sectionNum <= 111) {
      rowLabel = String.fromCharCode(65 + i); // A-I
    }
    // Field level end sections use numeric rows 1-25
    else if (level === 'field' && sectionNum >= 118 && sectionNum <= 137) {
      rowLabel = `${i + 1}`; // 1-25
    }
    // All other levels use A-Z or 1-N
    else if (level === 'premium' || level === 'club') {
      rowLabel = `${i + 1}`; // Numeric rows
    }
    else {
      rowLabel = `${i + 1}`; // Numeric rows for upper
    }

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
    angleSpan: 4.0,
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
      'Premium Club (A-L)': 0,
      '100 Level (Field)': 0,
      '200 Level (Club)': 0,
      '300 Level (Upper)': 0,
    },
    seatDistribution: {
      standard: 0,
      aisle: 0,
      wheelchair: 0,
    },
    coveredSeats: 0,
  };

  // Generate Premium Club sections (A-L)
  log.step('Generating Premium Club sections (A-L)...');
  const premiumSections = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
  for (const sectionId of premiumSections) {
    const config = createSectionConfig(sectionId, 'premium');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['Premium Club (A-L)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    // Export to file
    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`Premium Club: ${premiumSections.length} sections, ${stats.levels['Premium Club (A-L)']} seats`);

  // Generate 100 Level sections (101-137)
  log.step('Generating 100 Level sections (101-137)...');
  for (let i = 101; i <= 137; i++) {
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
  log.success(`100 Level: ${137 - 101 + 1} sections, ${stats.levels['100 Level (Field)']} seats`);

  // Generate 200 Level sections (201-235)
  log.step('Generating 200 Level sections (201-235)...');
  for (let i = 201; i <= 235; i++) {
    const sectionId = `${i}`;
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
  log.success(`200 Level: ${235 - 201 + 1} sections, ${stats.levels['200 Level (Club)']} seats`);

  // Generate 300 Level sections (300-328)
  log.step('Generating 300 Level sections (300-328)...');
  for (let i = 300; i <= 328; i++) {
    const sectionId = `${i}`;
    const config = createSectionConfig(sectionId, 'upper');
    const section = generateSectionSeats(config);
    allSections.push(section);
    totalSeats += section.totalSeats;
    stats.levels['300 Level (Upper)'] += section.totalSeats;
    stats.totalRows += section.rows.length;

    const tsContent = exportSectionToTypeScript(section);
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, tsContent, 'utf-8');
  }
  log.success(`300 Level: ${328 - 300 + 1} sections, ${stats.levels['300 Level (Upper)']} seats`);

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
