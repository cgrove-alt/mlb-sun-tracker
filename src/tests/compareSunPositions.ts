/**
 * Simple comparison test between NREL and SunCalc
 */

import { computeSunPosition } from '../utils/nrelSolarPosition';
import SunCalc from 'suncalc';

// Test a specific known case
const testDate = new Date('2024-07-04T15:00:00'); // July 4, 3 PM local time
const yankeeStadium = { lat: 40.8296, lon: -73.9262 };

console.log('Test Date:', testDate.toString());
console.log('Location: Yankee Stadium', yankeeStadium);
console.log('');

// NREL calculation
const timeZoneOffset = -testDate.getTimezoneOffset() / 60;
console.log('Timezone offset (hours from UTC):', timeZoneOffset);

const nrelResult = computeSunPosition(
  testDate,
  yankeeStadium.lat,
  yankeeStadium.lon,
  timeZoneOffset
);

console.log('\nNREL Result:');
console.log('  Elevation:', nrelResult.elevation.toFixed(2), '°');
console.log('  Azimuth:', nrelResult.azimuth.toFixed(2), '°');
console.log('  Zenith:', nrelResult.zenith.toFixed(2), '°');

// SunCalc calculation
const sunCalcResult = SunCalc.getPosition(testDate, yankeeStadium.lat, yankeeStadium.lon);
const sunCalcAltitude = sunCalcResult.altitude * 180 / Math.PI;
const sunCalcAzimuth = ((sunCalcResult.azimuth * 180 / Math.PI) + 180) % 360;

console.log('\nSunCalc Result:');
console.log('  Altitude:', sunCalcAltitude.toFixed(2), '°');
console.log('  Azimuth:', sunCalcAzimuth.toFixed(2), '°');

// Check sun times too
const sunTimes = SunCalc.getTimes(testDate, yankeeStadium.lat, yankeeStadium.lon);
console.log('\nSun Times (SunCalc):');
console.log('  Sunrise:', sunTimes.sunrise.toLocaleTimeString());
console.log('  Solar Noon:', sunTimes.solarNoon.toLocaleTimeString());
console.log('  Sunset:', sunTimes.sunset.toLocaleTimeString());

// Debug: check UTC vs local calculations
console.log('\nDebug Info:');
console.log('  Local time:', testDate.toLocaleString());
console.log('  UTC time:', testDate.toUTCString());
console.log('  Unix timestamp:', testDate.getTime());