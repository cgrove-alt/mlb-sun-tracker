#!/usr/bin/env ts-node

/**
 * Optimized Parallel Batch Script to Generate Pre-computed Sun Data
 * Processes multiple stadiums and game times in parallel for faster generation
 */

import * as fs from 'fs';
import * as path from 'path';
import { spawn } from 'child_process';
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
  { time: '11:00', label: '11:00 AM' },
  { time: '13:00', label: '1:00 PM' },
  { time: '15:00', label: '3:00 PM' },
  { time: '18:00', label: '6:00 PM' },
  { time: '19:00', label: '7:00 PM' },
  { time: '20:00', label: '8:00 PM' }
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
  'reds': 'reds',
  'redsox': 'redsox',
  'rockies': 'rockies',
  'royals': 'royals',
  'tigers': 'tigers',
  'twins': 'twins',
  'whitesox': 'whitesox',
  'yankees': 'yankees'
};

interface Task {
  stadiumId: string;
  stadiumName: string;
  gameTime: string;
  gameLabel: string;
}

function log(message: string, color: string = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkStadiumData(stadiumId: string): boolean {
  const mappedDir = STADIUM_MAPPING[stadiumId] || stadiumId;
  const seatDataDir = path.join(__dirname, '..', 'src', 'data', 'seatData', mappedDir);
  return fs.existsSync(seatDataDir);
}

async function runTask(task: Task): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now();

    const child = spawn('npx', [
      'tsx',
      path.join(__dirname, 'precomputeSunData.ts'),
      `--stadium=${task.stadiumId}`,
      `--game-time=${task.gameTime}`
    ], {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let output = '';
    let errorOutput = '';

    child.stdout.on('data', (data) => {
      output += data.toString();
    });

    child.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    child.on('close', (code) => {
      const duration = ((Date.now() - startTime) / 1000).toFixed(1);

      if (code === 0 && output.includes('Successfully saved')) {
        log(`  ✅ ${task.stadiumName} @ ${task.gameLabel} - Completed in ${duration}s`, colors.green);
        resolve(true);
      } else {
        log(`  ❌ ${task.stadiumName} @ ${task.gameLabel} - Failed after ${duration}s`, colors.red);
        if (errorOutput) {
          console.error(`     Error: ${errorOutput.slice(0, 200)}`);
        }
        resolve(false);
      }
    });
  });
}

async function processBatch(tasks: Task[], batchSize: number): Promise<number> {
  let completed = 0;
  let failed = 0;

  // Process tasks in batches
  for (let i = 0; i < tasks.length; i += batchSize) {
    const batch = tasks.slice(i, Math.min(i + batchSize, tasks.length));
    const batchNumber = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(tasks.length / batchSize);

    log(`\n${colors.cyan}📦 Batch ${batchNumber}/${totalBatches} - Processing ${batch.length} tasks in parallel...${colors.reset}`);

    // Run batch in parallel
    const results = await Promise.all(batch.map(task => runTask(task)));

    // Count results
    const batchCompleted = results.filter(r => r).length;
    const batchFailed = results.filter(r => !r).length;
    completed += batchCompleted;
    failed += batchFailed;

    log(`  Batch complete: ${batchCompleted} succeeded, ${batchFailed} failed`, colors.cyan);
  }

  return completed;
}

async function main() {
  log(`${colors.bright}MLB Sun Tracker - Parallel Pre-computation for All Game Times${colors.reset}\n`);

  // Check which stadiums have data
  const stadiumsWithData = MLB_STADIUMS.filter(s => checkStadiumData(s.id));
  const stadiumsWithoutData = MLB_STADIUMS.filter(s => !checkStadiumData(s.id));

  log(`${colors.cyan}📊 Stadium Seat Data Status:${colors.reset}`);
  log(`  ${colors.green}✅ With data: ${stadiumsWithData.length} stadiums${colors.reset}`);
  if (stadiumsWithoutData.length > 0) {
    log(`  ${colors.yellow}❌ Without data: ${stadiumsWithoutData.length} stadiums${colors.reset}`);
    stadiumsWithoutData.forEach(s => {
      log(`     - ${s.name} (${s.id})`, colors.yellow);
    });
  }

  // Create tasks for all stadium/time combinations
  const tasks: Task[] = [];
  for (const stadium of stadiumsWithData) {
    for (const gameTime of GAME_TIMES) {
      tasks.push({
        stadiumId: stadium.id,
        stadiumName: stadium.name,
        gameTime: gameTime.time,
        gameLabel: gameTime.label
      });
    }
  }

  const totalTasks = tasks.length;
  log(`\n${colors.cyan}🎯 Game times to generate:${colors.reset}`);
  GAME_TIMES.forEach(gt => {
    log(`  ${colors.blue}• ${gt.label}${colors.reset}`);
  });

  log(`\n${colors.magenta}📈 Total tasks: ${totalTasks} (${stadiumsWithData.length} stadiums × ${GAME_TIMES.length} times)${colors.reset}`);

  // Determine batch size based on system resources
  // Using 4 parallel processes as a safe default (adjust based on CPU cores)
  const cpuCount = require('os').cpus().length;
  const batchSize = Math.min(cpuCount, 6); // Use up to 6 parallel processes

  log(`\n${colors.yellow}⚡ Processing with ${batchSize} parallel workers...${colors.reset}`);
  log(`${colors.yellow}This will be much faster than sequential processing!${colors.reset}\n`);

  const startTime = Date.now();

  // Process all tasks in batches
  const completedCount = await processBatch(tasks, batchSize);

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(1);
  const avgTimePerTask = (parseFloat(totalDuration) / totalTasks).toFixed(1);

  // Summary
  log(`\n${colors.bright}========================================${colors.reset}`);
  log(`${colors.bright}📊 Generation Complete!${colors.reset}`);
  log(`${colors.bright}========================================${colors.reset}`);
  log(`${colors.green}✅ Successfully generated: ${completedCount}/${totalTasks} files${colors.reset}`);
  log(`${colors.cyan}⏱️  Total time: ${totalDuration} seconds${colors.reset}`);
  log(`${colors.cyan}⚡ Average time per task: ${avgTimePerTask} seconds${colors.reset}`);

  if (completedCount < totalTasks) {
    log(`\n${colors.yellow}⚠️  Some tasks failed. Check the output above for details.${colors.reset}`);
    process.exit(1);
  } else {
    log(`\n${colors.green}🎉 All sun data successfully generated for 2026 season!${colors.reset}`);
  }
}

// Run the script
main().catch(error => {
  log(`\n${colors.red}Fatal error: ${error.message}${colors.reset}`, colors.red);
  process.exit(1);
});