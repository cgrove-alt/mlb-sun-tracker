/**
 * Covered Sections Validation Script
 * Generated: November 28, 2025
 *
 * This script verifies that covered sections ALWAYS return 0% sun exposure
 * regardless of sun position.
 */

import { isSectionInSun, getSectionSunExposure } from '../src/utils/sectionSunCalculations';
import type { StadiumSection } from '../src/data/stadiumSectionTypes';

// Test cases with different sun positions
const sunPositions = [
  { azimuth: 90, elevation: 45, label: 'Morning sun (East, 45°)' },
  { azimuth: 180, elevation: 75, label: 'Midday sun (South, 75°)' },
  { azimuth: 270, elevation: 45, label: 'Afternoon sun (West, 45°)' },
  { azimuth: 180, elevation: 85, label: 'High noon (South, 85°)' },
  { azimuth: 135, elevation: 30, label: 'Low morning (SE, 30°)' },
  { azimuth: 225, elevation: 15, label: 'Late afternoon (SW, 15°)' },
];

// Test sections: covered and uncovered
const testSections: StadiumSection[] = [
  {
    id: 'covered-1',
    name: 'Covered Section 1 (behind home)',
    level: 'lower',
    baseAngle: 0,
    angleSpan: 10,
    covered: true,
    price: 'premium'
  },
  {
    id: 'covered-2',
    name: 'Covered Section 2 (first base)',
    level: 'club',
    baseAngle: 90,
    angleSpan: 10,
    covered: true,
    price: 'premium'
  },
  {
    id: 'covered-3',
    name: 'Covered Section 3 (third base)',
    level: 'upper',
    baseAngle: 270,
    angleSpan: 10,
    covered: true,
    price: 'moderate'
  },
  {
    id: 'uncovered-1',
    name: 'Uncovered Section (outfield)',
    level: 'field',
    baseAngle: 180,
    angleSpan: 10,
    covered: false,
    price: 'value'
  },
  {
    id: 'uncovered-2',
    name: 'Uncovered Section (first base)',
    level: 'lower',
    baseAngle: 90,
    angleSpan: 10,
    covered: false,
    price: 'moderate'
  },
];

async function validateCoveredSections() {
  console.log('==============================================');
  console.log('    COVERED SECTIONS VALIDATION REPORT       ');
  console.log('    Generated: November 28, 2025             ');
  console.log('==============================================\n');

  let passed = 0;
  let failed = 0;

  // Test each covered section with all sun positions
  const coveredSections = testSections.filter(s => s.covered);
  const uncoveredSections = testSections.filter(s => !s.covered);

  console.log('--- COVERED SECTIONS (should ALWAYS be 0% exposure) ---\n');

  for (const section of coveredSections) {
    console.log(`Section: ${section.name}`);
    let sectionPassed = true;

    for (const sun of sunPositions) {
      const inSun = isSectionInSun(section, sun.azimuth, sun.elevation);
      const exposure = getSectionSunExposure(section, sun.elevation, sun.azimuth);

      if (inSun || exposure > 0) {
        console.log(`  ❌ ${sun.label}: inSun=${inSun}, exposure=${exposure}%`);
        sectionPassed = false;
        failed++;
      } else {
        console.log(`  ✅ ${sun.label}: inSun=${inSun}, exposure=${exposure}%`);
        passed++;
      }
    }

    console.log(sectionPassed ? '  → Section PASSED\n' : '  → Section FAILED\n');
  }

  console.log('\n--- UNCOVERED SECTIONS (should have exposure when in sun path) ---\n');

  for (const section of uncoveredSections) {
    console.log(`Section: ${section.name} (baseAngle: ${section.baseAngle}°)`);
    let hasExposure = false;

    for (const sun of sunPositions) {
      const inSun = isSectionInSun(section, sun.azimuth, sun.elevation);
      const exposure = getSectionSunExposure(section, sun.elevation, sun.azimuth);

      if (exposure > 0) hasExposure = true;
      console.log(`  ${inSun ? '☀️' : '🌥️'} ${sun.label}: inSun=${inSun}, exposure=${exposure}%`);
    }

    console.log(hasExposure ? '  → Gets sun exposure (correct)\n' : '  → No sun exposure (may be correct if always shaded)\n');
  }

  console.log('==============================================');
  console.log('  SUMMARY');
  console.log('==============================================');
  console.log(`  Covered section tests: ${passed + failed}`);
  console.log(`  Passed: ${passed}`);
  console.log(`  Failed: ${failed}`);
  console.log(`  Pass Rate: ${((passed / (passed + failed)) * 100).toFixed(0)}%`);
  console.log('==============================================');

  if (failed > 0) {
    console.log('\n❌ CRITICAL: Covered sections are incorrectly showing sun exposure!');
    process.exit(1);
  } else {
    console.log('\n✅ All covered sections correctly show 0% sun exposure.');
    process.exit(0);
  }
}

validateCoveredSections().catch(console.error);
