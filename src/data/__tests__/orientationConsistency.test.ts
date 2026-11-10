import { MLB_STADIUMS } from '../stadiums';
import { getUnifiedVenuesByLeague } from '../unifiedVenues';
import { getOrientationProvenance } from '../stadiumOrientationProvenance';
import { ORIENTATION_MEASUREMENTS } from '../orientationMeasurements';

// Orientation (home plate → center field bearing) drives every shade answer.
// stadiums.ts is the source of truth; section maps read it through
// getStadiumOrientation(). unifiedVenues.ts and the provenance record are
// separate hand-maintained files that the site also reads, so a corrected
// value must reach all of them. A fix that lands in only one file used to
// stay wrong in production through the other.

describe('MLB orientation consistency', () => {
  const unified = new Map(getUnifiedVenuesByLeague('MLB').map((v) => [v.id, v]));

  it.each(MLB_STADIUMS.map((s) => [s.id, s.orientation] as const))(
    '%s: unifiedVenues and provenance match stadiums.ts',
    (id, orientation) => {
      expect(unified.get(id)?.orientation).toBe(orientation);
      expect(getOrientationProvenance(id)?.orientation).toBe(orientation);
    },
  );

  it.each(ORIENTATION_MEASUREMENTS.map((m) => [m.stadiumId, m] as const))(
    '%s: stadiums.ts uses the measured orientation, and the measurements agree',
    (id, m) => {
      const stadium = MLB_STADIUMS.find((s) => s.id === id);
      expect(stadium?.orientation).toBe(m.orientationDeg);
      const provenance = getOrientationProvenance(id);
      expect(provenance?.method).toBe('gis-measured');
      expect(provenance?.precisionDeg).toBe(m.precisionDeg);
      for (const bearing of [m.bearingHomeToMoundDeg, m.bearingInfieldSymmetryDeg]) {
        expect(Math.abs(bearing - m.orientationDeg)).toBeLessThanOrEqual(m.precisionDeg);
      }
    },
  );

  it('Yankee Stadium points east-northeast (≈75°), not 55°', () => {
    expect(MLB_STADIUMS.find((s) => s.id === 'yankees')?.orientation).toBe(75);
  });
});
