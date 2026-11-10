import { compassName, fieldSunSide } from '../nflSunSide';

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

describe('compass names', () => {
  it('rounds to the nearest of eight points', () => {
    expect([0, 22, 23, 90, 181, 292, 338, -45].map(compassName))
      .toEqual(['north', 'north', 'northeast', 'east', 'south', 'west', 'north', 'northwest']);
  });
});
