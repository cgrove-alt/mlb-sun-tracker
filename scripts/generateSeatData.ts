#!/usr/bin/env ts-node
/**
 * Generate Seat Data for Dodger Stadium
 *
 * This script generates 3D coordinates for all seats in Dodger Stadium
 * using the existing stadium3DGeometry functions.
 */

import * as fs from 'fs';
import * as path from 'path';
import { MLB_STADIUMS } from '../src/data/stadiums';
import { stadiumSections as dodgerSections } from '../src/data/stadiumSections-split/dodgers';
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
          position: [number, number, number]; // [x, y, z]
        }[];
      }[];
    };
  };
}

async function generateDodgerStadiumSeats() {
  console.log('🏟️  Starting seat data generation for Dodger Stadium...\n');

  // Find Dodger Stadium
  const stadium = MLB_STADIUMS.find(s => s.id === 'dodgers');
  if (!stadium) {
    throw new Error('Dodger Stadium not found in stadiums data');
  }

  console.log(`Stadium: ${stadium.name}`);
  console.log(`Location: ${stadium.latitude}, ${stadium.longitude}`);
  console.log(`Sections: ${dodgerSections.sections.length}\n`);

  // Generate 3D model with all seats
  console.log('Generating 3D model with seat coordinates...');
  const model3D = getStadium3DModel(stadium, dodgerSections.sections as StadiumSection[]);

  // Transform into output format
  const seatData: SeatData = {
    stadiumId: 'dodgers',
    stadiumName: stadium.name,
    totalSections: model3D.sections.length,
    totalSeats: 0,
    generatedAt: new Date().toISOString(),
    sections: {}
  };

  // Process each section
  for (const sectionGeometry of model3D.sections) {
    const section = dodgerSections.sections.find(s => s.id === sectionGeometry.id);
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

  console.log(`✅ Generated ${seatData.totalSeats.toLocaleString()} seats across ${seatData.totalSections} sections\n`);

  // Write to file
  const outputDir = path.join(__dirname, '../src/data/seatData');
  const outputPath = path.join(outputDir, 'dodger-stadium-seats.json');

  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(seatData, null, 2));

  // Calculate file size
  const stats = fs.statSync(outputPath);
  const fileSizeKB = (stats.size / 1024).toFixed(2);

  console.log(`📁 Output file: ${outputPath}`);
  console.log(`📊 File size: ${fileSizeKB} KB\n`);

  // Print summary statistics
  console.log('📈 Section-Level Statistics:');
  const levelStats: Record<string, { sections: number; seats: number }> = {};

  for (const [sectionId, sectionData] of Object.entries(seatData.sections)) {
    const level = sectionData.level;
    if (!levelStats[level]) {
      levelStats[level] = { sections: 0, seats: 0 };
    }
    levelStats[level].sections++;
    levelStats[level].seats += sectionData.totalSeats;
  }

  for (const [level, stats] of Object.entries(levelStats)) {
    console.log(`  ${level.padEnd(8)}: ${stats.sections.toString().padStart(3)} sections, ${stats.seats.toLocaleString().padStart(6)} seats`);
  }

  console.log('\n✨ Seat data generation complete!');
}

// Run the script
generateDodgerStadiumSeats().catch(error => {
  console.error('❌ Error generating seat data:', error);
  process.exit(1);
});
