// Sun calculation functions for stadium sections
// Separated from stadiumSections.ts to prevent bundling 3.3 MB of data in client bundle

import type { StadiumSection } from '../data/stadiumSectionTypes';

// Helper function to check if a section is in sun based on sun position
export function isSectionInSun(section: StadiumSection, sunAzimuth: number, sunElevation: number): boolean {
  // If sun is below horizon, no sections are sunny
  if (sunElevation < 0) return false;

  // Covered sections ALWAYS have 0% sun exposure - they have permanent overhead coverage
  if (section.covered) return false;

  // Normalize angles to 0-360 range
  const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

  const sunAngle = normalizeAngle(sunAzimuth);

  // CORRECT LOGIC: Sections get sun when they are LOCATED on the SAME SIDE as the sun
  // baseAngle represents where the section is LOCATED around the stadium perimeter
  // Sections face INWARD toward the field, so sun hits them from behind
  // For example: if sun is at 180° (south), sections located around 180° get sun on spectators' backs

  const sectionLocation = normalizeAngle(section.baseAngle + section.angleSpan / 2);

  // Calculate angle difference between sun position and section location
  let angleDiff = Math.abs(sunAngle - sectionLocation);
  if (angleDiff > 180) {
    angleDiff = 360 - angleDiff;
  }

  // Section gets sun if it's located on the same side as the sun (within ~90 degrees)
  // This accounts for the fact that sun can illuminate sections at an angle
  return angleDiff <= 90;
}

// Helper function to calculate sun exposure percentage for a section
export function getSectionSunExposure(section: StadiumSection, sunElevation: number, sunAzimuth: number): number {
  if (sunElevation < 0) return 0;

  // Covered sections ALWAYS have 0% sun exposure - they have permanent overhead coverage
  if (section.covered) return 0;

  // Check if section is actually in sun first
  if (!isSectionInSun(section, sunAzimuth, sunElevation)) return 0;

  // Base exposure calculation based on sun elevation
  const elevationFactor = Math.min(sunElevation / 90, 1); // Normalize to 0-1, cap at 1

  // Calculate angle-based intensity (how directly the sun hits the section)
  const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;
  const sectionLocation = normalizeAngle(section.baseAngle + section.angleSpan / 2);
  const sunAngle = normalizeAngle(sunAzimuth);

  // CORRECT LOGIC: Sun hits sections from behind when they're on the same side
  // Calculate angle difference between sun and section location
  let angleDiff = Math.abs(sunAngle - sectionLocation);
  if (angleDiff > 180) {
    angleDiff = 360 - angleDiff;
  }

  // Angle factor: 1.0 when sun is directly behind section, decreases as angle increases
  const angleFactor = Math.max(0, (90 - angleDiff) / 90);

  // Level-based adjustments
  let levelMultiplier = 1.0;
  if (section.level === 'field') {
    levelMultiplier = 1.0; // Field level gets full exposure
  } else if (section.level === 'lower') {
    levelMultiplier = 0.95; // Slight reduction due to possible overhangs
  } else if (section.level === 'club') {
    levelMultiplier = 0.85; // More protection from overhangs
  } else if (section.level === 'upper') {
    levelMultiplier = 1.0; // Upper sections often more exposed
  } else if (section.level === 'suite') {
    levelMultiplier = 0.75; // Suites often have more protection
  }

  // Enhance exposure for high sun angles (midday sun is stronger)
  let middayBoost = 1.0;
  if (sunElevation > 60) {
    middayBoost = 1.4; // Strong midday sun
  } else if (sunElevation > 45) {
    middayBoost = 1.25; // Moderate afternoon sun
  } else if (sunElevation > 30) {
    middayBoost = 1.1; // Lower angle sun
  }

  // Combine all factors with adjusted formula for more realistic values
  const exposure = elevationFactor * angleFactor * levelMultiplier * middayBoost * 100;

  return Math.round(Math.max(0, Math.min(100, exposure)));
}
