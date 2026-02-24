// Validate World Cup 2026 Match Schedule
// Ensures all 104 matches have valid venues and dates

import { WORLD_CUP_2026_MATCHES } from '../src/data/worldcup2026/matches';
import { ALL_WORLD_CUP_VENUES } from '../src/data/worldcup2026/venues';

console.log('='.repeat(60));
console.log('World Cup 2026 Match Schedule Validation');
console.log('='.repeat(60));
console.log();

// 1. Total matches
console.log('✓ Total matches:', WORLD_CUP_2026_MATCHES.length);
if (WORLD_CUP_2026_MATCHES.length !== 104) {
  console.error('  ERROR: Expected 104 matches, got', WORLD_CUP_2026_MATCHES.length);
  process.exit(1);
}

// 2. Unique match IDs
const matchIds = WORLD_CUP_2026_MATCHES.map(m => m.matchId);
const uniqueIds = new Set(matchIds);
console.log('✓ Unique match IDs:', uniqueIds.size);
if (uniqueIds.size !== 104) {
  console.error('  ERROR: Duplicate match IDs found');
  process.exit(1);
}

// 3. Venue validation
const matchVenues = new Set(WORLD_CUP_2026_MATCHES.map(m => m.venue));
const venueIds = new Set(ALL_WORLD_CUP_VENUES.map(v => v.id));

console.log('✓ Unique venues used:', matchVenues.size);
console.log('  Venues:', Array.from(matchVenues).sort().join(', '));

const missingVenues = Array.from(matchVenues).filter(v => !venueIds.has(v));
if (missingVenues.length > 0) {
  console.error('  ERROR: Missing venue definitions:', missingVenues);
  process.exit(1);
}
console.log('✓ All venues validated');

// 4. Date validation
const dates = WORLD_CUP_2026_MATCHES.map(m => new Date(m.date));
const invalidDates = dates.filter(d => isNaN(d.getTime()));
if (invalidDates.length > 0) {
  console.error('  ERROR: Invalid dates found:', invalidDates.length);
  process.exit(1);
}

const startDate = new Date('2026-06-11');
const endDate = new Date('2026-07-26');
const outOfRange = WORLD_CUP_2026_MATCHES.filter(m => {
  const matchDate = new Date(m.date);
  return matchDate < startDate || matchDate > endDate;
});

if (outOfRange.length > 0) {
  console.error('  ERROR: Matches outside tournament dates:', outOfRange.map(m => m.matchId));
  process.exit(1);
}
console.log('✓ All dates valid (2026-06-11 to 2026-07-26)');

// 5. Matches by round
const byRound = WORLD_CUP_2026_MATCHES.reduce((acc, m) => {
  acc[m.round] = (acc[m.round] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

console.log();
console.log('Matches by round:');
Object.entries(byRound).forEach(([round, count]) => {
  console.log('  ' + round + ':', count);
});

// Verify expected counts
const expected = {
  'Group Stage': 72,
  'Round of 32': 16,
  'Round of 16': 8,
  'Quarterfinal': 4,
  'Semifinal': 2,
  'Third Place': 1,
  'Final': 1
};

let hasErrors = false;
Object.entries(expected).forEach(([round, count]) => {
  if (byRound[round] !== count) {
    console.error(`  ERROR: ${round} should have ${count} matches, found ${byRound[round] || 0}`);
    hasErrors = true;
  }
});

if (hasErrors) {
  process.exit(1);
}

console.log('✓ All round counts correct');

// 6. Matches by venue
const venueMatchCounts: Record<string, number> = {};
WORLD_CUP_2026_MATCHES.forEach(match => {
  venueMatchCounts[match.venue] = (venueMatchCounts[match.venue] || 0) + 1;
});

console.log();
console.log('Matches per venue:');
Object.entries(venueMatchCounts)
  .sort((a, b) => b[1] - a[1])
  .forEach(([venue, count]) => {
    console.log('  ' + venue + ':', count);
  });

// 7. Groups validation
const groups = new Set(
  WORLD_CUP_2026_MATCHES
    .filter(m => m.group)
    .map(m => m.group!)
);
console.log();
console.log('✓ Groups:', groups.size, '(expected 12)');
if (groups.size !== 12) {
  console.error('  ERROR: Expected 12 groups, found', groups.size);
  process.exit(1);
}
console.log('  Groups:', Array.from(groups).sort().join(', '));

console.log();
console.log('='.repeat(60));
console.log('✅ All validations passed!');
console.log('='.repeat(60));
