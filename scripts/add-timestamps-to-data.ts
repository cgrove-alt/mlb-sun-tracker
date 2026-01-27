#!/usr/bin/env ts-node
/**
 * Add lastUpdated timestamps to stadium data files
 *
 * This script adds ISO 8601 timestamps to all stadium data files
 * that don't already have them. Uses current date as default.
 *
 * Usage:
 *   npm run add-timestamps
 *   npm run add-timestamps -- --date=2025-01-27
 */

import * as fs from 'fs';
import * as path from 'path';

interface AddTimestampsOptions {
  date: string; // ISO 8601 date string
  dryRun: boolean;
}

const DEFAULT_OPTIONS: AddTimestampsOptions = {
  date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
  dryRun: false,
};

/**
 * Parse command line arguments
 */
function parseArgs(): AddTimestampsOptions {
  const options = { ...DEFAULT_OPTIONS };

  process.argv.slice(2).forEach(arg => {
    if (arg.startsWith('--date=')) {
      options.date = arg.split('=')[1];
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    }
  });

  return options;
}

/**
 * Check if file already has lastUpdated timestamp
 */
function hasTimestamp(content: string): boolean {
  return /lastUpdated:\s*['"]/.test(content);
}

/**
 * Add lastUpdated timestamp to a data file
 */
function addTimestampToFile(filePath: string, date: string, dryRun: boolean): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Skip if already has timestamp
    if (hasTimestamp(content)) {
      return false;
    }

    // Find the export statement
    const exportMatch = content.match(/export const \w+Sections: DetailedSection\[\] = \[/);

    if (!exportMatch) {
      console.warn(`⚠️  Could not find export statement in ${filePath}`);
      return false;
    }

    // Find the first section object
    const sectionStart = content.indexOf('{', exportMatch.index! + exportMatch[0].length);

    if (sectionStart === -1) {
      console.warn(`⚠️  Could not find section object in ${filePath}`);
      return false;
    }

    // Insert lastUpdated field at the end of each section
    let updatedContent = content;
    const sectionsMatches = content.matchAll(/}\s*,?\s*{/g);
    const sections = Array.from(sectionsMatches);

    // Add timestamp to each section, working backwards to preserve positions
    const timestampField = `\n    lastUpdated: '${date}',`;

    // First, handle the last section (before the final ]})
    const lastSectionEnd = content.lastIndexOf('}', content.lastIndexOf('];'));
    if (lastSectionEnd > 0) {
      updatedContent = updatedContent.slice(0, lastSectionEnd) + timestampField + updatedContent.slice(lastSectionEnd);
    }

    // Then handle middle sections
    for (let i = sections.length - 1; i >= 0; i--) {
      const match = sections[i];
      const insertPos = match.index! + 1; // After the closing }
      updatedContent = updatedContent.slice(0, insertPos) + timestampField + updatedContent.slice(insertPos);
    }

    if (!dryRun) {
      fs.writeFileSync(filePath, updatedContent, 'utf-8');
    }

    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
    return false;
  }
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
 * Main function
 */
function main() {
  const options = parseArgs();

  console.log('Adding timestamps to stadium data files...\n');
  console.log(`Date: ${options.date}`);
  console.log(`Dry run: ${options.dryRun ? 'Yes' : 'No'}\n`);

  // Find all stadium data files
  const baseDirs = [
    'src/data/sections/milb',
    'src/data/sections/mlb',
    'src/data/sections/nfl',
  ];

  let totalFiles = 0;
  let updatedFiles = 0;
  let skippedFiles = 0;

  for (const dir of baseDirs) {
    const files = findTsFiles(dir);

    for (const file of files) {
      totalFiles++;
      const updated = addTimestampToFile(file, options.date, options.dryRun);

      if (updated) {
        updatedFiles++;
        console.log(`✓ ${file}`);
      } else {
        skippedFiles++;
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total files: ${totalFiles}`);
  console.log(`Updated: ${updatedFiles}`);
  console.log(`Skipped (already have timestamp): ${skippedFiles}`);
  console.log('='.repeat(80));

  if (options.dryRun) {
    console.log('\n⚠️  Dry run mode - no files were modified');
  }
}

// Run if called directly
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error('Error adding timestamps:', error);
    process.exit(1);
  }
}
