/**
 * Apply Stadium Orientation Fixes
 *
 * This script updates stadiums.ts with verified orientation values
 */

import * as fs from 'fs';
import * as path from 'path';

// Import verification data
import { STADIUM_ORIENTATIONS } from './verify-stadium-orientations';

const STADIUMS_FILE = path.join(__dirname, '../src/data/stadiums.ts');

async function applyFixes() {
  console.log('==============================================');
  console.log('  APPLYING STADIUM ORIENTATION CORRECTIONS    ');
  console.log('==============================================\n');

  // Read the current file
  let content = fs.readFileSync(STADIUMS_FILE, 'utf-8');

  let changesApplied = 0;

  for (const stadium of STADIUM_ORIENTATIONS) {
    if (stadium.change !== 0) {
      // Create regex to find and replace the orientation value
      // Match: id: 'stadiumId', ... orientation: NUMBER,
      const regex = new RegExp(
        `(id:\\s*['"]${stadium.id}['"][\\s\\S]*?orientation:\\s*)${stadium.currentValue}(\\s*,)`,
        'g'
      );

      const newContent = content.replace(regex, `$1${stadium.verifiedValue}$2`);

      if (newContent !== content) {
        content = newContent;
        changesApplied++;
        const arrow = stadium.change > 0 ? '↑' : '↓';
        console.log(`  ✓ ${stadium.name}: ${stadium.currentValue}° → ${stadium.verifiedValue}° (${arrow}${Math.abs(stadium.change)}°)`);
      } else {
        console.log(`  ⚠ ${stadium.name}: Could not find pattern to replace`);
      }
    }
  }

  // Write the updated content
  fs.writeFileSync(STADIUMS_FILE, content);

  console.log('\n==============================================');
  console.log(`  COMPLETE: ${changesApplied} stadium orientations updated`);
  console.log('==============================================');
  console.log('\nNext step: Run "npm run build" to verify no errors');
}

applyFixes().catch(console.error);
