import { compassName, fieldSunSide, fieldSunSideAt, nflGameShade } from '../nflSunSide';

const chicago = { latitude: 41.8623, longitude: -87.6167, timezone: 'America/Chicago' };

describe('which sideline has the sun at its back', () => {
  it('north–south field: the west sideline shades, the east sideline and north end zone face the sun', () => {
    const side = fieldSunSide({ ...chicago, orientation: 0 });
    expect(side.shadedSideline).toBe('west');
    expect(side.sunnySideline).toBe('east');
    expect(side.sunFacingEndZone).toBe('north');
    expect(side.clear).toBe(true);
  });

  it('east–west field: the south sideline shades (the sun stays in the southern sky)', () => {
    const side = fieldSunSide({ ...chicago, orientation: 90 });
    expect(side.shadedSideline).toBe('south');
    expect(side.sunnySideline).toBe('north');
    expect(side.sunFacingEndZone).toBe('east');
    expect(side.clear).toBe(true);
  });

  it('depends only on the axis, not which end is listed first', () => {
    expect(fieldSunSide({ ...chicago, orientation: 190 })).toEqual(fieldSunSide({ ...chicago, orientation: 10 }));
  });

  it('says so when the sun runs along the field', () => {
    // Axis pointing at the mid-game sun (southwest): neither sideline is favored.
    const side = fieldSunSide({ ...chicago, orientation: 45 });
    expect(side.clear).toBe(false);
    expect(side.sunFacingEndZone).toBe('northeast');
  });

  it('a 4:25 PM kickoff on the same field still favors the west sideline', () => {
    expect(fieldSunSide({ ...chicago, orientation: 0 }, '2025-09-14', { hour: 16, minute: 25 }).shadedSideline).toBe('west');
  });
});

describe('the end zone with the sun at its back', () => {
  it('is named when the sun is nearly as much behind it as behind the sideline', () => {
    // 1:00 PM on a north–south field: the sun goes from south to west-southwest.
    expect(fieldSunSide({ ...chicago, orientation: 0 }).shadedEndZone).toBe('south');
  });

  it('is not named when the sun is square across the field', () => {
    expect(fieldSunSide({ ...chicago, orientation: 0 }, '2025-09-14', { hour: 16, minute: 25 }).shadedEndZone).toBeNull();
  });

  it('is named when the sun runs along the field', () => {
    const side = fieldSunSide({ ...chicago, orientation: 45 });
    expect(side.clear).toBe(false);
    expect(side.shadedEndZone).toBe('southwest');
  });

  it('is across the field from the one that faces the sun', () => {
    const opposite: Record<string, string> = {
      north: 'south', south: 'north', east: 'west', west: 'east',
      northeast: 'southwest', southwest: 'northeast', northwest: 'southeast', southeast: 'northwest',
    };
    let named = 0;
    for (let orientation = 0; orientation < 180; orientation += 5) {
      const side = fieldSunSide({ ...chicago, orientation });
      if (!side.shadedEndZone) continue;
      named += 1;
      expect(side.shadedEndZone).toBe(opposite[side.sunFacingEndZone]);
    }
    expect(named).toBeGreaterThan(0);
  });
});

describe('the answer for one game', () => {
  const field = { ...chicago, orientation: 0 };

  it('is the same as for that date and kickoff', () => {
    // 1:00 PM in Chicago on September 14, 2025.
    expect(fieldSunSideAt(field, new Date('2025-09-14T18:00:00Z')))
      .toEqual(fieldSunSide(field, '2025-09-14', { hour: 13, minute: 0 }));
  });

  it('is null when the sun is down for the whole game', () => {
    expect(fieldSunSideAt(field, new Date('2025-11-16T01:20:00Z'))).toBeNull();
  });

  it('counts only the part of the game with the sun up', () => {
    // 3:25 PM in Chicago on November 16, 2025: the sun sets at about 4:28 PM.
    expect(fieldSunSideAt(field, new Date('2025-11-16T21:25:00Z'))?.shadedSideline).toBe('west');
  });

  it('gives the kickoff in the stadium\'s own time, and the sunset when it falls during the game', () => {
    const game = nflGameShade(field, new Date('2025-11-16T21:25:00Z'));
    expect(game).toMatchObject({ time: '3:25 PM', date: 'November 16' });
    expect(game.sunset).toMatch(/^4:2\d PM$/);
    expect(game.side?.shadedSideline).toBe('west');
  });

  it('gives no sunset for a game that ends before it', () => {
    const game = nflGameShade(field, new Date('2025-09-14T18:00:00Z'));
    expect(game).toMatchObject({ time: '1:00 PM', date: 'September 14' });
    expect(game.sunset).toBeUndefined();
  });

  it('says the sun is down for a night game', () => {
    expect(nflGameShade(field, new Date('2025-11-16T01:20:00Z')).side).toBeNull();
  });
});

describe('compass names', () => {
  it('rounds to the nearest of eight points', () => {
    expect([0, 22, 23, 90, 181, 292, 338, -45].map(compassName))
      .toEqual(['north', 'north', 'northeast', 'east', 'south', 'west', 'north', 'northwest']);
  });
});
