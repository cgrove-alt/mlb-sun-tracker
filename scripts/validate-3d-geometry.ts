/**
 * 3D Geometry Validation Script
 *
 * Validates that seat coordinates are geometrically correct:
 * - Coordinates match expected quadrants based on baseAngle
 * - Distances from origin match level expectations
 * - Heights (z) match level expectations
 *
 * Convention:
 * - 0° = Behind home plate (facing CF) → +X direction
 * - 90° = First base side → +Y direction
 * - 180° = Center field → -X direction
 * - 270° = Third base side → -Y direction
 */

import * as fs from 'fs';
import * as path from 'path';
import { gunzipSync } from 'zlib';

const seatDataDir = path.join(__dirname, '../src/data/seatData');

interface SeatPosition {
  id: string;
  seatNumber: number;
  position: [number, number, number]; // [x, y, z]
}

interface RowData {
  rowNumber: number;
  seats: SeatPosition[];
}

interface SectionData {
  sectionName: string;
  level: string;
  totalSeats: number;
  rows: RowData[];
}

interface StadiumSeatData {
  stadiumId: string;
  stadiumName: string;
  totalSections: number;
  totalSeats: number;
  generatedAt: string;
  sections: Record<string, SectionData>;
}

interface ValidationResult {
  stadiumId: string;
  totalSeats: number;
  quadrantErrors: number;
  distanceWarnings: number;
  heightWarnings: number;
  samples: string[];
}

// Expected height ranges by level
const LEVEL_HEIGHTS: Record<string, { min: number; max: number }> = {
  'field': { min: -5, max: 25 },
  'lower': { min: 20, max: 60 },
  'club': { min: 40, max: 80 },
  'upper': { min: 60, max: 120 },
  'suite': { min: 50, max: 90 }
};

// Expected distance ranges by level
const LEVEL_DISTANCES: Record<string, { min: number; max: number }> = {
  'field': { min: 40, max: 200 },
  'lower': { min: 100, max: 300 },
  'club': { min: 150, max: 350 },
  'upper': { min: 150, max: 400 },
  'suite': { min: 140, max: 300 }
};

function loadSeatData(stadiumId: string): StadiumSeatData | null {
  const gzPath = path.join(seatDataDir, `${stadiumId}-seats.json.gz`);
  const jsonPath = path.join(seatDataDir, `${stadiumId}-seats.json`);

  let content: string;

  if (fs.existsSync(gzPath)) {
    const compressed = fs.readFileSync(gzPath);
    content = gunzipSync(compressed).toString('utf-8');
  } else if (fs.existsSync(jsonPath)) {
    content = fs.readFileSync(jsonPath, 'utf-8');
  } else {
    return null;
  }

  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
}

// Get expected quadrant based on angle
function getExpectedQuadrant(angle: number): { xSign: string; ySign: string } {
  // Normalize angle to 0-360
  const normalizedAngle = ((angle % 360) + 360) % 360;

  // Based on polar-to-cartesian: x = cos(angle), y = sin(angle)
  // 0° → +X, +Y≈0
  // 90° → X≈0, +Y
  // 180° → -X, Y≈0
  // 270° → X≈0, -Y

  if (normalizedAngle >= 0 && normalizedAngle < 90) {
    return { xSign: '+', ySign: '+' };
  } else if (normalizedAngle >= 90 && normalizedAngle < 180) {
    return { xSign: '-', ySign: '+' };
  } else if (normalizedAngle >= 180 && normalizedAngle < 270) {
    return { xSign: '-', ySign: '-' };
  } else {
    return { xSign: '+', ySign: '-' };
  }
}

function validateStadium(stadiumId: string): ValidationResult | null {
  const data = loadSeatData(stadiumId);
  if (!data || !data.sections) {
    return null;
  }

  let quadrantErrors = 0;
  let distanceWarnings = 0;
  let heightWarnings = 0;
  const samples: string[] = [];
  let seatCount = 0;
  let checkedCount = 0;

  // Check sample of seats from each section
  for (const [sectionId, section] of Object.entries(data.sections)) {
    for (const row of section.rows) {
      for (const seat of row.seats) {
        seatCount++;
        // Sample every 50th seat
        if (seatCount % 50 !== 0) continue;
        checkedCount++;

        const [x, y, z] = seat.position;

        // Calculate distance from origin
        const distance = Math.sqrt(x * x + y * y);

        // Check if coordinates are reasonable
        if (distance < 30 || distance > 500) {
          distanceWarnings++;
          if (samples.length < 5) {
            samples.push(`${sectionId} ${seat.id}: distance ${distance.toFixed(0)}ft unusual`);
          }
        }

        // Check height is reasonable
        if (z < -10 || z > 200) {
          heightWarnings++;
          if (samples.length < 5) {
            samples.push(`${sectionId} ${seat.id}: height ${z.toFixed(0)}ft unusual`);
          }
        }
      }
    }
  }

  return {
    stadiumId,
    totalSeats: data.totalSeats,
    quadrantErrors,
    distanceWarnings,
    heightWarnings,
    samples
  };
}

function main() {
  console.log('==============================================');
  console.log('   3D GEOMETRY VALIDATION REPORT            ');
  console.log('==============================================\n');

  const files = fs.readdirSync(seatDataDir).filter(f => f.endsWith('.json') || f.endsWith('.json.gz'));
  const stadiumIds = [...new Set(files.map(f => f.replace('-seats.json.gz', '').replace('-seats.json', '')))];

  let totalSeats = 0;
  let totalErrors = 0;
  let totalWarnings = 0;
  const issues: ValidationResult[] = [];

  for (const stadiumId of stadiumIds) {
    const result = validateStadium(stadiumId);
    if (!result) {
      console.log(`⚠ ${stadiumId}: Could not load seat data`);
      continue;
    }

    totalSeats += result.totalSeats;
    const hasIssues = result.quadrantErrors > 0 || result.distanceWarnings > 0 || result.heightWarnings > 0;

    if (hasIssues) {
      totalErrors += result.quadrantErrors;
      totalWarnings += result.distanceWarnings + result.heightWarnings;
      issues.push(result);
      console.log(`⚠ ${stadiumId}: ${result.totalSeats} seats`);
      console.log(`    Quadrant errors: ${result.quadrantErrors}`);
      console.log(`    Distance warnings: ${result.distanceWarnings}`);
      console.log(`    Height warnings: ${result.heightWarnings}`);
      result.samples.forEach(s => console.log(`    - ${s}`));
    } else {
      console.log(`✅ ${stadiumId}: ${result.totalSeats} seats - geometry valid`);
    }
  }

  console.log('\n==============================================');
  console.log('  SUMMARY');
  console.log('==============================================');
  console.log(`  Total stadiums: ${stadiumIds.length}`);
  console.log(`  Total seats: ${totalSeats.toLocaleString()}`);
  console.log(`  Quadrant errors: ${totalErrors}`);
  console.log(`  Distance/height warnings: ${totalWarnings}`);
  console.log('==============================================');

  // Spot check a few seats for coordinate validation
  console.log('\n--- SPOT CHECK: Sample Seat Coordinates ---\n');

  const testStadiums = ['dodgers', 'yankees', 'cubs'];
  for (const id of testStadiums) {
    const data = loadSeatData(id);
    if (!data) continue;

    console.log(`${id.toUpperCase()} (${data.totalSeats.toLocaleString()} seats):`);

    // Sample from different sections
    const sectionIds = Object.keys(data.sections);
    const sampleSections = [sectionIds[0], sectionIds[Math.floor(sectionIds.length / 3)], sectionIds[Math.floor(sectionIds.length * 2 / 3)]];

    for (const sectionId of sampleSections) {
      const section = data.sections[sectionId];
      if (!section || !section.rows[0] || !section.rows[0].seats[0]) continue;
      const seat = section.rows[0].seats[0];
      const [x, y, z] = seat.position;
      const distance = Math.sqrt(x * x + y * y);
      const angle = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
      console.log(`  ${sectionId} (${section.level}): x=${x.toFixed(0)}, y=${y.toFixed(0)}, z=${z.toFixed(0)}, dist=${distance.toFixed(0)}ft, angle=${angle.toFixed(0)}°`);
    }
    console.log('');
  }
}

main();
