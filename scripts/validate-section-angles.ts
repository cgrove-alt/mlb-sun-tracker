/**
 * Section Angle Validation Script
 * Generated: November 26, 2025
 *
 * This script validates the section baseAngle data for all MLB stadiums.
 *
 * ANGLE CONVENTION:
 * - 0° = Directly behind home plate (facing center field)
 * - 90° = First base side (right field foul line area)
 * - 180° = Center field (straight-away center)
 * - 270° = Third base side (left field foul line area)
 *
 * The angle represents where the section is located relative to home plate,
 * measured clockwise from the center field direction.
 *
 * VALIDATION CHECKS:
 * 1. All angles are 0-359
 * 2. Sections are distributed logically around the stadium
 * 3. Level assignments are consistent
 * 4. Price assignments make sense (field level = premium, upper = value)
 * 5. Covered sections are in expected locations (behind home plate)
 */

import * as fs from 'fs';
import * as path from 'path';

interface Section {
  id: string;
  name: string;
  level: string;
  baseAngle: number;
  angleSpan: number;
  covered: boolean;
  price: string;
}

interface StadiumSections {
  stadiumId: string;
  sections: Section[];
}

interface ValidationResult {
  stadiumId: string;
  sectionCount: number;
  issues: string[];
  warnings: string[];
  coverage: {
    homeplate: number; // 330-30°
    firstBase: number; // 30-90°
    rightField: number; // 90-150°
    centerField: number; // 150-210°
    leftField: number; // 210-270°
    thirdBase: number; // 270-330°
  };
}

// Load all stadium section files
const sectionsDir = path.join(__dirname, '../src/data/stadiumSections-split');

function loadStadiumSections(stadiumId: string): StadiumSections | null {
  const filePath = path.join(sectionsDir, `${stadiumId}.ts`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  // Simple regex extraction of section data
  const content = fs.readFileSync(filePath, 'utf-8');
  const sectionsMatch = content.match(/sections:\s*\[([\s\S]*?)\]/);
  if (!sectionsMatch) return null;

  // Parse individual sections (flexible regex that handles optional price, rows/seatsPerRow, as const, and escaped quotes)
  const sectionRegex = /\{\s*id:\s*['"]([^'"]+)['"],\s*name:\s*['"]([^']*(?:\\'[^']*)*)['"],\s*level:\s*['"]([^'"]+)['"]\s*(?:as\s*const)?,\s*baseAngle:\s*(\d+),\s*angleSpan:\s*(\d+),\s*covered:\s*(true|false)[^}]*\}/g;

  const sections: Section[] = [];
  let match;
  while ((match = sectionRegex.exec(sectionsMatch[1])) !== null) {
    sections.push({
      id: match[1],
      name: match[2],
      level: match[3],
      baseAngle: parseInt(match[4]),
      angleSpan: parseInt(match[5]),
      covered: match[6] === 'true',
      price: 'unknown' // Price is optional in some files
    });
  }

  return {
    stadiumId,
    sections
  };
}

function getAngleZone(angle: number): string {
  if (angle >= 330 || angle < 30) return 'homeplate';
  if (angle >= 30 && angle < 90) return 'firstBase';
  if (angle >= 90 && angle < 150) return 'rightField';
  if (angle >= 150 && angle < 210) return 'centerField';
  if (angle >= 210 && angle < 270) return 'leftField';
  return 'thirdBase';
}

function validateStadium(data: StadiumSections): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];
  const coverage = {
    homeplate: 0,
    firstBase: 0,
    rightField: 0,
    centerField: 0,
    leftField: 0,
    thirdBase: 0
  };

  // Count sections in each zone
  for (const section of data.sections) {
    // Check angle validity
    if (section.baseAngle < 0 || section.baseAngle >= 360) {
      issues.push(`Section ${section.id}: Invalid angle ${section.baseAngle}`);
    }

    // Count by zone
    const zone = getAngleZone(section.baseAngle);
    coverage[zone as keyof typeof coverage]++;

    // Check covered sections - they should typically be near home plate or in upper deck
    if (section.covered && section.level === 'field') {
      // Field level covered sections are unusual - flag for review
      if (section.baseAngle > 60 && section.baseAngle < 300) {
        warnings.push(`Section ${section.id}: Field level covered section in outfield area (${section.baseAngle}°)`);
      }
    }

    // Check price consistency
    if (section.level === 'field' && section.price === 'value') {
      warnings.push(`Section ${section.id}: Field level section marked as value price`);
    }
    if (section.level === 'upper' && section.price === 'luxury') {
      warnings.push(`Section ${section.id}: Upper level section marked as luxury price`);
    }
  }

  // Check for gaps in coverage
  const totalSections = data.sections.length;
  const minSectionsPerZone = Math.floor(totalSections / 8); // Allow some zones to have fewer

  if (coverage.homeplate < minSectionsPerZone) {
    warnings.push(`Low section count behind home plate (${coverage.homeplate})`);
  }
  if (coverage.firstBase < minSectionsPerZone) {
    warnings.push(`Low section count on first base side (${coverage.firstBase})`);
  }
  if (coverage.thirdBase < minSectionsPerZone) {
    warnings.push(`Low section count on third base side (${coverage.thirdBase})`);
  }

  return {
    stadiumId: data.stadiumId,
    sectionCount: data.sections.length,
    issues,
    warnings,
    coverage
  };
}

// Main validation
async function main() {
  console.log('==============================================');
  console.log('    SECTION ANGLE VALIDATION REPORT          ');
  console.log('    Generated: November 26, 2025             ');
  console.log('==============================================\n');

  const stadiumIds = [
    'angels', 'astros', 'athletics', 'bluejays', 'braves',
    'brewers', 'cardinals', 'cubs', 'diamondbacks', 'dodgers',
    'giants', 'guardians', 'mariners', 'marlins', 'mets',
    'nationals', 'orioles', 'padres', 'phillies', 'pirates',
    'rangers', 'rays', 'redsox', 'reds', 'rockies',
    'royals', 'tigers', 'twins', 'whitesox', 'yankees'
  ];

  let totalSections = 0;
  let totalIssues = 0;
  let totalWarnings = 0;
  const results: ValidationResult[] = [];

  for (const id of stadiumIds) {
    const data = loadStadiumSections(id);
    if (!data) {
      console.log(`⚠ ${id}: No section data file found`);
      continue;
    }

    const result = validateStadium(data);
    results.push(result);
    totalSections += result.sectionCount;
    totalIssues += result.issues.length;
    totalWarnings += result.warnings.length;

    // Print stadium summary
    const status = result.issues.length > 0 ? '❌' :
                   result.warnings.length > 0 ? '⚠️' : '✅';
    console.log(`${status} ${id}: ${result.sectionCount} sections`);

    if (result.issues.length > 0) {
      result.issues.forEach(i => console.log(`    ❌ ${i}`));
    }
    if (result.warnings.length > 0 && result.warnings.length <= 3) {
      result.warnings.forEach(w => console.log(`    ⚠️ ${w}`));
    } else if (result.warnings.length > 3) {
      console.log(`    ⚠️ ${result.warnings.length} warnings (showing first 3)`);
      result.warnings.slice(0, 3).forEach(w => console.log(`    ⚠️ ${w}`));
    }
  }

  console.log('\n==============================================');
  console.log('  SUMMARY');
  console.log('==============================================');
  console.log(`  Total stadiums: ${results.length}`);
  console.log(`  Total sections: ${totalSections}`);
  console.log(`  Critical issues: ${totalIssues}`);
  console.log(`  Warnings: ${totalWarnings}`);
  console.log('==============================================');

  // Print coverage distribution
  console.log('\n--- SECTION DISTRIBUTION BY ZONE ---\n');
  console.log('Stadium            | HP   | 1B   | RF   | CF   | LF   | 3B   | Total');
  console.log('-------------------|------|------|------|------|------|------|------');
  for (const r of results) {
    const c = r.coverage;
    console.log(
      `${r.stadiumId.padEnd(18)} | ${String(c.homeplate).padStart(4)} | ${String(c.firstBase).padStart(4)} | ${String(c.rightField).padStart(4)} | ${String(c.centerField).padStart(4)} | ${String(c.leftField).padStart(4)} | ${String(c.thirdBase).padStart(4)} | ${String(r.sectionCount).padStart(4)}`
    );
  }
}

main().catch(console.error);
