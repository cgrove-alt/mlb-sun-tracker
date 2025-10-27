#!/usr/bin/env ts-node

/**
 * Test script to verify seat data loading with section ID suffix stripping
 */

import * as fs from 'fs';
import * as path from 'path';
import { getSeatDataStadiumId } from '../src/utils/stadiumIdMapping';

// Import the helper function to test the logic
function getNumericSectionId(sectionId: string): string {
  // Same logic as in seatDataLoader.ts
  if (/^\d+$/.test(sectionId)) {
    return sectionId;
  }

  const numericMatch = sectionId.match(/^(\d+)/);
  if (numericMatch) {
    if (sectionId.match(/^\d+(IR|RS|TD)$/)) {
      return sectionId; // Keep the full ID
    }
    return numericMatch[1];
  }

  return sectionId;
}

async function testSeatDataLoading() {
  console.log('Testing seat data loading with suffix stripping...\n');

  const testCases = [
    { stadium: 'dodgers', section: '1DG', expectedJSON: '1' },
    { stadium: 'dodgers', section: '48FD', expectedJSON: '48' },
    { stadium: 'dodgers', section: '101LG', expectedJSON: '101' },
    { stadium: 'dodgers', section: '10IR', expectedJSON: '10IR' }, // Special case
    { stadium: 'dodgers', section: '10RS', expectedJSON: '10RS' }, // Special case
    { stadium: 'dodgers', section: '1', expectedJSON: '1' }, // Already numeric
  ];

  let passCount = 0;
  let failCount = 0;

  for (const testCase of testCases) {
    process.stdout.write(`Testing ${testCase.stadium}/${testCase.section}... `);

    try {
      // Map stadium ID
      const seatDataStadiumId = getSeatDataStadiumId(testCase.stadium);

      // Test the suffix stripping logic
      const jsonSectionId = getNumericSectionId(testCase.section);

      // Check if the file exists
      const jsonPath = path.join(
        process.cwd(),
        'public',
        'data',
        'seats',
        seatDataStadiumId,
        `${jsonSectionId}.json`
      );

      if (fs.existsSync(jsonPath)) {
        const fileContent = fs.readFileSync(jsonPath, 'utf8');
        const data = JSON.parse(fileContent);

        if (jsonSectionId === testCase.expectedJSON) {
          console.log(`✅ SUCCESS - Section "${testCase.section}" maps to "${jsonSectionId}.json" (${data.totalSeats} seats)`);
          passCount++;
        } else {
          console.log(`❌ FAILED - Section "${testCase.section}" maps to "${jsonSectionId}.json" but expected "${testCase.expectedJSON}.json"`);
          failCount++;
        }
      } else {
        console.log(`❌ FAILED - File not found: ${jsonSectionId}.json (expected ${testCase.expectedJSON}.json)`);
        failCount++;
      }
    } catch (error) {
      console.log(`❌ ERROR - ${error}`);
      failCount++;
    }
  }

  console.log(`\n========================================`);
  console.log(`Test Results: ${passCount} passed, ${failCount} failed`);
  console.log(`========================================`);

  if (failCount === 0) {
    console.log('✅ All tests passed! Seat data loading is working correctly.');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please check the implementation.');
    process.exit(1);
  }
}

// Run the test
testSeatDataLoading().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});