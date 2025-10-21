#!/usr/bin/env ts-node

/**
 * Stadium Seat Data Validation Script
 * Validates generated seat data for accuracy and completeness
 * Created: 2025-10-21
 * Usage: ts-node scripts/validateStadiumData.ts --stadium=dodger-stadium
 */

import * as fs from 'fs';
import * as path from 'path';
import type { SectionSeatingData, SeatDataMetadata } from '../src/types/seat';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✅ PASSED:${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️  WARNING:${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}❌ FAILED:${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.cyan}ℹ️${colors.reset}  ${msg}`),
  section: (msg: string) => console.log(`\n${colors.bright}${msg}${colors.reset}`),
};

interface ValidationResult {
  passed: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Parse command line arguments
 */
function parseArgs(): { stadiumId: string } {
  const args = process.argv.slice(2);
  let stadiumId = '';

  for (const arg of args) {
    if (arg.startsWith('--stadium=')) {
      stadiumId = arg.split('=')[1];
    }
  }

  if (!stadiumId) {
    console.error('Missing required argument: --stadium');
    console.log('\nUsage:');
    console.log('  ts-node scripts/validateStadiumData.ts --stadium=<stadium-id>');
    console.log('\nExample:');
    console.log('  ts-node scripts/validateStadiumData.ts --stadium=dodger-stadium');
    process.exit(1);
  }

  return { stadiumId };
}

/**
 * Load all section files for a stadium
 */
function loadSections(stadiumId: string): SectionSeatingData[] {
  const sectionsDir = path.join(
    __dirname,
    '..',
    'src',
    'data',
    'seatData',
    stadiumId,
    'sections'
  );

  if (!fs.existsSync(sectionsDir)) {
    log.error(`Sections directory not found: ${sectionsDir}`);
    process.exit(1);
  }

  const files = fs.readdirSync(sectionsDir).filter((f) => f.endsWith('.ts') && !f.startsWith('_'));

  log.info(`Loading ${files.length} section files...`);

  const sections: SectionSeatingData[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(sectionsDir, file);
      const content = fs.readFileSync(filePath, 'utf-8');

      // Extract the exported variable name and data
      // This is a simplified approach - in production, use proper TS parsing
      const match = content.match(/export const \w+: SectionSeatingData = ({[\s\S]+});/);

      if (!match) {
        log.warning(`Could not parse ${file} - skipping`);
        continue;
      }

      // Use eval to parse the object (safe because we control the source)
      // In production, consider using ts-node to properly import
      const data = eval(`(${match[1]})`);
      sections.push(data);
    } catch (error) {
      log.warning(`Failed to load ${file}: ${error}`);
    }
  }

  log.success(`Loaded ${sections.length} sections`);
  return sections;
}

/**
 * Load metadata
 */
function loadMetadata(stadiumId: string): SeatDataMetadata | null {
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
    log.warning('Metadata file not found');
    return null;
  }

  try {
    const content = fs.readFileSync(metadataPath, 'utf-8');
    const match = content.match(/export const metadata: SeatDataMetadata = ({[\s\S]+?});/);

    if (!match) {
      log.warning('Could not parse metadata');
      return null;
    }

    const metadata = eval(`(${match[1]})`);
    return metadata;
  } catch (error) {
    log.warning(`Failed to load metadata: ${error}`);
    return null;
  }
}

/**
 * Validate total capacity
 */
function validateCapacity(
  sections: SectionSeatingData[],
  metadata: SeatDataMetadata | null
): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: [],
  };

  const totalSeats = sections.reduce((sum, s) => sum + s.totalSeats, 0);

  log.section('Capacity Check');
  console.log(`   Total Seats: ${totalSeats.toLocaleString()}`);

  if (metadata?.officialCapacity) {
    console.log(`   Official Capacity: ${metadata.officialCapacity.toLocaleString()}`);

    const difference = totalSeats - metadata.officialCapacity;
    const percentDiff = (Math.abs(difference) / metadata.officialCapacity) * 100;

    console.log(`   Difference: ${difference >= 0 ? '+' : ''}${difference} seats (${percentDiff.toFixed(1)}%)`);

    if (percentDiff > 1) {
      result.warnings.push(
        `Capacity difference exceeds 1% tolerance (${percentDiff.toFixed(1)}%)`
      );
      log.warning(`Capacity difference: ${difference} seats`);
    } else {
      console.log(`   ${colors.green}Status: Within acceptable tolerance${colors.reset}`);
    }
  } else {
    result.warnings.push('No official capacity in metadata for comparison');
  }

  return result;
}

/**
 * Validate unique seat IDs
 */
function validateUniqueSeatIds(sections: SectionSeatingData[]): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: [],
  };

  log.section('Unique Seat IDs Check');

  const allSeatIds = new Set<string>();
  const duplicates = new Set<string>();

  for (const section of sections) {
    for (const row of section.rows) {
      for (const seat of row.seats) {
        if (allSeatIds.has(seat.id)) {
          duplicates.add(seat.id);
          result.errors.push(`Duplicate seat ID: ${seat.id}`);
        }
        allSeatIds.add(seat.id);
      }
    }
  }

  console.log(`   Total IDs: ${allSeatIds.size.toLocaleString()}`);
  console.log(`   Unique IDs: ${(allSeatIds.size - duplicates.size).toLocaleString()}`);
  console.log(`   Duplicates: ${duplicates.size}`);

  if (duplicates.size > 0) {
    result.passed = false;
    log.error(`Found ${duplicates.size} duplicate seat IDs`);
  } else {
    console.log(`   ${colors.green}Status: All IDs unique${colors.reset}`);
  }

  return result;
}

/**
 * Validate coordinate bounds
 */
function validateCoordinateBounds(sections: SectionSeatingData[]): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: [],
  };

  log.section('Coordinate Bounds Check');

  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;
  let minZ = Infinity,
    maxZ = -Infinity;

  for (const section of sections) {
    for (const row of section.rows) {
      for (const seat of row.seats) {
        const { x, y, z } = seat.position3D;

        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
        minZ = Math.min(minZ, z);
        maxZ = Math.max(maxZ, z);
      }
    }
  }

  console.log(`   X Range: ${minX.toFixed(1)} to ${maxX.toFixed(1)} ft`);
  console.log(`   Y Range: ${minY.toFixed(1)} to ${maxY.toFixed(1)} ft`);
  console.log(`   Z Range: ${minZ.toFixed(1)} to ${maxZ.toFixed(1)} ft`);

  // Check for unreasonable bounds
  const maxDimension = 600; // 600 feet is very large for a stadium
  const maxHeight = 200; // 200 feet is extremely high

  if (Math.abs(minX) > maxDimension || Math.abs(maxX) > maxDimension) {
    result.warnings.push(`X coordinates exceed reasonable bounds (±${maxDimension} ft)`);
  }
  if (Math.abs(minY) > maxDimension || Math.abs(maxY) > maxDimension) {
    result.warnings.push(`Y coordinates exceed reasonable bounds (±${maxDimension} ft)`);
  }
  if (minZ < 0 || maxZ > maxHeight) {
    result.errors.push(`Z coordinates out of range (should be 0-${maxHeight} ft)`);
    result.passed = false;
  }

  if (result.errors.length === 0 && result.warnings.length === 0) {
    console.log(`   ${colors.green}Status: All within bounds${colors.reset}`);
  }

  return result;
}

/**
 * Validate distribution totals
 */
function validateDistribution(sections: SectionSeatingData[]): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: [],
  };

  log.section('Distribution Totals Check');

  const distribution = {
    standard: 0,
    aisle: 0,
    wheelchair: 0,
    companion: 0,
    other: 0,
  };

  for (const section of sections) {
    distribution.standard += section.seatDistribution.standard;
    distribution.aisle += section.seatDistribution.aisle;
    distribution.wheelchair += section.seatDistribution.wheelchair;
    distribution.companion += section.seatDistribution.companion;
    distribution.other += section.seatDistribution.other;
  }

  const total = Object.values(distribution).reduce((sum, val) => sum + val, 0);
  const totalSeats = sections.reduce((sum, s) => sum + s.totalSeats, 0);

  console.log(`   Standard: ${distribution.standard.toLocaleString()}`);
  console.log(`   Aisle: ${distribution.aisle.toLocaleString()}`);
  console.log(`   Wheelchair: ${distribution.wheelchair.toLocaleString()}`);
  console.log(`   Companion: ${distribution.companion.toLocaleString()}`);
  console.log(`   Other: ${distribution.other.toLocaleString()}`);
  console.log(`   Total: ${total.toLocaleString()}`);

  if (total !== totalSeats) {
    result.errors.push(
      `Distribution total (${total}) doesn't match seat total (${totalSeats})`
    );
    result.passed = false;
    log.error(`Distribution mismatch: ${total} vs ${totalSeats}`);
  } else {
    console.log(`   ${colors.green}Status: Totals match ✅${colors.reset}`);
  }

  return result;
}

/**
 * Check for section gaps
 */
function checkSectionGaps(sections: SectionSeatingData[]): ValidationResult {
  const result: ValidationResult = {
    passed: true,
    errors: [],
    warnings: [],
  };

  log.section('Section Continuity Check');

  const sectionIds = sections.map((s) => s.sectionId).sort();

  console.log(`   Total Sections: ${sectionIds.length}`);
  console.log(`   Section IDs: ${sectionIds.slice(0, 5).join(', ')}...${sectionIds.slice(-3).join(', ')}`);

  // Check for gaps in numbered sections
  const numberedSections = sectionIds
    .map((id) => parseInt(id, 10))
    .filter((num) => !isNaN(num))
    .sort((a, b) => a - b);

  if (numberedSections.length > 0) {
    const gaps: string[] = [];
    for (let i = 1; i < numberedSections.length; i++) {
      const current = numberedSections[i];
      const previous = numberedSections[i - 1];

      if (current - previous > 1) {
        gaps.push(`${previous + 1}-${current - 1}`);
      }
    }

    if (gaps.length > 0) {
      result.warnings.push(`Gaps in numbered sections: ${gaps.join(', ')}`);
      log.warning(`Missing sections: ${gaps.join(', ')}`);
      console.log(`   ${colors.yellow}Note: This may be normal for multi-level stadiums${colors.reset}`);
    }
  }

  return result;
}

/**
 * Generate comprehensive report
 */
function generateReport(
  sections: SectionSeatingData[],
  results: ValidationResult[],
  stadiumId: string
): void {
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const allPassed = results.every((r) => r.passed);

  console.log('\n' + '━'.repeat(50));
  console.log(`${colors.bright}📊 ${stadiumId.toUpperCase()} VALIDATION REPORT${colors.reset}`);
  console.log('━'.repeat(50) + '\n');

  if (allPassed && totalWarnings === 0) {
    console.log(`${colors.green}${colors.bright}✅ ALL CHECKS PASSED${colors.reset}\n`);
    console.log('Data is ready for deployment!\n');
  } else if (allPassed) {
    console.log(`${colors.yellow}${colors.bright}⚠️  PASSED WITH WARNINGS (${totalWarnings})${colors.reset}\n`);
    console.log('Review warnings before deployment.\n');
  } else {
    console.log(`${colors.red}${colors.bright}❌ VALIDATION FAILED (${totalErrors} errors)${colors.reset}\n`);
    console.log('Fix errors before deployment.\n');
  }

  if (totalErrors > 0) {
    console.log(`${colors.red}Errors:${colors.reset}`);
    results.forEach((r) => {
      r.errors.forEach((err) => console.log(`  • ${err}`));
    });
    console.log();
  }

  if (totalWarnings > 0) {
    console.log(`${colors.yellow}Warnings:${colors.reset}`);
    results.forEach((r) => {
      r.warnings.forEach((warn) => console.log(`  • ${warn}`));
    });
    console.log();
  }

  console.log('━'.repeat(50));

  process.exit(allPassed ? 0 : 1);
}

/**
 * Main execution
 */
function main() {
  console.log(`${colors.bright}MLB Sun Tracker - Stadium Data Validation${colors.reset}\n`);

  const { stadiumId } = parseArgs();

  log.info(`Validating: ${stadiumId}\n`);

  // Load data
  const sections = loadSections(stadiumId);
  const metadata = loadMetadata(stadiumId);

  if (sections.length === 0) {
    log.error('No sections loaded - cannot validate');
    process.exit(1);
  }

  // Run validation checks
  const results: ValidationResult[] = [
    validateCapacity(sections, metadata),
    validateUniqueSeatIds(sections),
    validateCoordinateBounds(sections),
    validateDistribution(sections),
    checkSectionGaps(sections),
  ];

  // Generate report
  generateReport(sections, results, stadiumId);
}

// Run if executed directly
if (require.main === module) {
  main();
}

export { validateCapacity, validateUniqueSeatIds, validateCoordinateBounds };
