// 2026 FIFA World Cup Type Definitions
// Types for World Cup venues, matches, and configurations

import { DetailedSection } from '../../types/stadium-complete';

export interface WorldCupVenue {
  // Identification
  id: string;                      // "metlife-stadium-wc"
  fifaName: string;                // Official FIFA name: "New York New Jersey Stadium"
  commonName: string;              // "MetLife Stadium"

  // Location
  city: string;
  country: 'USA' | 'Mexico' | 'Canada';
  latitude: number;
  longitude: number;
  timezone: string;                // IANA timezone

  // Capacity
  capacity: number;
  soccerCapacity: number;          // Different from NFL capacity

  // Link to NFL stadium if dual-use
  nflStadiumId?: string;           // "metlife-stadium-giants" or "metlife-stadium-jets"
  basedOnNFLStadium?: boolean;     // True if this is adapted from NFL configuration

  // Section mapping for dual-use stadiums
  sectionMapping?: {               // Maps NFL section IDs to soccer configuration
    [nflSectionId: string]: string;
  };

  // Soccer-specific configuration
  fieldOrientation: number;        // Degrees from north (may differ from NFL)
  fieldDimensions: {
    length: number;                // 105-110 meters (FIFA regulation)
    width: number;                 // 68-75 meters (FIFA regulation)
  };

  // Section data (row-level)
  sections: DetailedSection[];

  // Metadata
  openingYear: number;
  surfaceType: 'grass' | 'artificial';
  roof: 'open' | 'retractable' | 'fixed';
  hostMatches: number;             // Number of World Cup matches hosted
}

export interface WorldCupMatch {
  matchId: string;                 // "wc2026-001"
  date: string;                    // "2026-06-11" (ISO 8601)
  kickoffTime: string;             // "17:00" (local time at venue)
  venue: string;                   // Stadium ID (WorldCupVenue.id)

  // Match details
  round: 'Group Stage' | 'Round of 16' | 'Quarterfinal' | 'Semifinal' | 'Third Place' | 'Final';
  group?: string;                  // "Group A" (if group stage)
  teamA: string;                   // "Mexico" or "TBD"
  teamB: string;                   // "USA" or "TBD"

  // Broadcast info
  tvChannels?: string[];           // ["FOX", "Telemundo", "TSN"]

  // Additional metadata
  expectedAttendance?: number;
  ticketPrice?: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface WorldCupSectionMapping {
  // Maps NFL section configuration to World Cup configuration
  nflSectionId: string;
  worldCupSectionId: string;
  worldCupSectionName?: string;
  notes?: string;                  // Any configuration differences
}

export interface WorldCupCity {
  name: string;
  country: 'USA' | 'Mexico' | 'Canada';
  venues: string[];                // WorldCupVenue IDs in this city
  matchCount: number;
  timezone: string;
}

export const WORLD_CUP_2026_INFO = {
  startDate: '2026-06-11',
  endDate: '2026-07-19',
  totalMatches: 104,
  totalVenues: 16,
  totalCountries: 3,
  participatingTeams: 48,
  openingMatch: {
    date: '2026-06-11',
    venue: 'estadio-azteca-wc',
    city: 'Mexico City',
    teams: 'Mexico vs TBD'
  },
  final: {
    date: '2026-07-19',
    venue: 'metlife-stadium-wc',
    city: 'East Rutherford, NJ'
  }
} as const;
