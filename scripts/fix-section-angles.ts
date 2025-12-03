/**
 * Fix Section Angle Gaps
 *
 * Identifies and fixes large gaps in section baseAngle values.
 * Redistributes angles evenly around the stadium bowl (0-360°).
 *
 * Convention:
 * - 0° = Behind home plate (facing center field)
 * - 90° = First base side
 * - 180° = Center field
 * - 270° = Third base side
 */

import * as fs from 'fs';
import * as path from 'path';

const sectionsDir = path.join(__dirname, '../src/data/stadiumSections-split');

interface SectionData {
  id: string;
  baseAngle: number;
  level: string;
  lineNumber: number;
  originalLine: string;
}

interface GapInfo {
  stadiumId: string;
  maxGap: number;
  gapStart: number;
  gapEnd: number;
  totalSections: number;
}

// Analyze gaps in a stadium file
function analyzeStadium(stadiumId: string): GapInfo | null {
  const filePath = path.join(sectionsDir, `${stadiumId}.ts`);
  if (!fs.existsSync(filePath)) return null;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const angles: number[] = [];
  const angleRegex = /baseAngle:\s*(\d+)/;

  for (const line of lines) {
    const match = line.match(angleRegex);
    if (match) {
      angles.push(parseInt(match[1]));
    }
  }

  if (angles.length === 0) return null;

  // Sort and find max gap
  const sortedAngles = [...new Set(angles)].sort((a, b) => a - b);

  let maxGap = 0;
  let gapStart = 0;
  let gapEnd = 0;

  for (let i = 1; i < sortedAngles.length; i++) {
    const gap = sortedAngles[i] - sortedAngles[i - 1];
    if (gap > maxGap) {
      maxGap = gap;
      gapStart = sortedAngles[i - 1];
      gapEnd = sortedAngles[i];
    }
  }

  // Check wrap-around gap (from max angle to 360 + min angle)
  const wrapGap = (360 - sortedAngles[sortedAngles.length - 1]) + sortedAngles[0];
  if (wrapGap > maxGap) {
    maxGap = wrapGap;
    gapStart = sortedAngles[sortedAngles.length - 1];
    gapEnd = sortedAngles[0];
  }

  return {
    stadiumId,
    maxGap,
    gapStart,
    gapEnd,
    totalSections: angles.length
  };
}

// Get sections from file with their positions
function getSections(stadiumId: string): SectionData[] {
  const filePath = path.join(sectionsDir, `${stadiumId}.ts`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const sections: SectionData[] = [];
  // Match: id, then level (before baseAngle), then baseAngle
  const sectionRegex = /\{\s*id:\s*['"]([^'"]+)['"][^}]*level:\s*['"]([^'"]+)['"][^}]*baseAngle:\s*(\d+)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(sectionRegex);
    if (match) {
      sections.push({
        id: match[1],
        level: match[2],
        baseAngle: parseInt(match[3]),
        lineNumber: i,
        originalLine: line
      });
    }
  }

  return sections;
}

// Fill gap by stretching adjacent sections' angles
function fillAngleGap(stadiumId: string, dryRun: boolean = true): void {
  const filePath = path.join(sectionsDir, `${stadiumId}.ts`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  const sections = getSections(stadiumId);
  if (sections.length === 0) {
    console.log(`  No sections found in ${stadiumId}`);
    return;
  }

  // Group by level
  const levels = ['field', 'lower', 'club', 'upper', 'suite'];
  const levelGroups: { [level: string]: SectionData[] } = {};
  for (const section of sections) {
    if (!levelGroups[section.level]) levelGroups[section.level] = [];
    levelGroups[section.level].push(section);
  }

  let totalChanges = 0;

  for (const level of levels) {
    const levelSections = levelGroups[level];
    if (!levelSections || levelSections.length < 2) continue;

    // Sort by angle
    levelSections.sort((a, b) => a.baseAngle - b.baseAngle);

    // Find the largest gap
    let maxGap = 0;
    let gapStartIdx = -1;
    for (let i = 0; i < levelSections.length; i++) {
      const nextIdx = (i + 1) % levelSections.length;
      const curr = levelSections[i].baseAngle;
      const next = levelSections[nextIdx].baseAngle;
      const gap = nextIdx === 0 ? (360 - curr + next) : (next - curr);
      if (gap > maxGap) {
        maxGap = gap;
        gapStartIdx = i;
      }
    }

    if (maxGap <= 30) continue; // No significant gap

    // The gap is between gapStartIdx and gapStartIdx+1
    // We'll redistribute all angles to fill the gap
    const gapEndIdx = (gapStartIdx + 1) % levelSections.length;
    const gapStart = levelSections[gapStartIdx].baseAngle;
    const gapEnd = levelSections[gapEndIdx].baseAngle;

    // Reorder sections starting from gap end (so gap becomes the "end" of the sequence)
    const reordered: SectionData[] = [];
    for (let i = 0; i < levelSections.length; i++) {
      reordered.push(levelSections[(gapEndIdx + i) % levelSections.length]);
    }

    // Now redistribute evenly from gapEnd to gapEnd+360
    const startAngle = gapEnd < gapStart ? gapEnd : gapEnd;
    const angleStep = 360 / levelSections.length;

    const changes: { section: SectionData; oldAngle: number; newAngle: number }[] = [];

    for (let i = 0; i < reordered.length; i++) {
      const section = reordered[i];
      const newAngle = Math.round((startAngle + i * angleStep) % 360);

      if (Math.abs(section.baseAngle - newAngle) > 2) {
        changes.push({ section, oldAngle: section.baseAngle, newAngle });
      }
    }

    if (changes.length > 0) {
      console.log(`  ${level} level: ${changes.length} angles adjusted (gap was ${maxGap}°)`);
      totalChanges += changes.length;

      if (!dryRun) {
        for (const change of changes) {
          const lineIndex = change.section.lineNumber;
          const oldLine = lines[lineIndex];
          const newLine = oldLine.replace(
            /baseAngle:\s*\d+/,
            `baseAngle: ${change.newAngle}`
          );
          lines[lineIndex] = newLine;
        }
      }
    }
  }

  if (!dryRun && totalChanges > 0) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`  ✓ Saved ${totalChanges} changes to ${stadiumId}.ts`);
  } else if (totalChanges === 0) {
    console.log(`  No changes needed for ${stadiumId}`);
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');

  console.log('==============================================');
  console.log('   SECTION ANGLE GAP ANALYSIS & FIX          ');
  console.log('==============================================\n');

  if (dryRun) {
    console.log('DRY RUN MODE - no files will be modified');
    console.log('Use --apply flag to make changes\n');
  }

  // Get all stadium files
  const files = fs.readdirSync(sectionsDir).filter(f => f.endsWith('.ts'));
  const stadiumIds = files.map(f => f.replace('.ts', ''));

  // Analyze all stadiums
  const gaps: GapInfo[] = [];
  for (const id of stadiumIds) {
    const info = analyzeStadium(id);
    if (info && info.maxGap > 50) {
      gaps.push(info);
    }
  }

  // Sort by gap size
  gaps.sort((a, b) => b.maxGap - a.maxGap);

  console.log('--- STADIUMS WITH LARGE GAPS (>50°) ---\n');

  for (const gap of gaps) {
    console.log(`${gap.stadiumId}:`);
    console.log(`  Gap: ${gap.maxGap}° (from ${gap.gapStart}° to ${gap.gapEnd}°)`);
    console.log(`  Total sections: ${gap.totalSections}`);

    if (!dryRun) {
      fillAngleGap(gap.stadiumId, false);
    }
    console.log('');
  }

  console.log('==============================================');
  console.log(`  Total stadiums with gaps: ${gaps.length}`);
  if (dryRun) {
    console.log('  Run with --apply to fix these issues');
  }
  console.log('==============================================');
}

main();
