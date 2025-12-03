#!/usr/bin/env ts-node
/**
 * Generate Seat Data for Any MLB Stadium
 *
 * This script generates 3D coordinates for all seats in any MLB stadium.
 *
 * Usage:
 *   npx tsx scripts/generateSeatDataForStadium.ts <stadiumId>
 *   npx tsx scripts/generateSeatDataForStadium.ts yankees
 *   npx tsx scripts/generateSeatDataForStadium.ts all
 */

import * as fs from 'fs';
import * as path from 'path';
import { MLB_STADIUMS } from '../src/data/stadiums';
import { getStadium3DModel } from '../src/data/stadium3DGeometry';
import type { StadiumSection } from '../src/data/stadiumSectionTypes';

interface SeatData {
  stadiumId: string;
  stadiumName: string;
  totalSections: number;
  totalSeats: number;
  generatedAt: string;
  sections: {
    [sectionId: string]: {
      sectionName: string;
      level: string;
      totalSeats: number;
      rows: {
        rowNumber: number;
        seats: {
          id: string;
          seatNumber: number;
          position: [number, number, number];
        }[];
      }[];
    };
  };
}

// Dynamically load stadium sections
async function loadStadiumSections(stadiumId: string): Promise<{ sections: StadiumSection[] } | null> {
  try {
    const modulePath = `../src/data/stadiumSections-split/${stadiumId}`;
    const module = await import(modulePath);
    return module.stadiumSections;
  } catch (error) {
    console.error(`  Could not load sections for ${stadiumId}:`, error);
    return null;
  }
}

async function generateSeatDataForStadium(stadiumId: string): Promise<void> {
  console.log(`\n🏟️  Generating seat data for: ${stadiumId}`);

  // Find stadium in data
  const stadium = MLB_STADIUMS.find(s => s.id === stadiumId);
  if (!stadium) {
    console.error(`  ❌ Stadium "${stadiumId}" not found`);
    return;
  }

  // Load section data
  const sectionsData = await loadStadiumSections(stadiumId);
  if (!sectionsData || !sectionsData.sections || sectionsData.sections.length === 0) {
    console.error(`  ❌ No section data for ${stadiumId}`);
    return;
  }

  console.log(`  Stadium: ${stadium.name}`);
  console.log(`  Location: ${stadium.latitude.toFixed(4)}, ${stadium.longitude.toFixed(4)}`);
  console.log(`  Sections: ${sectionsData.sections.length}`);

  // Generate 3D model with all seats
  console.log('  Generating 3D coordinates...');
  const model3D = getStadium3DModel(stadium, sectionsData.sections as StadiumSection[]);

  // Transform into output format
  const seatData: SeatData = {
    stadiumId,
    stadiumName: stadium.name,
    totalSections: model3D.sections.length,
    totalSeats: 0,
    generatedAt: new Date().toISOString(),
    sections: {}
  };

  // Process each section
  for (const sectionGeometry of model3D.sections) {
    const section = sectionsData.sections.find(s => s.id === sectionGeometry.id);
    if (!section) continue;

    // Group seats by row
    const rowMap = new Map<number, typeof sectionGeometry.seats>();
    for (const seat of sectionGeometry.seats) {
      if (!rowMap.has(seat.row)) {
        rowMap.set(seat.row, []);
      }
      rowMap.get(seat.row)!.push(seat);
    }

    // Convert to array format
    const rows = Array.from(rowMap.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([rowNumber, seats]) => ({
        rowNumber,
        seats: seats.map(seat => ({
          id: seat.id,
          seatNumber: seat.seatNumber,
          position: [
            Math.round(seat.position.x * 10) / 10,
            Math.round(seat.position.y * 10) / 10,
            Math.round(seat.position.z * 10) / 10
          ] as [number, number, number]
        }))
      }));

    seatData.sections[sectionGeometry.id] = {
      sectionName: section.name,
      level: section.level,
      totalSeats: sectionGeometry.seats.length,
      rows
    };

    seatData.totalSeats += sectionGeometry.seats.length;
  }

  // Ensure output directories exist
  const srcOutputDir = path.join(__dirname, '../src/data/seatData');
  const publicOutputDir = path.join(__dirname, '../public/data/seatData');

  if (!fs.existsSync(srcOutputDir)) {
    fs.mkdirSync(srcOutputDir, { recursive: true });
  }
  if (!fs.existsSync(publicOutputDir)) {
    fs.mkdirSync(publicOutputDir, { recursive: true });
  }

  // Write to both src and public directories
  const srcPath = path.join(srcOutputDir, `${stadiumId}-seats.json`);
  const publicPath = path.join(publicOutputDir, `${stadiumId}-seats.json`);

  const jsonContent = JSON.stringify(seatData, null, 2);
  fs.writeFileSync(srcPath, jsonContent);
  fs.writeFileSync(publicPath, jsonContent);

  // Calculate file size
  const stats = fs.statSync(srcPath);
  const fileSizeKB = (stats.size / 1024).toFixed(2);

  console.log(`  ✅ Generated ${seatData.totalSeats.toLocaleString()} seats across ${seatData.totalSections} sections`);
  console.log(`  📊 File size: ${fileSizeKB} KB`);

  // Print level statistics
  const levelStats: Record<string, { sections: number; seats: number }> = {};
  for (const sectionData of Object.values(seatData.sections)) {
    const level = sectionData.level;
    if (!levelStats[level]) {
      levelStats[level] = { sections: 0, seats: 0 };
    }
    levelStats[level].sections++;
    levelStats[level].seats += sectionData.totalSeats;
  }

  console.log('  📈 By level:');
  for (const [level, stats] of Object.entries(levelStats)) {
    console.log(`     ${level.padEnd(8)}: ${stats.sections.toString().padStart(3)} sections, ${stats.seats.toLocaleString().padStart(6)} seats`);
  }

  // Validate against official capacity
  const accuracy = (seatData.totalSeats / stadium.capacity) * 100;
  if (accuracy < 95 || accuracy > 105) {
    console.warn(`  ⚠️  Accuracy: ${accuracy.toFixed(1)}% (${seatData.totalSeats.toLocaleString()} generated vs ${stadium.capacity.toLocaleString()} official)`);
  } else {
    console.log(`  ✓ Accuracy: ${accuracy.toFixed(1)}% (target: ${stadium.capacity.toLocaleString()})`);
  }
}

// Main function
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: npx tsx scripts/generateSeatDataForStadium.ts <stadiumId|all>');
    console.log('\nAvailable stadiums:');
    MLB_STADIUMS.forEach(s => console.log(`  - ${s.id}: ${s.name}`));
    process.exit(1);
  }

  const stadiumId = args[0].toLowerCase();

  console.log('==============================================');
  console.log('    SEAT DATA GENERATOR                       ');
  console.log('    Generated: ' + new Date().toISOString());
  console.log('==============================================');

  if (stadiumId === 'all') {
    console.log('\nGenerating seat data for ALL MLB stadiums...');
    for (const stadium of MLB_STADIUMS) {
      await generateSeatDataForStadium(stadium.id);
    }
  } else {
    await generateSeatDataForStadium(stadiumId);
  }

  console.log('\n==============================================');
  console.log('✨ Seat data generation complete!');
  console.log('==============================================');
}

main().catch(error => {
  console.error('❌ Error:', error);
  process.exit(1);
});
