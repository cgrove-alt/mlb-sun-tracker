/**
 * Script to extract unifiedVenues data from TypeScript to JSON
 * This reduces the bundle size by moving 160KB of data out of the JS bundle
 */

import * as fs from 'fs';
import * as path from 'path';
import { ALL_UNIFIED_VENUES } from '../src/data/unifiedVenues';

const outputDir = path.join(process.cwd(), 'public', 'data');
const outputFile = path.join(outputDir, 'unified-venues.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the data to JSON
fs.writeFileSync(outputFile, JSON.stringify(ALL_UNIFIED_VENUES, null, 2));

console.log(`✓ Extracted unified venues to ${outputFile}`);
console.log(`  Total venues: ${ALL_UNIFIED_VENUES.length}`);
console.log(`  File size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
