#!/usr/bin/env ts-node
/**
 * Add rows and seatsPerRow to stadium sections that don't have them
 *
 * Usage:
 *   npx tsx scripts/add-rows-to-sections.ts <stadiumId>
 */

import * as fs from 'fs';
import * as path from 'path';
import { MLB_STADIUMS } from '../src/data/stadiums';

async function addRowsToSections(stadiumId: string): Promise<void> {
  console.log(`\n📝 Adding rows/seatsPerRow to: ${stadiumId}`);

  // Find stadium
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  if (!stadium) {
    console.error(`  ❌ Stadium not found: ${stadiumId}`);
    return;
  }

  const targetCapacity = stadium.capacity;

  // Read section file
  const sectionFilePath = path.join(__dirname, `../src/data/stadiumSections-split/${stadiumId}.ts`);
  if (!fs.existsSync(sectionFilePath)) {
    console.error(`  ❌ Section file not found: ${sectionFilePath}`);
    return;
  }

  let content = fs.readFileSync(sectionFilePath, 'utf-8');

  // Count sections
  const sectionMatches = content.match(/{\s*id:\s*['"][^'"]+['"]/g) || [];
  const totalSections = sectionMatches.length;

  // Calculate target per section
  const seatsPerSection = Math.ceil(targetCapacity / totalSections);
  const rows = 20;
  const seatsPerRow = Math.ceil(seatsPerSection / rows);

  console.log(`  Target capacity: ${targetCapacity.toLocaleString()}`);
  console.log(`  Total sections: ${totalSections}`);
  console.log(`  Target per section: ${seatsPerSection}`);
  console.log(`  Setting: rows=${rows}, seatsPerRow=${seatsPerRow}`);

  // Add rows and seatsPerRow to each section that doesn't have them
  // Match sections and add rows/seatsPerRow before the closing brace
  const updated = content.replace(
    /{\s*id:\s*['"]([^'"]+)['"],\s*name:\s*['"][^'"]+['"],\s*level:\s*['"][^'"]+['"],\s*baseAngle:\s*[\d.]+,\s*angleSpan:\s*[\d.]+,\s*covered:\s*(true|false)(?:,\s*price:\s*['"][^'"]+['"])?\s*}/g,
    (match) => {
      // Check if already has rows
      if (match.includes('rows:')) {
        return match;
      }
      // Add rows and seatsPerRow before the closing brace
      return match.slice(0, -1) + `, rows: ${rows}, seatsPerRow: ${seatsPerRow} }`;
    }
  );

  // Write updated file
  fs.writeFileSync(sectionFilePath, updated);
  console.log(`  ✅ Updated ${sectionFilePath}`);

  // Verify
  const verifyContent = fs.readFileSync(sectionFilePath, 'utf-8');
  const withRows = (verifyContent.match(/rows:\s*\d+/g) || []).length;
  console.log(`  📊 Sections with rows: ${withRows}/${totalSections}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: npx tsx scripts/add-rows-to-sections.ts <stadiumId>');
    process.exit(1);
  }

  await addRowsToSections(args[0].toLowerCase());
  console.log('\n✨ Done! Now run calibration.');
}

main().catch(console.error);
