#!/usr/bin/env ts-node

/**
 * Generate SVG maps for all 30 MLB stadiums
 *
 * Usage: npx tsx scripts/generateAllStadiumSVGs.ts
 */

import { execSync } from 'child_process';
import { MLB_STADIUMS } from '../src/data/stadiums';

async function generateAllStadiums() {
  console.log('🏟️  Generating SVG maps for all 30 MLB stadiums...\n');

  let successCount = 0;
  let failCount = 0;

  for (const stadium of MLB_STADIUMS) {
    try {
      console.log(`\n[${ successCount + failCount + 1}/30] Processing ${stadium.name}...`);
      execSync(`npx tsx scripts/generateStadiumSVG.ts --stadium=${stadium.id}`, {
        stdio: 'inherit',
      });
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to generate SVG for ${stadium.name}`);
      failCount++;
    }
  }

  console.log(`\n\n📊 Summary:`);
  console.log(`  ✅ Success: ${successCount} stadiums`);
  console.log(`  ❌ Failed: ${failCount} stadiums`);
  console.log(`\n✅ All stadium SVG maps generated!`);
  console.log(`  Location: public/stadiums/maps/`);
}

generateAllStadiums().catch(console.error);
