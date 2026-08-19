// bowlGeometry.ts — THE single source of truth for "which side of the bowl is
// in shade". Every shade model in this codebase must build on this module.
//
// ---------------------------------------------------------------------------
// WHY THIS FILE EXISTS
// ---------------------------------------------------------------------------
// Before this module, four independent implementations each re-derived the
// sun/shade relationship from scratch (sectionSunCalculations, sunCalculator's
// SunCalculator class, sunCalculator's calculateRowShadows, and
// getUnifiedVenueShade). Three of the four had the sign INVERTED — they told
// users to sit on the sunny side. The comments in two of them even mislabeled
// the branches, which is how the inversion survived review for so long.
//
// The rule below is short, physical, and verifiable. Do not re-derive it.
//
// ---------------------------------------------------------------------------
// COORDINATE CONVENTIONS
// ---------------------------------------------------------------------------
//   `section.baseAngle` is STADIUM-LOCAL, measured CCW from the first-base
//   direction in the stadium's own frame:
//       0 = 1B, 90 = CF, 180 = 3B, 270 = behind home plate.
//
//   `stadiumOrientation` is the COMPASS bearing from home plate to center
//   field (0 = N, 90 = E, ...).
//
//   `sunAzimuth` is an absolute COMPASS bearing — the direction the sun lies
//   in, as seen from the ballpark.
//
//   To compare a section against the sun, convert the section to compass:
//       sectionCompass = (stadiumOrientation + 90 − sectionLocalCenter) mod 360
//   Derivation (stand at home plate facing center field):
//       1B  (local 0)   → orientation + 90   (catcher's right)
//       CF  (local 90)  → orientation        (straight ahead)
//       3B  (local 180) → orientation − 90   (catcher's left)
//       HP  (local 270) → orientation + 180  (behind the catcher)
//
// ---------------------------------------------------------------------------
// THE PHYSICS — READ THIS BEFORE CHANGING ANY SHADE CODE
// ---------------------------------------------------------------------------
// A grandstand shades its own seats.
//
//   * Sun BEHIND the section (section's compass bearing ≈ sun azimuth):
//     the seats sit in the shadow of their own structure — the deck, façade,
//     and upper tier that rise behind them block the low/mid sun. This is the
//     SHADED case. It is the dominant shade mechanism in a ballpark.
//
//   * Sun ACROSS the bowl (section's compass bearing ≈ sun azimuth + 180):
//     the light crosses the field and lands square in the spectators' faces,
//     unobstructed except by any overhang lip directly above them (which
//     shades only the back rows). This is the SUNNY case.
//
// Sanity check against published ballpark guidance, using data already cited in
// src/data/stadiums.ts:
//   Rogers Centre, orientation 0° (HP→CF due north). Third base sits at compass
//   270° (west). The sourced note reads "3rd base side is the shade side, 1st
//   base side is sunny" — and west is exactly where the afternoon sun is. The
//   side the sun is ON is the side in shade. Same result at Wrigley (3B shaded,
//   1B bakes), Fenway (3B grandstand shaded, CF/RF bleachers roast) and Oracle
//   Park (1B side shaded in the afternoon).
//
// If a change to this file makes the sun-side sunnier than the opposite side,
// the change is wrong. `bowlGeometry.test.ts` and `shadeSanity.test.ts` enforce
// this against real section data for all 30 MLB parks.

export type SeatingLevel = 'field' | 'lower' | 'club' | 'upper' | 'suite' | 'standing';

export const normalizeAngle = (deg: number): number => ((deg % 360) + 360) % 360;

/**
 * A documented 0° axis (Highmark, Lambeau, Rogers Centre, …) is valid.
 * `orientation || 0` is not: it silently aims a park with missing data due north.
 */
export function requireFiniteOrientation(orientation: unknown, context?: string): number {
  if (typeof orientation !== 'number' || !Number.isFinite(orientation)) {
    throw new Error(
      `Stadium orientation is missing or invalid${context ? ` (${context})` : ''}; refusing to invent a north-facing default.`,
    );
  }
  return orientation;
}

/** Smallest angle between two compass bearings, in [0, 180]. */
export function angularDistance(a: number, b: number): number {
  const d = Math.abs(normalizeAngle(a) - normalizeAngle(b));
  return d > 180 ? 360 - d : d;
}

/**
 * Convert a stadium-local section angle into an absolute compass bearing.
 * See the convention block above.
 */
export function sectionCompassAngle(
  section: { baseAngle: number; angleSpan?: number },
  stadiumOrientation: number,
): number {
  const center = section.baseAngle + (section.angleSpan ?? 0) / 2;
  return normalizeAngle(stadiumOrientation + 90 - center);
}

/**
 * How a venue's `section.baseAngle` is stored.
 *
 *   baseball-local     — MLB / MiLB. 0 = 1B, 90 = CF, 180 = 3B, 270 = home.
 *                        Must be converted with `sectionCompassAngle`.
 *   compass-from-north — NFL (`nflSections.ts`). `baseAngle` is already an
 *                        absolute compass bearing (0 = north). Applying the
 *                        baseball conversion here rotates every section by
 *                        `orientation + 90 − angle` and points shade the
 *                        wrong way for every football venue.
 */
export type SectionAngleConvention = 'baseball-local' | 'compass-from-north';

export function sectionAngleConventionFor(venue: {
  league?: string;
  venueType?: string;
  sport?: string;
  sectionAngleConvention?: SectionAngleConvention;
}): SectionAngleConvention {
  if (venue.sectionAngleConvention) return venue.sectionAngleConvention;
  if (
    venue.league === 'NFL'
    || venue.venueType === 'football'
    || venue.sport === 'football'
  ) {
    return 'compass-from-north';
  }
  return 'baseball-local';
}

/**
 * Compass bearing of a section for any venue type. Baseball parks go through
 * `sectionCompassAngle`; football sections keep their documented
 * north-referenced angle.
 */
export function venueSectionCompassAngle(
  section: { baseAngle: number; angleSpan?: number },
  stadiumOrientation: number,
  convention: SectionAngleConvention = 'baseball-local',
): number {
  if (convention === 'compass-from-north') {
    const center = section.baseAngle + (section.angleSpan ?? 0) / 2;
    return normalizeAngle(center);
  }
  return sectionCompassAngle(section, stadiumOrientation);
}

export interface SunIncidence {
  /** Angle between the sun and the section's compass position, 0–180. */
  angleDiffDeg: number;
  /**
   * 1 when the sun is directly behind these seats (deep-shade regime),
   * 0 when it is directly across the bowl. Continuous — no branch, no seam.
   */
  sunBehind: number;
  /**
   * 1 when the sun shines straight into these seats (lit regime),
   * 0 when it is behind them. Always equals 1 − sunBehind.
   */
  sunFacing: number;
}

/**
 * Half-width of the sun-behind → sun-facing transition, in degrees. The
 * changeover is centred on 90° and spans 90° ± this value.
 *
 * Why a smoothstep of this width rather than a cosine or a hard branch:
 * self-shading is an OCCLUSION effect, and occlusion is close to a step.
 * Model the bowl as a ring of radius R with structure of height H behind the
 * seats. A ray from a seat toward the sun either
 *   - exits immediately through the structure right behind it
 *     (angleDiff < 90°) — blocked for any sun below roughly atan(H / 20 ft),
 *     which for H ≈ 45 ft is about 66°, i.e. essentially all afternoon; or
 *   - crosses the bowl and only meets the far rim (angleDiff > 90°) at a
 *     distance of 2R·|cos(angleDiff)| ≈ 500 ft, which blocks the sun only
 *     below about 5°.
 * So the true transition sits at 90° and is sharp. It is not infinitely sharp,
 * because real bowls are not circular, sections have width, and orientation
 * data carries a few degrees of uncertainty — hence a finite blend rather than
 * the hard `angleDiff > 90` branch the old models used, which produced a ~3×
 * jump between neighbouring sections and a visible seam across the diagram.
 *
 * A plain cosine was tried first and is too soft: it treats a section 75° from
 * the sun and one 105° from the sun as nearly alike, when the first is behind
 * the shadow line and the second is in open sun.
 */
export const INCIDENCE_TRANSITION_HALF_WIDTH_DEG = 40;

/** Classic smoothstep: 0 at t≤0, 1 at t≥1, flat first derivative at both ends. */
function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t));
  return x * x * (3 - 2 * x);
}

/**
 * How the sun strikes a section, as two continuous weights.
 */
export function sunIncidence(sunAzimuthDeg: number, sectionCompassDeg: number): SunIncidence {
  const angleDiffDeg = angularDistance(sunAzimuthDeg, sectionCompassDeg);
  const w = INCIDENCE_TRANSITION_HALF_WIDTH_DEG;
  const sunBehind = smoothstep((90 + w - angleDiffDeg) / (2 * w));
  return { angleDiffDeg, sunBehind, sunFacing: 1 - sunBehind };
}

/**
 * Horizontal reach of the shadow cast by a structure `heightFt` tall when the
 * sun sits `altitudeDeg` above the horizon: reach = height / tan(altitude).
 * Returns Infinity at or below the horizon.
 */
export function shadowReachFt(heightFt: number, altitudeDeg: number): number {
  if (altitudeDeg <= 0) return Infinity;
  const t = Math.tan((altitudeDeg * Math.PI) / 180);
  if (t <= 0) return Infinity;
  return heightFt / t;
}

// ---------------------------------------------------------------------------
// Bowl dimensions used when a section carries no per-row geometry.
// ---------------------------------------------------------------------------
// These are modelling assumptions, deliberately gathered in one place rather
// than scattered as magic numbers. They describe a generic MLB seating bowl:
//
//   backStructureHeightFt — height of whatever rises immediately behind a
//     level (the tier above it, its façade, the press box, the roof line).
//     This is the structure that throws shade FORWARD across the seats when
//     the sun is behind the section. A lower bowl is backed by the entire
//     upper deck, so it is large; an upper deck has only a modest rear façade.
//
//   deckDepthFt — front-to-back depth of one seating level, i.e. how far that
//     shadow has to reach to cover the whole level.
export const BOWL_DEFAULTS = {
  backStructureHeightFt: {
    field: 45,
    lower: 45,
    club: 35,
    upper: 14,
    suite: 45,
    standing: 30,
  } as Record<SeatingLevel, number>,
  deckDepthFt: {
    field: 30,
    lower: 60,
    club: 40,
    upper: 55,
    suite: 30,
    standing: 25,
  } as Record<SeatingLevel, number>,
  /**
   * Elevation angle of the stadium rim as seen from the seating bowl. Below
   * this the surrounding structure occludes the sun for essentially every
   * seat, whichever side it is on — which is why a 7:30 pm first pitch is
   * cooler everywhere, not just on one side.
   */
  rimAngleDeg: 12,
};

const levelOf = (level: SeatingLevel | undefined): SeatingLevel =>
  level && level in BOWL_DEFAULTS.backStructureHeightFt ? level : 'lower';

/**
 * Fraction of direct sun still reaching the bowl at all, 0–1. Fades to 0 as
 * the sun sinks behind the stadium rim. Applies equally to every section, so
 * it never changes which side is shadier — only how strong the sun is.
 */
export function horizonBlockFactor(altitudeDeg: number): number {
  if (altitudeDeg <= 0) return 0;
  return Math.min(1, altitudeDeg / BOWL_DEFAULTS.rimAngleDeg);
}

/**
 * Fraction of a seating level (0–1) covered by the shadow of the structure
 * BEHIND it. Only meaningful in the sun-behind regime; callers weight it by
 * `sunBehind`.
 *
 * At a 45° sun a lower bowl is ~75% shaded by the upper deck above and behind
 * it; by 20° it is fully shaded; at 70° (high noon) only ~27% is. An upper
 * deck, with little behind it, shows the opposite profile — exposed at noon,
 * picking up back-row shade only late.
 */
export function backStructureShadeFraction(
  altitudeDeg: number,
  level: SeatingLevel | undefined,
): number {
  if (altitudeDeg <= 0) return 1;
  const key = levelOf(level);
  const reach = shadowReachFt(BOWL_DEFAULTS.backStructureHeightFt[key], altitudeDeg);
  const depth = BOWL_DEFAULTS.deckDepthFt[key];
  if (!Number.isFinite(reach)) return 1;
  return Math.max(0, Math.min(1, reach / depth));
}

/**
 * Fraction of a row (0–1) shaded by an overhang lip ABOVE it when the sun is
 * in front, across the bowl. The lip's shadow lands `reach` feet back from the
 * lip; a seat `distanceBehindLipFt` behind it is shaded once the shadow gets
 * that far.
 *
 * `distanceBehindLipFt` must be a real measurement. Passing 0 or a missing
 * value used to mean "divide by ~zero" and pinned the row to 100% shade
 * forever; callers must now detect that case and fall back, so this function
 * reports 0 rather than fabricating full shade.
 */
export function overhangShadeFraction(
  altitudeDeg: number,
  overhangHeightFt: number | undefined,
  distanceBehindLipFt: number | undefined,
): number {
  if (altitudeDeg <= 0) return 1;
  if (!overhangHeightFt || overhangHeightFt <= 0) return 0;
  if (!distanceBehindLipFt || distanceBehindLipFt <= 0) return 0;
  const reach = shadowReachFt(overhangHeightFt, altitudeDeg);
  if (!Number.isFinite(reach)) return 1;
  return Math.max(0, Math.min(1, reach / distanceBehindLipFt));
}

/**
 * Section-level structural shade fraction, 0–1, blending both mechanisms by
 * incidence. This is the function every section-level model should call.
 *
 *   shade = sunBehind × (shadow of the structure behind the seats)
 *         + sunFacing × (shadow of the overhang lip above the seats)
 *
 * At `sunBehind = 1` the section sits in its own structure's shadow; at
 * `sunFacing = 1` it is lit except for whatever the lip above blocks. Between
 * the two the blend is smooth, so adjacent sections never jump tiers.
 */
export function structuralShadeFraction(params: {
  sunAltitudeDeg: number;
  sunAzimuthDeg: number;
  sectionCompassDeg: number;
  level?: SeatingLevel;
  /** Overhang above the seats, if the section has one. */
  overhangHeightFt?: number;
  /** How far the seats sit behind the overhang lip. */
  overhangDistanceFt?: number;
}): number {
  const { sunAltitudeDeg, sunAzimuthDeg, sectionCompassDeg, level } = params;
  if (sunAltitudeDeg <= 0) return 1;

  const { sunBehind, sunFacing } = sunIncidence(sunAzimuthDeg, sectionCompassDeg);
  const behindShade = backStructureShadeFraction(sunAltitudeDeg, level);
  const facingShade = overhangShadeFraction(
    sunAltitudeDeg,
    params.overhangHeightFt,
    params.overhangDistanceFt,
  );

  return Math.max(0, Math.min(1, sunBehind * behindShade + sunFacing * facingShade));
}

/**
 * Fraction of a section in DIRECT SUN, 0–100. The inverse of
 * `structuralShadeFraction`, damped by the rim occlusion factor so a sun
 * sitting just above the horizon reads as weak everywhere.
 *
 * This is geometry only. Cloud cover does not move the shadow line and must
 * not be folded in here — see the note in sectionSunCalculations.ts.
 */
export function directSunPercent(params: Parameters<typeof structuralShadeFraction>[0]): number {
  if (params.sunAltitudeDeg <= 0) return 0;
  const lit = 1 - structuralShadeFraction(params);
  return Math.max(0, Math.min(100, 100 * lit * horizonBlockFactor(params.sunAltitudeDeg)));
}
