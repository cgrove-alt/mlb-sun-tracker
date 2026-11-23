/**
 * Which side of a ballpark has the sun at its back at a day game, for parks
 * without a seating map (MiLB).
 *
 * Seats face the field. When the sun is on their side of the park it shines on
 * their backs, so the rows behind them and any roof throw shade forward; the
 * seats across the field look into the sun.
 *
 * The sun's path comes from the NREL SPA (`solarPosition.ts`), sampled every
 * 15 minutes through a 1:05 PM game (the usual 2025 MiLB day start) on six
 * Sundays across the 2025 season. Each sample adds the sun's horizontal
 * direction (cos elevation), as in `nflSunSide.ts`. A side is named when it is
 * within 60° of the mean direction. The sun starts near due south but is in
 * the southwest for most of the game, so a fixed due-south sun names the wrong
 * side at many parks.
 *
 * `orientation` is the compass bearing from home plate to center field.
 */
import { getSolarPosition } from './solarPosition';
import { calendarDateAndTimeToUTC } from './stadiumTime';

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

/** The sides the sun is behind, the one it is most behind first; none when it is behind the outfield. */
export function dayGameShadeSides(venue: BallparkVenue): string[] {
  const rad = Math.PI / 180;
  let east = 0;
  let north = 0;
  for (const date of SEASON_SUNDAYS) {
    const start = calendarDateAndTimeToUTC(date, FIRST_PITCH.hour, FIRST_PITCH.minute, venue.timezone);
    for (let minutes = 0; minutes <= GAME_MINUTES; minutes += 15) {
      const sun = getSolarPosition(new Date(start.getTime() + minutes * 60_000), venue.latitude, venue.longitude);
      const horizontal = Math.cos(sun.altitudeDegrees * rad);
      east += horizontal * Math.sin(sun.azimuthDegrees * rad);
      north += horizontal * Math.cos(sun.azimuthDegrees * rad);
    }
  }
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
