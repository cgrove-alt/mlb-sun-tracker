#!/usr/bin/env npx tsx

/**
 * Convert TypeScript Seat Data to JSON
 *
 * This script converts all TypeScript seat data files to JSON format
 * and saves them in the public directory for runtime fetching.
 * This solves the Vercel serverless function size limit issue.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.join(__dirname, '..');
const SEAT_DATA_SRC = path.join(ROOT_DIR, 'src', 'data', 'seatData');
const SEAT_DATA_PUBLIC = path.join(ROOT_DIR, 'public', 'data', 'seats');

interface ConversionStats {
  totalStadiums: number;
  totalSections: number;
  totalBytes: number;
  errors: string[];
}

const stats: ConversionStats = {
  totalStadiums: 0,
  totalSections: 0,
  totalBytes: 0,
  errors: [],
};

function extractJsonFromTypeScript(content: string, sectionId: string): any {
  // Find the export statement and extract the JSON object
  // Format: export const section_XXX: SectionSeatingData = { ... };
  const match = content.match(
    /export\s+const\s+\w+\s*:\s*\w+\s*=\s*({[\s\S]*});/
  );

  if (!match || !match[1]) {
    throw new Error('Could not extract JSON object from TypeScript file');
  }

  try {
    // Parse the JSON (it's already valid JSON in the TS file)
    return JSON.parse(match[1]);
  } catch (error: any) {
    throw new Error(`JSON parse error: ${error.message}`);
  }
}

async function convertStadium(stadiumId: string) {
  const sectionsDir = path.join(SEAT_DATA_SRC, stadiumId, 'sections');
  const outputDir = path.join(SEAT_DATA_PUBLIC, stadiumId);

  if (!fs.existsSync(sectionsDir)) {
    console.warn(`⚠️  Sections directory not found: ${stadiumId}`);
    return;
  }

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(sectionsDir).filter(
    (f) => f.endsWith('.ts') && f !== '_template.ts'
  );

  console.log(`\n📍 ${stadiumId}: ${files.length} sections`);

  for (const file of files) {
    const sectionId = file.replace('.ts', '');
    const inputPath = path.join(sectionsDir, file);
    const outputPath = path.join(outputDir, `${sectionId}.json`);

    try {
      // Read the TypeScript file
      const content = fs.readFileSync(inputPath, 'utf-8');

      // Extract the JSON data
      const sectionData = extractJsonFromTypeScript(content, sectionId);

      // Write as JSON
      const json = JSON.stringify(sectionData, null, 0); // No formatting to save space
      fs.writeFileSync(outputPath, json, 'utf-8');

      const bytes = Buffer.byteLength(json, 'utf-8');
      stats.totalBytes += bytes;
      stats.totalSections++;

      process.stdout.write('.');
    } catch (error: any) {
      stats.errors.push(`${stadiumId}/${sectionId}: ${error.message}`);
      console.error(`  ❌ ${sectionId}: ${error.message}`);
    }
  }

  console.log(` ✅ ${files.length} sections converted`);
  stats.totalStadiums++;
}

async function main() {
  console.log('🔄 Converting TypeScript seat data to JSON...\n');
  console.log(`Source: ${SEAT_DATA_SRC}`);
  console.log(`Output: ${SEAT_DATA_PUBLIC}\n`);

  // Create output directory
  if (!fs.existsSync(SEAT_DATA_PUBLIC)) {
    fs.mkdirSync(SEAT_DATA_PUBLIC, { recursive: true });
  }

  // Get all stadium directories
  const stadiums = fs
    .readdirSync(SEAT_DATA_SRC)
    .filter((name) => {
      const fullPath = path.join(SEAT_DATA_SRC, name);
      return fs.statSync(fullPath).isDirectory();
    })
    .sort();

  console.log(`Found ${stadiums.length} stadiums\n`);

  // Convert each stadium
  for (const stadium of stadiums) {
    await convertStadium(stadium);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('CONVERSION COMPLETE');
  console.log('='.repeat(60));
  console.log(`✅ Stadiums: ${stats.totalStadiums}`);
  console.log(`✅ Sections: ${stats.totalSections}`);
  console.log(`✅ Total Size: ${(stats.totalBytes / 1024 / 1024).toFixed(2)} MB`);

  if (stats.errors.length > 0) {
    console.log(`\n⚠️  Errors: ${stats.errors.length}`);
    stats.errors.forEach((err) => console.log(`  - ${err}`));
  }

  console.log('\n📁 JSON files written to: public/data/seats/');
  console.log('🚀 Ready for deployment!\n');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
