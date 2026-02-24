#!/usr/bin/env ts-node
/**
 * Data Freshness Check Script
 *
 * Monitors stadium data files for outdated timestamps and generates reports
 * of stadiums that need data updates.
 *
 * Usage:
 *   npm run check-data-freshness
 *   npm run check-data-freshness -- --format=json
 *   npm run check-data-freshness -- --warn-days=365 --error-days=730
 */

import * as fs from 'fs';
import * as path from 'path';

interface DataFreshnessReport {
  stadiumId: string;
  filePath: string;
  lastUpdated: string | null;
  daysSinceUpdate: number | null;
  status: 'current' | 'warning' | 'error' | 'missing';
  message: string;
}

interface FreshnessCheckOptions {
  warnDays: number; // Days after which to warn
  errorDays: number; // Days after which to error
  format: 'text' | 'json';
}

const DEFAULT_OPTIONS: FreshnessCheckOptions = {
  warnDays: 365, // 1 year
  errorDays: 730, // 2 years
  format: 'text',
};

/**
 * Parse command line arguments
 */
function parseArgs(): FreshnessCheckOptions {
  const options = { ...DEFAULT_OPTIONS };

  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--warn-days=')) {
      options.warnDays = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--error-days=')) {
      options.errorDays = parseInt(arg.split('=')[1], 10);
    } else if (arg.startsWith('--format=')) {
      const format = arg.split('=')[1];
      if (format === 'json' || format === 'text') {
        options.format = format;
      }
    }
  });

  return options;
}

/**
 * Extract lastUpdated timestamp from a data file
 */
function extractLastUpdated(filePath: string): string | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Look for lastUpdated field in the file
    const lastUpdatedMatch = content.match(/lastUpdated:\s*['"]([^'"]+)['"]/);

    if (lastUpdatedMatch) {
      return lastUpdatedMatch[1];
    }

    return null;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

/**
 * Calculate days since a given date
 */
function daysSince(dateString: string): number {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check a single data file for freshness
 */
function checkFileFreshness(
  filePath: string,
  options: FreshnessCheckOptions
): DataFreshnessReport {
  const stadiumId = path.basename(filePath, '.ts');
  const lastUpdated = extractLastUpdated(filePath);

  if (!lastUpdated) {
    return {
      stadiumId,
      filePath,
      lastUpdated: null,
      daysSinceUpdate: null,
      status: 'missing',
      message: 'No lastUpdated timestamp found',
    };
  }

  const daysSinceUpdate = daysSince(lastUpdated);

  let status: DataFreshnessReport['status'] = 'current';
  let message = `Data is current (${daysSinceUpdate} days old)`;

  if (daysSinceUpdate > options.errorDays) {
    status = 'error';
    message = `Data is outdated (${daysSinceUpdate} days old, over ${options.errorDays} days)`;
  } else if (daysSinceUpdate > options.warnDays) {
    status = 'warning';
    message = `Data needs review (${daysSinceUpdate} days old, over ${options.warnDays} days)`;
  }

  return {
    stadiumId,
    filePath,
    lastUpdated,
    daysSinceUpdate,
    status,
    message,
  };
}

/**
 * Recursively find all TypeScript files in a directory
 */
function findTsFiles(dir: string): string[] {
  const files: string[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory() && item.name !== '__tests__' && item.name !== 'node_modules') {
      files.push(...findTsFiles(fullPath));
    } else if (item.isFile() && item.name.endsWith('.ts') && !item.name.endsWith('.test.ts') && item.name !== 'index.ts') {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Main function to check all stadium data files
 */
function checkAllDataFreshness(): DataFreshnessReport[] {
  const reports: DataFreshnessReport[] = [];
  const options = parseArgs();

  // Find all stadium section data files
  const baseDirs = [
    'src/data/sections/milb',
    'src/data/sections/mlb',
    'src/data/sections/nfl',
  ];

  for (const dir of baseDirs) {
    const files = findTsFiles(dir);

    for (const file of files) {
      const report = checkFileFreshness(file, options);
      reports.push(report);
    }
  }

  return reports;
}

/**
 * Print report in text format
 */
function printTextReport(reports: DataFreshnessReport[]): void {
  const errorReports = reports.filter(r => r.status === 'error');
  const warningReports = reports.filter(r => r.status === 'warning');
  const missingReports = reports.filter(r => r.status === 'missing');
  const currentReports = reports.filter(r => r.status === 'current');

  console.log('\n' + '='.repeat(80));
  console.log('DATA FRESHNESS REPORT');
  console.log('='.repeat(80) + '\n');

  console.log(`Total stadiums checked: ${reports.length}`);
  console.log(`  ✅ Current: ${currentReports.length}`);
  console.log(`  ⚠️  Warning: ${warningReports.length}`);
  console.log(`  ❌ Error: ${errorReports.length}`);
  console.log(`  ⚪ Missing: ${missingReports.length}`);
  console.log('');

  if (errorReports.length > 0) {
    console.log('❌ ERRORS (Outdated Data - Over 2 Years):');
    console.log('-'.repeat(80));
    errorReports.forEach(report => {
      console.log(`  ${report.stadiumId}`);
      console.log(`    File: ${report.filePath}`);
      console.log(`    Last Updated: ${report.lastUpdated}`);
      console.log(`    Days Since Update: ${report.daysSinceUpdate}`);
      console.log('');
    });
  }

  if (warningReports.length > 0) {
    console.log('⚠️  WARNINGS (Needs Review - Over 1 Year):');
    console.log('-'.repeat(80));
    warningReports.forEach(report => {
      console.log(`  ${report.stadiumId}`);
      console.log(`    File: ${report.filePath}`);
      console.log(`    Last Updated: ${report.lastUpdated}`);
      console.log(`    Days Since Update: ${report.daysSinceUpdate}`);
      console.log('');
    });
  }

  if (missingReports.length > 0) {
    console.log('⚪ MISSING TIMESTAMPS:');
    console.log('-'.repeat(80));
    missingReports.forEach(report => {
      console.log(`  ${report.stadiumId}`);
      console.log(`    File: ${report.filePath}`);
      console.log('');
    });
  }

  console.log('='.repeat(80));

  // Exit with error code if there are errors
  if (errorReports.length > 0 || missingReports.length > 0) {
    process.exit(1);
  }
}

/**
 * Print report in JSON format
 */
function printJsonReport(reports: DataFreshnessReport[]): void {
  console.log(JSON.stringify(reports, null, 2));

  // Exit with error code if there are errors
  const hasErrors = reports.some(r => r.status === 'error' || r.status === 'missing');
  if (hasErrors) {
    process.exit(1);
  }
}

/**
 * Main execution
 */
function main() {
  const options = parseArgs();

  console.error('Checking data freshness...\n');

  const reports = checkAllDataFreshness();

  if (options.format === 'json') {
    printJsonReport(reports);
  } else {
    printTextReport(reports);
  }
}

// Run if called directly
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('Error running freshness check:', error);
    process.exit(1);
  }
}

export { checkAllDataFreshness, checkFileFreshness, type DataFreshnessReport };
