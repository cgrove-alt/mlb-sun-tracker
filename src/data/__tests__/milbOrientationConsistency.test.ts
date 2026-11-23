import { MILB_FIELD_DIRECTIONS } from '../milbOrientationMeasurements';
import { ALL_MILB_STADIUMS } from '../milbStadiums';
import { MLB_STADIUMS } from '../stadiums';
import { ALL_UNIFIED_VENUES } from '../unifiedVenues';

const milbVenues = ALL_UNIFIED_VENUES.filter((venue) => venue.league === 'MiLB');

describe('MiLB park directions', () => {
  it('every MiLB venue has a measurement record', () => {
    expect(milbVenues.map((v) => v.id).sort()).toEqual(Object.keys(MILB_FIELD_DIRECTIONS).sort());
  });

  it.each(milbVenues.map((v) => [v.id, v] as const))('%s: venue data matches the measurement', (id, venue) => {
    const { orientation } = MILB_FIELD_DIRECTIONS[id];
    expect(venue.orientation).toBe(orientation);
    expect(ALL_MILB_STADIUMS.find((s) => s.id === id)?.orientation).toBe(orientation);
    const g = venue.seatingGeometry!;
    expect([g.primarySeatingAngle, g.endZone1Angle]).toEqual([orientation, orientation]);
    expect([g.sideline1Angle, g.sideline2Angle, g.endZone2Angle])
      .toEqual([(orientation + 90) % 360, (orientation + 270) % 360, (orientation + 180) % 360]);
  });

  it('one ballpark has one direction, whichever team plays there', () => {
    // Sutter Health Park is also an MLB park, measured on its own.
    const athletics = MLB_STADIUMS.find((s) => s.id === 'athletics')!;
    const riverCats = MILB_FIELD_DIRECTIONS['sacramento-river-cats'];
    expect(Math.abs(riverCats.orientation - athletics.orientation)).toBeLessThanOrEqual(riverCats.precisionDeg);
    // Both teams play at Roger Dean Chevrolet Stadium.
    expect(MILB_FIELD_DIRECTIONS['palm-beach-cardinals'].orientation)
      .toBe(MILB_FIELD_DIRECTIONS['jupiter-hammerheads'].orientation);
  });

  // Two values once came from satellite images under `method: 'photo'`, so a
  // re-run of the script measured something else.
  it.each(Object.entries(MILB_FIELD_DIRECTIONS))('%s: the value is the one its method gives', (_id, park) => {
    if (park.method === 'photo') {
      const [naip, usgs] = [...park.source.matchAll(/(?:NAIP|USGS) (\d+)° \(([\d.]+)\)/g)]
        .map(([, direction, score]) => ({ direction: Number(direction), score: Number(score) }));
      expect(park.orientation).toBe((naip.score >= usgs.score ? naip : usgs).direction);
    } else {
      const median = Number(park.source.match(/^.*?Sentinel-2 2025.*?median ([\d.]+)°/)?.[1]);
      expect(Math.abs(park.orientation - median)).toBeLessThanOrEqual(0.5);
    }
  });

  it('every value carries its error, the mound it was measured at and a source', () => {
    for (const park of Object.values(MILB_FIELD_DIRECTIONS)) {
      expect(park.precisionDeg).toBeGreaterThan(0);
      expect(park.mound).toHaveLength(2);
      expect(park.source.length).toBeGreaterThan(10);
    }
  });
});
