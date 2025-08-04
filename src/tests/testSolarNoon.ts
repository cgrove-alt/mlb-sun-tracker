/**
 * Test sun position at solar noon
 */

import { computeSunPosition } from '../utils/nrelSolarPosition';
import SunCalc from 'suncalc';

const yankeeStadium = { lat: 40.8296, lon: -73.9262 };
const testDate = new Date('2024-07-04T12:00:00'); // Start with noon

// Get solar noon from SunCalc
const sunTimes = SunCalc.getTimes(testDate, yankeeStadium.lat, yankeeStadium.lon);
console.log('Solar Noon (SunCalc):', sunTimes.solarNoon.toString());

// Test at solar noon
const solarNoonDate = sunTimes.solarNoon;
const timeZoneOffset = -solarNoonDate.getTimezoneOffset() / 60;

console.log('\nAt Solar Noon:');
console.log('Time:', solarNoonDate.toLocaleTimeString());

// NREL calculation
const nrelResult = computeSunPosition(
  solarNoonDate,
  yankeeStadium.lat,
  yankeeStadium.lon,
  timeZoneOffset
);

console.log('\nNREL Result:');
console.log('  Elevation:', nrelResult.elevation.toFixed(2), '°');
console.log('  Azimuth:', nrelResult.azimuth.toFixed(2), '°');

// SunCalc calculation
const sunCalcResult = SunCalc.getPosition(solarNoonDate, yankeeStadium.lat, yankeeStadium.lon);
const sunCalcAltitude = sunCalcResult.altitude * 180 / Math.PI;
const sunCalcAzimuth = ((sunCalcResult.azimuth * 180 / Math.PI) + 180) % 360;

console.log('\nSunCalc Result:');
console.log('  Altitude:', sunCalcAltitude.toFixed(2), '°');
console.log('  Azimuth:', sunCalcAzimuth.toFixed(2), '°');

// Also test at different times of day
console.log('\n\nTesting different times on July 4, 2024:');
const testTimes = [
  '06:00:00', // Early morning
  '09:00:00', // Morning
  '12:00:00', // Noon
  '15:00:00', // Afternoon
  '18:00:00', // Evening
  '20:00:00'  // Late evening
];

testTimes.forEach(time => {
  const date = new Date(`2024-07-04T${time}`);
  const nrel = computeSunPosition(date, yankeeStadium.lat, yankeeStadium.lon, -4);
  const sc = SunCalc.getPosition(date, yankeeStadium.lat, yankeeStadium.lon);
  const scAlt = sc.altitude * 180 / Math.PI;
  
  console.log(`\n${time}: NREL=${nrel.elevation.toFixed(1)}°, SunCalc=${scAlt.toFixed(1)}°, Diff=${Math.abs(nrel.elevation - scAlt).toFixed(1)}°`);
});