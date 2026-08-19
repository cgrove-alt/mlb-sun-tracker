// Shared orientation → shaded-side helper (audit Phase 3/4).
//
// Uses the same compass model as StadiumPageSSR and sectionSunCalculations:
// `orientation` is the compass bearing from home plate to center field
// (baseball) or the field long-axis (football, 0 = north).
// Returns the side of the park that falls into shade first for a ~1 PM day
// game, so on-page copy and JSON-LD FAQ answers agree and are orientation-aware
// (e.g. an east-facing park like Yankee Stadium correctly yields the first base
// side, not a naive orientation<180 guess).

import { sectionCompassAngle, sunIncidence } from './bowlGeometry';

export type ShadeVenueType = 'baseball' | 'football';

export type BaseballBaselineSide = 'first base side' | 'third base side';

/**
 * Which baseline sits in its own grandstand's shadow at this sun azimuth.
 * Uses the same incidence model as the calculators, not a "3B is always shade" rule.
 */
export function baseballShadedBaseline(
  orientation: number,
  sunAzimuthDeg: number,
): BaseballBaselineSide {
  const first = sunIncidence(
    sunAzimuthDeg,
    sectionCompassAngle({ baseAngle: 0, angleSpan: 0 }, orientation),
  );
  const third = sunIncidence(
    sunAzimuthDeg,
    sectionCompassAngle({ baseAngle: 180, angleSpan: 0 }, orientation),
  );
  return first.sunBehind >= third.sunBehind ? 'first base side' : 'third base side';
}

export function baseballSunnyBaseline(
  orientation: number,
  sunAzimuthDeg: number,
): BaseballBaselineSide {
  return baseballShadedBaseline(orientation, sunAzimuthDeg) === 'first base side'
    ? 'third base side'
    : 'first base side';
}

const normalize = (deg: number): number => ((deg % 360) + 360) % 360;

const compassOf = (
  orientation: number,
  side: 'firstBase' | 'thirdBase' | 'behindHome' | 'centerField',
): number => {
  const offset =
    side === 'firstBase' ? 90 : side === 'thirdBase' ? -90 : side === 'behindHome' ? 180 : 0;
  return normalize(orientation + offset);
};

const angularDistance = (a: number, b: number): number => {
  const d = Math.abs(normalize(a) - normalize(b));
  return d > 180 ? 360 - d : d;
};

const cardinalName = (bearing: number): string => {
  const n = normalize(bearing);
  if (n < 22.5 || n >= 337.5) return 'north';
  if (n < 67.5) return 'northeast';
  if (n < 112.5) return 'east';
  if (n < 157.5) return 'southeast';
  if (n < 202.5) return 'south';
  if (n < 247.5) return 'southwest';
  if (n < 292.5) return 'west';
  return 'northwest';
};

// Approximate midday (1 PM) sun azimuth in NH summer at mid-latitudes: ~S.
const MIDDAY_SUN_AZIMUTH = 180;

function closestToMiddaySun<T extends { compass: number }>(sides: T[]): T {
  let best = sides[0];
  let bestDiff = 360;
  for (const s of sides) {
    const d = angularDistance(MIDDAY_SUN_AZIMUTH, s.compass);
    if (d < bestDiff) {
      bestDiff = d;
      best = s;
    }
  }
  return best;
}

// Every baseball caller renders this as "the {phrase} falls into shade first"
// or "Shade first on the {phrase}", so the phrases have to read grammatically
// after a definite article.
export function bestShadedSideForDayGame(
  orientation: number,
  venueType: ShadeVenueType = 'baseball',
): string {
  if (venueType === 'football') {
    // Field long-axis = orientation. End zones sit on that axis; sidelines
    // are 90° off. Name the winning side by its actual compass bearing so an
    // east-west field is not labelled "north end zone".
    const sides = [
      { axis: true, compass: normalize(orientation) },
      { axis: true, compass: normalize(orientation + 180) },
      { axis: false, compass: normalize(orientation + 90) },
      { axis: false, compass: normalize(orientation + 270) },
    ];
    const best = closestToMiddaySun(sides);
    const dir = cardinalName(best.compass);
    return best.axis ? `${dir} end zone` : `${dir} sideline`;
  }

  const sides = [
    { name: 'first base side', compass: compassOf(orientation, 'firstBase') },
    { name: 'third base side', compass: compassOf(orientation, 'thirdBase') },
    { name: 'seating behind home plate', compass: compassOf(orientation, 'behindHome') },
    { name: 'outfield seating beyond center field', compass: compassOf(orientation, 'centerField') },
  ];
  return closestToMiddaySun(sides).name;
}
