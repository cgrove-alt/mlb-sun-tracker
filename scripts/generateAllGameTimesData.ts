#!/usr/bin/env ts-node

/**
 * Batch Script to Generate Pre-computed Sun Data for All Common MLB Game Times
 * Created: 2025-10-27
 *
 * This script generates sun exposure data for all common MLB game start times:
 * - Day games: 11:00 AM, 1:00 PM, 3:00 PM
 * - Night games: 6:00 PM, 7:00 PM, 8:00 PM
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { MLB_STADIUMS } from '../src/data/stadiums';

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Common MLB game start times
const GAME_TIMES = [
  { time: '11:00', label: '11:00 AM', ampm: 'am' },
  { time: '13:00', label: '1:00 PM', ampm: 'pm' },
  { time: '15:00', label: '3:00 PM', ampm: 'pm' },
  { time: '18:00', label: '6:00 PM', ampm: 'pm' },
  { time: '19:00', label: '7:00 PM', ampm: 'pm' },
  { time: '20:00', label: '8:00 PM', ampm: 'pm' }
];

// Map MLB stadium IDs to seat data directory names
const STADIUM_MAPPING: Record<string, string> = {
  'angels': 'angels',
  'astros': 'astros',
  'athletics': 'athletics',
  'bluejays': 'bluejays',
  'braves': 'braves',
  'brewers': 'brewers',
  'cardinals': 'cardinals',
  'cubs': 'cubs',
  'diamondbacks': 'diamondbacks',
  'dodgers': 'dodger-stadium',
  'giants': 'giants',
  'guardians': 'guardians',
  'mariners': 'mariners',
  'marlins': 'marlins',
  'mets': 'mets',
  'nationals': 'nationals',
  'orioles': 'orioles',
  'padres': 'padres',
  'phillies': 'phillies',
  'pirates': 'pirates',
  'rangers': 'rangers',
  'rays': 'rays',
  'redsox': 'redsox',
  'reds': 'reds',
  'rockies': 'rockies',
  'royals': 'royals',
  'tigers': 'tigers',
  'twins': 'twins',
  'whitesox': 'whitesox',
  'yankees': 'yankees'
};

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkStadiumHasSeatData(stadiumId: string): boolean {
  const seatDataPath = path.join(__dirname, '..', 'src', 'data', 'seatData', stadiumId, 'sections');
  return fs.existsSync(seatDataPath);
}

async function generateDataForStadium(stadiumId: string, seatDataId: string, testMode: boolean = false) {
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  if (!stadium) {
    log(`Stadium not found: ${stadiumId}`, colors.red);
    return;
  }

  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(`Processing: ${stadium.name} (${stadiumId})`, colors.bright);
  log(`${'='.repeat(60)}`, colors.cyan);

  // Check if stadium has seat data
  if (!checkStadiumHasSeatData(seatDataId)) {
    log(`⚠️ No seat data found for ${seatDataId}, skipping...`, colors.yellow);
    return;
  }

  for (const gameTime of GAME_TIMES) {
    log(`\n⏰ Generating data for ${gameTime.label}...`, colors.blue);

    try {
      const command = testMode
        ? `npx tsx scripts/precomputeSunData.ts --stadium=${seatDataId} --game-time=${gameTime.time} --test`
        : `npx tsx scripts/precomputeSunData.ts --stadium=${seatDataId} --game-time=${gameTime.time}`;

      // Execute the precompute script
      execSync(command, {
        stdio: 'inherit',
        cwd: path.join(__dirname, '..')
      });

      log(`✅ Successfully generated data for ${gameTime.label}`, colors.green);
    } catch (error) {
      log(`❌ Failed to generate data for ${gameTime.label}: ${error}`, colors.red);
    }
  }
}

async function generateDataForAllStadiums(testMode: boolean = false) {
  log(`${colors.bright}MLB Sun Tracker - Batch Pre-computation for All Game Times${colors.reset}\n`);

  const stadiumsWithData: string[] = [];
  const stadiumsWithoutData: string[] = [];

  // Check which stadiums have seat data
  for (const [stadiumId, seatDataId] of Object.entries(STADIUM_MAPPING)) {
    if (checkStadiumHasSeatData(seatDataId)) {
      stadiumsWithData.push(stadiumId);
    } else {
      stadiumsWithoutData.push(stadiumId);
    }
  }

  log(`\n📊 Stadium Seat Data Status:`, colors.cyan);
  log(`  ✅ With data: ${stadiumsWithData.length} stadiums`, colors.green);
  log(`  ❌ Without data: ${stadiumsWithoutData.length} stadiums`, colors.yellow);

  if (testMode) {
    log(`\n⚠️ TEST MODE: Only processing Section 101 for each stadium`, colors.yellow);
  }

  log(`\n🎯 Game times to generate:`, colors.cyan);
  GAME_TIMES.forEach(gt => log(`  • ${gt.label}`, colors.blue));

  const totalTasks = stadiumsWithData.length * GAME_TIMES.length;
  log(`\n📈 Total tasks: ${totalTasks} (${stadiumsWithData.length} stadiums × ${GAME_TIMES.length} times)`, colors.magenta);

  // Ask for confirmation
  log(`\nThis will generate a large amount of data. Continue? (Ctrl+C to cancel)`, colors.yellow);

  // Process each stadium
  let completed = 0;
  const startTime = Date.now();

  for (const stadiumId of stadiumsWithData) {
    const seatDataId = STADIUM_MAPPING[stadiumId];
    await generateDataForStadium(stadiumId, seatDataId, testMode);
    completed += GAME_TIMES.length;

    const progress = ((completed / totalTasks) * 100).toFixed(1);
    log(`\n📊 Overall Progress: ${completed}/${totalTasks} (${progress}%)`, colors.magenta);
  }

  const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);

  log(`\n${'='.repeat(60)}`, colors.cyan);
  log(`✅ BATCH PROCESSING COMPLETE`, colors.green);
  log(`${'='.repeat(60)}`, colors.cyan);
  log(`Total time: ${totalTime} minutes`, colors.cyan);
  log(`Stadiums processed: ${stadiumsWithData.length}`, colors.cyan);
  log(`Game times per stadium: ${GAME_TIMES.length}`, colors.cyan);
  log(`Total files generated: ${completed}`, colors.cyan);

  if (stadiumsWithoutData.length > 0) {
    log(`\n⚠️ Stadiums skipped (no seat data):`, colors.yellow);
    stadiumsWithoutData.forEach(s => log(`  • ${s}`, colors.yellow));
  }
}

async function generateDataForSingleStadium(stadiumId: string, testMode: boolean = false) {
  const seatDataId = STADIUM_MAPPING[stadiumId];
  if (!seatDataId) {
    log(`❌ Unknown stadium ID: ${stadiumId}`, colors.red);
    log(`\nAvailable stadiums:`, colors.cyan);
    Object.keys(STADIUM_MAPPING).forEach(id => log(`  • ${id}`, colors.blue));
    process.exit(1);
  }

  await generateDataForStadium(stadiumId, seatDataId, testMode);

  log(`\n✅ Completed generating data for ${stadiumId}`, colors.green);
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  let stadiumId: string | null = null;
  let testMode = false;
  let allStadiums = false;

  for (const arg of args) {
    if (arg.startsWith('--stadium=')) {
      stadiumId = arg.split('=')[1];
    } else if (arg === '--test') {
      testMode = true;
    } else if (arg === '--all') {
      allStadiums = true;
    }
  }

  return { stadiumId, testMode, allStadiums };
}

// Main execution
async function main() {
  const { stadiumId, testMode, allStadiums } = parseArgs();

  if (allStadiums) {
    await generateDataForAllStadiums(testMode);
  } else if (stadiumId) {
    await generateDataForSingleStadium(stadiumId, testMode);
  } else {
    log(`Usage:`, colors.cyan);
    log(`  Generate for all stadiums:`, colors.blue);
    log(`    npx tsx scripts/generateAllGameTimesData.ts --all [--test]`);
    log(`\n  Generate for single stadium:`, colors.blue);
    log(`    npx tsx scripts/generateAllGameTimesData.ts --stadium=<id> [--test]`);
    log(`\nExamples:`, colors.cyan);
    log(`  npx tsx scripts/generateAllGameTimesData.ts --stadium=dodgers`);
    log(`  npx tsx scripts/generateAllGameTimesData.ts --all --test`);
    log(`\nAvailable stadium IDs:`, colors.cyan);
    Object.keys(STADIUM_MAPPING).slice(0, 5).forEach(id => log(`  • ${id}`, colors.blue));
    log(`  ... and ${Object.keys(STADIUM_MAPPING).length - 5} more`, colors.blue);
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch((error) => {
    log(`\n❌ Fatal error: ${error}`, colors.red);
    console.error(error);
    process.exit(1);
  });
}

export { generateDataForAllStadiums, generateDataForSingleStadium };