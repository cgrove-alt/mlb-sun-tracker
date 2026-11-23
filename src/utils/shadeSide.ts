/**
 * Which side of a ballpark has the sun at its back during a game, for parks
 * without a seating map (MiLB).
 *
 * Seats face the field. When the sun is on their side of the park it shines on
 * their backs, so the rows behind them and any roof throw shade forward; the
 * seats across the field look into the sun.
 *
 * The sun's path comes from the NREL SPA (`solarPosition.ts`), sampled every
 * 15 minutes through the game while the sun is up. Each sample adds the sun's
 * horizontal direction (cos elevation), as in `nflSunSide.ts`. A side is named
 * when it is within 60° of the mean direction.
 *
 * The park's page answers for a 1:05 PM game (the usual 2025 MiLB day start) on
 * six Sundays across the 2025 season. The sun starts near due south but is in
 * the southwest for most of the game, so a fixed due-south sun names the wrong
 * side at many parks. The finder answers for the game the fan picked: most are
 * in the evening, when the sun is in the west.
 *
 * `orientation` is the compass bearing from home plate to center field.
 */
import { getSolarPosition, getSunTimes } from './solarPosition';
import { calendarDateAndTimeToUTC, formatStadiumLocal } from './stadiumTime';

const SEASON_SUNDAYS = ['2025-04-13', '2025-05-18', '2025-06-15', '2025-07-20', '2025-08-24', '2025-09-14'];
const FIRST_PITCH = { hour: 13, minute: 5 };
const GAME_MINUTES = 180;
const SUN_BEHIND_WITHIN_DEG = 60;

/** Each reads after "the". Offsets are from the direction the park faces. */
const SIDES = [
  { name: 'first base side', offset: 90 },
  { name: 'third base side', offset: -90 },
  { name: 'seating behind home plate', offset: 180 },
];

export interface BallparkVenue {
  latitude: number;
  longitude: number;
  timezone: string;
  orientation: number;
}

/** What the finder says about one game, in the park's own time. */
export interface GameShade {
  time: string;
  date: string;
  /** null when the sun is down for the whole game. */
  sides: string[] | null;
  /** Only when the sun sets during the game. */
  sunset?: string;
}

/**
 * The sides the sun is behind during games at these times, the one it is most
 * behind first; none when it is behind the outfield, null when it is down.
 */
export function shadeSides(venue: BallparkVenue, starts: Date[]): string[] | null {
  const rad = Math.PI / 180;
  let east = 0;
  let north = 0;
  let samples = 0;
  for (const start of starts) {
    for (let minutes = 0; minutes <= GAME_MINUTES; minutes += 15) {
      const sun = getSolarPosition(new Date(start.getTime() + minutes * 60_000), venue.latitude, venue.longitude);
      if (sun.altitudeDegrees <= 0) continue;
      const horizontal = Math.cos(sun.altitudeDegrees * rad);
      east += horizontal * Math.sin(sun.azimuthDegrees * rad);
      north += horizontal * Math.cos(sun.azimuthDegrees * rad);
      samples += 1;
    }
  }
  if (samples === 0) return null;
  const sunDirection = Math.atan2(east, north) / rad;
  return SIDES
    .map(({ name, offset }) => {
      const apart = (((sunDirection - venue.orientation - offset) % 360) + 360) % 360;
      return { name, degreesFromSun: Math.min(apart, 360 - apart) };
    })
    .filter((side) => side.degreesFromSun <= SUN_BEHIND_WITHIN_DEG)
    .sort((a, b) => a.degreesFromSun - b.degreesFromSun)
    .map((side) => side.name);
}

/** The sides that shade first at a day game (the park's page). */
export function dayGameShadeSides(venue: BallparkVenue): string[] {
  const starts = SEASON_SUNDAYS.map((date) =>
    calendarDateAndTimeToUTC(date, FIRST_PITCH.hour, FIRST_PITCH.minute, venue.timezone));
  return shadeSides(venue, starts) ?? [];
}

/** The same for the game the fan picked (the finder). */
export function gameShade(venue: BallparkVenue, start: Date): GameShade {
  const { sunset } = getSunTimes(start, venue.latitude, venue.longitude);
  const end = start.getTime() + GAME_MINUTES * 60_000;
  const setsDuringGame = sunset.getTime() > start.getTime() && sunset.getTime() < end;
  return {
    time: formatStadiumLocal(start, venue.timezone, 'h:mm a'),
    date: formatStadiumLocal(start, venue.timezone, 'MMMM d'),
    sides: shadeSides(venue, [start]),
    sunset: setsDuringGame ? formatStadiumLocal(sunset, venue.timezone, 'h:mm a') : undefined,
  };
}
