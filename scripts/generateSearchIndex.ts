#!/usr/bin/env ts-node

/**
 * Search Index Generation Script
 *
 * Generates a searchable index of all sections across all 30 MLB stadiums.
 * Output: public/data/search/search-index.json
 *
 * Usage: npx tsx scripts/generateSearchIndex.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { MLB_STADIUMS } from '../src/data/stadiums';

interface SearchIndexSection {
  id: string;
  name: string;
  stadiumId: string;
  stadiumName: string;
  teamName: string;
  level: string;
  seats: number;
  keywords: string[];
  url: string;
}

interface SearchIndex {
  generated: string;
  version: string;
  totalSections: number;
  sections: SearchIndexSection[];
}

/**
 * Map stadium ID to seat data directory name
 */
function getSeatDataStadiumId(stadiumId: string): string {
  return stadiumId === 'dodgers' ? 'dodger-stadium' : stadiumId;
}

/**
 * Extract level from section ID
 * Examples: "101" -> "loge", "1RS" -> "reserve", "301" -> "upper"
 */
function extractLevel(sectionId: string): string {
  // Field level: 1-53
  if (/^[1-9]$|^[1-4][0-9]$|^5[0-3]$/.test(sectionId)) return 'field';

  // Loge level: 100-199
  if (/^1\d{2}$/.test(sectionId)) return 'loge';

  // Reserve level: sections with RS suffix or 200s
  if (sectionId.includes('RS') || /^2\d{2}$/.test(sectionId)) return 'reserve';

  // Club level: sections with IR suffix
  if (sectionId.includes('IR')) return 'club';

  // Top Deck: sections with TD suffix or 300s
  if (sectionId.includes('TD') || /^3\d{2}$/.test(sectionId)) return 'upper';

  // Pavilion/Bleachers
  if (sectionId.includes('PV') || sectionId.includes('LF') || sectionId.includes('RF')) {
    return 'pavilion';
  }

  return 'other';
}

/**
 * Generate search keywords for a section
 */
function generateKeywords(section: SearchIndexSection): string[] {
  const keywords = new Set<string>();

  // Add section identifiers
  keywords.add(section.id.toLowerCase());
  keywords.add(section.name.toLowerCase());
  keywords.add(`section ${section.id}`.toLowerCase());
  keywords.add(`sec ${section.id}`.toLowerCase());

  // Add stadium info
  keywords.add(section.stadiumName.toLowerCase());
  keywords.add(section.teamName.toLowerCase());
  keywords.add(section.stadiumId.toLowerCase());

  // Add level info
  keywords.add(section.level);
  keywords.add(`${section.level} level`);

  // Add descriptive keywords
  const seatCount = section.seats;
  if (seatCount < 200) keywords.add('small');
  else if (seatCount < 400) keywords.add('medium');
  else keywords.add('large');

  // Location keywords based on section number
  const sectionNum = parseInt(section.id);
  if (!isNaN(sectionNum)) {
    if (sectionNum % 100 < 20) keywords.add('first base side');
    else if (sectionNum % 100 < 40) keywords.add('right field');
    else if (sectionNum % 100 < 60) keywords.add('center field');
    else if (sectionNum % 100 < 80) keywords.add('left field');
    else keywords.add('third base side');
  }

  return Array.from(keywords);
}

/**
 * Read section metadata from a section file
 */
function readSectionMetadata(filePath: string): { seats: number } | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Extract totalSeats from the file
    const seatsMatch = content.match(/totalSeats:\s*(\d+)/);
    const seats = seatsMatch ? parseInt(seatsMatch[1]) : 0;

    return { seats };
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return null;
  }
}

/**
 * Main function to generate search index
 */
async function generateSearchIndex() {
  console.log('🔍 Generating search index for all MLB stadiums...\n');

  const searchIndex: SearchIndex = {
    generated: new Date().toISOString(),
    version: '1.0.0',
    totalSections: 0,
    sections: [],
  };

  let totalStadiums = 0;
  let totalSections = 0;

  for (const stadium of MLB_STADIUMS) {
    const seatDataStadiumId = getSeatDataStadiumId(stadium.id);
    const sectionsDir = path.join(
      process.cwd(),
      'src',
      'data',
      'seatData',
      seatDataStadiumId,
      'sections'
    );

    try {
      if (!fs.existsSync(sectionsDir)) {
        console.warn(`⚠️  No sections directory for ${stadium.name}`);
        continue;
      }

      const sectionFiles = fs
        .readdirSync(sectionsDir)
        .filter((f) => f.endsWith('.ts') && f !== '_template.ts');

      let stadiumSections = 0;

      for (const file of sectionFiles) {
        const sectionId = file.replace('.ts', '');
        const filePath = path.join(sectionsDir, file);
        const metadata = readSectionMetadata(filePath);

        if (!metadata) continue;

        const section: SearchIndexSection = {
          id: sectionId,
          name: `Section ${sectionId}`,
          stadiumId: stadium.id,
          stadiumName: stadium.name,
          teamName: stadium.team,
          level: extractLevel(sectionId),
          seats: metadata.seats,
          keywords: [],
          url: `/stadium/${stadium.id}/section/${sectionId}`,
        };

        // Generate keywords
        section.keywords = generateKeywords(section);

        searchIndex.sections.push(section);
        stadiumSections++;
        totalSections++;
      }

      console.log(`✓ ${stadium.name}: ${stadiumSections} sections`);
      totalStadiums++;

    } catch (error) {
      console.error(`❌ Error processing ${stadium.name}:`, error);
    }
  }

  searchIndex.totalSections = totalSections;

  console.log(`\n📊 Search Index Summary:`);
  console.log(`  Stadiums: ${totalStadiums}`);
  console.log(`  Total Sections: ${totalSections}`);
  console.log(`  Average Sections/Stadium: ${Math.round(totalSections / totalStadiums)}`);

  // Save to public directory
  const outputDir = path.join(process.cwd(), 'public', 'data', 'search');
  const outputPath = path.join(outputDir, 'search-index.json');

  // Create directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log(`✓ Created output directory: ${outputDir}`);
  }

  // Write the index
  fs.writeFileSync(outputPath, JSON.stringify(searchIndex, null, 2), 'utf-8');

  const fileSizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
  console.log(`\n✅ Search index generated successfully!`);
  console.log(`  File: ${outputPath}`);
  console.log(`  Size: ${fileSizeKB} KB`);

  // Also create a minified version
  const minifiedPath = path.join(outputDir, 'search-index.min.json');
  fs.writeFileSync(minifiedPath, JSON.stringify(searchIndex), 'utf-8');
  const minSizeKB = (fs.statSync(minifiedPath).size / 1024).toFixed(2);
  console.log(`  Minified: ${minSizeKB} KB (${((parseFloat(minSizeKB) / parseFloat(fileSizeKB)) * 100).toFixed(1)}% of original)`);
}

// Run the script
generateSearchIndex().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
