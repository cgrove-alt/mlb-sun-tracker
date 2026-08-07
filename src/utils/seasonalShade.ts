/**
 * Seasonal shade copy derived from real solar geometry.
 *
 * The venue pages used to print a fixed sentence per month — the same words for
 * every park. "April: sun sits lower on the horizon" is true in Seattle and in
 * Miami, but by wildly different amounts: the sun's noon altitude in April is
 * about 55° in Seattle and about 73° in Miami, and the June-to-April swing is
 * roughly 16° in Miami versus 24° in Seattle. That difference is the whole
 * reason one park's overhangs shade meaningfully more in spring and another's
 * barely change.
 *
 * These helpers compute the actual peak sun altitude for a given latitude and
 * month with SunCalc, then describe what that geometry means for shade. Nothing
 * here is hand-written per park.
 */

import { getSunPosition } from './sunPosition';

/** Month numbers as used by the venue page (0 = January, matching Date). */
export type SeasonMonth = 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface SeasonalSunFacts {
  /** 0-indexed month. */
  month: number;
  /** Sun's altitude in degrees at its highest point on the sample date. */
  peakAltitudeDeg: number;
  /** Difference from the season's highest month (0 for that month). */
  degreesBelowPeakMonth: number;
}

/**
 * Highest sun altitude reached on a representative day of `month`.
 *
 * Samples across the day rather than trying to compute solar noon analytically,
 * which keeps this exactly consistent with the same SunCalc the shade engine
 * uses. The 15th is used as the representative day so the value reflects the
 * middle of the month rather than either edge.
 */
export function peakSunAltitude(
  latitude: number,
  longitude: number,
  month: number,
  year = 2025,
): number {
  let peak = -90;
  // Every 10 minutes across the day, in UTC — enough resolution that the
  // maximum is within ~0.1° of true solar noon at any latitude.
  for (let minutes = 0; minutes < 24 * 60; minutes += 10) {
    const d = new Date(Date.UTC(year, month, 15, 0, minutes));
    const alt = getSunPosition(d, latitude, longitude).altitudeDegrees;
    if (alt > peak) peak = alt;
  }
  return peak;
}

/** Peak sun altitude for each month of the baseball season. */
export function seasonalSunFacts(
  latitude: number,
  longitude: number,
  months: readonly number[],
  year = 2025,
): SeasonalSunFacts[] {
  const peaks = months.map(m => ({ month: m, peakAltitudeDeg: peakSunAltitude(latitude, longitude, m, year) }));
  const highest = Math.max(...peaks.map(p => p.peakAltitudeDeg));
  return peaks.map(p => ({
    ...p,
    degreesBelowPeakMonth: highest - p.peakAltitudeDeg,
  }));
}

/** A typical upper-deck lip height, used to express shadow reach in real feet. */
export const REFERENCE_OVERHANG_FT = 20;

/**
 * How far back into the bowl a `REFERENCE_OVERHANG_FT` lip throws shade at this
 * sun altitude: horizontal reach = height / tan(altitude).
 *
 * Deliberately an absolute length rather than a ratio against the peak month. A
 * ratio looks reasonable at mid latitudes but blows up where the summer sun is
 * nearly overhead — Miami's June sun at 87.5° gives tan ≈ 22, so April reads as
 * "556% further", which is arithmetically true and completely uninformative.
 * Feet of shadow is the thing a reader can actually picture.
 */
export function overhangShadowReachFt(altitudeDeg: number): number {
  const t = Math.tan((altitudeDeg * Math.PI) / 180);
  if (t <= 0) return Infinity;
  return REFERENCE_OVERHANG_FT / t;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * One sentence describing what this month's sun geometry means for shade at
 * this specific park. Uses the park's own computed altitude, not a template.
 */
export function seasonalShadeNote(
  facts: SeasonalSunFacts,
  seasonPeakDeg: number,
  stadiumName: string,
): string {
  const name = MONTH_NAMES[facts.month];
  const deg = Math.round(facts.peakAltitudeDeg);
  const below = Math.round(facts.degreesBelowPeakMonth);
  const reachFt = Math.round(overhangShadowReachFt(facts.peakAltitudeDeg));
  const peakReachFt = Math.round(overhangShadowReachFt(seasonPeakDeg));
  const extraFt = reachFt - peakReachFt;

  if (below <= 1) {
    return `${name}: the sun reaches about ${deg}° over ${stadiumName} — its highest of the season. ` +
      `A ${REFERENCE_OVERHANG_FT} ft deck lip throws only ~${reachFt} ft of shade at that angle, the shortest ` +
      `shadow of the year, so at a day game only genuinely covered seats stay out of the sun.`;
  }

  if (below >= 15) {
    return `${name}: the sun tops out near ${deg}°, about ${below}° lower than midsummer. ` +
      `The same ${REFERENCE_OVERHANG_FT} ft deck lip now reaches ~${reachFt} ft back into the bowl ` +
      `(${extraFt} ft more than at the season's peak), so distinctly more rows sit in shade — ` +
      `most noticeably for afternoon starts.`;
  }

  return `${name}: the sun peaks around ${deg}°, roughly ${below}° off its summer high. ` +
    `A ${REFERENCE_OVERHANG_FT} ft deck lip shades about ${reachFt} ft of seating (${extraFt} ft more than at peak), ` +
    `so covered and back-row seats fall into shade earlier in the afternoon.`;
}

/** Build the whole season's per-month copy for one venue. */
export function buildSeasonalShadeCopy(
  latitude: number,
  longitude: number,
  stadiumName: string,
  months: readonly number[],
  year = 2025,
): Array<{ month: number; name: string; peakAltitudeDeg: number; note: string }> {
  const facts = seasonalSunFacts(latitude, longitude, months, year);
  const seasonPeak = Math.max(...facts.map(f => f.peakAltitudeDeg));
  return facts.map(f => ({
    month: f.month,
    name: MONTH_NAMES[f.month],
    peakAltitudeDeg: f.peakAltitudeDeg,
    note: seasonalShadeNote(f, seasonPeak, stadiumName),
  }));
}
