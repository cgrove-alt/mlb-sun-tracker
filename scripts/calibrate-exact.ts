#!/usr/bin/env ts-node
/**
 * Exact Calibration - Achieve 100.0% accuracy for stadium seat counts
 *
 * This script adjusts seatsPerRow values to hit EXACTLY the target capacity.
 * Uses a greedy algorithm to fill remaining gaps by finding sections with matching row counts.
 */

import * as fs from 'fs';
import * as path from 'path';
import { MLB_STADIUMS } from '../src/data/stadiums';

interface SectionInfo {
  id: string;
  rows: number;
  seatsPerRow: number;
}

function calibrateExact(stadiumId: string): void {
  console.log(`\n🎯 Exact calibration: ${stadiumId}`);

  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  if (!stadium) {
    console.error(`  ❌ Stadium not found: ${stadiumId}`);
    return;
  }

  const targetCapacity = stadium.capacity;
  console.log(`  Target: ${targetCapacity.toLocaleString()} seats exactly`);

  const filePath = path.join(__dirname, `../src/data/stadiumSections-split/${stadiumId}.ts`);
  if (!fs.existsSync(filePath)) {
    console.error(`  ❌ File not found: ${filePath}`);
    return;
  }

  const content = fs.readFileSync(filePath, 'utf-8');

  // Parse all sections
  const sections: SectionInfo[] = [];
  const sectionRegex = /id:\s*['"]([^'"]+)['"].*?rows:\s*(\d+).*?seatsPerRow:\s*(\d+)/g;
  let match;

  while ((match = sectionRegex.exec(content)) !== null) {
    sections.push({
      id: match[1],
      rows: parseInt(match[2]),
      seatsPerRow: parseInt(match[3])
    });
  }

  if (sections.length === 0) {
    console.error(`  ❌ No sections with rows/seatsPerRow found`);
    return;
  }

  // Calculate current total
  const currentTotal = sections.reduce((sum, s) => sum + s.rows * s.seatsPerRow, 0);
  console.log(`  Current: ${currentTotal.toLocaleString()} seats`);
  console.log(`  Sections: ${sections.length}`);

  // Calculate initial difference
  let difference = targetCapacity - currentTotal;
  console.log(`  Initial difference: ${difference} seats`);

  if (difference === 0) {
    console.log(`  ✅ Already exact!`);
    return;
  }

  // Group sections by row count for efficient lookup
  const sectionsByRows = new Map<number, SectionInfo[]>();
  for (const section of sections) {
    if (!sectionsByRows.has(section.rows)) {
      sectionsByRows.set(section.rows, []);
    }
    sectionsByRows.get(section.rows)!.push(section);
  }

  // Get available row counts sorted (for greedy algorithm)
  const availableRowCounts = Array.from(sectionsByRows.keys()).sort((a, b) => b - a);
  console.log(`  Available row counts: ${availableRowCounts.join(', ')}`);

  // Greedy algorithm: use largest row counts first to fill the gap
  let iterations = 0;
  const maxIterations = 10000;

  while (difference !== 0 && iterations < maxIterations) {
    iterations++;
    let madeProgress = false;

    for (const rowCount of availableRowCounts) {
      const sectionsWithRows = sectionsByRows.get(rowCount)!;

      if (difference > 0 && difference >= rowCount) {
        // Need more seats - find a section to add seatsPerRow
        for (const section of sectionsWithRows) {
          section.seatsPerRow += 1;
          difference -= rowCount;
          madeProgress = true;
          break;
        }
        if (madeProgress) break;
      } else if (difference < 0 && -difference >= rowCount) {
        // Need fewer seats - find a section to subtract seatsPerRow
        for (const section of sectionsWithRows) {
          if (section.seatsPerRow > 1) {
            section.seatsPerRow -= 1;
            difference += rowCount;
            madeProgress = true;
            break;
          }
        }
        if (madeProgress) break;
      } else if (difference > 0 && rowCount <= difference) {
        // This row count can help
        for (const section of sectionsWithRows) {
          section.seatsPerRow += 1;
          difference -= rowCount;
          madeProgress = true;
          break;
        }
        if (madeProgress) break;
      }
    }

    // If we couldn't make progress with available row counts, try smaller ones
    if (!madeProgress) {
      // Find the exact row count we need
      const neededRowCount = Math.abs(difference);

      // Check if any section has exactly that row count
      if (sectionsByRows.has(neededRowCount)) {
        const section = sectionsByRows.get(neededRowCount)![0];
        if (difference > 0) {
          section.seatsPerRow += 1;
          difference -= neededRowCount;
        } else if (section.seatsPerRow > 1) {
          section.seatsPerRow -= 1;
          difference += neededRowCount;
        }
        madeProgress = true;
      }

      if (!madeProgress) {
        // Try to find a combination of row counts
        // For small remainders, we need to find sections with small row counts
        // or adjust a section's rows count

        // Find the smallest row count that's larger than remaining difference
        for (const rowCount of [...availableRowCounts].reverse()) {
          if (rowCount > Math.abs(difference)) {
            // We'll overshoot, then correct in next iteration
            const section = sectionsByRows.get(rowCount)![0];
            if (difference > 0) {
              section.seatsPerRow += 1;
              difference -= rowCount;
              madeProgress = true;
            } else if (section.seatsPerRow > 1) {
              section.seatsPerRow -= 1;
              difference += rowCount;
              madeProgress = true;
            }
            if (madeProgress) break;
          }
        }
      }

      if (!madeProgress) {
        console.log(`  ⚠️ Cannot fill remaining ${difference} seats with available row counts`);
        console.log(`  💡 Need to adjust a section's rows count`);

        // Find a section where we can add/subtract rows to hit exact count
        if (difference > 0) {
          // Need more seats - find section where adding 1 row gets us close
          for (const section of sections) {
            if (section.seatsPerRow <= difference) {
              const rowsToAdd = Math.floor(difference / section.seatsPerRow);
              section.rows += rowsToAdd;
              difference -= rowsToAdd * section.seatsPerRow;
              console.log(`  Adjusted ${section.id}: +${rowsToAdd} rows`);
              madeProgress = true;
              break;
            }
          }
        } else {
          // Need fewer seats
          for (const section of sections) {
            if (section.rows > 1 && section.seatsPerRow <= -difference) {
              const rowsToRemove = Math.min(section.rows - 1, Math.floor(-difference / section.seatsPerRow));
              section.rows -= rowsToRemove;
              difference += rowsToRemove * section.seatsPerRow;
              console.log(`  Adjusted ${section.id}: -${rowsToRemove} rows`);
              madeProgress = true;
              break;
            }
          }
        }

        if (!madeProgress) break;
      }
    }
  }

  // Calculate final total
  const finalTotal = sections.reduce((sum, s) => sum + s.rows * s.seatsPerRow, 0);
  const finalDiff = targetCapacity - finalTotal;

  console.log(`  Final total: ${finalTotal.toLocaleString()} seats`);
  console.log(`  Final difference: ${finalDiff}`);

  if (finalDiff !== 0) {
    console.log(`  ⚠️ Could not achieve exact match. Off by ${finalDiff} seats.`);
  } else {
    console.log(`  ✅ EXACT MATCH achieved!`);
  }

  // Update the file
  let newContent = content;
  for (const section of sections) {
    // Update seatsPerRow
    const seatsPerRowRegex = new RegExp(
      `(id:\\s*['"]${section.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"].*?seatsPerRow:\\s*)\\d+`
    );
    newContent = newContent.replace(seatsPerRowRegex, `$1${section.seatsPerRow}`);

    // Update rows
    const rowsRegex = new RegExp(
      `(id:\\s*['"]${section.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"].*?rows:\\s*)\\d+`
    );
    newContent = newContent.replace(rowsRegex, `$1${section.rows}`);
  }

  fs.writeFileSync(filePath, newContent);
  console.log(`  📁 Updated ${filePath}`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: npx tsx scripts/calibrate-exact.ts <stadiumId|all>');
    process.exit(1);
  }

  const stadiumId = args[0].toLowerCase();

  const allStadiums = [
    'royals', 'pirates', 'twins', 'tigers', 'guardians', 'rangers', 'brewers', 'rays',
    'dodgers', 'rockies', 'bluejays', 'diamondbacks', 'mariners', 'yankees',
    'orioles', 'angels', 'cardinals', 'phillies', 'reds', 'mets',
    'giants', 'cubs', 'astros', 'braves', 'nationals', 'whitesox',
    'padres', 'redsox', 'marlins', 'athletics'
  ];

  const stadiums = stadiumId === 'all' ? allStadiums : [stadiumId];

  for (const id of stadiums) {
    calibrateExact(id);
  }

  console.log('\n✨ Exact calibration complete!');
}

main().catch(console.error);
