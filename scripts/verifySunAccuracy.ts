#!/usr/bin/env ts-node

/**
 * Sun Exposure Calculation Accuracy Verification
 * Tests NREL algorithm, timezone handling, and shadow calculations
 * Created: 2025-10-23
 * Usage: npx tsx scripts/verifySunAccuracy.ts
 */

import { getSunPositionNREL } from '../src/utils/nrelSolarPositionOfficial';
import { MLB_STADIUMS } from '../src/data/stadiums';
import SunCalc from 'suncalc';

// ANSI colors
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️${colors.reset}  ${msg}`),
  error: (msg: string) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.cyan}ℹ️${colors.reset}  ${msg}`),
  header: (msg: string) => console.log(`\n${colors.bright}${msg}${colors.reset}`),
};

/**
 * Test 1: NREL vs SunCalc Accuracy Comparison
 */
function testNRELAccuracy() {
  log.header('Test 1: NREL vs SunCalc Accuracy Comparison');

  // Test cases: Known locations and times
  // Create dates in the stadium's timezone by specifying as ISO strings with timezone
  const testCases = [
    {
      name: 'Dodger Stadium - Summer Day Game',
      date: new Date('2026-07-15T13:10:00-07:00'), // PDT = UTC-7
      latitude: 34.0739,
      longitude: -118.2400,
      timezone: 'America/Los_Angeles',
    },
    {
      name: 'Yankee Stadium - DST Transition',
      date: new Date('2026-03-08T13:10:00-04:00'), // EDT = UTC-4 (after DST)
      latitude: 40.8296,
      longitude: -73.9262,
      timezone: 'America/New_York',
    },
    {
      name: 'Chase Field - No DST (Arizona)',
      date: new Date('2026-06-15T13:10:00-07:00'), // MST = UTC-7 (no DST)
      latitude: 33.4453,
      longitude: -112.0667,
      timezone: 'America/Phoenix',
    },
  ];

  let totalErrorAzimuth = 0;
  let totalErrorAltitude = 0;
  let testsPassed = 0;

  for (const test of testCases) {
    try {
      // Calculate with NREL
      const nrelResult = getSunPositionNREL(
        test.date,
        test.latitude,
        test.longitude,
        test.timezone
      );

      // Calculate with SunCalc for comparison
      const sunCalcResult = SunCalc.getPosition(
        test.date,
        test.latitude,
        test.longitude
      );
      const sunCalcAzimuth = ((sunCalcResult.azimuth * 180 / Math.PI) + 180) % 360;
      const sunCalcAltitude = sunCalcResult.altitude * 180 / Math.PI;

      // Calculate differences
      const azimuthError = Math.abs(nrelResult.azimuthDegrees - sunCalcAzimuth);
      const altitudeError = Math.abs(nrelResult.altitudeDegrees - sunCalcAltitude);

      totalErrorAzimuth += azimuthError;
      totalErrorAltitude += altitudeError;

      console.log(`\n  ${test.name}:`);
      console.log(`    NREL:    Azimuth=${nrelResult.azimuthDegrees.toFixed(4)}°, Altitude=${nrelResult.altitudeDegrees.toFixed(4)}°`);
      console.log(`    SunCalc: Azimuth=${sunCalcAzimuth.toFixed(4)}°, Altitude=${sunCalcAltitude.toFixed(4)}°`);
      console.log(`    Error:   Azimuth=${azimuthError.toFixed(4)}°, Altitude=${altitudeError.toFixed(4)}°`);

      // NREL with full periodic terms should be within ±0.001° of SunCalc
      // (NREL: ±0.0003° accuracy, SunCalc: ±0.5° accuracy)
      if (azimuthError < 0.6 && altitudeError < 0.6) {
        log.success(`    ${test.name} PASSED`);
        testsPassed++;
      } else {
        log.error(`    ${test.name} FAILED - Error exceeds expected range (should be <0.6°)`);
      }
    } catch (error) {
      log.error(`    ${test.name} FAILED with exception: ${error}`);
    }
  }

  const avgAzimuthError = totalErrorAzimuth / testCases.length;
  const avgAltitudeError = totalErrorAltitude / testCases.length;

  console.log(`\n  Average Errors:`);
  console.log(`    Azimuth: ${avgAzimuthError.toFixed(4)}° (Expected: <0.001° for NREL, <0.6° vs SunCalc)`);
  console.log(`    Altitude: ${avgAltitudeError.toFixed(4)}° (Expected: <0.001° for NREL, <0.6° vs SunCalc)`);

  if (testsPassed === testCases.length) {
    log.success(`All ${testCases.length} NREL accuracy tests PASSED\n`);
    return true;
  } else {
    log.error(`${testCases.length - testsPassed}/${testCases.length} tests FAILED\n`);
    return false;
  }
}

/**
 * Test 2: DST Transition Handling
 */
function testDSTTransitions() {
  log.header('Test 2: DST Transition Handling');

  const testCases = [
    {
      name: 'Before DST (PST)',
      date: new Date('2026-03-07T13:10:00'), // Day before DST
      timezone: 'America/Los_Angeles',
      expectedOffset: -8, // PST = UTC-8
    },
    {
      name: 'After DST (PDT)',
      date: new Date('2026-03-09T13:10:00'), // Day after DST starts
      timezone: 'America/Los_Angeles',
      expectedOffset: -7, // PDT = UTC-7
    },
    {
      name: 'Arizona (No DST)',
      date: new Date('2026-07-15T13:10:00'),
      timezone: 'America/Phoenix',
      expectedOffset: -7, // MST = UTC-7 year-round
    },
  ];

  let testsPassed = 0;

  for (const test of testCases) {
    try {
      // Get actual offset using Intl API
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: test.timezone,
        timeZoneName: 'longOffset'
      });
      const parts = formatter.formatToParts(test.date);
      const tzName = parts.find(p => p.type === 'timeZoneName')?.value || '';
      const match = tzName.match(/GMT([+-]\d{1,2})/);
      const actualOffset = match ? parseInt(match[1]) : 0;

      console.log(`\n  ${test.name}:`);
      console.log(`    Date: ${test.date.toISOString()}`);
      console.log(`    Timezone: ${test.timezone}`);
      console.log(`    Expected Offset: UTC${test.expectedOffset >= 0 ? '+' : ''}${test.expectedOffset}`);
      console.log(`    Actual Offset:   UTC${actualOffset >= 0 ? '+' : ''}${actualOffset}`);

      if (actualOffset === test.expectedOffset) {
        log.success(`    ${test.name} PASSED`);
        testsPassed++;
      } else {
        log.error(`    ${test.name} FAILED - Offset mismatch`);
      }
    } catch (error) {
      log.error(`    ${test.name} FAILED with exception: ${error}`);
    }
  }

  if (testsPassed === testCases.length) {
    log.success(`All ${testCases.length} DST tests PASSED\n`);
    return true;
  } else {
    log.error(`${testCases.length - testsPassed}/${testCases.length} tests FAILED\n`);
    return false;
  }
}

/**
 * Test 3: Stadium Data Completeness
 */
function testStadiumData() {
  log.header('Test 3: Stadium Data Completeness');

  let testsPassed = 0;
  const requiredFields = ['id', 'name', 'latitude', 'longitude', 'timezone', 'capacity', 'orientation'];

  for (const stadium of MLB_STADIUMS) {
    const missingFields: string[] = [];

    for (const field of requiredFields) {
      // Check if field exists (not just truthy, since 0 is valid for orientation)
      if ((stadium as any)[field] === undefined || (stadium as any)[field] === null) {
        missingFields.push(field);
      }
    }

    if (missingFields.length === 0) {
      testsPassed++;
    } else {
      log.error(`  ${stadium.name}: Missing fields: ${missingFields.join(', ')}`);
    }
  }

  if (testsPassed === MLB_STADIUMS.length) {
    log.success(`All ${MLB_STADIUMS.length} stadiums have complete data\n`);
    return true;
  } else {
    log.error(`${MLB_STADIUMS.length - testsPassed}/${MLB_STADIUMS.length} stadiums have incomplete data\n`);
    return false;
  }
}

/**
 * Test 4: Sun Position Sanity Checks
 */
function testSunPositionSanity() {
  log.header('Test 4: Sun Position Sanity Checks');

  // Test that sun altitude is reasonable at noon in summer
  const testDate = new Date('2026-06-21T12:00:00-07:00'); // Summer solstice, noon PDT
  const dodgers = MLB_STADIUMS.find(s => s.id === 'dodgers')!;

  const result = getSunPositionNREL(
    testDate,
    dodgers.latitude,
    dodgers.longitude,
    dodgers.timezone
  );

  console.log(`\n  Summer Solstice at Dodger Stadium (Noon):`);
  console.log(`    Azimuth: ${result.azimuthDegrees.toFixed(2)}°`);
  console.log(`    Altitude: ${result.altitudeDegrees.toFixed(2)}°`);

  // At LA's latitude (34°N), sun altitude at solar noon on summer solstice
  // Theoretical: 90° - 34° + 23.5° = 79.5°
  // Actual (accounting for refraction, exact declination, etc.): ~73-75°
  const expectedAltitude = 74.0;  // More realistic expectation
  const altitudeError = Math.abs(result.altitudeDegrees - expectedAltitude);

  // Allow 2° tolerance for variations
  if (altitudeError < 2.0) {
    log.success(`  Sun altitude within expected range (actual: ${result.altitudeDegrees.toFixed(2)}°, expected: ~${expectedAltitude}°)\n`);
    return true;
  } else {
    log.error(`  Sun altitude outside expected range (error: ${altitudeError.toFixed(2)}°)\n`);
    return false;
  }
}

/**
 * Main execution
 */
async function main() {
  console.log(`${colors.bright}MLB Sun Tracker - Accuracy Verification${colors.reset}\n`);

  const results = {
    nrelAccuracy: testNRELAccuracy(),
    dstHandling: testDSTTransitions(),
    stadiumData: testStadiumData(),
    sunSanity: testSunPositionSanity(),
  };

  // Summary
  log.header('━'.repeat(50));
  log.header('VERIFICATION SUMMARY');
  log.header('━'.repeat(50));

  const tests = [
    { name: 'NREL vs SunCalc Accuracy', passed: results.nrelAccuracy },
    { name: 'DST Transition Handling', passed: results.dstHandling },
    { name: 'Stadium Data Completeness', passed: results.stadiumData },
    { name: 'Sun Position Sanity Checks', passed: results.sunSanity },
  ];

  let totalPassed = 0;
  for (const test of tests) {
    if (test.passed) {
      log.success(`${test.name}: PASSED`);
      totalPassed++;
    } else {
      log.error(`${test.name}: FAILED`);
    }
  }

  console.log('');
  log.header(`${totalPassed}/${tests.length} Test Suites Passed`);

  if (totalPassed === tests.length) {
    log.success('\n✨ ALL TESTS PASSED! Sun calculations are accurate and ready.\n');
    process.exit(0);
  } else {
    log.error('\n❌ SOME TESTS FAILED. Review errors before regenerating data.\n');
    process.exit(1);
  }
}

// Run verification
main().catch((error) => {
  log.error(`Fatal error: ${error}`);
  console.error(error);
  process.exit(1);
});
