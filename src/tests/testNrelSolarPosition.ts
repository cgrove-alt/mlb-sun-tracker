/**
 * Test file to verify NREL Solar Position Algorithm implementation
 */

import { computeSunPosition, getSunPositionNREL } from '../utils/nrelSolarPosition';
import { getSunPosition } from '../utils/sunCalculations';
import SunCalc from 'suncalc';

// Test locations
const testLocations = [
  { name: 'Yankee Stadium', lat: 40.8296, lon: -73.9262 },
  { name: 'Dodger Stadium', lat: 34.0739, lon: -118.2400 },
  { name: 'Wrigley Field', lat: 41.9484, lon: -87.6553 },
  { name: 'Oracle Park', lat: 37.7786, lon: -122.3893 }
];

// Test dates
const testDates = [
  new Date('2024-06-21T19:00:00'), // Summer solstice, evening game
  new Date('2024-09-23T14:00:00'), // Fall equinox, afternoon game
  new Date('2024-12-21T13:00:00'), // Winter solstice, afternoon
  new Date('2024-03-20T19:00:00')  // Spring equinox, evening
];

console.log('Testing NREL Solar Position Algorithm Implementation\n');
console.log('=' . repeat(60));

// Test computeSunPosition directly
console.log('\n1. Testing computeSunPosition (raw NREL implementation):');
testLocations.forEach(location => {
  console.log(`\n${location.name}:`);
  testDates.forEach(date => {
    const timeZoneOffset = -date.getTimezoneOffset() / 60;
    const result = computeSunPosition(
      date,
      location.lat,
      location.lon,
      timeZoneOffset
    );
    
    console.log(`  ${date.toLocaleString()}: ` +
                `Azimuth=${result.azimuth.toFixed(2)}°, ` +
                `Elevation=${result.elevation.toFixed(2)}°, ` +
                `Zenith=${result.zenith.toFixed(2)}°`);
  });
});

// Compare NREL vs SunCalc
console.log('\n\n2. Comparing NREL vs SunCalc results:');
console.log('=' . repeat(60));

testLocations.forEach(location => {
  console.log(`\n${location.name}:`);
  const date = new Date('2024-07-04T15:00:00'); // Fixed date for comparison
  
  // NREL result
  const nrelResult = getSunPositionNREL(date, location.lat, location.lon);
  
  // SunCalc result
  const sunCalcPos = SunCalc.getPosition(date, location.lat, location.lon);
  const sunCalcAzimuth = ((sunCalcPos.azimuth * 180 / Math.PI) + 180) % 360;
  const sunCalcAltitude = sunCalcPos.altitude * 180 / Math.PI;
  
  console.log(`  NREL:    Azimuth=${nrelResult.azimuthDegrees.toFixed(2)}°, Altitude=${nrelResult.altitudeDegrees.toFixed(2)}°`);
  console.log(`  SunCalc: Azimuth=${sunCalcAzimuth.toFixed(2)}°, Altitude=${sunCalcAltitude.toFixed(2)}°`);
  console.log(`  Difference: Azimuth=${Math.abs(nrelResult.azimuthDegrees - sunCalcAzimuth).toFixed(2)}°, ` +
              `Altitude=${Math.abs(nrelResult.altitudeDegrees - sunCalcAltitude).toFixed(2)}°`);
});

// Test backward compatibility
console.log('\n\n3. Testing backward compatibility with getSunPosition:');
console.log('=' . repeat(60));

// Save original env value
const originalEnvValue = process.env.REACT_APP_USE_NREL_SPA;

// Test with NREL enabled (default)
process.env.REACT_APP_USE_NREL_SPA = 'true';
console.log('\nWith NREL enabled:');
const nrelEnabledResult = getSunPosition(
  new Date('2024-07-04T15:00:00'),
  testLocations[0].lat,
  testLocations[0].lon
);
console.log(`  Azimuth (deg): ${nrelEnabledResult.azimuthDegrees.toFixed(2)}°`);
console.log(`  Altitude (deg): ${nrelEnabledResult.altitudeDegrees.toFixed(2)}°`);
console.log(`  Azimuth (rad): ${nrelEnabledResult.azimuth.toFixed(4)}`);
console.log(`  Altitude (rad): ${nrelEnabledResult.altitude.toFixed(4)}`);

// Test with NREL disabled (fallback to SunCalc)
process.env.REACT_APP_USE_NREL_SPA = 'false';
console.log('\nWith NREL disabled (SunCalc fallback):');
const sunCalcFallbackResult = getSunPosition(
  new Date('2024-07-04T15:00:00'),
  testLocations[0].lat,
  testLocations[0].lon
);
console.log(`  Azimuth (deg): ${sunCalcFallbackResult.azimuthDegrees.toFixed(2)}°`);
console.log(`  Altitude (deg): ${sunCalcFallbackResult.altitudeDegrees.toFixed(2)}°`);
console.log(`  Azimuth (rad): ${sunCalcFallbackResult.azimuth.toFixed(4)}`);
console.log(`  Altitude (rad): ${sunCalcFallbackResult.altitude.toFixed(4)}`);

// Restore original env value
process.env.REACT_APP_USE_NREL_SPA = originalEnvValue;

// Test edge cases
console.log('\n\n4. Testing edge cases:');
console.log('=' . repeat(60));

const edgeCases = [
  { name: 'Midnight', date: new Date('2024-06-21T00:00:00') },
  { name: 'Solar noon', date: new Date('2024-06-21T12:00:00') },
  { name: 'Sunrise', date: new Date('2024-06-21T05:30:00') },
  { name: 'Sunset', date: new Date('2024-06-21T20:30:00') }
];

edgeCases.forEach(testCase => {
  console.log(`\n${testCase.name}:`);
  const result = computeSunPosition(
    testCase.date,
    testLocations[0].lat,
    testLocations[0].lon,
    -5 // EST
  );
  console.log(`  Elevation: ${result.elevation.toFixed(2)}° ` +
              `(${result.elevation < 0 ? 'Below horizon' : 'Above horizon'})`);
  console.log(`  Azimuth: ${result.azimuth.toFixed(2)}°`);
});

console.log('\n\nTest completed!');