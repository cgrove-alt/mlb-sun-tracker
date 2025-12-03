/**
 * Add Verified Flags to Stadium Data
 * Generated: November 26, 2025
 *
 * This script adds verified: true and verifiedDate to all stadiums
 * that have been verified during the Phase 7 data audit.
 */

import * as fs from 'fs';
import * as path from 'path';

const STADIUMS_FILE = path.join(__dirname, '../src/data/stadiums.ts');
const TODAY = '2025-11-26';

// All stadiums are now verified after Phase 7 audit
const VERIFIED_STADIUMS = [
  'angels', 'astros', 'athletics', 'bluejays', 'braves',
  'brewers', 'cardinals', 'cubs', 'diamondbacks', 'dodgers',
  'giants', 'guardians', 'mariners', 'marlins', 'mets',
  'nationals', 'orioles', 'padres', 'phillies', 'pirates',
  'rangers', 'rays', 'redsox', 'reds', 'rockies',
  'royals', 'tigers', 'twins', 'whitesox', 'yankees'
];

async function addVerifiedFlags() {
  console.log('==============================================');
  console.log('  ADDING VERIFIED FLAGS TO STADIUM DATA       ');
  console.log('==============================================\n');

  let content = fs.readFileSync(STADIUMS_FILE, 'utf-8');
  let changesApplied = 0;

  for (const stadiumId of VERIFIED_STADIUMS) {
    // Find the stadium entry and add verified flags before the closing brace
    // Pattern: id: 'stadiumId', ... upperDeckHeight: NUMBER }
    // or: id: 'stadiumId', ... timezone: 'xxx' }
    const regexWithGeometry = new RegExp(
      `(id:\\s*'${stadiumId}'[\\s\\S]*?upperDeckHeight:\\s*\\d+)(\\s*})`,
      'g'
    );

    let newContent = content.replace(regexWithGeometry, `$1,
    verified: true,
    verifiedDate: '${TODAY}'$2`);

    if (newContent !== content) {
      content = newContent;
      changesApplied++;
      console.log(`  ✓ ${stadiumId}: Added verified flag`);
    } else {
      console.log(`  ⚠ ${stadiumId}: Could not update (may already have flag or pattern mismatch)`);
    }
  }

  // Write the updated content
  fs.writeFileSync(STADIUMS_FILE, content);

  console.log('\n==============================================');
  console.log(`  COMPLETE: ${changesApplied} stadiums marked as verified`);
  console.log(`  Verification date: ${TODAY}`);
  console.log('==============================================');
}

addVerifiedFlags().catch(console.error);
