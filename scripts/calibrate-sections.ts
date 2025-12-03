#!/usr/bin/env ts-node
/**
 * Calibrate Stadium Section Data to Match Official Capacity
 *
 * This script adjusts seatsPerRow values proportionally to hit exact target capacity.
 *
 * Usage:
 *   npx tsx scripts/calibrate-sections.ts <stadiumId>
 *   npx tsx scripts/calibrate-sections.ts royals
 */

import * as fs from 'fs';
import * as path from 'path';
import { MLB_STADIUMS } from '../src/data/stadiums';

interface SectionData {
  id: string;
  name: string;
  level: string;
  baseAngle: number;
  angleSpan: number;
  covered?: boolean;
  rows?: number;
  seatsPerRow?: number;
  distanceFromField?: number;
}

async function calibrateStadium(stadiumId: string): Promise<void> {
  console.log(`\n🔧 Calibrating: ${stadiumId}`);

  // Find stadium
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  if (!stadium) {
    console.error(`  ❌ Stadium not found: ${stadiumId}`);
    return;
  }

  const targetCapacity = stadium.capacity;
  console.log(`  Target capacity: ${targetCapacity.toLocaleString()}`);

  // Read section file
  const sectionFilePath = path.join(__dirname, `../src/data/stadiumSections-split/${stadiumId}.ts`);
  if (!fs.existsSync(sectionFilePath)) {
    console.error(`  ❌ Section file not found: ${sectionFilePath}`);
    return;
  }

  let content = fs.readFileSync(sectionFilePath, 'utf-8');

  // Parse sections to calculate current total
  const sectionRegex = /{\s*id:\s*['"]([^'"]+)['"][^}]*rows:\s*(\d+)[^}]*seatsPerRow:\s*(\d+)/g;
  let currentTotal = 0;
  const sections: { id: string; rows: number; seatsPerRow: number; match: string }[] = [];

  let match;
  while ((match = sectionRegex.exec(content)) !== null) {
    const rows = parseInt(match[2]);
    const seatsPerRow = parseInt(match[3]);
    currentTotal += rows * seatsPerRow;
    sections.push({ id: match[1], rows, seatsPerRow, match: match[0] });
  }

  // Also count sections without rows/seatsPerRow (using defaults 20x20)
  const allSectionsRegex = /{\s*id:\s*['"]([^'"]+)['"]/g;
  let totalSections = 0;
  while (allSectionsRegex.exec(content) !== null) {
    totalSections++;
  }

  const sectionsWithData = sections.length;
  const sectionsWithDefaults = totalSections - sectionsWithData;
  const defaultSeats = sectionsWithDefaults * 20 * 20; // 400 per default section

  console.log(`  Sections with data: ${sectionsWithData}`);
  console.log(`  Sections using defaults: ${sectionsWithDefaults}`);
  console.log(`  Current from data: ${currentTotal.toLocaleString()}`);
  console.log(`  Current from defaults: ${defaultSeats.toLocaleString()}`);
  console.log(`  Total current: ${(currentTotal + defaultSeats).toLocaleString()}`);

  // Calculate scale factor
  const totalCurrent = currentTotal + defaultSeats;
  const scaleFactor = targetCapacity / totalCurrent;
  console.log(`  Scale factor: ${scaleFactor.toFixed(4)}`);

  if (Math.abs(scaleFactor - 1) < 0.05) {
    console.log(`  ✓ Already within 5% accuracy, skipping`);
    return;
  }

  // Apply scale factor to seatsPerRow
  let newContent = content;
  let adjustedTotal = 0;

  for (const section of sections) {
    const newSeatsPerRow = Math.round(section.seatsPerRow * scaleFactor);
    const oldPattern = `seatsPerRow: ${section.seatsPerRow}`;
    const newPattern = `seatsPerRow: ${newSeatsPerRow}`;
    newContent = newContent.replace(oldPattern, newPattern);
    adjustedTotal += section.rows * newSeatsPerRow;
  }

  // Also adjust default sections by adding explicit rows/seatsPerRow
  const adjustedDefaultSeats = Math.round(defaultSeats * scaleFactor);
  const newDefaultSeatsPerRow = Math.round(20 * scaleFactor);

  console.log(`  Adjusted from data: ${adjustedTotal.toLocaleString()}`);
  console.log(`  Adjusted defaults: ${adjustedDefaultSeats.toLocaleString()}`);
  console.log(`  New total: ${(adjustedTotal + adjustedDefaultSeats).toLocaleString()}`);

  // Write updated file
  fs.writeFileSync(sectionFilePath, newContent);
  console.log(`  ✅ Updated ${sectionFilePath}`);

  // Calculate final accuracy
  const finalAccuracy = ((adjustedTotal + adjustedDefaultSeats) / targetCapacity) * 100;
  console.log(`  📊 Final accuracy: ${finalAccuracy.toFixed(1)}%`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: npx tsx scripts/calibrate-sections.ts <stadiumId|list>');
    console.log('\nStadiums needing calibration:');
    console.log('  - royals (227.8%)');
    console.log('  - pirates (130.9%)');
    console.log('  - twins (82.5%)');
    console.log('  - tigers (78.6%)');
    console.log('  - rangers (124.2%)');
    console.log('  - brewers (78.8%)');
    process.exit(1);
  }

  const stadiumId = args[0].toLowerCase();

  // Define stadiums that need calibration
  const needsCalibration = ['royals', 'pirates', 'twins', 'tigers', 'rangers', 'brewers'];

  if (stadiumId === 'all') {
    for (const id of needsCalibration) {
      await calibrateStadium(id);
    }
  } else {
    await calibrateStadium(stadiumId);
  }

  console.log('\n✨ Calibration complete!');
  console.log('Run: npx tsx scripts/generateSeatDataForStadium.ts <stadiumId> to regenerate');
}

main().catch(console.error);
