#!/usr/bin/env ts-node

/**
 * CSV Seat Data Import Tool
 * Parses CSV files with section/row/seat data and generates TypeScript files
 * Created: 2025-10-21
 * Usage: ts-node scripts/importSeatData.ts --stadium=dodger-stadium --csv=path/to/data.csv
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import {
  generateSectionSeats,
  validateSectionSeats,
  exportSectionToTypeScript,
  type SeatGenerationConfig,
} from '../src/utils/generateSeatPositions';
import type { SectionSeatingData } from '../src/types/seat';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️${colors.reset}  ${msg}`),
  error: (msg: string) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.cyan}ℹ️${colors.reset}  ${msg}`),
  step: (msg: string) => console.log(`${colors.bright}⚙️${colors.reset}  ${msg}`),
};

interface CSVRow {
  section_id: string;
  section_name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite';
  rows: string; // Comma-separated row labels
  seats_per_row: string; // Single number or comma-separated counts
  covered: string; // 'true' or 'false'
  partial_coverage?: string;
  covered_rows?: string;
  base_angle: string; // Degrees
  angle_span: string; // Degrees
  price_tier?: 'value' | 'moderate' | 'premium' | 'luxury';
  wheelchair_rows?: string;
  notes?: string;
}

interface ParsedSection {
  config: SeatGenerationConfig;
  csvRow: CSVRow;
}

/**
 * Parse command line arguments
 */
function parseArgs(): { stadiumId: string; csvPath: string } {
  const args = process.argv.slice(2);
  let stadiumId = '';
  let csvPath = '';

  for (const arg of args) {
    if (arg.startsWith('--stadium=')) {
      stadiumId = arg.split('=')[1];
    } else if (arg.startsWith('--csv=')) {
      csvPath = arg.split('=')[1];
    }
  }

  if (!stadiumId || !csvPath) {
    log.error('Missing required arguments');
    console.log('\nUsage:');
    console.log('  ts-node scripts/importSeatData.ts --stadium=<stadium-id> --csv=<path-to-csv>');
    console.log('\nExample:');
    console.log('  ts-node scripts/importSeatData.ts --stadium=dodger-stadium --csv=./dodger-data.csv');
    process.exit(1);
  }

  return { stadiumId, csvPath };
}

/**
 * Read and parse CSV file
 */
function readCSV(csvPath: string): CSVRow[] {
  log.step(`Reading CSV file: ${csvPath}`);

  if (!fs.existsSync(csvPath)) {
    log.error(`CSV file not found: ${csvPath}`);
    process.exit(1);
  }

  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  try {
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    }) as CSVRow[];

    log.success(`Parsed ${records.length} sections from CSV`);
    return records;
  } catch (error) {
    log.error(`Failed to parse CSV: ${error}`);
    process.exit(1);
  }
}

/**
 * Parse row labels from comma-separated string
 */
function parseRowLabels(rowsString: string): string[] {
  return rowsString.split(',').map((r) => r.trim());
}

/**
 * Parse seats per row - can be single number or comma-separated counts
 */
function parseSeatsPerRow(
  seatsString: string,
  rowCount: number
): number[] {
  const trimmed = seatsString.trim();

  // Single number - all rows have same seat count
  if (!trimmed.includes(',')) {
    const count = parseInt(trimmed, 10);
    return new Array(rowCount).fill(count);
  }

  // Comma-separated - different count per row
  const counts = trimmed.split(',').map((s) => parseInt(s.trim(), 10));

  if (counts.length !== rowCount) {
    throw new Error(
      `Seat count mismatch: ${counts.length} counts for ${rowCount} rows`
    );
  }

  return counts;
}

/**
 * Convert CSV row to SeatGenerationConfig
 */
function csvToConfig(csvRow: CSVRow, stadiumId: string): SeatGenerationConfig {
  const rowLabels = parseRowLabels(csvRow.rows);
  const seatCounts = parseSeatsPerRow(csvRow.seats_per_row, rowLabels.length);

  const rows = rowLabels.map((label, index) => ({
    rowLabel: label,
    seatCount: seatCounts[index],
    rowNumber: index,
  }));

  // Parse covered rows if provided
  const wheelchairRows = csvRow.wheelchair_rows
    ? csvRow.wheelchair_rows.split(',').map((r) => r.trim())
    : undefined;

  // Determine aisle seats (typically first and last in row)
  const aisleSeats = rows.length > 0 ? [1, rows[0].seatCount] : [];

  const config: SeatGenerationConfig = {
    sectionId: csvRow.section_id,
    sectionName: csvRow.section_name,
    stadiumId,
    baseAngle: parseFloat(csvRow.base_angle),
    angleSpan: parseFloat(csvRow.angle_span),

    // Elevation defaults by level (can be refined later)
    baseElevation: getBaseElevation(csvRow.level),
    rowHeight: 2.5, // Standard 2.5 feet per row rake

    // Depth defaults (distance from home plate)
    startDepth: getStartDepth(csvRow.level, parseFloat(csvRow.base_angle)),
    rowDepth: 3, // Standard 3 feet per row depth

    rows,

    // Seat dimensions
    seatWidth: 2.0, // Standard 2 feet
    seatSpacing: 0.5, // Standard 0.5 feet between seats
    rowSpacing: 36, // Standard 36 inches

    // Section properties
    level: csvRow.level,
    covered: csvRow.covered === 'true',
    overhangHeight: csvRow.covered === 'true' ? 40 : undefined,
    priceRange: csvRow.price_tier,

    // Accessibility
    wheelchairRows,
    aisleSeats,
  };

  return config;
}

/**
 * Get base elevation for level
 */
function getBaseElevation(
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite'
): number {
  const elevations = {
    field: 0,
    lower: 25,
    club: 50,
    upper: 75,
    suite: 60,
  };
  return elevations[level];
}

/**
 * Get starting depth based on level and angle
 * Sections behind home plate are closer, outfield sections farther
 */
function getStartDepth(level: string, angle: number): number {
  // Base distance from home plate
  let baseDistance = 60; // Field level behind home

  // Adjust by level
  if (level === 'lower') baseDistance += 20;
  if (level === 'club') baseDistance += 30;
  if (level === 'upper') baseDistance += 40;
  if (level === 'suite') baseDistance += 25;

  // Adjust by angle (outfield sections are farther)
  // 0° = behind home (close)
  // 90° = first base (medium)
  // 180° = outfield (far)
  const angleFactor = Math.abs(Math.cos((angle * Math.PI) / 180));
  const angleAdjustment = (1 - angleFactor) * 100; // 0-100 feet

  return baseDistance + angleAdjustment;
}

/**
 * Process all CSV rows and generate sections
 */
function processSections(
  csvRows: CSVRow[],
  stadiumId: string
): ParsedSection[] {
  log.step('Converting CSV to section configs...');

  const sections: ParsedSection[] = [];
  const errors: string[] = [];

  for (const csvRow of csvRows) {
    try {
      const config = csvToConfig(csvRow, stadiumId);
      sections.push({ config, csvRow });
    } catch (error) {
      const errorMsg = `Section ${csvRow.section_id} (${csvRow.section_name}): ${error}`;
      errors.push(errorMsg);
      log.error(errorMsg);
    }
  }

  if (errors.length > 0) {
    log.error(`Failed to process ${errors.length} sections`);
    process.exit(1);
  }

  log.success(`Converted ${sections.length} sections successfully`);
  return sections;
}

/**
 * Generate seat data for all sections
 */
function generateAllSections(sections: ParsedSection[]): SectionSeatingData[] {
  log.step('Generating seat coordinates...');

  const sectionData: SectionSeatingData[] = [];
  let totalSeats = 0;
  let errors = 0;

  for (const { config, csvRow } of sections) {
    try {
      const data = generateSectionSeats(config);
      const validation = validateSectionSeats(data);

      if (!validation.valid) {
        log.error(
          `Validation failed for ${config.sectionName}:\n  ${validation.errors.join('\n  ')}`
        );
        errors++;
        continue;
      }

      if (validation.warnings.length > 0) {
        log.warning(
          `Warnings for ${config.sectionName}:\n  ${validation.warnings.join('\n  ')}`
        );
      }

      sectionData.push(data);
      totalSeats += data.totalSeats;

      log.step(
        `Generated ${data.totalSeats} seats for ${config.sectionName}`
      );
    } catch (error) {
      log.error(`Failed to generate ${config.sectionName}: ${error}`);
      errors++;
    }
  }

  if (errors > 0) {
    log.error(`Failed to generate ${errors} sections`);
    process.exit(1);
  }

  log.success(
    `Generated ${totalSeats.toLocaleString()} seats across ${sectionData.length} sections`
  );
  return sectionData;
}

/**
 * Export sections to TypeScript files
 */
function exportSections(
  sectionData: SectionSeatingData[],
  stadiumId: string
): void {
  log.step('Exporting TypeScript files...');

  const outputDir = path.join(
    __dirname,
    '..',
    'src',
    'data',
    'seatData',
    stadiumId,
    'sections'
  );

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let exported = 0;

  for (const section of sectionData) {
    const filename = `${section.sectionId}.ts`;
    const filepath = path.join(outputDir, filename);
    const content = exportSectionToTypeScript(section);

    fs.writeFileSync(filepath, content, 'utf-8');
    exported++;
  }

  log.success(`Exported ${exported} TypeScript files to ${outputDir}`);
}

/**
 * Update stadium metadata file
 */
function updateMetadata(
  sectionData: SectionSeatingData[],
  stadiumId: string
): void {
  log.step('Updating metadata...');

  const metadataPath = path.join(
    __dirname,
    '..',
    'src',
    'data',
    'seatData',
    stadiumId,
    'metadata.ts'
  );

  if (!fs.existsSync(metadataPath)) {
    log.warning(`Metadata file not found at ${metadataPath} - skipping update`);
    return;
  }

  // Calculate totals
  const totalSeats = sectionData.reduce((sum, s) => sum + s.totalSeats, 0);
  const totalSections = sectionData.length;

  // Read existing metadata
  let metadataContent = fs.readFileSync(metadataPath, 'utf-8');

  // Update fields
  metadataContent = metadataContent.replace(
    /sectionsComplete: \d+/,
    `sectionsComplete: ${totalSections}`
  );
  metadataContent = metadataContent.replace(
    /sectionsMissing: \d+/,
    `sectionsMissing: 0`
  );
  metadataContent = metadataContent.replace(
    /seatsComplete: \d+/,
    `seatsComplete: ${totalSeats}`
  );
  metadataContent = metadataContent.replace(/seatsMissing: \d+/, `seatsMissing: 0`);

  // Write updated metadata
  fs.writeFileSync(metadataPath, metadataContent, 'utf-8');

  log.success(`Updated metadata: ${totalSections} sections, ${totalSeats.toLocaleString()} seats`);
}

/**
 * Generate summary report
 */
function generateReport(sectionData: SectionSeatingData[]): void {
  const totalSeats = sectionData.reduce((sum, s) => sum + s.totalSeats, 0);
  const byLevel = sectionData.reduce(
    (acc, s) => {
      const level = s.rows[0]?.seats[0]?.accessibility?.wheelchairAccessible
        ? 'wheelchair'
        : 'standard';
      acc[level] = (acc[level] || 0) + s.totalSeats;
      return acc;
    },
    {} as Record<string, number>
  );

  console.log('\n' + '━'.repeat(50));
  console.log(`${colors.bright}📊 IMPORT SUMMARY${colors.reset}`);
  console.log('━'.repeat(50));
  console.log(`Total Sections: ${sectionData.length}`);
  console.log(`Total Seats: ${totalSeats.toLocaleString()}`);
  console.log('\nBy Level:');

  const levels = sectionData.reduce(
    (acc, s) => {
      const level = s.sectionId.includes('RS')
        ? 'Reserve'
        : s.sectionId.includes('TD')
          ? 'Top Deck'
          : s.sectionId.startsWith('3')
            ? 'Pavilion'
            : parseInt(s.sectionId, 10) >= 100
              ? 'Loge'
              : 'Field';
      acc[level] = (acc[level] || 0) + s.totalSeats;
      return acc;
    },
    {} as Record<string, number>
  );

  Object.entries(levels)
    .sort(([, a], [, b]) => b - a)
    .forEach(([level, count]) => {
      console.log(`  ${level}: ${count.toLocaleString()} seats`);
    });

  console.log('━'.repeat(50) + '\n');
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bright}MLB Sun Tracker - Seat Data Import Tool${colors.reset}\n`);

  const { stadiumId, csvPath } = parseArgs();

  log.info(`Stadium: ${stadiumId}`);
  log.info(`CSV File: ${csvPath}\n`);

  // Step 1: Read CSV
  const csvRows = readCSV(csvPath);

  // Step 2: Process sections
  const sections = processSections(csvRows, stadiumId);

  // Step 3: Generate seat data
  const sectionData = generateAllSections(sections);

  // Step 4: Export TypeScript files
  exportSections(sectionData, stadiumId);

  // Step 5: Update metadata
  updateMetadata(sectionData, stadiumId);

  // Step 6: Generate report
  generateReport(sectionData);

  log.success('Import complete! Ready for validation.\n');
  log.info('Next step: Run validation script');
  log.info(`  npm run validate-stadium-data -- --stadium=${stadiumId}\n`);
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { csvToConfig, processSections, generateAllSections };
