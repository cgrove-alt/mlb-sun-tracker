#!/usr/bin/env ts-node

/**
 * Detailed NREL debugging with intermediate value logging
 */

import { L_TERMS, B_TERMS, R_TERMS } from '../src/data/nrelPeriodicTerms';

// Test date: Summer solstice 2026 at noon PDT
const testDate = new Date('2026-06-21T12:00:00-07:00');

console.log('=== NREL DETAILED DEBUG ===\n');
console.log('Test Date:', testDate.toISOString());
console.log('UTC:', testDate.toUTCString());
console.log('');

// Step 1: Calculate Julian Date
const year = testDate.getUTCFullYear();
const month = testDate.getUTCMonth() + 1;
const day = testDate.getUTCDate();
const hour = testDate.getUTCHours() + testDate.getUTCMinutes() / 60 + testDate.getUTCSeconds() / 3600;

const a = Math.floor((14 - month) / 12);
const y = year + 4800 - a;
const m = month + 12 * a - 3;

const JD = day + Math.floor((153 * m + 2) / 5) + 365 * y +
           Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) -
           32045 + hour / 24;

console.log('Step 1: Julian Date');
console.log(`  JD = ${JD.toFixed(6)}`);
console.log(`  Expected JD for 2026-06-21 19:00 UTC ≈ 2461283.29167`);
console.log('');

// Step 2: Julian Ephemeris values
const deltaT = 63.83 + 0.1 * (year - 2000); // Simplified for 2000-2050
const JDE = JD + deltaT / 86400;
const JC = (JD - 2451545) / 36525;
const JCE = (JDE - 2451545) / 36525;
const JME = JCE / 10;

console.log('Step 2: Julian Ephemeris Values');
console.log(`  JDE = ${JDE.toFixed(6)}`);
console.log(`  JC = ${JC.toFixed(6)}`);
console.log(`  JCE = ${JCE.toFixed(6)}`);
console.log(`  JME = ${JME.toFixed(6)}`);
console.log('');

// Step 3: Calculate L (heliocentric longitude) from periodic terms
function calculatePeriodicSum(termArrays: number[][][], JME: number): number {
  let sum = 0;
  for (let i = 0; i < termArrays.length; i++) {
    const terms = termArrays[i];
    let termSum = 0;
    for (const [A, B, C] of terms) {
      termSum += A * Math.cos(B + C * JME);
    }
    sum += termSum * Math.pow(JME, i);
  }
  return sum;
}

const L_raw = calculatePeriodicSum(L_TERMS, JME);
const L_radians = L_raw / 1e8;
const L_degrees = (L_radians * 180 / Math.PI) % 360;

console.log('Step 3: Heliocentric Longitude (L)');
console.log(`  L_raw = ${L_raw.toExponential(6)}`);
console.log(`  L_radians = ${L_radians.toFixed(6)}`);
console.log(`  L_degrees = ${L_degrees.toFixed(6)}°`);
console.log('');

// Step 4: Calculate B (heliocentric latitude)
const B_raw = calculatePeriodicSum(B_TERMS, JME);
const B_radians = B_raw / 1e8;
const B_degrees = B_radians * 180 / Math.PI;

console.log('Step 4: Heliocentric Latitude (B)');
console.log(`  B_raw = ${B_raw.toExponential(6)}`);
console.log(`  B_radians = ${B_radians.toFixed(9)}`);
console.log(`  B_degrees = ${B_degrees.toFixed(6)}°`);
console.log('');

// Step 5: Calculate R (radius vector)
const R_raw = calculatePeriodicSum(R_TERMS, JME);
const R_AU = R_raw / 1e8;

console.log('Step 5: Radius Vector (R)');
console.log(`  R_raw = ${R_raw.toExponential(6)}`);
console.log(`  R_AU = ${R_AU.toFixed(9)} AU`);
console.log(`  Expected R ≈ 1.016 AU (summer, Earth farthest from Sun)`);
console.log('');

// Step 6: Convert to geocentric
const geocentric_longitude = (L_degrees + 180) % 360;
const geocentric_latitude = -B_degrees;

console.log('Step 6: Geocentric Position');
console.log(`  Geocentric Longitude = ${geocentric_longitude.toFixed(6)}° (helio + 180°)`);
console.log(`  Geocentric Latitude = ${geocentric_latitude.toFixed(6)}° (-helio)`);
console.log('');

// Expected values for summer solstice:
// - Sun should be at declination ≈ +23.5° (Tropic of Cancer)
// - At noon, sun should be high in sky for Northern hemisphere
console.log('=== ANALYSIS ===');
console.log('For summer solstice at 34°N latitude (Dodger Stadium):');
console.log('  Expected sun declination: ≈ +23.5°');
console.log('  Expected altitude at solar noon: 90° - 34° + 23.5° = 79.5°');
console.log('  Expected azimuth at solar noon: ≈ 180° (due south)');
