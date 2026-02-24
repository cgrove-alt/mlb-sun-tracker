// Sun calculation functions for stadium sections
// Separated from stadiumSections.ts to prevent bundling 3.3 MB of data in client bundle

import type { StadiumSection } from '../data/stadiumSectionTypes';

// Normalize angles to 0-360 range
const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

/**
 * Check if a section is in sun based on sun position and stadium orientation
 *
 * COORDINATE SYSTEMS:
 * - Sun azimuth: Compass degrees (0°=North, 90°=East, 180°=South, 270°=West)
 * - Section baseAngle: Stadium-relative degrees (0°=behind home plate, 90°=first base, 180°=center field, 270°=third base)
 * - Stadium orientation: Compass bearing of center field direction
 *
 * We convert sun azimuth to stadium-relative coordinates for comparison.
 */
export function isSectionInSun(
  section: StadiumSection,
  sunAzimuth: number,
  sunElevation: number,
  stadiumOrientation: number = 0
): boolean {
  // If sun is below horizon, no sections are sunny
  if (sunElevation < 0) return false;

  // Covered sections ALWAYS have 0% sun exposure - they have permanent overhead coverage
  if (section.covered) return false;

  // Convert sun azimuth from compass to stadium-relative coordinates
  // Stadium-relative: 0° = behind home plate, 180° = center field
  // If stadium orientation is 22° (CF faces NNE), then home plate faces 202° (SSW)
  // Sun at 202° compass should map to ~0° stadium-relative (behind home plate)
  const relativeSunAngle = normalizeAngle(sunAzimuth - stadiumOrientation + 180);

  const sectionCenter = normalizeAngle(section.baseAngle + section.angleSpan / 2);

  // Calculate angle difference between sun position and section location
  let angleDiff = Math.abs(relativeSunAngle - sectionCenter);
  if (angleDiff > 180) {
    angleDiff = 360 - angleDiff;
  }

  // Section gets sun if it's on the same side as the sun (within ~90 degrees)
  return angleDiff <= 90;
}

/**
 * Calculate sun exposure percentage for a section
 * @param section - The stadium section
 * @param sunElevation - Sun altitude in degrees (0-90)
 * @param sunAzimuth - Sun azimuth in compass degrees (0°=N, 90°=E, 180°=S, 270°=W)
 * @param stadiumOrientation - Compass bearing of center field direction (default 0)
 * @returns Exposure percentage 0-100
 */
export function getSectionSunExposure(
  section: StadiumSection,
  sunElevation: number,
  sunAzimuth: number,
  stadiumOrientation: number = 0
): number {
  if (sunElevation < 0) return 0;

  // Covered sections ALWAYS have 0% sun exposure - they have permanent overhead coverage
  if (section.covered) return 0;

  // Check if section is actually in sun first
  if (!isSectionInSun(section, sunAzimuth, sunElevation, stadiumOrientation)) return 0;

  // Base exposure calculation based on sun elevation
  const elevationFactor = Math.min(sunElevation / 90, 1); // Normalize to 0-1, cap at 1

  // Convert sun azimuth to stadium-relative coordinates for angle comparison
  const relativeSunAngle = normalizeAngle(sunAzimuth - stadiumOrientation + 180);
  const sectionCenter = normalizeAngle(section.baseAngle + section.angleSpan / 2);

  // Calculate angle difference between sun and section location
  let angleDiff = Math.abs(relativeSunAngle - sectionCenter);
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
