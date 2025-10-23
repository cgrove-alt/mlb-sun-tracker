#!/usr/bin/env ts-node

/**
 * Compare official NREL SPA package with my implementation and SunCalc
 */

import { getSunPositionNREL } from '../src/utils/nrelSolarPosition';
import SunCalc from 'suncalc';
// @ts-ignore
import { getSpa } from 'nrel-spa';

const testDate = new Date('2026-06-21T12:00:00-07:00'); // Summer solstice noon PDT
const latitude = 34.0739; // Dodger Stadium
const longitude = -118.2400;
const timezone = 'America/Los_Angeles';

console.log('Test: Summer Solstice 2026 at Noon (Dodger Stadium)');
console.log('Date:', testDate.toISOString());
console.log('Local:', testDate.toLocaleString('en-US', { timeZone: timezone }));
console.log('');

// Official NREL SPA package
const nrelOfficial = getSpa(testDate, latitude, longitude, -7); // PDT = UTC-7
console.log('Official NREL SPA Package:');
console.log(`  Azimuth: ${nrelOfficial.azimuth.toFixed(4)}°`);
console.log(`  Zenith: ${nrelOfficial.zenith.toFixed(4)}°`);
console.log(`  Altitude (90-zenith): ${(90 - nrelOfficial.zenith).toFixed(4)}°`);
console.log('');

// My NREL implementation
const myNREL = getSunPositionNREL(testDate, latitude, longitude, timezone);
console.log('My NREL Implementation:');
console.log(`  Azimuth: ${myNREL.azimuthDegrees.toFixed(4)}°`);
console.log(`  Altitude: ${myNREL.altitudeDegrees.toFixed(4)}°`);
console.log('');

// SunCalc for comparison
const sunCalc = SunCalc.getPosition(testDate, latitude, longitude);
const sunCalcAzimuth = ((sunCalc.azimuth * 180 / Math.PI) + 180) % 360;
const sunCalcAltitude = sunCalc.altitude * 180 / Math.PI;
console.log('SunCalc:');
console.log(`  Azimuth: ${sunCalcAzimuth.toFixed(4)}°`);
console.log(`  Altitude: ${sunCalcAltitude.toFixed(4)}°`);
console.log('');

console.log('Errors vs Official NREL:');
console.log(`  My NREL Azimuth Error: ${Math.abs(myNREL.azimuthDegrees - nrelOfficial.azimuth).toFixed(4)}°`);
console.log(`  My NREL Altitude Error: ${Math.abs(myNREL.altitudeDegrees - (90 - nrelOfficial.zenith)).toFixed(4)}°`);
console.log(`  SunCalc Azimuth Error: ${Math.abs(sunCalcAzimuth - nrelOfficial.azimuth).toFixed(4)}°`);
console.log(`  SunCalc Altitude Error: ${Math.abs(sunCalcAltitude - (90 - nrelOfficial.zenith)).toFixed(4)}°`);
