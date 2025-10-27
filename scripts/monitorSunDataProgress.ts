#!/usr/bin/env ts-node

/**
 * Monitor Sun Data Generation Progress
 * Shows real-time status of sun data generation across all MLB stadiums
 * Created: 2025-10-27
 */

import * as fs from 'fs';
import * as path from 'path';

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

// All MLB stadiums with their seat data directory names
const STADIUMS: Record<string, string> = {
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
  'yankees': 'yankees',
};

const GAME_TIMES = ['11:00', '13:00', '15:00', '18:00', '19:00', '20:00'];

interface StadiumStatus {
  name: string;
  dataDir: string;
  filesGenerated: number;
  filesExpected: number;
  complete: boolean;
  missing: string[];
  fileSize?: number;
}

function getExpectedFilename(time: string): string {
  const [hours, minutes] = time.split(':');
  const hourNum = parseInt(hours, 10);
  const timeStr = hours.padStart(2, '0') + minutes.padStart(2, '0');
  const ampm = hourNum >= 12 ? 'pm' : 'am';
  return `precomputed-sun-${timeStr}${ampm}.json.gz`;
}

function checkStadiumStatus(stadiumId: string, dataDir: string): StadiumStatus {
  const sunDataDir = path.join(__dirname, '..', 'public', 'data', 'sun', dataDir);

  const status: StadiumStatus = {
    name: stadiumId,
    dataDir: dataDir,
    filesGenerated: 0,
    filesExpected: 6,
    complete: false,
    missing: [],
    fileSize: 0,
  };

  if (!fs.existsSync(sunDataDir)) {
    status.missing = GAME_TIMES.map(getExpectedFilename);
    return status;
  }

  const existingFiles = fs.readdirSync(sunDataDir);
  const expectedFiles = GAME_TIMES.map(getExpectedFilename);

  for (const expectedFile of expectedFiles) {
    if (existingFiles.includes(expectedFile)) {
      status.filesGenerated++;
      const filePath = path.join(sunDataDir, expectedFile);
      const stats = fs.statSync(filePath);
      status.fileSize = (status.fileSize || 0) + stats.size;
    } else {
      status.missing.push(expectedFile);
    }
  }

  status.complete = status.filesGenerated === status.filesExpected;
  return status;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function displayProgress() {
  console.clear();
  console.log(`${colors.bright}🏟️  MLB Sun Data Generation Progress${colors.reset}`);
  console.log(`${colors.dim}Updated: ${new Date().toLocaleTimeString()}${colors.reset}\n`);

  let totalComplete = 0;
  let totalFiles = 0;
  const totalExpected = Object.keys(STADIUMS).length * 6;

  console.log('━'.repeat(80));
  console.log(`Stadium`.padEnd(20) + 'Progress'.padEnd(20) + 'Status'.padEnd(15) + 'Size');
  console.log('━'.repeat(80));

  const statuses: StadiumStatus[] = [];

  for (const [stadiumId, dataDir] of Object.entries(STADIUMS)) {
    const status = checkStadiumStatus(stadiumId, dataDir);
    statuses.push(status);
    totalFiles += status.filesGenerated;
    if (status.complete) totalComplete++;
  }

  // Sort: incomplete first, then by name
  statuses.sort((a, b) => {
    if (a.complete !== b.complete) return a.complete ? 1 : -1;
    return a.name.localeCompare(b.name);
  });

  for (const status of statuses) {
    const progress = `[${status.filesGenerated}/${status.filesExpected}]`;
    const percentage = ((status.filesGenerated / status.filesExpected) * 100).toFixed(0) + '%';
    const progressBar = '█'.repeat(Math.floor(status.filesGenerated * 10 / status.filesExpected)) +
                        '░'.repeat(10 - Math.floor(status.filesGenerated * 10 / status.filesExpected));

    const statusColor = status.complete ? colors.green :
                        status.filesGenerated > 0 ? colors.yellow :
                        colors.red;
    const statusText = status.complete ? '✓ Complete' :
                      status.filesGenerated > 0 ? '⚙ In Progress' :
                      '○ Pending';

    const size = status.fileSize ? formatFileSize(status.fileSize) : '-';

    console.log(
      `${status.name.padEnd(20)}` +
      `${progressBar} ${progress.padEnd(7)}` +
      `${statusColor}${statusText.padEnd(15)}${colors.reset}` +
      `${size}`
    );
  }

  console.log('━'.repeat(80));

  const overallPercentage = ((totalFiles / totalExpected) * 100).toFixed(1);
  const progressBar = '█'.repeat(Math.floor(totalFiles * 30 / totalExpected)) +
                      '░'.repeat(30 - Math.floor(totalFiles * 30 / totalExpected));

  console.log(`\n${colors.bright}Overall Progress:${colors.reset}`);
  console.log(`${progressBar} ${totalFiles}/${totalExpected} files (${overallPercentage}%)`);
  console.log(`${colors.cyan}Stadiums Complete: ${totalComplete}/30${colors.reset}`);

  // Show recently completed
  const recentlyCompleted = statuses
    .filter(s => s.complete)
    .slice(-3)
    .map(s => s.name);

  if (recentlyCompleted.length > 0) {
    console.log(`\n${colors.green}Recently Completed:${colors.reset} ${recentlyCompleted.join(', ')}`);
  }

  // Show currently processing (partial files)
  const processing = statuses
    .filter(s => !s.complete && s.filesGenerated > 0)
    .map(s => `${s.name} (${s.filesGenerated}/6)`);

  if (processing.length > 0) {
    console.log(`${colors.yellow}Currently Processing:${colors.reset} ${processing.join(', ')}`);
  }
}

// Run continuous monitoring
function startMonitoring() {
  displayProgress();

  // Update every 5 seconds
  setInterval(() => {
    displayProgress();
  }, 5000);
}

// Handle graceful exit
process.on('SIGINT', () => {
  console.log('\n\nMonitoring stopped.');
  process.exit(0);
});

console.log('Starting monitoring... Press Ctrl+C to stop.\n');
startMonitoring();