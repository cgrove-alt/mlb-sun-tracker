// Sun calculation functions for stadium sections.
//
// Geometric model (replaces the same-side-only heuristic that was here before):
//
//   - Below horizon: no direct sun anywhere.
//   - Covered section: a partial canopy lets some light through only at very
//     high sun (>60°); below that, treat as shaded.
//   - High sun (≥30° elevation): every uncovered seat receives direct light.
//     Azimuth controls intensity, not whether the seat is in sun.
//   - Low sun (<30°): direction matters.
//       * Sun on the opposite side of the bowl from the section
//         (|sun_az − section_az| > 90°): rays cross the field and shine
//         DIRECTLY into the seats. This is the dominant late-afternoon case.
//         The previous implementation reported these sections as shaded — a
//         physics bug that affected every late-game shade prediction.
//       * Sun on the same side as the section (≤ 90°): sun is behind the
//         spectators, mostly absorbed by the bowl structure. Some
//         back-lighting reaches lower rows, but most of the section is in
//         shadow.

import type { StadiumSection } from '../data/stadiumSectionTypes';

const normalizeAngle = (angle: number): number => ((angle % 360) + 360) % 360;

function angleDiffDeg(a: number, b: number): number {
  const diff = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return diff > 180 ? 360 - diff : diff;
}

function sectionCenterAngle(section: StadiumSection): number {
  return normalizeAngle(section.baseAngle + section.angleSpan / 2);
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
 */
export function isSectionInSun(
  section: StadiumSection,
  sunAzimuth: number,
  sunElevation: number,
): boolean {
  if (sunElevation <= 0) return false;
  if (section.covered) {
    // Partial canopies only let direct sun through when the sun is nearly
    // overhead. Below 60° treat the seat as shaded.
    return sunElevation > 60;
  }
  // Uncovered, above the horizon: at least part of the section is in sun.
  // The intensity question is `getSectionSunExposure`.
  return true;
}

/**
 * What fraction (0–100) of this section is in direct sun?
 *
 * The shape of this curve matters more than its absolute scale: callers use
 * it both to rank sections (higher = sunnier) and as a heuristic gate
 * (exposure > 10 means "in sun"). The model below handles both regimes
 * sensibly (see file-header comment).
 */
export function getSectionSunExposure(
  section: StadiumSection,
  sunElevation: number,
  sunAzimuth: number,
): number {
  if (sunElevation <= 0) return 0;
  if (section.covered && sunElevation <= 60) return 0;

  const sectionAngle = sectionCenterAngle(section);
  const angleDiff = angleDiffDeg(sunAzimuth, sectionAngle);
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
