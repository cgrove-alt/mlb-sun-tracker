// TypeScript interfaces for multi-league venue support

export interface BaseVenue {
  id: string;
  name: string;
  team: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number;
  capacity: number;
  roof: 'open' | 'retractable' | 'fixed';
  timezone: string;
}

export interface BaseballVenue extends BaseVenue {
  league: 'MLB';
  sport: 'baseball';
  venueType: 'baseball';
  // Baseball-specific fields
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
}

export interface FootballVenue extends BaseVenue {
  league: 'NFL';
  sport: 'football';
  venueType: 'football';
  alternateTeams?: string[]; // For shared stadiums
  surface: 'natural grass' | 'artificial' | 'hybrid';
  opened: number;
  address: string;
  // Football-specific geometry
  seatingGeometry: {
    bowlShape: 'rectangular';
    fieldDimensions: {
      length: 120; // yards including end zones
      width: 53.3; // yards
    };
    endZoneOrientation: string;
    primarySeatingAngle: number;
    sideline1Angle: number;
    sideline2Angle: number;
    endZone1Angle: number;
    endZone2Angle: number;
  };
  roofHeight?: number;
  roofOverhang?: number;
  upperDeckHeight?: number;
}

export interface SoccerVenue extends BaseVenue {
  league: 'MLS';
  sport: 'soccer';
  venueType: 'soccer';
  surface: 'natural grass' | 'artificial' | 'hybrid';
  opened: number;
  address: string;
  // Soccer-specific geometry
  seatingGeometry: {
    bowlShape: 'rectangular';
    fieldDimensions: {
      length: number; // meters (100-110)
      width: number;  // meters (64-75)
    };
    endZoneOrientation: string;
    primarySeatingAngle: number;
    sideline1Angle: number;
    sideline2Angle: number;
    endZone1Angle: number;
    endZone2Angle: number;
  };
}

// Union type for all venue types
export type AnyVenue = BaseballVenue | FootballVenue | SoccerVenue;

// League information
export interface LeagueInfo {
  name: string;
  sport: string;
  season: {
    start: string;
    end: string;
  };
  gameTypes: string[];
  typicalGameTimes: string[];
}

// Venue section interfaces
export interface BaseSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper';
  baseAngle: number;
  angleSpan: number;
  covered: boolean;
  price: 'value' | 'moderate' | 'premium' | 'luxury';
}

export interface BaseballSection extends BaseSection {
  venueType: 'baseball';
  // Baseball sections might have foul territory info
  foulTerritory?: boolean;
}

export interface FootballSection extends BaseSection {
  venueType: 'football';
  sectionType?: 'sideline' | 'endzone' | 'corner';
  yardlineStart?: number;
  yardlineEnd?: number;
}

export interface SoccerSection extends BaseSection {
  venueType: 'soccer';
  sectionType?: 'sideline' | 'goal' | 'corner';
}

export type AnySection = BaseballSection | FootballSection | SoccerSection;

// Shade calculation interfaces
export interface ShadeCalculationResult {
  section: AnySection;
  shadePercentage: number;
  isFullyShaded: boolean;
  isPartiallyShaded: boolean;
  isInSun: boolean;
  shadeFactor: number;
  calculationMethod: '2D' | '3D' | 'enhanced';
}

export interface VenueShadeAnalysis {
  venue: AnyVenue;
  gameDateTime: Date;
  sunPosition: {
    azimuthDegrees: number;
    altitudeDegrees: number;
  };
  sections: ShadeCalculationResult[];
  recommendedSections: ShadeCalculationResult[];
  weather?: {
    temperature?: number;
    cloudCover?: number;
    conditions?: string;
  };
}

// Search and filtering interfaces
export interface VenueFilters {
  leagues?: string[];
  sports?: string[];
  roofTypes?: ('open' | 'retractable' | 'fixed')[];
  states?: string[];
  capacityRange?: {
    min?: number;
    max?: number;
  };
  shadeRequired?: boolean;
  priceRange?: ('value' | 'moderate' | 'premium' | 'luxury')[];
}

export interface VenueSearchResult {
  venue: AnyVenue;
  sections: AnySection[];
  matchScore: number;
  shadedSectionCount: number;
  averageShadePercentage: number;
}

// Game/Event interfaces
export interface BaseGameEvent {
  id: string;
  venue: AnyVenue;
  date: Date;
  homeTeam: string;
  awayTeam: string;
  gameType: 'regular' | 'playoff' | 'championship';
}

export interface BaseballGame extends BaseGameEvent {
  sport: 'baseball';
  inning?: number;
  weatherDelay?: boolean;
}

export interface FootballGame extends BaseGameEvent {
  sport: 'football';
  week?: number;
  season: 'preseason' | 'regular' | 'playoff';
  overtime?: boolean;
}

export interface SoccerMatch extends BaseGameEvent {
  sport: 'soccer';
  minute?: number;
  extraTime?: boolean;
  tournament?: string;
}

export type AnyGameEvent = BaseballGame | FootballGame | SoccerMatch;

// Utility type guards
export function isBaseballVenue(venue: AnyVenue): venue is BaseballVenue {
  return venue.sport === 'baseball';
}

export function isFootballVenue(venue: AnyVenue): venue is FootballVenue {
  return venue.sport === 'football';
}

export function isSoccerVenue(venue: AnyVenue): venue is SoccerVenue {
  return venue.sport === 'soccer';
}

export function isBaseballSection(section: AnySection): section is BaseballSection {
  return section.venueType === 'baseball';
}

export function isFootballSection(section: AnySection): section is FootballSection {
  return section.venueType === 'football';
}

export function isSoccerSection(section: AnySection): section is SoccerSection {
  return section.venueType === 'soccer';
}

// Configuration interfaces for venues.json
export interface VenueConfiguration {
  venues: {
    id: string;
    name: string;
    league: string;
    team: string;
    alternateTeams?: string[];
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    orientation: number;
    capacity: number;
    roof: 'open' | 'retractable' | 'fixed';
    roofHeight?: number;
    roofOverhang?: number;
    upperDeckHeight?: number;
    timezone: string;
    seatingGeometry?: {
      bowlShape: 'circular' | 'rectangular' | 'oval';
      fieldDimensions: {
        length: number;
        width: number;
      };
      endZoneOrientation?: string;
      primarySeatingAngle: number;
      sideline1Angle?: number;
      sideline2Angle?: number;
      endZone1Angle?: number;
      endZone2Angle?: number;
    };
    venueType: string;
    surface?: string;
    opened?: number;
    address?: string;
  }[];
  leagues: Record<string, LeagueInfo>;
  venueTypes: Record<string, {
    defaultGameDuration: number;
    shadePriority: 'low' | 'medium' | 'high';
    sunExposureConcerns: string[];
    seasonalFactors: string[];
  }>;
}

// API response interfaces
export interface VenueAPIResponse {
  venue: AnyVenue;
  sections: AnySection[];
  shadeAnalysis?: VenueShadeAnalysis;
  upcomingGames?: AnyGameEvent[];
  weather?: {
    current: any;
    forecast: any[];
  };
}

export interface LeagueAPIResponse {
  league: LeagueInfo;
  venues: AnyVenue[];
  totalVenues: number;
  venuesByState: Record<string, AnyVenue[]>;
}

// Error handling
export class VenueNotFoundError extends Error {
  constructor(venueId: string) {
    super(`Venue not found: ${venueId}`);
    this.name = 'VenueNotFoundError';
  }
}

export class LeagueNotFoundError extends Error {
  constructor(leagueId: string) {
    super(`League not found: ${leagueId}`);
    this.name = 'LeagueNotFoundError';
  }
}

export class ShadeCalculationError extends Error {
  constructor(message: string) {
    super(`Shade calculation error: ${message}`);
    this.name = 'ShadeCalculationError';
  }
}