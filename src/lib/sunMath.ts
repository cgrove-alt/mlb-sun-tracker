/**
 * sunMath.ts — Single source of truth for all solar exposure math.
 *
 * Every altitude factor in the codebase must use `altitudeFactor()`.
 * No other altitude formula should exist.
 */

/**
 * Convert sun altitude in degrees to a 0–1 irradiance factor.
 * Uses sin(altitude) which is physically correct: solar flux on a horizontal
 * surface is proportional to sin(elevation angle).
 *
 * @param altitudeDeg  Sun altitude above horizon in degrees
 * @returns 0 when below horizon, sin(alt) when above (naturally capped at 1 at 90°)
 */
export function altitudeFactor(altitudeDeg: number): number {
  if (altitudeDeg <= 0) return 0;
  return Math.sin(altitudeDeg * (Math.PI / 180));
}

/**
 * Normalize a bearing difference to the range [-180, 180].
 *
 * @param a  First bearing in degrees (0–360)
 * @param b  Second bearing in degrees (0–360)
 * @returns  Signed difference in (-180, 180]
 */
export function bearingDiff(a: number, b: number): number {
  let diff = ((a - b) % 360 + 360) % 360;
  if (diff > 180) diff -= 360;
  return diff;
}

/**
 * Determine whether a stadium section is illuminated by direct sunlight.
 *
 * A section is illuminated when the sun is on the same side of the stadium as
 * the section — i.e. the absolute angle difference between sun azimuth and the
 * section's outward-facing direction is ≤ 90°.
 *
 * @param sunAzimuth       Sun azimuth in compass degrees (0 = N, 90 = E, 180 = S, 270 = W)
 * @param sectionFacing    Compass bearing that describes where the section is located
 *                         around the stadium perimeter (its outward direction)
 * @param sectionAngleSpan Angular width of the section in degrees (for center calculation)
 * @returns true if the section can receive direct sunlight
 */
export function isSectionIlluminated(
  sunAzimuth: number,
  sectionFacing: number,
  sectionAngleSpan: number
): boolean {
  const sectionCenter = sectionFacing + sectionAngleSpan / 2;
  return Math.abs(bearingDiff(sunAzimuth, sectionCenter)) <= 90;
}

/**
 * Calculate the fractional solar exposure (0–1) for a stadium section.
 *
 * Combines:
 *  1. altitudeFactor  — physically correct sin(altitude)
 *  2. angleFactor     — cosine fall-off as sun moves away from section's face
 *  3. levelMultiplier — empirical reduction for sections with overhang protection
 *  4. coverageReduction — fully covered sections are at 30% of open exposure
 *
 * @param sunAltitudeDeg  Sun altitude in degrees
 * @param sunAzimuthDeg   Sun azimuth in compass degrees
 * @param sectionBaseAngle  Compass bearing of the section's start edge
 * @param sectionAngleSpan  Angular span of the section in degrees
 * @param level           Seating level ('field'|'lower'|'club'|'upper'|'suite')
 * @param covered         Whether the section has overhead coverage
 * @returns Exposure fraction in [0, 1]
 */
export function sectionSolarFraction(
  sunAltitudeDeg: number,
  sunAzimuthDeg: number,
  sectionBaseAngle: number,
  sectionAngleSpan: number,
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite',
  covered: boolean
): number {
  if (sunAltitudeDeg <= 0) return 0;
  if (covered && sunAltitudeDeg < 30) return 0; // Low sun blocked by canopy

  const sectionCenter = sectionBaseAngle + sectionAngleSpan / 2;
  const diff = Math.abs(bearingDiff(sunAzimuthDeg, sectionCenter));

  if (diff > 90) return 0; // Sun is behind the section

  // 1. Physically correct altitude factor
  const elevFactor = altitudeFactor(sunAltitudeDeg);

  // 2. Angular proximity factor: 1 when sun is directly behind section, 0 at 90°
  const angleFactor = (90 - diff) / 90;

  // 3. Level-based overhang multiplier
  const levelMultiplier =
    level === 'suite' ? 0.75
    : level === 'club' ? 0.85
    : level === 'lower' ? 0.95
    : 1.0; // 'field' and 'upper' are fully exposed

  // 4. Coverage reduction (partial canopy still allows some sun)
  const coverageReduction = covered ? 0.3 : 1.0;

  return elevFactor * angleFactor * levelMultiplier * coverageReduction;
}
