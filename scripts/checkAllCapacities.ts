#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

const stadiums = [
  { id: 'angels', name: 'Angels', target: 45517 },
  { id: 'astros', name: 'Astros', target: 41168 },
  { id: 'athletics', name: 'Athletics', target: 14014 },
  { id: 'bluejays', name: 'Blue Jays', target: 39150 },
  { id: 'braves', name: 'Braves', target: 41084 },
  { id: 'brewers', name: 'Brewers', target: 41900 },
  { id: 'cardinals', name: 'Cardinals', target: 44383 },
  { id: 'cubs', name: 'Cubs', target: 41649 },
  { id: 'diamondbacks', name: 'Diamondbacks', target: 48686 },
  { id: 'dodger-stadium', name: 'Dodgers', target: 56000 },
  { id: 'giants', name: 'Giants', target: 41331 },
  { id: 'guardians', name: 'Guardians', target: 34830 },
  { id: 'mariners', name: 'Mariners', target: 47929 },
  { id: 'marlins', name: 'Marlins', target: 37446 },
  { id: 'mets', name: 'Mets', target: 42136 },
  { id: 'nationals', name: 'Nationals', target: 41313 },
  { id: 'orioles', name: 'Orioles', target: 45971 },
  { id: 'padres', name: 'Padres', target: 40209 },
  { id: 'phillies', name: 'Phillies', target: 42901 },
  { id: 'pirates', name: 'Pirates', target: 38747 },
  { id: 'rangers', name: 'Rangers', target: 40300 },
  { id: 'rays', name: 'Rays', target: 25025 },
  { id: 'reds', name: 'Reds', target: 42271 },
  { id: 'redsox', name: 'Red Sox', target: 37755 },
  { id: 'rockies', name: 'Rockies', target: 46897 },
  { id: 'royals', name: 'Royals', target: 37903 },
  { id: 'tigers', name: 'Tigers', target: 41083 },
  { id: 'twins', name: 'Twins', target: 38544 },
  { id: 'whitesox', name: 'White Sox', target: 40615 },
  { id: 'yankees', name: 'Yankees', target: 46537 },
];

console.log('Stadium Capacity Check');
console.log('======================');
console.log('');

let perfectCount = 0;
let needsAdjustment: any[] = [];

for (const stadium of stadiums) {
  const metadataPath = path.join(__dirname, '../src/data/seatData', stadium.id, 'metadata.ts');

  if (fs.existsSync(metadataPath)) {
    const content = fs.readFileSync(metadataPath, 'utf-8');
    const match = content.match(/totalSeats:\s*(\d+)/);

    if (match) {
      const actual = parseInt(match[1], 10);
      const diff = actual - stadium.target;
      const status = diff === 0 ? '✅' : '⚠️';

      console.log(`${status} ${stadium.name.padEnd(15)} Current: ${actual.toLocaleString().padStart(6)} | Target: ${stadium.target.toLocaleString().padStart(6)} | Diff: ${diff >= 0 ? '+' : ''}${diff}`);

      if (diff === 0) {
        perfectCount++;
      } else {
        needsAdjustment.push({ name: stadium.name, id: stadium.id, diff });
      }
    }
  } else {
    console.log(`❌ ${stadium.name.padEnd(15)} Metadata not found`);
  }
}

console.log('');
console.log('Summary:');
console.log(`Perfect matches: ${perfectCount}/${stadiums.length}`);

if (needsAdjustment.length > 0) {
  console.log('');
  console.log('Needs adjustment:');
  needsAdjustment
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
    .forEach(s => {
      console.log(`  ${s.name}: ${s.diff >= 0 ? '+' : ''}${s.diff} seats`);
    });
}