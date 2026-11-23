/**
 * A game's start in the venue's own time, and the sunset when it falls during
 * the game. Used by the finder's answers (`shadeSide.ts`, `nflSunSide.ts`).
 */
import { getSunTimes } from './solarPosition';
import { formatStadiumLocal } from './stadiumTime';

export interface GameClock {
  time: string;
  date: string;
  /** Only when the sun sets during the game. */
  sunset?: string;
}

export function gameClock(
  venue: { latitude: number; longitude: number; timezone: string },
  start: Date,
  minutes: number,
): GameClock {
  const { sunset } = getSunTimes(start, venue.latitude, venue.longitude);
  const end = start.getTime() + minutes * 60_000;
  const setsDuringGame = sunset.getTime() > start.getTime() && sunset.getTime() < end;
  return {
    time: formatStadiumLocal(start, venue.timezone, 'h:mm a'),
    date: formatStadiumLocal(start, venue.timezone, 'MMMM d'),
    sunset: setsDuringGame ? formatStadiumLocal(sunset, venue.timezone, 'h:mm a') : undefined,
  };
}
