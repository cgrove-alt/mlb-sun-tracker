#!/usr/bin/env ts-node

/**
 * Sun Exposure Pre-computation Script
 * Pre-computes sun exposure for all seats at common game times
 * Created: 2025-10-21
 * Usage: npx tsx scripts/precomputeSunData.ts --stadium=dodger-stadium --game-time=13:10
 */

import * as fs from 'fs';
import * as path from 'path';
import { gzipSync } from 'zlib';
import type { SectionSeatingData, Seat } from '../src/types/seat';
import { calculateSeatSunExposureAtTime } from '../src/utils/seatSunCalculations';
import { MLB_STADIUMS } from '../src/data/stadiums';
import type { Obstruction3D } from '../src/types/stadium-complete';

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
  success: (msg: string) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️${colors.reset}  ${msg}`),
  error: (msg: string) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.cyan}ℹ️${colors.reset}  ${msg}`),
  step: (msg: string) => console.log(`${colors.bright}⚙️${colors.reset}  ${msg}`),
  progress: (msg: string) => process.stdout.write(`\r${colors.dim}${msg}${colors.reset}`),
};

interface PrecomputedSeatData {
  seatId: string;
  // Compact binary string: each character represents sun exposure for one time point
  // '1' = in sun, '0' = in shade
  timeline: string[];
}

interface PrecomputedData {
  stadiumId: string;
  gameTime: string;
  generatedDate: string;
  timezone: string;
  dates: string[];
  timePoints: string[]; // e.g., ["13:10", "13:25", "13:40", ...]
  seats: Record<string, PrecomputedSeatData>;
}

/**
 * Parse command line arguments
 */
function parseArgs(): { stadiumId: string; gameTime: string; testMode: boolean } {
  const args = process.argv.slice(2);
  let stadiumId = '';
  let gameTime = '13:10'; // Default to 1:10 PM
  let testMode = false;

  for (const arg of args) {
    if (arg.startsWith('--stadium=')) {
      stadiumId = arg.split('=')[1];
    } else if (arg.startsWith('--game-time=')) {
      gameTime = arg.split('=')[1];
    } else if (arg === '--test') {
      testMode = true;
    }
  }

  if (!stadiumId) {
    console.error('Missing required argument: --stadium');
    console.log('\nUsage:');
    console.log('  npx tsx scripts/precomputeSunData.ts --stadium=<stadium-id> [--game-time=HH:MM] [--test]');
    console.log('\nExample:');
    console.log('  npx tsx scripts/precomputeSunData.ts --stadium=dodger-stadium --game-time=13:10');
    console.log('  npx tsx scripts/precomputeSunData.ts --stadium=dodger-stadium --test');
    process.exit(1);
  }

  return { stadiumId, gameTime, testMode };
}

/**
 * Generate weekly dates from April through October 2025
 */
function generateWeeklyDates(): Date[] {
  const dates: Date[] = [];
  const startDate = new Date('2025-04-05'); // First Saturday in April
  const endDate = new Date('2025-10-11'); // Last game in October

  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7); // Add 7 days
  }

  return dates;
}

/**
 * Generate time points for a 5-hour game timeline
 */
function generateTimePoints(gameStartTime: string): string[] {
  const [hours, minutes] = gameStartTime.split(':').map(Number);
  const timePoints: string[] = [];

  for (let i = 0; i <= 20; i++) {
    // 21 time points (0 to 300 minutes)
    const totalMinutes = hours * 60 + minutes + i * 15;
    const h = Math.floor(totalMinutes / 60) % 24;
    const m = totalMinutes % 60;
    timePoints.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
  }

  return timePoints;
}

/**
 * Load obstructions for a stadium
 */
async function loadStadiumObstructions(stadiumId: string): Promise<Obstruction3D[]> {
  try {
    // Map seat data stadium IDs to obstruction file names
    const obstructionIdMap: Record<string, string> = {
      'dodger-stadium': 'dodgers',
    };
    const obstructionId = obstructionIdMap[stadiumId] || stadiumId;

    const obstructionsPath = path.join(
      __dirname,
      '..',
      'src',
      'data',
      'obstructions',
      'mlb',
      `${obstructionId}-obstructions.ts`
    );

    if (!fs.existsSync(obstructionsPath)) {
      log.warning(`No obstructions file found for ${stadiumId}`);
      return [];
    }

    const module = await import(obstructionsPath);
    const obstructions = module.default || module[`${obstructionId}Obstructions`];

    if (Array.isArray(obstructions)) {
      log.info(`Loaded ${obstructions.length} obstructions for ${stadiumId}`);
      return obstructions;
    }

    return [];
  } catch (error) {
    log.warning(`Failed to load obstructions for ${stadiumId}: ${error}`);
    return [];
  }
}

/**
 * Load all section files for a stadium
 */
async function loadAllSections(stadiumId: string): Promise<SectionSeatingData[]> {
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

  const files = fs
    .readdirSync(sectionsDir)
    .filter((f) => f.endsWith('.ts') && !f.startsWith('_'));

  log.info(`Loading ${files.length} section files...`);

  const sections: SectionSeatingData[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(sectionsDir, file);
      const module = await import(filePath);
      const section = module.default || module[Object.keys(module)[0]];
      sections.push(section);
    } catch (error) {
      log.warning(`Failed to load ${file}: ${error}`);
    }
  }

  log.success(`Loaded ${sections.length} sections`);
  return sections;
}

/**
 * Calculate sun exposure for a single seat at all dates/times
 */
function calculateSeatTimeline(
  seat: Seat,
  dates: Date[],
  timePoints: string[],
  latitude: number,
  longitude: number,
  timezone: string,
  obstructions: Obstruction3D[]
): string[] {
  const timeline: string[] = [];

  for (const date of dates) {
    let dayTimeline = '';

    for (const timePoint of timePoints) {
      const [hours, minutes] = timePoint.split(':').map(Number);
      const gameTime = new Date(date);
      gameTime.setHours(hours, minutes, 0, 0);

      try {
        const exposure = calculateSeatSunExposureAtTime(
          seat,
          gameTime,
          latitude,
          longitude,
          obstructions
        );

        // Simplified: in sun if intensity > 50%
        dayTimeline += exposure.inSun && exposure.sunIntensity > 50 ? '1' : '0';
      } catch (error) {
        // If calculation fails, mark as unknown ('?')
        dayTimeline += '?';
      }
    }

    timeline.push(dayTimeline);
  }

  return timeline;
}

/**
 * Pre-compute sun data for all seats
 */
async function precomputeSunData(
  stadiumId: string,
  gameTime: string,
  testMode: boolean
): Promise<PrecomputedData> {
  log.step('Starting pre-computation...\n');

  // Load stadium data
  // Map seat data stadium IDs to MLB_STADIUMS IDs
  const stadiumIdMap: Record<string, string> = {
    'dodger-stadium': 'dodgers',
  };
  const mlbStadiumId = stadiumIdMap[stadiumId] || stadiumId;
  const stadium = MLB_STADIUMS.find((s) => s.id === mlbStadiumId);
  if (!stadium) {
    log.error(`Stadium not found: ${stadiumId} (mapped to: ${mlbStadiumId})`);
    process.exit(1);
  }

  // Generate dates and time points
  const dates = generateWeeklyDates();
  const timePoints = generateTimePoints(gameTime);

  log.info(`Computing for ${dates.length} dates`);
  log.info(`Time points: ${timePoints[0]} - ${timePoints[timePoints.length - 1]}`);
  log.info(`Stadium: ${stadium.name} (${stadium.latitude}°, ${stadium.longitude}°)\n`);

  // Load obstructions
  const obstructions = await loadStadiumObstructions(stadiumId);
  console.log(); // Add blank line after obstruction loading

  // Load sections
  let sections = await loadAllSections(stadiumId);

  // Test mode: only process Section 101
  if (testMode) {
    sections = sections.filter((s) => s.sectionId === '101');
    log.warning(`TEST MODE: Processing only Section 101 (${sections[0]?.totalSeats || 0} seats)\n`);
  }

  // Calculate total seats
  const totalSeats = sections.reduce((sum, s) => sum + s.totalSeats, 0);
  log.info(`Total seats to process: ${totalSeats.toLocaleString()}\n`);

  // Initialize result
  const result: PrecomputedData = {
    stadiumId,
    gameTime,
    generatedDate: new Date().toISOString().split('T')[0],
    timezone: stadium.timezone,
    dates: dates.map((d) => d.toISOString().split('T')[0]),
    timePoints,
    seats: {},
  };

  // Process each seat
  let processed = 0;
  const startTime = Date.now();

  for (const section of sections) {
    for (const row of section.rows) {
      for (const seat of row.seats) {
        // Calculate timeline for this seat
        const timeline = calculateSeatTimeline(
          seat,
          dates,
          timePoints,
          stadium.latitude,
          stadium.longitude,
          stadium.timezone,
          obstructions
        );

        result.seats[seat.id] = {
          seatId: seat.id,
          timeline,
        };

        processed++;

        // Update progress every 100 seats
        if (processed % 100 === 0) {
          const elapsed = Date.now() - startTime;
          const rate = processed / (elapsed / 1000); // seats per second
          const remaining = totalSeats - processed;
          const eta = remaining / rate;
          const etaMin = Math.floor(eta / 60);
          const etaSec = Math.floor(eta % 60);

          log.progress(
            `Processing: ${processed.toLocaleString()}/${totalSeats.toLocaleString()} seats ` +
              `(${((processed / totalSeats) * 100).toFixed(1)}%) - ` +
              `ETA: ${etaMin}m ${etaSec}s - ` +
              `Rate: ${rate.toFixed(1)} seats/sec`
          );
        }
      }
    }
  }

  // Clear progress line
  process.stdout.write('\r' + ' '.repeat(100) + '\r');

  const totalTime = (Date.now() - startTime) / 1000;
  log.success(
    `Processed ${processed.toLocaleString()} seats in ${totalTime.toFixed(1)}s ` +
      `(${(processed / totalTime).toFixed(1)} seats/sec)\n`
  );

  return result;
}

/**
 * Save pre-computed data to compressed JSON file
 */
function savePrecomputedData(
  data: PrecomputedData,
  stadiumId: string,
  gameTime: string,
  testMode: boolean
): string {
  log.step('Compressing and saving data...');

  const outputDir = path.join(__dirname, '..', 'src', 'data', 'seatData', stadiumId);
  const timeStr = gameTime.replace(':', ''); // '13:10' → '1310'
  const filename = testMode
    ? `precomputed-sun-${timeStr}pm-test.json.gz`
    : `precomputed-sun-${timeStr}pm.json.gz`;
  const outputPath = path.join(outputDir, filename);

  // Convert to JSON
  const json = JSON.stringify(data);
  const uncompressedSize = Buffer.byteLength(json);

  // Compress with gzip
  const compressed = gzipSync(json, { level: 9 });
  const compressedSize = compressed.length;

  // Save to file
  fs.writeFileSync(outputPath, compressed);

  const compressionRatio = ((1 - compressedSize / uncompressedSize) * 100).toFixed(1);

  log.success(`Saved to: ${outputPath}`);
  log.info(`Uncompressed: ${(uncompressedSize / 1024 / 1024).toFixed(2)} MB`);
  log.info(`Compressed: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
  log.info(`Compression: ${compressionRatio}% reduction\n`);

  return outputPath;
}

/**
 * Main execution
 */
async function main() {
  console.log(`${colors.bright}MLB Sun Tracker - Sun Data Pre-computation${colors.reset}\n`);

  const { stadiumId, gameTime, testMode } = parseArgs();

  log.info(`Stadium: ${stadiumId}`);
  log.info(`Game Time: ${gameTime}`);
  if (testMode) {
    log.warning(`Test Mode: Enabled (Section 101 only)`);
  }
  console.log();

  // Pre-compute data
  const data = await precomputeSunData(stadiumId, gameTime, testMode);

  // Save compressed file
  const outputPath = savePrecomputedData(data, stadiumId, gameTime, testMode);

  // Summary
  console.log('━'.repeat(50));
  console.log(`${colors.bright}📊 PRE-COMPUTATION SUMMARY${colors.reset}`);
  console.log('━'.repeat(50));
  console.log(`Seats: ${Object.keys(data.seats).length.toLocaleString()}`);
  console.log(`Dates: ${data.dates.length} (${data.dates[0]} to ${data.dates[data.dates.length - 1]})`);
  console.log(`Time Points: ${data.timePoints.length} per game`);
  console.log(`Total Data Points: ${(Object.keys(data.seats).length * data.dates.length * data.timePoints.length).toLocaleString()}`);
  console.log(`Output: ${outputPath}`);
  console.log('━'.repeat(50) + '\n');

  log.success('Pre-computation complete!');

  if (testMode) {
    log.info('Next: Review test results, then run full computation:');
    log.info(`  npx tsx scripts/precomputeSunData.ts --stadium=${stadiumId} --game-time=${gameTime}\n`);
  } else {
    log.info('Next: Create data loader utility (precomputedSunLoader.ts)');
    log.info('Next: Update metadata.ts with pre-computed data info\n');
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    log.error(`Fatal error: ${error}`);
    console.error(error);
    process.exit(1);
  });
}

export { precomputeSunData, generateWeeklyDates, generateTimePoints };
