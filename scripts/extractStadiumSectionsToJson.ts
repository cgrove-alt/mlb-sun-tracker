/**
 * Script to extract stadiumSections data from TypeScript to JSON
 * This reduces the bundle size by moving 580KB of data out of the JS bundle
 */

import * as fs from 'fs';
import * as path from 'path';
import { stadiumSections } from '../src/data/stadiumSections';

const outputDir = path.join(process.cwd(), 'public', 'data');
const outputFile = path.join(outputDir, 'stadium-sections.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write the data to JSON
fs.writeFileSync(outputFile, JSON.stringify(stadiumSections, null, 2));

console.log(`✓ Extracted stadium sections to ${outputFile}`);
console.log(`  Total stadiums: ${stadiumSections.length}`);
console.log(`  Total sections: ${stadiumSections.reduce((sum, s) => sum + s.sections.length, 0)}`);
console.log(`  File size: ${(fs.statSync(outputFile).size / 1024).toFixed(2)} KB`);
