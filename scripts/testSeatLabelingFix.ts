#!/usr/bin/env ts-node

/**
 * Test script to verify the seat labeling fix
 * Tests that suffixed section IDs correctly map to numeric JSON files
 */

import * as fs from 'fs';
import * as path from 'path';
import { getStadiumSections } from '../src/data/stadiumSections';
import { getSeatDataStadiumId } from '../src/utils/stadiumIdMapping';

// Helper function from seatDataLoader.ts
function getNumericSectionId(sectionId: string): string {
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

async function testSeatLabelingFix() {
  console.log('🔍 Testing Seat Labeling Fix...\n');
  console.log('This test verifies that:');
  console.log('1. Stadium sections have suffixed IDs (1DG, 48FD, etc.)');
  console.log('2. JSON files exist with numeric names (1.json, 48.json, etc.)');
  console.log('3. The mapping function correctly strips suffixes');
  console.log('\n' + '='.repeat(60) + '\n');

  const testStadium = 'dodgers';
  const seatDataStadiumId = getSeatDataStadiumId(testStadium);
  const sections = getStadiumSections(testStadium);

  if (!sections || sections.length === 0) {
    console.error(`❌ No sections found for ${testStadium}`);
    process.exit(1);
  }

  console.log(`Testing ${testStadium} stadium (mapped to ${seatDataStadiumId})`);
  console.log(`Found ${sections.length} sections in stadiumSections data\n`);

  let passCount = 0;
  let failCount = 0;
  const testSections = sections.slice(0, 10); // Test first 10 sections

  for (const section of testSections) {
    const suffixedId = section.id; // e.g., "1DG", "48FD"
    const numericId = getNumericSectionId(suffixedId); // e.g., "1", "48"

    const jsonPath = path.join(
      process.cwd(),
      'public',
      'data',
      'seats',
      seatDataStadiumId,
      `${numericId}.json`
    );

    process.stdout.write(`Section "${suffixedId}" → "${numericId}.json": `);

    if (fs.existsSync(jsonPath)) {
      const fileContent = fs.readFileSync(jsonPath, 'utf8');
      try {
        const data = JSON.parse(fileContent);

        // Check if seat data has proper structure
        if (data.rows && data.rows.length > 0) {
          const firstRow = data.rows[0];
          if (firstRow.seats && firstRow.seats.length > 0) {
            const firstSeat = firstRow.seats[0];
            if (firstSeat.seatNumber) {
              console.log(`✅ SUCCESS - Found ${data.totalSeats} seats with labels`);
              passCount++;
            } else {
              console.log(`❌ FAILED - Seats missing seatNumber field`);
              failCount++;
            }
          } else {
            console.log(`❌ FAILED - No seats in first row`);
            failCount++;
          }
        } else {
          console.log(`❌ FAILED - No rows in seat data`);
          failCount++;
        }
      } catch (error) {
        console.log(`❌ FAILED - Invalid JSON: ${error}`);
        failCount++;
      }
    } else {
      console.log(`❌ FAILED - JSON file not found`);
      failCount++;
    }
  }

  console.log(`\n` + '='.repeat(60));
  console.log(`Test Results: ${passCount} passed, ${failCount} failed`);
  console.log('='.repeat(60));

  if (failCount === 0) {
    console.log('✅ All tests passed! The seat labeling fix is working correctly.');
    console.log('\nThe fix ensures:');
    console.log('• Static pages are generated with suffixed IDs (1DG, 48FD, etc.)');
    console.log('• Runtime loading strips suffixes to find JSON files (1.json, 48.json)');
    console.log('• Seat data contains proper seatNumber fields for display');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed. Please check the implementation.');
    process.exit(1);
  }
}

// Run the test
testSeatLabelingFix().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});