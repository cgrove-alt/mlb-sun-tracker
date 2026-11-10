/**
 * Which side of a football field has the sun at its back during a game.
 *
 * Seats on a sideline face the field. When the sun is on that sideline's side
 * of the field, it shines on the backs of those seats, so the rows and the
 * overhang behind them throw shade forward; the opposite sideline looks into
 * the sun. The same holds for the end zones.
 *
 * The sun's path comes from the NREL SPA (`solarPosition.ts`), sampled every
 * 15 minutes through the game. Each sample adds the sun's horizontal
 * direction (cos elevation) projected across and along the field.
 *
 * `orientation` is the field's long axis in compass degrees (end zone to end
 * zone, 0 = north–south). Only the axis matters, so 10° and 190° agree.
 */
import { getSolarPosition } from './solarPosition';
import { calendarDateAndTimeToUTC } from './stadiumTime';

/** A Sunday 1:00 PM kickoff in Week 2 of the 2025 season: early-season heat. */
export const EARLY_SEASON_DATE = '2025-09-14';
export const KICKOFF = { hour: 13, minute: 0 };
export const GAME_MINUTES = 180;

/**
 * Below this, the sun favors neither sideline enough to name one (the sun
 * runs along the field). 0.2 means the across-field share of the sun's
 * horizontal direction averages under about a fifth.
 */
export const CLEAR_SIDELINE = 0.2;

export interface FieldVenue {
  latitude: number;
  longitude: number;
  timezone: string;
  orientation: number;
}

export interface FieldSunSide {
  /** Where the seats with the sun at their backs are: 'west' means the west sideline. */
  shadedSideline: string;
  sunnySideline: string;
  /** End zone whose seats look into the sun. */
  sunFacingEndZone: string;
  /** Mean across-field share of the sun's horizontal direction, 0–1. */
  sidelineContrast: number;
  /** False when the sun runs along the field and neither sideline has a clear edge. */
  clear: boolean;
}

const COMPASS = ['north', 'northeast', 'east', 'southeast', 'south', 'southwest', 'west', 'northwest'];

export function compassName(degrees: number): string {
  const d = ((degrees % 360) + 360) % 360;
  return COMPASS[Math.round(d / 45) % 8];
}

export function fieldSunSide(
  venue: FieldVenue,
  date = EARLY_SEASON_DATE,
  kickoff = KICKOFF,
): FieldSunSide {
  const start = calendarDateAndTimeToUTC(date, kickoff.hour, kickoff.minute, venue.timezone);
  const across = venue.orientation + 90; // where one sideline is, seen from midfield
  const rad = Math.PI / 180;
  let acrossSum = 0;
  let alongSum = 0;
  let samples = 0;
  for (let minutes = 0; minutes <= GAME_MINUTES; minutes += 15) {
    const sun = getSolarPosition(new Date(start.getTime() + minutes * 60_000), venue.latitude, venue.longitude);
    if (sun.altitudeDegrees <= 0) continue;
    const horizontal = Math.cos(sun.altitudeDegrees * rad);
    acrossSum += horizontal * Math.cos((sun.azimuthDegrees - across) * rad);
    alongSum += horizontal * Math.cos((sun.azimuthDegrees - venue.orientation) * rad);
    samples += 1;
  }
  if (samples === 0) throw new Error('fieldSunSide: the sun is down for the whole game');
  const acrossMean = acrossSum / samples;
  const alongMean = alongSum / samples;
  const shaded = acrossMean >= 0 ? across : across + 180;
  // End-zone seats face the field, so the end away from the sun looks into it.
  const sunFacing = alongMean >= 0 ? venue.orientation + 180 : venue.orientation;
  return {
    shadedSideline: compassName(shaded),
    sunnySideline: compassName(shaded + 180),
    sunFacingEndZone: compassName(sunFacing),
    sidelineContrast: Math.abs(acrossMean),
    clear: Math.abs(acrossMean) >= CLEAR_SIDELINE,
  };
}

/** The three usual NFL kickoff windows. */
export const LATE_KICKOFF = { hour: 16, minute: 25 };
export const NIGHT_KICKOFF = { hour: 20, minute: 20 };

export interface KickoffSunSides {
  early: FieldSunSide;
  late: FieldSunSide;
  /** True when the sun has set by a prime-time kickoff on the same date. */
  nightAfterSunset: boolean;
}

export function kickoffSunSides(venue: FieldVenue, date = EARLY_SEASON_DATE): KickoffSunSides {
  const night = calendarDateAndTimeToUTC(date, NIGHT_KICKOFF.hour, NIGHT_KICKOFF.minute, venue.timezone);
  return {
    early: fieldSunSide(venue, date, KICKOFF),
    late: fieldSunSide(venue, date, LATE_KICKOFF),
    nightAfterSunset: getSolarPosition(night, venue.latitude, venue.longitude).altitudeDegrees <= 0,
  };
}
