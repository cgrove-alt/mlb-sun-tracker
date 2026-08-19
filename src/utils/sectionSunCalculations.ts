// Section-level sun exposure.
//
// The coordinate convention and the physics both live in
// `src/utils/bowlGeometry.ts` — read that file's header before changing
// anything here. In short:
//
//   `section.baseAngle` is STADIUM-LOCAL (0 = 1B, 90 = CF, 180 = 3B,
//   270 = behind home). `sunAzimuth` is an absolute compass bearing. They can
//   only be compared after converting the section with
//   `sectionCompassAngle(section, stadiumOrientation)`.
//
//   A grandstand shades its own seats: the stands on the SAME compass side as
//   the sun sit in their own structure's shadow, and the stands ACROSS the
//   bowl take the light in the face.
//
// This module is the section-level (not row-level) model. It answers "how much
// of this section is in direct sun right now" and is what the venue-page shade
// diagram draws.

import type { StadiumSection } from '../data/stadiumSectionTypes';
import {
  sectionCompassAngle,
  venueSectionCompassAngle,
  directSunPercent,
  requireFiniteOrientation,
  type SeatingLevel,
  type SectionAngleConvention,
} from './bowlGeometry';

export { sectionCompassAngle };
export type { SectionAngleConvention };

/**
 * Is this section receiving any meaningful direct sunlight right now?
 *
 * Section-level binary; the per-row `calculateRowShadows` handles per-row
 * structural shade.
 *
 * @param stadiumOrientation Compass HP→CF (baseball) or field long-axis (NFL).
 *   `0` is a real north-facing axis, not a missing value.
 * @param convention How `section.baseAngle` is stored. NFL inventories are
 *   compass-from-north; baseball-local here would rotate the bowl.
 */
export function isSectionInSun(
  section: StadiumSection,
  sunAzimuth: number,
  sunElevation: number,
  stadiumOrientation: number,
  convention: SectionAngleConvention = 'baseball-local',
): boolean {
  // Same shadow line as getSectionSunExposure: majority direct sun.
  // Orientation and convention are not optional — an uncovered seat with
  // the sun up is still shaded when it sits in its own grandstand's shadow.
  return getSectionSunExposure(
    section,
    sunElevation,
    sunAzimuth,
    stadiumOrientation,
    convention,
  ) > 50;
}

/**
 * What fraction (0–100) of this section is in direct sun?
 *
 * REWRITTEN 2026-08-07. The previous implementation pointed the right way but
 * said almost nothing:
 *
 *   - Its elevation term was `min(sunElevation / 45, 1)`, so at ANY sun
 *     altitude at or above 45° both regimes saturated to 1 and every open
 *     section in the park returned an identical number. Azimuth then dropped
 *     out too, because the azimuth blend faded toward 1.0 as the sun rose.
 *     Result: for 1 PM and 4 PM starts — the games where shade matters most —
 *     the venue-page diagram was completely orientation-blind, painting the
 *     whole bowl one colour.
 *   - Its azimuth term was a bathtub: `azimuthFactor` reached 1.0 at BOTH 0°
 *     (sun directly behind the seats) and 180° (sun straight across), with its
 *     minimum at 90°. So the model's idea of the shadiest seat in the park was
 *     the one at right angles to the sun, not the one with the sun behind it.
 *   - It branched hard at `angleDiff > 90`, with different elevation AND
 *     azimuth formulas either side. Two sections 2° apart across that boundary
 *     differed by roughly 3×, a visible seam across the diagram.
 *
 * All three are gone: exposure is now `directSunPercent` from bowlGeometry,
 * which is continuous in azimuth, keeps a real (if damped) sun/shade split at
 * high sun, and models the actual shading structure per seating level.
 *
 * Geometry only — cloud cover dims the sun but does not move the shadow line,
 * so weather is applied by callers, not folded in here.
 *
 * @param stadiumOrientation Compass HP→CF (baseball) or field long-axis (NFL).
 * @param convention How `section.baseAngle` is stored. Default baseball-local.
 */
export function getSectionSunExposure(
  section: StadiumSection,
  sunElevation: number,
  sunAzimuth: number,
  stadiumOrientation: number,
  convention: SectionAngleConvention = 'baseball-local',
): number {
  if (sunElevation <= 0) return 0;
  if (section.covered && sunElevation <= 60) return 0;

  const orientation = requireFiniteOrientation(stadiumOrientation, section.id);
  const exposure = directSunPercent({
    sunAltitudeDeg: sunElevation,
    sunAzimuthDeg: sunAzimuth,
    sectionCompassDeg: venueSectionCompassAngle(section, orientation, convention),
    level: section.level as SeatingLevel,
  });

  // A partial canopy at very high sun still lets some direct light past its
  // edges — 30% throughput, unchanged from the previous model.
  const coverageThroughput = section.covered ? 0.3 : 1.0;

  return Math.round(Math.max(0, Math.min(100, exposure * coverageThroughput)));
}
