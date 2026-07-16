/**
 * Venue data audit (audit Phase 2, step 4).
 *
 * Scans the single source of truth for venue header facts
 * (src/data/unifiedVenues.ts → ALL_UNIFIED_VENUES) and reports any record
 * with a missing or malformed city, state, capacity, or orientation.
 *
 * Usage: node scripts/auditVenueData.js
 * Exit code 1 if any problems are found (so it can gate CI later).
 */
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '../src/data/unifiedVenues.ts');
const content = fs.readFileSync(file, 'utf-8');

const match = content.match(/export const ALL_UNIFIED_VENUES: UnifiedVenue\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not parse ALL_UNIFIED_VENUES from unifiedVenues.ts');
  process.exit(1);
}
// The venues array is auto-generated with double-quoted keys, so it is valid
// JSON — parse it safely rather than eval-ing arbitrary code.
let venues;
try {
  venues = JSON.parse(match[1]);
} catch (err) {
  console.error('ALL_UNIFIED_VENUES is not valid JSON:', err.message);
  process.exit(1);
}

const US_STATE = /^[A-Z]{2}$/; // 2-letter US/CA abbreviation
const problems = [];

for (const v of venues) {
  const issues = [];

  if (!v.city || !String(v.city).trim()) issues.push('missing city');
  if (!v.state || !String(v.state).trim()) issues.push('missing state');
  else if (!US_STATE.test(String(v.state).trim())) issues.push(`malformed state "${v.state}"`);

  if (v.capacity == null || typeof v.capacity !== 'number' || Number.isNaN(v.capacity) || v.capacity <= 0) {
    issues.push(`bad capacity "${v.capacity}"`);
  }

  if (v.orientation == null || typeof v.orientation !== 'number' || Number.isNaN(v.orientation) || v.orientation < 0 || v.orientation >= 360) {
    issues.push(`bad orientation "${v.orientation}"`);
  }

  if (issues.length) {
    problems.push({ id: v.id, league: v.league, name: v.name, issues });
  }
}

console.log(`Audited ${venues.length} venues in ALL_UNIFIED_VENUES.`);
if (problems.length === 0) {
  console.log('✓ No missing/malformed city, state, capacity, or orientation found.');
  process.exit(0);
}

console.log(`\n✗ ${problems.length} venue(s) with problems:\n`);
for (const p of problems) {
  console.log(`  [${p.league}] ${p.id} (${p.name}): ${p.issues.join('; ')}`);
}
process.exit(1);
