import { ALL_UNIFIED_VENUES, UnifiedVenue } from '../data/unifiedVenues';
import { ALL_WORLD_CUP_VENUES } from '../data/worldcup2026/venues';
import { calculateDistance, kmToMiles } from './venueDistance';

export interface NearbyVenue {
  id: string;
  name: string;
  league: string;
  city: string;
  state?: string;
  distanceKm: number;
  distanceMiles: number;
}

export function getNearbyVenues(venueId: string, limit = 5): NearbyVenue[] {
  // Find the source venue from unified or WC venues
  const unifiedVenue = ALL_UNIFIED_VENUES.find(v => v.id === venueId);
  const wcVenue = ALL_WORLD_CUP_VENUES.find(v => v.id === venueId);

  const sourceLat = unifiedVenue?.latitude ?? wcVenue?.latitude;
  const sourceLon = unifiedVenue?.longitude ?? wcVenue?.longitude;

  if (sourceLat === undefined || sourceLon === undefined) {
    return [];
  }

  // Calculate distance to every other unified venue
  const candidates: NearbyVenue[] = [];

  for (const v of ALL_UNIFIED_VENUES) {
    if (v.id === venueId) continue;
    const distanceKm = calculateDistance(sourceLat, sourceLon, v.latitude, v.longitude);
    candidates.push({
      id: v.id,
      name: v.name,
      league: v.league,
      city: v.city,
      state: v.state,
      distanceKm,
      distanceMiles: kmToMiles(distanceKm),
    });
  }

  // Also include WC venues (if source is not a WC venue itself)
  for (const v of ALL_WORLD_CUP_VENUES) {
    if (v.id === venueId) continue;
    // Skip WC venues that share an NFL stadium already in unified venues
    if (v.nflStadiumId && ALL_UNIFIED_VENUES.some(u => u.id === v.nflStadiumId)) continue;
    const distanceKm = calculateDistance(sourceLat, sourceLon, v.latitude, v.longitude);
    candidates.push({
      id: v.id,
      name: v.commonName,
      league: 'World Cup 2026',
      city: v.city,
      distanceKm,
      distanceMiles: kmToMiles(distanceKm),
    });
  }

  // Sort by distance, return closest N
  candidates.sort((a, b) => a.distanceKm - b.distanceKm);
  return candidates.slice(0, limit);
}
