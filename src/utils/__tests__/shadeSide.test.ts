import { ALL_UNIFIED_VENUES } from '../../data/unifiedVenues';
import { calendarDateAndTimeToUTC } from '../stadiumTime';
import { dayGameShadeSides, gameShade, shadeSides } from '../shadeSide';

// Directions measured on aerial photos (src/data/milbOrientationMeasurements.ts).
const park = (latitude: number, longitude: number, timezone: string, orientation: number) =>
  ({ latitude, longitude, timezone, orientation });
const buffalo = park(42.8806, -78.8736, 'America/New_York', 157);
const albuquerque = park(35.0698, -106.629, 'America/Denver', 45);
const birmingham = park(33.5077, -86.8126, 'America/Chicago', 104);
const akron = park(41.0778, -81.5217, 'America/New_York', 355);
const hillsboro = park(45.5536, -122.9085, 'America/Los_Angeles', 193);

describe('which side of a ballpark has the sun at its back at a day game', () => {
  it('a park facing northeast: behind home plate', () => {
    expect(dayGameShadeSides(albuquerque)).toEqual(['seating behind home plate']);
  });

  it('a park facing southeast: the first base side', () => {
    expect(dayGameShadeSides(buffalo)).toEqual(['first base side']);
  });

  it('names two sides when the sun is behind both, the one it is most behind first', () => {
    expect(dayGameShadeSides(birmingham)).toEqual(['seating behind home plate', 'first base side']);
    expect(dayGameShadeSides(akron)).toEqual(['seating behind home plate', 'third base side']);
  });

  it('names no side when the sun is behind the outfield', () => {
    expect(dayGameShadeSides(hillsboro)).toEqual([]);
  });

  it('follows the sun west instead of leaving it due south', () => {
    // Facing 60°, the first base side is at 150° and behind home plate at 240°.
    // A sun fixed at 180° picked first base.
    expect(dayGameShadeSides({ ...albuquerque, orientation: 60 })[0]).toBe('seating behind home plate');
  });
});

const at = (venue: { timezone: string }, date: string, hour: number, minute: number) =>
  calendarDateAndTimeToUTC(date, hour, minute, venue.timezone);

describe('which side has the sun at its back for one game', () => {
  it('a day game: the same as the day-game answer', () => {
    expect(shadeSides(buffalo, [at(buffalo, '2025-07-20', 13, 5)])).toEqual(['first base side']);
  });

  it('an evening game: the sun has moved to the west-northwest', () => {
    // Mean direction 288° (worked out with the NOAA equations, not this code).
    // Buffalo: first base is at 247°, behind home plate at 337°.
    expect(shadeSides(buffalo, [at(buffalo, '2025-07-20', 18, 35)]))
      .toEqual(['first base side', 'seating behind home plate']);
    // Albuquerque: third base is at 315°, behind home plate at 225°.
    expect(shadeSides(albuquerque, [at(albuquerque, '2025-07-20', 18, 35)]))
      .toEqual(['third base side']);
  });

  it('leaves out the part of the game after sunset', () => {
    // 7:05 PM on September 14: the sun sets at 7:26 PM at 273°. Counting it on
    // round to the north would add the seating behind home plate.
    expect(shadeSides(buffalo, [at(buffalo, '2025-09-14', 19, 5)])).toEqual(['first base side']);
  });

  it('null when the sun is down for the whole game', () => {
    expect(shadeSides(buffalo, [at(buffalo, '2025-09-14', 20, 5)])).toBeNull();
  });

  it('every MiLB park: the day answer is the six Sundays put together', () => {
    for (const venue of ALL_UNIFIED_VENUES.filter((v) => v.league === 'MiLB')) {
      const starts = ['2025-04-13', '2025-05-18', '2025-06-15', '2025-07-20', '2025-08-24', '2025-09-14']
        .map((date) => at(venue, date, 13, 5));
      expect(dayGameShadeSides(venue)).toEqual(shadeSides(venue, starts));
    }
  });
});

describe("what the finder says about one game, in the park's own time", () => {
  it('a day game', () => {
    expect(gameShade(buffalo, at(buffalo, '2025-07-20', 13, 5))).toEqual({
      time: '1:05 PM', date: 'July 20', sides: ['first base side'], sunset: undefined,
    });
  });

  it('gives the sunset when it falls during the game', () => {
    // Sunset in Buffalo on 2025-07-20 is 8:48 PM.
    expect(gameShade(buffalo, at(buffalo, '2025-07-20', 18, 35)).sunset).toBe('8:48 PM');
    expect(gameShade(buffalo, at(buffalo, '2025-07-20', 16, 5)).sunset).toBeUndefined();
  });

  it('a game after sunset', () => {
    expect(gameShade(buffalo, at(buffalo, '2025-09-14', 20, 5))).toEqual({
      time: '8:05 PM', date: 'September 14', sides: null, sunset: undefined,
    });
  });

  it("uses the park's time zone", () => {
    expect(gameShade(albuquerque, new Date('2025-07-21T00:35:00Z'))).toMatchObject({
      time: '6:35 PM', date: 'July 20',
    });
  });
});
