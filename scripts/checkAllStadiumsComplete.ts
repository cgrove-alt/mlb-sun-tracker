#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';

// Official MLB stadium capacities (2024-2025 season)
const stadiums = [
  { dir: 'angels', name: 'Angels', team: 'LAA', target: 45517 },
  { dir: 'astros', name: 'Astros', team: 'HOU', target: 41168 },
  { dir: 'athletics', name: 'Athletics', team: 'OAK', target: 14014 }, // Sacramento temp
  { dir: 'bluejays', name: 'Blue Jays', team: 'TOR', target: 39150 },
  { dir: 'braves', name: 'Braves', team: 'ATL', target: 41084 },
  { dir: 'brewers', name: 'Brewers', team: 'MIL', target: 41900 },
  { dir: 'cardinals', name: 'Cardinals', team: 'STL', target: 44383 },
  { dir: 'cubs', name: 'Cubs', team: 'CHC', target: 41649 },
  { dir: 'diamondbacks', name: 'Diamondbacks', team: 'ARI', target: 48686 },
  { dir: 'dodger-stadium', name: 'Dodgers', team: 'LAD', target: 56000 },
  { dir: 'giants', name: 'Giants', team: 'SF', target: 41331 },
  { dir: 'guardians', name: 'Guardians', team: 'CLE', target: 34830 },
  { dir: 'mariners', name: 'Mariners', team: 'SEA', target: 47929 },
  { dir: 'marlins', name: 'Marlins', team: 'MIA', target: 37446 },
  { dir: 'mets', name: 'Mets', team: 'NYM', target: 42136 },
  { dir: 'nationals', name: 'Nationals', team: 'WSH', target: 41313 },
  { dir: 'orioles', name: 'Orioles', team: 'BAL', target: 45971 },
  { dir: 'padres', name: 'Padres', team: 'SD', target: 40209 },
  { dir: 'phillies', name: 'Phillies', team: 'PHI', target: 42901 },
  { dir: 'pirates', name: 'Pirates', team: 'PIT', target: 38747 },
  { dir: 'rangers', name: 'Rangers', team: 'TEX', target: 40300 },
  { dir: 'rays', name: 'Rays', team: 'TB', target: 25025 },
  { dir: 'reds', name: 'Reds', team: 'CIN', target: 42271 },
  { dir: 'redsox', name: 'Red Sox', team: 'BOS', target: 37755 },
  { dir: 'rockies', name: 'Rockies', team: 'COL', target: 46897 },
  { dir: 'royals', name: 'Royals', team: 'KC', target: 37903 },
  { dir: 'tigers', name: 'Tigers', team: 'DET', target: 41083 },
  { dir: 'twins', name: 'Twins', team: 'MIN', target: 38544 },
  { dir: 'whitesox', name: 'White Sox', team: 'CWS', target: 40615 },
  { dir: 'yankees', name: 'Yankees', team: 'NYY', target: 46537 },
];

console.log('');
console.log('MLB Stadium Seat Generation Status');
console.log('===================================');
console.log('');

let perfectCount = 0;
let hasDataCount = 0;
let totalActualSeats = 0;
let totalTargetSeats = 0;
const needsAdjustment: any[] = [];

// Check each stadium
for (const stadium of stadiums.sort((a, b) => a.name.localeCompare(b.name))) {
  const metadataPath = path.join(__dirname, '../src/data/seatData', stadium.dir, 'metadata.ts');

  if (fs.existsSync(metadataPath)) {
    const content = fs.readFileSync(metadataPath, 'utf-8');
    const match = content.match(/"?totalSeats"?:\s*(\d+)/);

    if (match) {
      const actual = parseInt(match[1], 10);
      const diff = actual - stadium.target;
      const percent = ((actual / stadium.target) * 100).toFixed(1);
      const status = Math.abs(diff) <= 5 ? '✅' : '⚠️';

      hasDataCount++;
      totalActualSeats += actual;
      totalTargetSeats += stadium.target;

      const teamStr = `[${stadium.team}]`;
      const nameStr = stadium.name.padEnd(15);
      const actualStr = actual.toLocaleString().padStart(6);
      const targetStr = stadium.target.toLocaleString().padStart(6);
      const diffStr = (diff >= 0 ? '+' : '') + diff;

      console.log(`${status} ${teamStr} ${nameStr} Current: ${actualStr} | Target: ${targetStr} | Diff: ${diffStr.padStart(6)} (${percent}%)`);

      if (Math.abs(diff) <= 5) {
        perfectCount++;
      } else {
        needsAdjustment.push({
          name: stadium.name,
          team: stadium.team,
          dir: stadium.dir,
          diff,
          actual,
          target: stadium.target
        });
      }
    }
  } else {
    console.log(`❌ [${stadium.team}] ${stadium.name.padEnd(15)} No metadata file found`);
    totalTargetSeats += stadium.target;
  }
}

// Summary
console.log('');
console.log('═══════════════════════════════════════');
console.log('Summary:');
console.log(`  Stadiums with data: ${hasDataCount}/30`);
console.log(`  Perfect matches (±5 seats): ${perfectCount}/30`);
console.log(`  Total seats generated: ${totalActualSeats.toLocaleString()}`);
console.log(`  Total target capacity: ${totalTargetSeats.toLocaleString()}`);
console.log(`  Overall accuracy: ${((totalActualSeats / totalTargetSeats) * 100).toFixed(2)}%`);

if (needsAdjustment.length > 0) {
  console.log('');
  console.log('Needs adjustment (>5 seat difference):');
  needsAdjustment
    .sort((a, b) => Math.abs(b.diff) - Math.abs(a.diff))
    .forEach(s => {
      const percent = ((s.actual / s.target) * 100).toFixed(1);
      console.log(`  [${s.team}] ${s.name}: ${s.diff >= 0 ? '+' : ''}${s.diff} seats (${percent}% of target)`);
    });
}