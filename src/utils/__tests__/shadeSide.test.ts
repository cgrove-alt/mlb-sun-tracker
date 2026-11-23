import { dayGameShadeSides } from '../shadeSide';

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
