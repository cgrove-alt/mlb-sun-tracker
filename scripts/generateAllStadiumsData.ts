#!/usr/bin/env ts-node

/**
 * Batch Processing Script for All MLB Stadiums Sun Data
 * Processes all 30 MLB stadiums in parallel batches to generate pre-computed sun exposure data
 * Created: 2025-10-27
 * Usage: npx tsx scripts/generateAllStadiumsData.ts [--batch-size=4] [--skip-existing]
 */

import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

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
  magenta: '\x1b[35m',
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️${colors.reset}  ${msg}`),
  error: (msg: string) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.cyan}ℹ️${colors.reset}  ${msg}`),
  step: (msg: string) => console.log(`${colors.bright}⚙️${colors.reset}  ${msg}`),
  stadium: (msg: string) => console.log(`${colors.magenta}🏟️${colors.reset}  ${msg}`),
};

// All MLB stadiums with their seat data directory names
const ALL_STADIUMS = [
  'angels',
  'astros',
  'athletics',
  'bluejays',
  'braves',
  'brewers',
  'cardinals',
  'cubs',
  'diamondbacks',
  'dodgers',      // Maps to dodger-stadium
  'giants',
  'guardians',
  'mariners',
  'marlins',
  'mets',
  'nationals',
  'orioles',
  'padres',
  'phillies',
  'pirates',
  'rangers',
  'rays',
  'reds',
  'redsox',
  'rockies',
  'royals',
  'tigers',
  'twins',
  'whitesox',
  'yankees',
];

// Game times to generate (6 common MLB game times)
const GAME_TIMES = ['11:00', '13:00', '15:00', '18:00', '19:00', '20:00'];

interface ProcessOptions {
  batchSize: number;
  skipExisting: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(): ProcessOptions {
  const args = process.argv.slice(2);
  let batchSize = 4; // Process 4 stadiums in parallel by default
  let skipExisting = false;

  for (const arg of args) {
    if (arg.startsWith('--batch-size=')) {
      batchSize = parseInt(arg.split('=')[1], 10);
    } else if (arg === '--skip-existing') {
      skipExisting = true;
    }
  }

  return { batchSize, skipExisting };
}

/**
 * Check if a stadium already has complete data
 */
function hasCompleteData(stadiumId: string): boolean {
  const seatDataId = stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;
  const dataDir = path.join(__dirname, '..', 'public', 'data', 'sun', seatDataId);

  if (!fs.existsSync(dataDir)) {
    return false;
  }

  // Check if all 6 time files exist
  const expectedFiles = GAME_TIMES.map(time => {
    const [hours, minutes] = time.split(':');
    const hourNum = parseInt(hours, 10);
    const timeStr = hours.padStart(2, '0') + minutes.padStart(2, '0');
    const ampm = hourNum >= 12 ? 'pm' : 'am';
    return `precomputed-sun-${timeStr}${ampm}.json.gz`;
  });

  const existingFiles = fs.readdirSync(dataDir);
  return expectedFiles.every(file => existingFiles.includes(file));
}

/**
 * Process a single stadium
 */
function processStadium(stadiumId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    log.stadium(`Starting processing for ${stadiumId}`);

    const child = spawn('npx', ['tsx', 'scripts/generateAllGameTimesData.ts', `--stadium=${stadiumId}`], {
      stdio: 'pipe',
      shell: true,
    });

    let lastOutput = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      const output = data.toString();
      // Only show key progress updates
      if (output.includes('Generating data for') || output.includes('✅') || output.includes('COMPLETE')) {
        process.stdout.write(`  ${colors.dim}[${stadiumId}]${colors.reset} ${output}`);
      }
      lastOutput = output;
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
      if (code === 0) {
        log.success(`${stadiumId} completed in ${duration} minutes`);
        resolve();
      } else {
        log.error(`${stadiumId} failed with code ${code}`);
        if (errorOutput) {
          console.error(`  Error output: ${errorOutput.substring(0, 500)}`);
        }
        reject(new Error(`Stadium ${stadiumId} failed`));
      }
    });

    child.on('error', (error) => {
      log.error(`Failed to start process for ${stadiumId}: ${error.message}`);
      reject(error);
    });
  });
}

/**
 * Process stadiums in batches
 */
async function processBatch(stadiums: string[]): Promise<void> {
  const promises = stadiums.map(stadium => processStadium(stadium));
  await Promise.allSettled(promises); // Use allSettled to continue even if some fail
}

/**
 * Main execution
 */
async function main() {
  console.log(`${colors.bright}🏟️  MLB Sun Data Batch Processor${colors.reset}\n`);

  const options = parseArgs();
  log.info(`Batch size: ${options.batchSize} stadiums in parallel`);
  log.info(`Skip existing: ${options.skipExisting}`);
  console.log();

  // Filter stadiums based on options
  let stadiumsToProcess = ALL_STADIUMS;

  if (options.skipExisting) {
    stadiumsToProcess = stadiumsToProcess.filter(stadium => {
      if (hasCompleteData(stadium)) {
        log.info(`Skipping ${stadium} (already has complete data)`);
        return false;
      }
      return true;
    });
  }

  if (stadiumsToProcess.length === 0) {
    log.success('All stadiums already have complete data!');
    return;
  }

  log.step(`Processing ${stadiumsToProcess.length} stadiums...\n`);

  // Process in batches
  const batches: string[][] = [];
  for (let i = 0; i < stadiumsToProcess.length; i += options.batchSize) {
    batches.push(stadiumsToProcess.slice(i, i + options.batchSize));
  }

  const totalStartTime = Date.now();
  let completedStadiums = 0;
  let failedStadiums: string[] = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log('━'.repeat(60));
    console.log(`${colors.bright}Batch ${i + 1}/${batches.length}${colors.reset}: ${batch.join(', ')}`);
    console.log('━'.repeat(60));

    try {
      await processBatch(batch);
      completedStadiums += batch.length;
    } catch (error) {
      log.warning(`Some stadiums in batch ${i + 1} failed`);
      // Track which ones failed for retry
      for (const stadium of batch) {
        if (!hasCompleteData(stadium)) {
          failedStadiums.push(stadium);
        } else {
          completedStadiums++;
        }
      }
    }

    // Progress update
    const progress = ((completedStadiums / stadiumsToProcess.length) * 100).toFixed(1);
    console.log(`\n${colors.blue}📊 Progress: ${completedStadiums}/${stadiumsToProcess.length} stadiums (${progress}%)${colors.reset}\n`);
  }

  const totalDuration = ((Date.now() - totalStartTime) / 1000 / 60).toFixed(1);

  // Final summary
  console.log('\n' + '━'.repeat(60));
  console.log(`${colors.bright}📊 BATCH PROCESSING COMPLETE${colors.reset}`);
  console.log('━'.repeat(60));
  log.info(`Total time: ${totalDuration} minutes`);
  log.info(`Completed: ${completedStadiums} stadiums`);

  if (failedStadiums.length > 0) {
    log.warning(`Failed: ${failedStadiums.length} stadiums`);
    console.log(`Failed stadiums: ${failedStadiums.join(', ')}`);
    console.log('\nTo retry failed stadiums, run:');
    console.log(`  npx tsx scripts/generateAllGameTimesData.ts --stadium=<stadium-name>`);
  } else {
    log.success('All stadiums processed successfully!');
  }

  // Verify total files
  console.log('\n' + '━'.repeat(60));
  log.step('Verifying generated files...');

  let totalFiles = 0;
  for (const stadium of ALL_STADIUMS) {
    if (hasCompleteData(stadium)) {
      totalFiles += 6; // 6 time files per stadium
    }
  }

  const expectedTotal = ALL_STADIUMS.length * 6;
  if (totalFiles === expectedTotal) {
    log.success(`All ${expectedTotal} files generated successfully!`);
  } else {
    log.warning(`Generated ${totalFiles}/${expectedTotal} files`);
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

export { processStadium, processBatch };