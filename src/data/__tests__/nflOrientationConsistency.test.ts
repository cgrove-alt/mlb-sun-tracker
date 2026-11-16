import { NFL_FIELD_AXES, isFieldAxisMeasured } from '../nflOrientationMeasurements';
import { NFL_STADIUMS } from '../nflStadiums';
import { ALL_UNIFIED_VENUES } from '../unifiedVenues';

const nflVenues = ALL_UNIFIED_VENUES.filter((venue) => venue.league === 'NFL');

describe('NFL field directions', () => {
  it('every NFL venue has a measurement record', () => {
    expect(nflVenues.map((v) => v.id).sort()).toEqual(Object.keys(NFL_FIELD_AXES).sort());
  });

  it.each(nflVenues.map((v) => [v.id, v]))('%s: venue data matches the measurement', (id, venue) => {
    const axis = NFL_FIELD_AXES[id as string];
    expect(venue.orientation).toBe(axis.orientation);
    expect(NFL_STADIUMS.find((s) => s.id === id)?.orientation).toBe(axis.orientation);
    const g = venue.seatingGeometry!;
    expect([g.primarySeatingAngle, g.endZone1Angle]).toEqual([axis.orientation, axis.orientation]);
    expect([g.sideline1Angle, g.sideline2Angle, g.endZone2Angle])
      .toEqual([(axis.orientation + 90) % 360, (axis.orientation + 270) % 360, (axis.orientation + 180) % 360]);
  });

  it('only covered fields are left unmeasured', () => {
    for (const venue of nflVenues) {
      if (!isFieldAxisMeasured(venue.id)) expect([venue.id, venue.roof]).not.toEqual([venue.id, 'open']);
    }
  });

  it('both MetLife teams share one field', () => {
    expect(NFL_FIELD_AXES['metlife-stadium-giants'].orientation).toBe(NFL_FIELD_AXES['metlife-stadium-jets'].orientation);
  });

  it('measured values carry their precision and source', () => {
    for (const axis of Object.values(NFL_FIELD_AXES)) {
      expect(axis.source.length).toBeGreaterThan(10);
      if (axis.method !== 'not-measured') expect(axis.precisionDeg).toBeGreaterThan(0);
    }
  });
});
