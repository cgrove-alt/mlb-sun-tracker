#!/usr/bin/env tsx
// Test script for MLB 3D Shade Calculator

import { loadMLBStadium3D, calculateMLBStadiumShade3D } from '../src/utils/mlb3DCalculator';
import { MLB_STADIUMS } from '../src/data/stadiums';
import { hasSpecificData } from '../src/data/stadium-data-aggregator';

async function testMLB3DCalculator() {
  console.log('🏟️  MLB 3D Shade Calculator Test\n');

  // Find stadiums with 3D data (obstructions)
  const stadiumsWithObstructions = MLB_STADIUMS.filter(stadium => {
    const status = hasSpecificData(stadium.id);
    return status.hasObstructions;
  });

  console.log(`✅ Found ${stadiumsWithObstructions.length} MLB stadiums with obstruction data:\n`);

  stadiumsWithObstructions.forEach((stadium, index) => {
    console.log(`   ${index + 1}. ${stadium.name} (${stadium.id})`);
  });

  // Test with Yankee Stadium (should have full 3D data)
  const testStadium = MLB_STADIUMS.find(s => s.id === 'yankees');

  if (!testStadium) {
    console.error('❌ Test stadium not found');
    process.exit(1);
  }

  console.log(`\n🔬 Testing 3D Calculator with: ${testStadium.name}\n`);

  // Test date and time
  const testDate = new Date('2025-07-15');
  const testTime = '13:00';

  console.log(`📅 Date: ${testDate.toISOString().split('T')[0]}`);
  console.log(`🕐 Time: ${testTime}`);
  console.log(`📍 Location: ${testStadium.latitude}°N, ${testStadium.longitude}°W`);
  console.log(`🧭 Orientation: ${testStadium.orientation}°\n`);

  // Load 3D model
  console.log('⏳ Loading 3D stadium model...');
  const stadium3D = loadMLBStadium3D(
    testStadium.id,
    testStadium.latitude,
    testStadium.longitude,
    testStadium.orientation || 0
  );

  console.log(`✅ Loaded stadium 3D model:`);
  console.log(`   - Sections: ${stadium3D.sections.length}`);
  console.log(`   - Obstructions: ${stadium3D.obstructions.length}`);
  console.log(`   - Total seats: ${stadium3D.sections.reduce((sum, s) => sum + s.seats.length, 0)}\n`);

  // Calculate shade
  console.log('🌞 Calculating shade (without cache)...\n');

  const startTime = performance.now();

  const result = await calculateMLBStadiumShade3D(
    testStadium.id,
    testStadium.name,
    testStadium.latitude,
    testStadium.longitude,
    testStadium.orientation || 0,
    testDate,
    testTime,
    {
      useCache: false, // Disable cache for first test
      useWebWorkers: false,
      lodLevel: 'medium',
      onProgress: (progress, message) => {
        console.log(`   [${progress.toFixed(0).padStart(3)}%] ${message}`);
      }
    }
  );

  const endTime = performance.now();

  console.log(`\n✅ Calculation complete!\n`);
  console.log(`⏱️  Calculation time: ${result.calculationTime.toFixed(2)}ms`);
  console.log(`📊 Sun position:`);
  console.log(`   - Azimuth: ${result.sunPosition.azimuth.toFixed(2)}°`);
  console.log(`   - Elevation: ${result.sunPosition.elevation.toFixed(2)}°`);
  console.log(`   - Is daytime: ${result.sunPosition.elevation > 0 ? 'Yes' : 'No'}\n`);

  // Analyze results
  const sections = Array.from(result.sections.values());
  const totalSeats = sections.reduce((sum, s) => s.totalSeats, 0);
  const seatsInShade = sections.reduce((sum, s) => s.seatsInShade, 0);
  const avgShadePercentage = (seatsInShade / totalSeats) * 100;

  console.log(`📈 Shade Analysis:`);
  console.log(`   - Total sections: ${sections.length}`);
  console.log(`   - Total seats analyzed: ${totalSeats}`);
  console.log(`   - Seats in shade: ${seatsInShade} (${avgShadePercentage.toFixed(1)}%)`);
  console.log(`   - Seats in sun: ${totalSeats - seatsInShade} (${(100 - avgShadePercentage).toFixed(1)}%)\n`);

  // Top 5 shadiest sections
  const sortedSections = sections.sort((a, b) => b.percentageInShade - a.percentageInShade);

  console.log(`🌳 Top 5 shadiest sections:`);
  sortedSections.slice(0, 5).forEach((section, index) => {
    console.log(`   ${index + 1}. ${section.sectionId}: ${section.percentageInShade.toFixed(1)}% in shade (${section.seatsInShade}/${section.totalSeats} seats)`);
  });

  console.log(`\n☀️  Top 5 sunniest sections:`);
  sortedSections.slice(-5).reverse().forEach((section, index) => {
    console.log(`   ${index + 1}. ${section.sectionId}: ${section.percentageInShade.toFixed(1)}% in shade (${section.seatsInShade}/${section.totalSeats} seats)`);
  });

  // Test caching
  console.log(`\n🗄️  Testing cache performance...\n`);

  const cachedStartTime = performance.now();

  const cachedResult = await calculateMLBStadiumShade3D(
    testStadium.id,
    testStadium.name,
    testStadium.latitude,
    testStadium.longitude,
    testStadium.orientation || 0,
    testDate,
    testTime,
    {
      useCache: true,
      useWebWorkers: false,
      lodLevel: 'medium'
    }
  );

  const cachedEndTime = performance.now();

  console.log(`✅ Cache test complete!`);
  console.log(`   - From cache: ${cachedResult.fromCache ? 'Yes' : 'No'}`);
  console.log(`   - Calculation time: ${cachedResult.calculationTime.toFixed(2)}ms`);

  if (cachedResult.fromCache) {
    const improvement = ((result.calculationTime - cachedResult.calculationTime) / result.calculationTime) * 100;
    console.log(`   - Cache improvement: ${improvement.toFixed(1)}% faster\n`);

    if (improvement > 80) {
      console.log(`✅ Cache performance target met (>80% improvement)!\n`);
    } else {
      console.log(`⚠️  Cache performance below target (${improvement.toFixed(1)}% vs 80% target)\n`);
    }
  } else {
    console.log(`   - Cache was not used (data recalculated)\n`);
  }

  // Performance assessment
  console.log(`\n🎯 Performance Assessment:\n`);

  const targetTime = 2000; // 2 seconds
  if (result.calculationTime < targetTime) {
    console.log(`✅ Calculation time target met: ${result.calculationTime.toFixed(2)}ms < ${targetTime}ms`);
  } else {
    console.log(`⚠️  Calculation time exceeds target: ${result.calculationTime.toFixed(2)}ms > ${targetTime}ms`);
  }

  console.log(`\n🎉 Test complete!\n`);

  // Exit successfully
  process.exit(0);
}

// Run the test
testMLB3DCalculator().catch(error => {
  console.error('❌ Test failed:', error);
  console.error(error.stack);
  process.exit(1);
});
