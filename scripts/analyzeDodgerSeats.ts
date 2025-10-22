#!/usr/bin/env ts-node
/**
 * Analyze Dodger Stadium Seat Data
 * Audit current seat generation to identify over-generation issues
 */

import * as fs from 'fs';
import * as path from 'path';

const seatDataDir = path.join(process.cwd(), 'src', 'data', 'seatData', 'dodger-stadium', 'sections');

const sections: { id: string; seats: number; rows: number }[] = [];
let totalSeats = 0;

// Read all section files
const files = fs.readdirSync(seatDataDir).filter(f => f.endsWith('.ts') && f !== '_template.ts');

for (const file of files) {
  const filepath = path.join(seatDataDir, file);
  const content = fs.readFileSync(filepath, 'utf-8');

  // Extract totalSeats and totalRows
  const seatsMatch = content.match(/totalSeats":\s*(\d+)/);
  const rowsMatch = content.match(/totalRows":\s*(\d+)/);

  if (seatsMatch && rowsMatch) {
    const sectionId = file.replace('.ts', '');
    const seats = parseInt(seatsMatch[1], 10);
    const rows = parseInt(rowsMatch[1], 10);

    sections.push({ id: sectionId, seats, rows });
    totalSeats += seats;
  }
}

// Sort by seat count descending
sections.sort((a, b) => b.seats - a.seats);

console.log('\n=== DODGER STADIUM SEAT AUDIT ===\n');
console.log(`Total Sections: ${sections.length}`);
console.log(`Total Seats: ${totalSeats.toLocaleString()}`);
console.log(`Official Capacity: 56,000`);
console.log(`Over-generation: +${(totalSeats - 56000).toLocaleString()} seats (${((totalSeats / 56000 - 1) * 100).toFixed(1)}%)\n`);

// Categorize by section type
const byType: Record<string, { count: number; seats: number; avgRows: number; avgSeatsPerRow: number }> = {
  'Field (1-53)': { count: 0, seats: 0, avgRows: 0, avgSeatsPerRow: 0 },
  'Loge (101-168)': { count: 0, seats: 0, avgRows: 0, avgSeatsPerRow: 0 },
  'Pavilion (301-316)': { count: 0, seats: 0, avgRows: 0, avgSeatsPerRow: 0 },
  'Reserve (RS)': { count: 0, seats: 0, avgRows: 0, avgSeatsPerRow: 0 },
  'Top Deck (TD)': { count: 0, seats: 0, avgRows: 0, avgSeatsPerRow: 0 },
  'Infield Reserve (IR)': { count: 0, seats: 0, avgRows: 0, avgSeatsPerRow: 0 },
};

sections.forEach(s => {
  const id = s.id;
  const spr = s.seats / s.rows;

  if (id.match(/^\d+$/)) {
    const num = parseInt(id, 10);
    if (num >= 1 && num <= 53) {
      byType['Field (1-53)'].count++;
      byType['Field (1-53)'].seats += s.seats;
      byType['Field (1-53)'].avgRows += s.rows;
      byType['Field (1-53)'].avgSeatsPerRow += spr;
    } else if (num >= 101 && num <= 168) {
      byType['Loge (101-168)'].count++;
      byType['Loge (101-168)'].seats += s.seats;
      byType['Loge (101-168)'].avgRows += s.rows;
      byType['Loge (101-168)'].avgSeatsPerRow += spr;
    } else if (num >= 301 && num <= 316) {
      byType['Pavilion (301-316)'].count++;
      byType['Pavilion (301-316)'].seats += s.seats;
      byType['Pavilion (301-316)'].avgRows += s.rows;
      byType['Pavilion (301-316)'].avgSeatsPerRow += spr;
    }
  } else if (id.endsWith('RS')) {
    byType['Reserve (RS)'].count++;
    byType['Reserve (RS)'].seats += s.seats;
    byType['Reserve (RS)'].avgRows += s.rows;
    byType['Reserve (RS)'].avgSeatsPerRow += spr;
  } else if (id.endsWith('TD')) {
    byType['Top Deck (TD)'].count++;
    byType['Top Deck (TD)'].seats += s.seats;
    byType['Top Deck (TD)'].avgRows += s.rows;
    byType['Top Deck (TD)'].avgSeatsPerRow += spr;
  } else if (id.endsWith('IR')) {
    byType['Infield Reserve (IR)'].count++;
    byType['Infield Reserve (IR)'].seats += s.seats;
    byType['Infield Reserve (IR)'].avgRows += s.rows;
    byType['Infield Reserve (IR)'].avgSeatsPerRow += spr;
  }
});

console.log('=== BY SECTION TYPE ===\n');
Object.entries(byType).forEach(([type, data]) => {
  if (data.count > 0) {
    const avgRows = (data.avgRows / data.count).toFixed(1);
    const avgSpr = (data.avgSeatsPerRow / data.count).toFixed(1);
    console.log(`${type}:`);
    console.log(`  Sections: ${data.count}`);
    console.log(`  Total Seats: ${data.seats.toLocaleString()}`);
    console.log(`  Avg Rows/Section: ${avgRows}`);
    console.log(`  Avg Seats/Row: ${avgSpr}`);
    console.log('');
  }
});

console.log('=== TOP 20 LARGEST SECTIONS ===\n');
sections.slice(0, 20).forEach((s, i) => {
  const spr = (s.seats / s.rows).toFixed(1);
  console.log(`${(i + 1).toString().padStart(2)}. ${s.id.padEnd(6)} - ${s.seats.toString().padStart(4)} seats (${s.rows.toString().padStart(2)} rows × ${spr} avg seats/row)`);
});

console.log('\n');
