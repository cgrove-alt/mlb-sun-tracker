/**
 * Stadium Geometry Data Script
 * Generated: November 26, 2025
 *
 * This script adds geometry data (roofHeight, roofOverhang, upperDeckHeight)
 * to all MLB stadiums for accurate shadow calculations.
 *
 * Data is estimated based on:
 * - Stadium type (open-air, retractable, dome)
 * - Typical MLB stadium architecture
 * - Known stadium features
 *
 * NOTE: These are reasonable estimates. Exact architectural data
 * should be obtained from official sources for maximum accuracy.
 *
 * HEIGHTS ARE IN FEET:
 * - upperDeckHeight: Height of upper deck seating above field level (typically 60-100 ft)
 * - roofHeight: Height of roof/canopy/press box above field level (varies by stadium)
 * - roofOverhang: Horizontal depth of overhang providing shade (typically 20-50 ft)
 */

interface StadiumGeometry {
  id: string;
  name: string;
  upperDeckHeight: number;
  roofHeight: number;
  roofOverhang: number;
  roofType: 'open' | 'retractable' | 'fixed';
  notes: string;
}

// Stadium geometry data - estimated based on stadium type and known features
const STADIUM_GEOMETRY: StadiumGeometry[] = [
  {
    id: 'angels',
    name: 'Angel Stadium',
    upperDeckHeight: 80,
    roofHeight: 120,
    roofOverhang: 40,
    roofType: 'open',
    notes: 'Open-air. Large upper deck with significant overhang.'
  },
  {
    id: 'astros',
    name: 'Minute Maid Park',
    upperDeckHeight: 75,
    roofHeight: 180,
    roofOverhang: 60,
    roofType: 'retractable',
    notes: 'Retractable roof. LF has historic train feature. When open, upper deck areas still shaded.'
  },
  {
    id: 'athletics',
    name: 'Sutter Health Park',
    upperDeckHeight: 45,
    roofHeight: 65,
    roofOverhang: 25,
    roofType: 'open',
    notes: 'Temporary 2025 home. Minor league facility. Smaller dimensions than typical MLB.'
  },
  {
    id: 'bluejays',
    name: 'Rogers Centre',
    upperDeckHeight: 85,
    roofHeight: 282,
    roofOverhang: 100,
    roofType: 'retractable',
    notes: 'Retractable roof. When closed, fully covered. World\'s first fully retractable roof.'
  },
  {
    id: 'braves',
    name: 'Truist Park',
    upperDeckHeight: 75,
    roofHeight: 110,
    roofOverhang: 35,
    roofType: 'open',
    notes: 'Modern open-air design (2017). Canopy covers upper deck.'
  },
  {
    id: 'brewers',
    name: 'American Family Field',
    upperDeckHeight: 80,
    roofHeight: 200,
    roofOverhang: 80,
    roofType: 'retractable',
    notes: 'Fan-shaped retractable roof. Extensive upper deck coverage when open.'
  },
  {
    id: 'cardinals',
    name: 'Busch Stadium',
    upperDeckHeight: 75,
    roofHeight: 105,
    roofOverhang: 30,
    roofType: 'open',
    notes: 'Open-air. Upper deck has partial canopy for back rows.'
  },
  {
    id: 'cubs',
    name: 'Wrigley Field',
    upperDeckHeight: 60,
    roofHeight: 85,
    roofOverhang: 25,
    roofType: 'open',
    notes: 'Historic park (1914). Upper deck relatively low. Limited overhang.'
  },
  {
    id: 'diamondbacks',
    name: 'Chase Field',
    upperDeckHeight: 80,
    roofHeight: 200,
    roofOverhang: 70,
    roofType: 'retractable',
    notes: 'Retractable roof with air conditioning. Essential for Phoenix heat.'
  },
  {
    id: 'dodgers',
    name: 'Dodger Stadium',
    upperDeckHeight: 85,
    roofHeight: 120,
    roofOverhang: 35,
    roofType: 'open',
    notes: 'Five-level seating bowl. Top Deck is highest in MLB. Limited overhead coverage.'
  },
  {
    id: 'giants',
    name: 'Oracle Park',
    upperDeckHeight: 70,
    roofHeight: 100,
    roofOverhang: 30,
    roofType: 'open',
    notes: 'Open-air with bay views. Press box provides some upper deck shade.'
  },
  {
    id: 'guardians',
    name: 'Progressive Field',
    upperDeckHeight: 75,
    roofHeight: 110,
    roofOverhang: 35,
    roofType: 'open',
    notes: 'Open-air with distinctive toothbrush lights. Upper deck has partial canopy.'
  },
  {
    id: 'mariners',
    name: 'T-Mobile Park',
    upperDeckHeight: 80,
    roofHeight: 160,
    roofOverhang: 55,
    roofType: 'retractable',
    notes: 'Unique sliding roof. Covers seating but not field when closed. Good shade coverage.'
  },
  {
    id: 'marlins',
    name: 'loanDepot park',
    upperDeckHeight: 75,
    roofHeight: 190,
    roofOverhang: 75,
    roofType: 'retractable',
    notes: 'Retractable roof. Essential for Miami weather. Extensive coverage when open.'
  },
  {
    id: 'mets',
    name: 'Citi Field',
    upperDeckHeight: 80,
    roofHeight: 115,
    roofOverhang: 40,
    roofType: 'open',
    notes: 'Open-air. Upper deck has significant overhang from press box level.'
  },
  {
    id: 'nationals',
    name: 'Nationals Park',
    upperDeckHeight: 75,
    roofHeight: 105,
    roofOverhang: 35,
    roofType: 'open',
    notes: 'Open-air. Modern design (2008). Partial canopy on upper deck.'
  },
  {
    id: 'orioles',
    name: 'Oriole Park at Camden Yards',
    upperDeckHeight: 70,
    roofHeight: 100,
    roofOverhang: 30,
    roofType: 'open',
    notes: 'Historic retro design (1992). Moderate upper deck with classic warehouse backdrop.'
  },
  {
    id: 'padres',
    name: 'Petco Park',
    upperDeckHeight: 75,
    roofHeight: 110,
    roofOverhang: 35,
    roofType: 'open',
    notes: 'Open-air. Western Metal Supply Building in LF is unique shadow source.'
  },
  {
    id: 'phillies',
    name: 'Citizens Bank Park',
    upperDeckHeight: 75,
    roofHeight: 110,
    roofOverhang: 35,
    roofType: 'open',
    notes: 'Open-air. Symmetrical design. Standard upper deck configuration.'
  },
  {
    id: 'pirates',
    name: 'PNC Park',
    upperDeckHeight: 65,
    roofHeight: 95,
    roofOverhang: 30,
    roofType: 'open',
    notes: 'Intimate open-air design. Lower upper deck for city views. Limited overhang.'
  },
  {
    id: 'rangers',
    name: 'Globe Life Field',
    upperDeckHeight: 85,
    roofHeight: 278,
    roofOverhang: 90,
    roofType: 'retractable',
    notes: 'Modern retractable roof (2020). Extensive shade coverage. Essential for Texas heat.'
  },
  {
    id: 'rays',
    name: 'George M. Steinbrenner Field',
    upperDeckHeight: 40,
    roofHeight: 55,
    roofOverhang: 20,
    roofType: 'open',
    notes: 'TEMPORARY 2025. Spring training facility. Minimal upper structure.'
  },
  {
    id: 'redsox',
    name: 'Fenway Park',
    upperDeckHeight: 60,
    roofHeight: 80,
    roofOverhang: 20,
    roofType: 'open',
    notes: 'Historic park (1912). Green Monster (37ft) provides LF shadow. Limited upper coverage.'
  },
  {
    id: 'reds',
    name: 'Great American Ball Park',
    upperDeckHeight: 70,
    roofHeight: 100,
    roofOverhang: 30,
    roofType: 'open',
    notes: 'Open-air with riverfront views. Moderate upper deck. Gap in LF for city views.'
  },
  {
    id: 'rockies',
    name: 'Coors Field',
    upperDeckHeight: 80,
    roofHeight: 115,
    roofOverhang: 40,
    roofType: 'open',
    notes: 'Open-air. Largest upper deck in NL. Mountain views. Purple Row at 5,280 ft.'
  },
  {
    id: 'royals',
    name: 'Kauffman Stadium',
    upperDeckHeight: 75,
    roofHeight: 105,
    roofOverhang: 30,
    roofType: 'open',
    notes: 'Open-air. Crown-shaped scoreboard. Moderate upper deck coverage.'
  },
  {
    id: 'tigers',
    name: 'Comerica Park',
    upperDeckHeight: 75,
    roofHeight: 110,
    roofOverhang: 35,
    roofType: 'open',
    notes: 'Open-air. SE orientation creates unique sun patterns. Tiger sculptures at entrance.'
  },
  {
    id: 'twins',
    name: 'Target Field',
    upperDeckHeight: 75,
    roofHeight: 110,
    roofOverhang: 40,
    roofType: 'open',
    notes: 'Open-air. Canopy above upper deck for weather protection. Minneapolis skyline views.'
  },
  {
    id: 'whitesox',
    name: 'Guaranteed Rate Field',
    upperDeckHeight: 80,
    roofHeight: 115,
    roofOverhang: 40,
    roofType: 'open',
    notes: 'Open-air. Upper deck has distinctive exploding scoreboard. SE orientation.'
  },
  {
    id: 'yankees',
    name: 'Yankee Stadium',
    upperDeckHeight: 80,
    roofHeight: 120,
    roofOverhang: 45,
    roofType: 'open',
    notes: 'Open-air. Large frieze canopy above upper deck. Classic design (2009).'
  }
];

// Generate TypeScript code to update stadiums.ts
function generateUpdateCode() {
  console.log('=== STADIUM GEOMETRY DATA ===\n');
  console.log('Add the following fields to each stadium in stadiums.ts:\n');

  STADIUM_GEOMETRY.forEach(stadium => {
    console.log(`// ${stadium.name} (${stadium.roofType})`);
    console.log(`// ${stadium.notes}`);
    console.log(`{`);
    console.log(`  id: '${stadium.id}',`);
    console.log(`  ...`);
    console.log(`  roofHeight: ${stadium.roofHeight},`);
    console.log(`  roofOverhang: ${stadium.roofOverhang},`);
    console.log(`  upperDeckHeight: ${stadium.upperDeckHeight}`);
    console.log(`},\n`);
  });
}

// Apply the geometry data to stadiums.ts
import * as fs from 'fs';
import * as path from 'path';

const STADIUMS_FILE = path.join(__dirname, '../src/data/stadiums.ts');

async function applyGeometry() {
  console.log('==============================================');
  console.log('  APPLYING STADIUM GEOMETRY DATA              ');
  console.log('==============================================\n');

  let content = fs.readFileSync(STADIUMS_FILE, 'utf-8');
  let changesApplied = 0;

  for (const stadium of STADIUM_GEOMETRY) {
    // Check if this stadium already has geometry data
    const hasGeometry = content.includes(`id: '${stadium.id}'`) &&
                       content.includes('upperDeckHeight');

    if (stadium.id === 'angels') {
      // Angels already has geometry, skip
      console.log(`  ⏭ ${stadium.name}: Already has geometry data`);
      continue;
    }

    // Find the stadium entry and add geometry before the closing brace
    // Pattern: id: 'stadiumId', ... timezone: 'xxx' }
    const regex = new RegExp(
      `(id:\\s*'${stadium.id}'[\\s\\S]*?timezone:\\s*'[^']+')(\\s*})`,
      'g'
    );

    const replacement = `$1,
    roofHeight: ${stadium.roofHeight},
    roofOverhang: ${stadium.roofOverhang},
    upperDeckHeight: ${stadium.upperDeckHeight}$2`;

    const newContent = content.replace(regex, replacement);

    if (newContent !== content) {
      content = newContent;
      changesApplied++;
      console.log(`  ✓ ${stadium.name}: Added geometry (upper: ${stadium.upperDeckHeight}ft, roof: ${stadium.roofHeight}ft)`);
    } else {
      console.log(`  ⚠ ${stadium.name}: Could not update (may already have geometry or pattern mismatch)`);
    }
  }

  // Write the updated content
  fs.writeFileSync(STADIUMS_FILE, content);

  console.log('\n==============================================');
  console.log(`  COMPLETE: ${changesApplied} stadiums updated with geometry`);
  console.log('==============================================');
}

// Export for use elsewhere
export { STADIUM_GEOMETRY };
export type { StadiumGeometry };

// Run
applyGeometry().catch(console.error);
