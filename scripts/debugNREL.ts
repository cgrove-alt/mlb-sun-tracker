#!/usr/bin/env ts-node

/**
 * Debug NREL implementation by comparing intermediate values
 */

import { getSunPositionNREL } from '../src/utils/nrelSolarPosition';
import SunCalc from 'suncalc';

const date = new Date('2026-06-21T12:00:00-07:00'); // Summer solstice noon PDT
const latitude = 34.0739; // Dodger Stadium
const longitude = -118.2400;
const timezone = 'America/Los_Angeles';

console.log('Test Date:', date.toISOString());
console.log('Local Time:', date.toLocaleString('en-US', { timeZone: timezone }));
console.log('UTC:', date.toUTCString());
console.log('');

// Test NREL
const nrelResult = getSunPositionNREL(date, latitude, longitude, timezone);
console.log('NREL Result:');
console.log(`  Azimuth: ${nrelResult.azimuthDegrees.toFixed(4)}°`);
console.log(`  Altitude: ${nrelResult.altitudeDegrees.toFixed(4)}°`);
console.log('');

// Test SunCalc
const sunCalcResult = SunCalc.getPosition(date, latitude, longitude);
const sunCalcAzimuth = ((sunCalcResult.azimuth * 180 / Math.PI) + 180) % 360;
const sunCalcAltitude = sunCalcResult.altitude * 180 / Math.PI;
console.log('SunCalc Result:');
console.log(`  Azimuth: ${sunCalcAzimuth.toFixed(4)}°`);
console.log(`  Altitude: ${sunCalcAltitude.toFixed(4)}°`);
console.log('');

// Expected at summer solstice noon: ~79° altitude at 34°N latitude
// Calculation: 90° - latitude + 23.5° (tilt) = 90 - 34 + 23.5 = 79.5°
console.log('Expected (theoretical):');
console.log(`  Altitude at solar noon on summer solstice at 34°N: ~79.5°`);
console.log('');

console.log('Error:');
console.log(`  Azimuth: ${Math.abs(nrelResult.azimuthDegrees - sunCalcAzimuth).toFixed(4)}°`);
console.log(`  Altitude: ${Math.abs(nrelResult.altitudeDegrees - sunCalcAltitude).toFixed(4)}°`);
