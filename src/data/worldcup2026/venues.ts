// 2026 FIFA World Cup Venue Database
// All 16 World Cup stadiums with row-level data

import { WorldCupVenue } from './types';

// Import NFL stadium sections for dual-use venues (11 USA stadiums)
import { metlifestadiumgiantsSections } from '../sections/nfl/metlife-stadium-giants';
import { sofistadiumramsSections } from '../sections/nfl/sofi-stadium-rams';
import { attstadiumSections } from '../sections/nfl/at-t-stadium';
import { mercedesbenzstadiumSections } from '../sections/nfl/mercedes-benz-stadium';
import { gehafieldarrowheadSections } from '../sections/nfl/geha-field-arrowhead';
import { hardrockstadiumSections } from '../sections/nfl/hard-rock-stadium';
import { lincolnfinancialfieldSections } from '../sections/nfl/lincoln-financial-field';
import { levisstadiumSections } from '../sections/nfl/levis-stadium';
import { gillettestadiumSections } from '../sections/nfl/gillette-stadium';
import { nrgstadiumSections } from '../sections/nfl/nrg-stadium';
import { lumenfieldSections } from '../sections/nfl/lumen-field';

/**
 * World Cup 2026 USA Venues (11 stadiums)
 * All adapted from existing NFL stadium configurations with row-level data
 */

export const WORLD_CUP_USA_VENUES: WorldCupVenue[] = [
  {
    id: 'metlife-stadium-wc',
    fifaName: 'New York New Jersey Stadium',
    commonName: 'MetLife Stadium',
    city: 'East Rutherford',
    country: 'USA',
    latitude: 40.8135,
    longitude: -74.0745,
    timezone: 'America/New_York',
    capacity: 82500,
    soccerCapacity: 87000,  // Increased capacity for soccer configuration
    nflStadiumId: 'metlife-stadium-giants',
    basedOnNFLStadium: true,
    sectionMapping: {},  // Direct mapping (same sections for soccer)
    fieldOrientation: 90,  // Soccer field orientation (may differ from NFL)
    fieldDimensions: {
      length: 110,  // meters (FIFA regulation)
      width: 75     // meters (FIFA regulation)
    },
    sections: metlifestadiumgiantsSections,
    openingYear: 2010,
    surfaceType: 'grass',
    roof: 'open',
    hostMatches: 8  // Final venue
  },
  {
    id: 'sofi-stadium-wc',
    fifaName: 'Los Angeles Stadium',
    commonName: 'SoFi Stadium',
    city: 'Inglewood',
    country: 'USA',
    latitude: 33.9535,
    longitude: -118.3392,
    timezone: 'America/Los_Angeles',
    capacity: 70240,
    soccerCapacity: 70000,
    nflStadiumId: 'sofi-stadium-rams',
    basedOnNFLStadium: true,
    sectionMapping: {},
    fieldOrientation: 93,
    fieldDimensions: {
      length: 110,
      width: 75
    },
    sections: sofistadiumramsSections,
    openingYear: 2020,
    surfaceType: 'artificial',
    roof: 'fixed',
    hostMatches: 8
  },
  {
    id: 'att-stadium-wc',
    fifaName: 'Dallas Stadium',
    commonName: 'AT&T Stadium',
    city: 'Arlington',
    country: 'USA',
    latitude: 32.7473,
    longitude: -97.0945,
    timezone: 'America/Chicago',
    capacity: 80000,
    soccerCapacity: 92967,  // Can expand significantly for soccer
    nflStadiumId: 'att-stadium',
    basedOnNFLStadium: true,
    sectionMapping: {},
    fieldOrientation: 90,
    fieldDimensions: {
      length: 110,
      width: 75
    },
    sections: attstadiumSections,
    openingYear: 2009,
    surfaceType: 'artificial',
    roof: 'retractable',
    hostMatches: 9  // Semifinal venue
  },
  {
    id: 'mercedes-benz-stadium-wc',
    fifaName: 'Atlanta Stadium',
    commonName: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
    country: 'USA',
    latitude: 33.7555,
    longitude: -84.4006,
    timezone: 'America/New_York',
    capacity: 71000,
    soccerCapacity: 75000,
    nflStadiumId: 'mercedes-benz-stadium',
    basedOnNFLStadium: true,
    sectionMapping: {},
    fieldOrientation: 0,
    fieldDimensions: {
      length: 110,
      width: 75
    },
    sections: mercedesbenzstadiumSections,
    openingYear: 2017,
    surfaceType: 'artificial',
    roof: 'retractable',
    hostMatches: 8
  },
  {
    id: 'arrowhead-stadium-wc',
    fifaName: 'Kansas City Stadium',
    commonName: 'Arrowhead Stadium (GEHA Field)',
    city: 'Kansas City',
    country: 'USA',
    latitude: 39.0489,
    longitude: -94.4839,
    timezone: 'America/Chicago',
    capacity: 76416,
    soccerCapacity: 76000,
    nflStadiumId: 'geha-field-arrowhead',
    basedOnNFLStadium: true,
    sectionMapping: {},
    fieldOrientation: 0,
    fieldDimensions: {
      length: 110,
      width: 75
    },
    sections: gehafieldarrowheadSections,
    openingYear: 1972,
    surfaceType: 'grass',
    roof: 'open',
    hostMatches: 6
  },
  {
    id: 'hard-rock-stadium-wc',
    fifaName: 'Miami Stadium',
    commonName: 'Hard Rock Stadium',
    city: 'Miami Gardens',
    country: 'USA',
    latitude: 25.9580,
    longitude: -80.2389,
    timezone: 'America/New_York',
    capacity: 64767,
    soccerCapacity: 67000,
    nflStadiumId: 'hard-rock-stadium',
    basedOnNFLStadium: true,
    sectionMapping: {},
    fieldOrientation: 35,
    fieldDimensions: {
      length: 110,
      width: 75
    },
    sections: hardrockstadiumSections,
    openingYear: 1987,
    surfaceType: 'grass',
    roof: 'open',  // Partial canopy
    hostMatches: 7  // Third place match venue
  },
  {
    id: 'lincoln-financial-field-wc',
    fifaName: 'Philadelphia Stadium',
    commonName: 'Lincoln Financial Field',
    city: 'Philadelphia',
    country: 'USA',
    latitude: 39.9008,
    longitude: -75.1675,
    timezone: 'America/New_York',
    capacity: 69596,
    soccerCapacity: 69000,
    nflStadiumId: 'lincoln-financial-field',
    basedOnNFLStadium: true,
    sectionMapping: {},
    fieldOrientation: 45,
    fieldDimensions: {
      length: 110,
      width: 75
    },
    sections: lincolnfinancialfieldSections,
    openingYear: 2003,
    surfaceType: 'grass',
    roof: 'open',
    hostMatches: 6
  },
  {
    id: 'levis-stadium-wc',
    fifaName: 'San Francisco Bay Area Stadium',
    commonName: "Levi's Stadium",
    city: 'Santa Clara',
    country: 'USA',
    latitude: 37.4032,
    longitude: -121.9698,
    timezone: 'America/Los_Angeles',
    capacity: 68500,
    soccerCapacity: 70000,
    nflStadiumId: 'levis-stadium',
    basedOnNFLStadium: true,
    sectionMapping: {},
    fieldOrientation: 43,
    fieldDimensions: {
      length: 110,
      width: 75
    },
    sections: levisstadiumSections,
    openingYear: 2014,
    surfaceType: 'grass',
    roof: 'open',
    hostMatches: 6
  },
  {
    id: 'gillette-stadium-wc',
    fifaName: 'Boston Stadium',
    commonName: 'Gillette Stadium',
    city: 'Foxborough',
    country: 'USA',
    latitude: 42.0909,
    longitude: -71.2643,
    timezone: 'America/New_York',
    capacity: 65878,
    soccerCapacity: 65000,
    nflStadiumId: 'gillette-stadium',
    basedOnNFLStadium: true,
    sectionMapping: {},
    fieldOrientation: 0,
    fieldDimensions: {
      length: 110,
      width: 75
    },
    sections: gillettestadiumSections,
    openingYear: 2002,
    surfaceType: 'artificial',
    roof: 'open',
    hostMatches: 7
  },
  {
    id: 'nrg-stadium-wc',
    fifaName: 'Houston Stadium',
    commonName: 'NRG Stadium',
    city: 'Houston',
    country: 'USA',
    latitude: 29.6847,
    longitude: -95.4107,
    timezone: 'America/Chicago',
    capacity: 72220,
    soccerCapacity: 72000,
    nflStadiumId: 'nrg-stadium',
    basedOnNFLStadium: true,
    sectionMapping: {},
    fieldOrientation: 0,
    fieldDimensions: {
      length: 110,
      width: 75
    },
    sections: nrgstadiumSections,
    openingYear: 2002,
    surfaceType: 'grass',
    roof: 'retractable',
    hostMatches: 7
  },
  {
    id: 'lumen-field-wc',
    fifaName: 'Seattle Stadium',
    commonName: 'Lumen Field',
    city: 'Seattle',
    country: 'USA',
    latitude: 47.5952,
    longitude: -122.3316,
    timezone: 'America/Los_Angeles',
    capacity: 69000,
    soccerCapacity: 69000,
    nflStadiumId: 'lumen-field',
    basedOnNFLStadium: true,
    sectionMapping: {},
    fieldOrientation: 0,
    fieldDimensions: {
      length: 110,
      width: 75
    },
    sections: lumenfieldSections,
    openingYear: 2002,
    surfaceType: 'artificial',
    roof: 'open',  // Partial roof
    hostMatches: 6
  }
];

/**
 * World Cup 2026 Mexico Venues (3 stadiums)
 * These require new data entry (not in current NFL database)
 * PLACEHOLDER - TO BE IMPLEMENTED IN PHASE 3
 */
export const WORLD_CUP_MEXICO_VENUES: WorldCupVenue[] = [
  {
    id: 'estadio-azteca-wc',
    fifaName: 'Estadio Azteca',
    commonName: 'Estadio Azteca',
    city: 'Mexico City',
    country: 'Mexico',
    latitude: 19.3029,
    longitude: -99.1506,
    timezone: 'America/Mexico_City',
    capacity: 87523,
    soccerCapacity: 87523,
    basedOnNFLStadium: false,
    fieldOrientation: 0,
    fieldDimensions: {
      length: 105,
      width: 68
    },
    sections: [],  // TO BE POPULATED IN PHASE 3
    openingYear: 1966,
    surfaceType: 'grass',
    roof: 'open',
    hostMatches: 5  // Opening match venue
  },
  {
    id: 'estadio-akron-wc',
    fifaName: 'Estadio Akron',
    commonName: 'Estadio Akron',
    city: 'Guadalajara',
    country: 'Mexico',
    latitude: 20.6861,
    longitude: -103.4633,
    timezone: 'America/Mexico_City',
    capacity: 49850,
    soccerCapacity: 49850,
    basedOnNFLStadium: false,
    fieldOrientation: 0,
    fieldDimensions: {
      length: 105,
      width: 68
    },
    sections: [],  // TO BE POPULATED IN PHASE 3
    openingYear: 2010,
    surfaceType: 'grass',
    roof: 'open',
    hostMatches: 4
  },
  {
    id: 'estadio-bbva-wc',
    fifaName: 'Estadio BBVA',
    commonName: 'Estadio BBVA',
    city: 'Monterrey',
    country: 'Mexico',
    latitude: 25.7236,
    longitude: -100.2446,
    timezone: 'America/Mexico_City',
    capacity: 53500,
    soccerCapacity: 53500,
    basedOnNFLStadium: false,
    fieldOrientation: 0,
    fieldDimensions: {
      length: 105,
      width: 68
    },
    sections: [],  // TO BE POPULATED IN PHASE 3
    openingYear: 2015,
    surfaceType: 'grass',
    roof: 'open',
    hostMatches: 4
  }
];

/**
 * World Cup 2026 Canada Venues (2 stadiums)
 * These require new data entry (not in current NFL database)
 * PLACEHOLDER - TO BE IMPLEMENTED IN PHASE 3
 */
export const WORLD_CUP_CANADA_VENUES: WorldCupVenue[] = [
  {
    id: 'bc-place-wc',
    fifaName: 'BC Place',
    commonName: 'BC Place',
    city: 'Vancouver',
    country: 'Canada',
    latitude: 49.2768,
    longitude: -123.1120,
    timezone: 'America/Vancouver',
    capacity: 54500,
    soccerCapacity: 54500,
    basedOnNFLStadium: false,
    fieldOrientation: 0,
    fieldDimensions: {
      length: 110,
      width: 70
    },
    sections: [],  // TO BE POPULATED IN PHASE 3
    openingYear: 1983,
    surfaceType: 'artificial',
    roof: 'retractable',
    hostMatches: 7
  },
  {
    id: 'bmo-field-wc',
    fifaName: 'BMO Field',
    commonName: 'BMO Field',
    city: 'Toronto',
    country: 'Canada',
    latitude: 43.6332,
    longitude: -79.4187,
    timezone: 'America/Toronto',
    capacity: 30000,
    soccerCapacity: 45500,  // Expanded for World Cup
    basedOnNFLStadium: false,
    fieldOrientation: 0,
    fieldDimensions: {
      length: 110,
      width: 70
    },
    sections: [],  // TO BE POPULATED IN PHASE 3
    openingYear: 2007,
    surfaceType: 'grass',
    roof: 'open',
    hostMatches: 6
  }
];

/**
 * All World Cup 2026 Venues (16 total)
 */
export const ALL_WORLD_CUP_VENUES: WorldCupVenue[] = [
  ...WORLD_CUP_USA_VENUES,
  ...WORLD_CUP_MEXICO_VENUES,
  ...WORLD_CUP_CANADA_VENUES
];

/**
 * Get World Cup venue by ID
 */
export function getWorldCupVenueById(id: string): WorldCupVenue | undefined {
  return ALL_WORLD_CUP_VENUES.find(venue => venue.id === id);
}

/**
 * Get World Cup venues by country
 */
export function getWorldCupVenuesByCountry(country: 'USA' | 'Mexico' | 'Canada'): WorldCupVenue[] {
  return ALL_WORLD_CUP_VENUES.filter(venue => venue.country === country);
}

/**
 * Get World Cup venues that are ready (have section data)
 */
export function getReadyWorldCupVenues(): WorldCupVenue[] {
  return ALL_WORLD_CUP_VENUES.filter(venue => venue.sections.length > 0);
}

/**
 * Statistics about World Cup venues
 */
export const WORLD_CUP_VENUE_STATS = {
  total: 16,
  usa: 11,
  mexico: 3,
  canada: 2,
  withRowData: 11,  // USA stadiums (based on NFL)
  needingData: 5,   // Mexico + Canada stadiums
  totalMatches: 104,
  totalCapacity: ALL_WORLD_CUP_VENUES.reduce((sum, v) => sum + v.soccerCapacity, 0)
};
