// Convert World Cup venues to UnifiedVenue format
// This allows World Cup to work seamlessly with the main workflow

import { UnifiedVenue } from './unifiedVenues';
import { ALL_WORLD_CUP_VENUES } from './worldcup2026/venues';

export const WORLD_CUP_UNIFIED_VENUES: UnifiedVenue[] = ALL_WORLD_CUP_VENUES.map(wcVenue => ({
  id: wcVenue.id,
  name: wcVenue.commonName,
  league: 'WorldCup' as const,
  team: `${wcVenue.city}, ${wcVenue.country}`,
  city: wcVenue.city,
  state: wcVenue.country, // Use country as state for World Cup
  country: wcVenue.country,
  latitude: wcVenue.latitude,
  longitude: wcVenue.longitude,
  orientation: wcVenue.fieldOrientation,
  capacity: wcVenue.soccerCapacity,
  roof: wcVenue.roof,
  timezone: wcVenue.timezone,
  venueType: 'soccer',
  sport: 'soccer',
  surface: wcVenue.surfaceType,
  opened: wcVenue.openingYear,
  address: `${wcVenue.city}, ${wcVenue.country}`,
  seatingGeometry: {
    bowlShape: 'oval',
    fieldDimensions: {
      length: wcVenue.fieldDimensions.length,
      width: wcVenue.fieldDimensions.width
    },
    endZoneOrientation: 'north-south',
    primarySeatingAngle: wcVenue.fieldOrientation,
    sideline1Angle: wcVenue.fieldOrientation + 90,
    sideline2Angle: wcVenue.fieldOrientation - 90,
    endZone1Angle: wcVenue.fieldOrientation,
    endZone2Angle: wcVenue.fieldOrientation + 180
  }
}));
