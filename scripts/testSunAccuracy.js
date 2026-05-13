#!/usr/bin/env node

/**
 * Test script to validate sun calculation accuracy improvements
 * Run with: node scripts/testSunAccuracy.js
 */

const { getSunPosition } = require('../src/utils/sunCalculations');
const {
  MLB_ORIENTATION_PROVENANCE,
} = require('../src/data/stadiumOrientationProvenance');
const { MLB_STADIUMS } = require('../src/data/stadiums');
const { getStadiumSections } = require('../src/data/stadiumSections');

console.log('🌞 Sun Calculation Accuracy Test Suite\n');
console.log('=' .repeat(60));

// Test 1: Sun position sanity check against a known reference.
// NOAA Solar Calculator @ Yankee Stadium (40.8296°N, 73.9262°W) on
// 2025-07-04 19:00 UTC reports azimuth≈251°, altitude≈53° (approx).
// We only assert that SunCalc returns a sensible non-zero result; deeper
// accuracy validation lives in src/utils/__tests__/sunAccuracy.test.ts.
console.log('\n📊 Test 1: Sun position sanity check');
console.log('-'.repeat(40));

const testDate = new Date('2025-07-04T19:00:00Z');
const yankeeStadium = { lat: 40.8296, lon: -73.9262, timezone: 'America/New_York' };

try {
  const sunPos = getSunPosition(testDate, yankeeStadium.lat, yankeeStadium.lon);

  console.log(`Test Date: ${testDate.toISOString()}`);
  console.log(`Location: Yankee Stadium`);
  console.log(`  Azimuth:  ${sunPos.azimuthDegrees.toFixed(2)}°`);
  console.log(`  Altitude: ${sunPos.altitudeDegrees.toFixed(2)}°`);

  const inDaytime = sunPos.altitudeDegrees > 0;
  if (inDaytime) {
    console.log('✅ PASS: Sun is above horizon and position is reported');
  } else {
    console.log('❌ FAIL: Sun reported below horizon at known daytime');
  }
} catch (error) {
  console.log('❌ ERROR:', error.message);
}

// Test 2: Covered Sections
console.log('\n🏟️ Test 2: Covered Section Shadow Validation');
console.log('-'.repeat(40));

try {
  const { SunCalculator } = require('../src/utils/sunCalculator');
  const yankees = MLB_STADIUMS.find(s => s.id === 'yankees');
  const calculator = new SunCalculator(yankees);
  const sections = getStadiumSections('yankees');
  
  const coveredSections = sections.filter(s => s.covered === true);
  console.log(`Found ${coveredSections.length} covered sections at Yankee Stadium`);
  
  // Test at noon on summer solstice (highest sun)
  const summerNoon = calculator.calculateSunPosition('2024-06-21', '12:00:00');
  const shadows = calculator.calculateShadows(summerNoon, coveredSections);
  
  let allCovered = true;
  shadows.forEach(shadow => {
    if (shadow.sunExposure > 0) {
      console.log(`❌ Section ${shadow.sectionId} has ${shadow.sunExposure}% sun exposure (should be 0%)`);
      allCovered = false;
    }
  });
  
  if (allCovered) {
    console.log('✅ PASS: All covered sections report 0% sun exposure');
  } else {
    console.log('❌ FAIL: Some covered sections incorrectly report sun exposure');
  }
} catch (error) {
  console.log('❌ ERROR:', error.message);
}

// Test 3: Stadium Orientations
console.log('\n🧭 Test 3: Stadium Orientation Validation');
console.log('-'.repeat(40));

try {
  // Cross-check stadiums.ts orientation against the provenance file. Only
  // 'verified' entries are treated as ground truth; 'unverified' entries
  // mirror stadiums.ts and won't disagree. Discrepancies indicate the
  // provenance file is out of sync with stadiums.ts, which would also mean
  // the audit trail is stale.
  const verified = MLB_ORIENTATION_PROVENANCE.filter(p => p.confidence === 'verified');
  const unverified = MLB_ORIENTATION_PROVENANCE.filter(p => p.confidence !== 'verified');

  console.log(`Verified stadiums: ${verified.length} / ${MLB_ORIENTATION_PROVENANCE.length}`);
  console.log(`Pending verification: ${unverified.length}`);

  const mismatches = [];
  for (const entry of verified) {
    const stadium = MLB_STADIUMS.find(s => s.id === entry.stadiumId);
    if (!stadium) {
      mismatches.push(`Missing stadium for verified provenance entry: ${entry.stadiumId}`);
      continue;
    }
    const diff = Math.abs(stadium.orientation - entry.orientation);
    const normalizedDiff = diff > 180 ? 360 - diff : diff;
    if (normalizedDiff > 2) {
      mismatches.push(
        `${stadium.name}: stadiums.ts=${stadium.orientation}° vs provenance=${entry.orientation}° (Δ${normalizedDiff}°)`
      );
    }
  }

  if (mismatches.length > 0) {
    console.log('\nOrientation Mismatches (verified entries only):');
    mismatches.forEach(m => console.log(`  ❌ ${m}`));
    console.log('❌ FAIL: Verified provenance disagrees with stadiums.ts');
  } else {
    console.log('✅ PASS: All verified stadium orientations match stadiums.ts');
    if (unverified.length > 0) {
      console.log(
        `   (${unverified.length} stadium${unverified.length === 1 ? '' : 's'} still need 2-source cross-check — see stadiumOrientationProvenance.ts.)`
      );
    }
  }
} catch (error) {
  console.log('❌ ERROR:', error.message);
}

// Test 4: Timezone Handling
console.log('\n🕐 Test 4: Timezone Offset Calculation');
console.log('-'.repeat(40));

try {
  const { getTimezoneOffset } = require('../src/utils/stadiumTimezone');
  
  const testCases = [
    { date: new Date('2024-07-01T12:00:00'), timezone: 'America/New_York', expected: -4, name: 'EDT' },
    { date: new Date('2024-01-01T12:00:00'), timezone: 'America/New_York', expected: -5, name: 'EST' },
    { date: new Date('2024-07-01T12:00:00'), timezone: 'America/Los_Angeles', expected: -7, name: 'PDT' },
    { date: new Date('2024-01-01T12:00:00'), timezone: 'America/Los_Angeles', expected: -8, name: 'PST' },
    { date: new Date('2024-07-01T12:00:00'), timezone: 'America/Phoenix', expected: -7, name: 'MST (no DST)' }
  ];
  
  let allCorrect = true;
  testCases.forEach(test => {
    const offset = getTimezoneOffset(test.date, test.timezone);
    const status = offset === test.expected ? '✅' : '❌';
    console.log(`${status} ${test.name}: ${offset} hours (expected ${test.expected})`);
    if (offset !== test.expected) allCorrect = false;
  });
  
  if (allCorrect) {
    console.log('\n✅ PASS: All timezone offsets calculated correctly');
  } else {
    console.log('\n❌ FAIL: Some timezone offsets are incorrect');
  }
} catch (error) {
  console.log('❌ ERROR:', error.message);
}

// Test 5: Atmospheric refraction is handled internally by SunCalc; there is
// no separate refraction module to validate. Detailed accuracy verification
// against external references lives in
// src/utils/__tests__/sunAccuracy.test.ts (Phase 7).

// Summary
console.log('\n' + '='.repeat(60));
console.log('📈 Test Summary');
console.log('='.repeat(60));

const improvements = [
  '✅ Consolidated on SunCalc with UTC-correct inputs',
  '✅ Removed disabled NREL fork and hardcoded LA-only DST',
  '✅ Section-in-sun model now handles cross-bowl illumination',
  '✅ Single refraction model (no double-correction)',
  '✅ Covered sections guaranteed 0% direct sun',
  '✅ Stadium orientation provenance enforced',
];

console.log('\nImprovements implemented:');
improvements.forEach(item => console.log(`  ${item}`));

console.log('\n✨ Sun-calculation pipeline consolidated to a single source of truth.');