// Sun calculation functions for stadium sections.
//
// Coordinate convention (CRITICAL — see also stadiumSectionTypes.ts):
//
//   `section.baseAngle` is a STADIUM-LOCAL angle, NOT a compass bearing.
//   It is measured CCW from +x (first base direction) in the stadium's own
//   frame: 0 = 1B, 90 = CF, 180 = 3B, 270 = behind home plate.
//
//   `sunAzimuth` is an ABSOLUTE compass bearing (0 = N, 90 = E, …).
//
//   To compare, the section's baseAngle must be converted to compass:
//       sectionCompass = (stadiumOrientation + 90 − baseAngle) mod 360
//   where `stadiumOrientation` is the compass bearing from home plate to
//   center field. Derivation:
//       1B  (baseAngle 0)   → compass orientation + 90  (catcher's right)
//       CF  (baseAngle 90)  → compass orientation       (straight ahead)
//       3B  (baseAngle 180) → compass orientation − 90  (catcher's left)
//       HP  (baseAngle 270) → compass orientation + 180 (behind catcher)
//
// Physics:
//
//   A section located at compass position θ around the bowl has seats that
//   face INWARD toward the field — i.e. the seat normal points (θ + 180°)
//   compass. Sunlight on the seat is direct when |sunAzimuth − seatNormal| <
//   90°, which is equivalent to |sunAzimuth − θ| > 90°. So:
//
//     - Section "opposite" the sun in compass terms (angleDiff > 90°) is
//       facing toward the sun and receives direct light. This is the dominant
//       late-afternoon case (rays cross the bowl into the seats).
//     - Section "same side" as the sun (angleDiff ≤ 90°) has the sun behind
//       the spectators; most of the light is absorbed by the bowl structure.
//     - High sun (≥ ~30°): every uncovered seat receives direct light;
//       azimuth controls intensity, not whether the seat is lit.
//     - Below horizon: no direct sun anywhere.

import type { StadiumSection } from '../data/stadiumSectionTypes';

const normalizeAngle = (angle: number): number => ((angle % 360) + 360) % 360;

function angleDiffDeg(a: number, b: number): number {
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return diff > 180 ? 360 - diff : diff;
}

/**
 * Convert a stadium-local section center angle into an absolute compass
 * bearing. See file-header convention block.
 */
export function sectionCompassAngle(
  section: Pick<StadiumSection, 'baseAngle' | 'angleSpan'>,
  stadiumOrientation: number,
): number {
  const sectionCenter = section.baseAngle + section.angleSpan / 2;
  return normalizeAngle(stadiumOrientation + 90 - sectionCenter);
}

function levelMultiplier(level: StadiumSection['level']): number {
  // Upper rows are generally more exposed (less overhang); suites tend to be
  // recessed. These match the previous file's level weightings so that
  // numbers across the codebase stay comparable.
  switch (level) {
    case 'field':
      return 1.0;
    case 'lower':
      return 0.95;
    case 'club':
      return 0.85;
    case 'upper':
      return 1.0;
    case 'suite':
      return 0.75;
    default:
      return 1.0;
  }
}

/**
 * Is this section receiving any meaningful direct sunlight right now?
 *
 * Section-level binary; the per-row `calculateRowShadows` handles per-row
 * structural shade.
 *
 * @param stadiumOrientation Compass bearing from home plate to center field.
 *   Required to convert `section.baseAngle` (stadium-local) to absolute
 *   compass for comparison with `sunAzimuth`. See file-header for details.
 */
export function isSectionInSun(
  section: StadiumSection,
  sunAzimuth: number,
  sunElevation: number,
  stadiumOrientation: number,
): boolean {
  if (sunElevation <= 0) return false;
  if (section.covered) {
    // Partial canopies only let direct sun through when the sun is nearly
    // overhead. Below 60° treat the seat as shaded.
    return sunElevation > 60;
  }
  // Uncovered, above the horizon: at least part of the section is in sun.
  // The intensity question is `getSectionSunExposure`. `stadiumOrientation`
  // is unused for the binary answer but kept in the signature so every
  // caller is forced to pass it (this is the parameter the bug fix added).
  void stadiumOrientation;
  return true;
}

/**
 * What fraction (0–100) of this section is in direct sun?
 *
 * The shape of this curve matters more than its absolute scale: callers use
 * it both to rank sections (higher = sunnier) and as a heuristic gate
 * (exposure > 10 means "in sun"). The model handles high-sun, low-sun,
 * opposite-side, and same-side regimes; see file-header for the physics.
 *
 * @param stadiumOrientation Compass bearing from home plate to center field.
 *   Required to convert `section.baseAngle` (stadium-local) to absolute
 *   compass for comparison with `sunAzimuth`.
 */
export function getSectionSunExposure(
  section: StadiumSection,
  sunElevation: number,
  sunAzimuth: number,
  stadiumOrientation: number,
): number {
  if (sunElevation <= 0) return 0;
  if (section.covered && sunElevation <= 60) return 0;

  const sectionCompass = sectionCompassAngle(section, stadiumOrientation);
  const angleDiff = angleDiffDeg(sunAzimuth, sectionCompass);
  const sunOnOppositeSide = angleDiff > 90;
  const level = levelMultiplier(section.level);
  // Partial canopy at very high sun: 30% throughput.
  const coverageThroughput = section.covered ? 0.3 : 1.0;

  // Elevation factor: fraction of the section illuminated, before azimuth.
  // Opposite-side stands receive horizontal cross-bowl rays even at the
  // horizon, so the floor is higher than for same-side.
  let elevationFactor: number;
  if (sunOnOppositeSide) {
    elevationFactor = 0.4 + 0.6 * Math.min(sunElevation / 45, 1);
  } else {
    const baseElev = Math.min(sunElevation / 45, 1);
    elevationFactor = baseElev * (0.4 + 0.6 * baseElev);
  }

  // Azimuth factor: directional intensity within the chosen regime.
  let azimuthFactor: number;
  if (sunOnOppositeSide) {
    const oppositeStrength = (angleDiff - 90) / 90; // 0 at 90°, 1 at 180°
    azimuthFactor = 0.6 + 0.4 * oppositeStrength;
  } else {
    const sameStrength = (90 - angleDiff) / 90; // 1 when sun directly behind
    azimuthFactor = 0.4 + 0.6 * sameStrength;
  }

  // Sun becomes effectively overhead at high elevations; dampen azimuth.
  const azimuthBlend = Math.max(0, 1 - sunElevation / 75);
  const finalAzimuthFactor = azimuthBlend * azimuthFactor + (1 - azimuthBlend) * 1.0;

  const exposure = 100 * elevationFactor * finalAzimuthFactor * level * coverageThroughput;
  return Math.round(Math.max(0, Math.min(100, exposure)));
}
