import { MLB_STADIUMS } from './stadiums';
import { NFL_STADIUMS } from './nflStadiums';
import { ALL_MILB_STADIUMS } from './milbStadiums';
import type { UnifiedVenue } from './unifiedVenues';

/**
 * Overlay shade-critical fields from the authored league sources onto the
 * generated `unifiedVenues.ts` dump.
 *
 * Root cause: `stadiums.ts` / `nflStadiums.ts` / `milbStadiums.ts` are the
 * files people edit, but the homepage, MobileApp, and MiLB/NFL pages read
 * `ALL_UNIFIED_VENUES`. Those copies drifted — Marlins orientation 135 vs
 * the GIS-measured 129.036, Athletics lat/lon off by ~1.6 km, Polar Park
 * off by ~1.1 km, and `primarySeatingAngle` still holding pre-correction
 * orientations. Timezone was tested for agreement; orientation/coords/roof
 * were not, so the next silent drift would have shipped again.
 */
type CanonicalGeometry = {
  latitude: number;
  longitude: number;
  orientation: number;
  timezone: string;
  roof?: UnifiedVenue['roof'];
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
  capacity: number;
  name: string;
  team: string;
  city: string;
  state: string;
};

function seatingFromOrientation(
  existing: UnifiedVenue['seatingGeometry'],
  orientation: number,
): UnifiedVenue['seatingGeometry'] | undefined {
  if (!existing) return existing;
  return {
    ...existing,
    primarySeatingAngle: orientation,
    endZone1Angle: orientation,
    endZone2Angle: (orientation + 180) % 360,
    sideline1Angle: (orientation + 90) % 360,
    sideline2Angle: (orientation + 270) % 360,
  };
}

function applySource(venue: UnifiedVenue, source: CanonicalGeometry): UnifiedVenue {
  return {
    ...venue,
    name: source.name,
    team: source.team,
    city: source.city,
    state: source.state,
    latitude: source.latitude,
    longitude: source.longitude,
    orientation: source.orientation,
    timezone: source.timezone,
    roof: source.roof ?? venue.roof,
    roofHeight: source.roofHeight ?? venue.roofHeight,
    roofOverhang: source.roofOverhang ?? venue.roofOverhang,
    upperDeckHeight: source.upperDeckHeight ?? venue.upperDeckHeight,
    capacity: source.capacity,
    seatingGeometry: seatingFromOrientation(venue.seatingGeometry, source.orientation),
  };
}

export function applyCanonicalVenueGeometry(venues: UnifiedVenue[]): UnifiedVenue[] {
  const mlb = new Map(MLB_STADIUMS.map((s) => [s.id, s]));
  const nfl = new Map(NFL_STADIUMS.map((s) => [s.id, s]));
  const milb = new Map(ALL_MILB_STADIUMS.map((s) => [s.id, s]));

  return venues.map((venue) => {
    if (venue.league === 'MLB') {
      const source = mlb.get(venue.id);
      return source ? applySource(venue, source) : venue;
    }
    if (venue.league === 'NFL') {
      const source = nfl.get(venue.id);
      return source ? applySource(venue, source) : venue;
    }
    if (venue.league === 'MiLB') {
      const source = milb.get(venue.id);
      return source ? applySource(venue, source) : venue;
    }
    return venue;
  });
}
