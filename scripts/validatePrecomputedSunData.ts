#!/usr/bin/env ts-node

/**
 * Precomputed Sun Data Validation Script
 * Spot-checks pre-computed sun exposure against real-time calculations
 * Created: 2025-10-21
 * Usage: npx tsx scripts/validatePrecomputedSunData.ts --stadium=dodger-stadium
 */

import * as fs from 'fs';
import * as path from 'path';
import { gunzipSync } from 'zlib';
import type { Seat } from '../src/types/seat';
import { calculateSeatSunExposureAtTime } from '../src/utils/seatSunCalculations';
import { MLB_STADIUMS } from '../src/data/stadiums';

// ANSI color codes
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
};

interface PrecomputedData {
  stadiumId: string;
  gameTime: string;
  dates: string[];
  timePoints: string[];
  seats: Record<string, { seatId: string; timeline: string[] }>;
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
    console.log('  npx tsx scripts/validatePrecomputedSunData.ts --stadium=<stadium-id>');
    process.exit(1);
  }

  return { stadiumId };
}

/**
 * Load precomputed data
 */
function loadPrecomputedData(stadiumId: string): PrecomputedData {
  const filePath = path.join(
    __dirname,
    '..',
    'src',
    'data',
    'seatData',
    stadiumId,
    'precomputed-sun-110pm.json.gz'
  );

  if (!fs.existsSync(filePath)) {
    log.error(`Precomputed file not found: ${filePath}`);
    process.exit(1);
  }

  const compressed = fs.readFileSync(filePath);
  const decompressed = gunzipSync(compressed);
  return JSON.parse(decompressed.toString('utf-8'));
}

/**
 * Load a random seat from sections
 */
async function getRandomSeat(stadiumId: string, sectionId: string): Promise<Seat | null> {
  try {
    const sectionPath = path.join(
      __dirname,
      '..',
      'src',
      'data',
      'seatData',
      stadiumId,
      'sections',
      `${sectionId}.ts`
    );

    const module = await import(sectionPath);
    const section = module.default || module[Object.keys(module)[0]];

    if (!section || !section.rows || section.rows.length === 0) {
      return null;
    }

    // Get a random row
    const randomRow = section.rows[Math.floor(Math.random() * section.rows.length)];
    if (!randomRow.seats || randomRow.seats.length === 0) {
      return null;
    }

    // Get a random seat from the row
    const randomSeat = randomRow.seats[Math.floor(Math.random() * randomRow.seats.length)];
    return randomSeat;
  } catch (error) {
    log.warning(`Failed to load section ${sectionId}: ${error}`);
    return null;
  }
}

/**
 * Validate a single seat's timeline
 */
function validateSeatTimeline(
  seat: Seat,
  precomputedTimeline: string[],
  dates: string[],
  timePoints: string[],
  latitude: number,
  longitude: number
): { total: number; matches: number; mismatches: number } {
  let total = 0;
  let matches = 0;
  let mismatches = 0;

  // Check a few random dates (not all to save time)
  const datesToCheck = [0, 7, 14, 21, 27]; // Early, mid, late season

  for (const dateIndex of datesToCheck) {
    if (dateIndex >= dates.length) continue;

    const date = new Date(dates[dateIndex]);
    const timeline = precomputedTimeline[dateIndex];

    // Check a few time points
    const timeIndicesToCheck = [0, 5, 10, 15, 20]; // Start, quarter, mid, three-quarter, end

    for (const timeIndex of timeIndicesToCheck) {
      if (timeIndex >= timePoints.length) continue;

      const [hours, minutes] = timePoints[timeIndex].split(':').map(Number);
      const gameTime = new Date(date);
      gameTime.setHours(hours, minutes, 0, 0);

      try {
        // Calculate real-time exposure
        const exposure = calculateSeatSunExposureAtTime(
          seat,
          gameTime,
          latitude,
          longitude,
          [] // No obstructions for now
        );

        const expectedInSun = exposure.inSun && exposure.sunIntensity > 50 ? '1' : '0';
        const precomputedInSun = timeline[timeIndex];

        total++;
        if (expectedInSun === precomputedInSun) {
          matches++;
        } else {
          mismatches++;
        }
      } catch (error) {
        // Calculation error - skip
        total++;
      }
    }
  }

  return { total, matches, mismatches };
}

/**
 * Main validation
 */
async function main() {
  console.log(`${colors.bright}Precomputed Sun Data Validation${colors.reset}\n`);

  const { stadiumId } = parseArgs();

  // Load stadium data
  const stadiumIdMap: Record<string, string> = {
    'dodger-stadium': 'dodgers',
  };
  const mlbStadiumId = stadiumIdMap[stadiumId] || stadiumId;
  const stadium = MLB_STADIUMS.find((s) => s.id === mlbStadiumId);

  if (!stadium) {
    log.error(`Stadium not found: ${stadiumId}`);
    process.exit(1);
  }

  log.info(`Validating: ${stadium.name}`);
  log.info(`Stadium ID: ${stadiumId}\n`);

  // Load precomputed data
  const precomputed = loadPrecomputedData(stadiumId);
  log.success(`Loaded precomputed data: ${Object.keys(precomputed.seats).length} seats\n`);

  // Select random seats to validate
  const sectionsToTest = ['101', '1', '15', '120', '1RS', '305', '1TD'];
  const seatsToValidate: Seat[] = [];

  log.info('Loading random seats for validation...');
  for (const sectionId of sectionsToTest) {
    const seat = await getRandomSeat(stadiumId, sectionId);
    if (seat) {
      seatsToValidate.push(seat);
      log.info(`  - ${seat.id} (Section ${sectionId})`);
    }
  }

  if (seatsToValidate.length === 0) {
    log.error('No seats found for validation');
    process.exit(1);
  }

  console.log();
  log.info(`Validating ${seatsToValidate.length} seats...\n`);

  // Validate each seat
  let totalChecks = 0;
  let totalMatches = 0;
  let totalMismatches = 0;

  for (const seat of seatsToValidate) {
    const precomputedSeat = precomputed.seats[seat.id];
    if (!precomputedSeat) {
      log.warning(`Seat ${seat.id} not found in precomputed data`);
      continue;
    }

    const result = validateSeatTimeline(
      seat,
      precomputedSeat.timeline,
      precomputed.dates,
      precomputed.timePoints,
      stadium.latitude,
      stadium.longitude
    );

    totalChecks += result.total;
    totalMatches += result.matches;
    totalMismatches += result.mismatches;

    const accuracy = result.total > 0 ? ((result.matches / result.total) * 100).toFixed(1) : '0';
    const status = result.mismatches === 0 ? '✅' : result.mismatches < 3 ? '⚠️' : '❌';

    console.log(
      `${status} ${seat.id.padEnd(30)} - ${result.matches}/${result.total} matches (${accuracy}% accurate)`
    );
  }

  // Summary
  console.log('\n' + '━'.repeat(70));
  console.log(`${colors.bright}VALIDATION SUMMARY${colors.reset}`);
  console.log('━'.repeat(70));

  const overallAccuracy = totalChecks > 0 ? ((totalMatches / totalChecks) * 100).toFixed(2) : '0';

  console.log(`Total checks: ${totalChecks}`);
  console.log(`Matches: ${totalMatches}`);
  console.log(`Mismatches: ${totalMismatches}`);
  console.log(`Overall accuracy: ${overallAccuracy}%`);

  if (parseFloat(overallAccuracy) >= 95) {
    log.success('\nValidation PASSED - Precomputed data is highly accurate');
  } else if (parseFloat(overallAccuracy) >= 85) {
    log.warning('\nValidation WARNING - Some discrepancies found but acceptable');
  } else {
    log.error('\nValidation FAILED - Significant discrepancies detected');
    process.exit(1);
  }

  console.log('\nNotes:');
  console.log('  - Small discrepancies may occur due to floating-point precision');
  console.log('  - Obstructions are not yet included in calculations');
  console.log('  - Binary encoding uses 50% intensity threshold\n');
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    log.error(`Fatal error: ${error}`);
    console.error(error);
    process.exit(1);
  });
}
