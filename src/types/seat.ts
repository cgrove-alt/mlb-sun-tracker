// Seat-Level Data Types for Individual Seat Tracking and Sun Exposure
// Created: 2025-10-21
// Purpose: Enable granular seat-level sun exposure calculations for all MLB stadiums

import { Vector3D } from './stadium-complete';

/**
 * Individual seat representation with complete metadata
 */
export interface Seat {
  // Identification
  id: string; // Unique identifier: "{stadiumId}-{sectionId}-{row}-{seatNumber}"
  sectionId: string; // Parent section
  row: string; // Row label (A, B, C... or 1, 2, 3...)
  seatNumber: string; // Seat number within row (1, 2, 3... or 101, 102...)

  // Physical location
  position3D: Vector3D; // 3D coordinates in stadium space
  elevation: number | null; // Height above field level in feet
  distanceFromHomeplate: number; // Distance from home plate in feet

  // Spatial properties
  angle: number; // Compass angle from home plate (0-360°)
  facing: number; // Direction seat faces (0-360°, typically toward field)

  // Seat characteristics
  seatType: 'standard' | 'aisle' | 'wheelchair' | 'companion' | 'barstool' | 'bench';
  hasArmrests: boolean;
  cupHolders: boolean;

  // View and accessibility
  viewQuality?: 'excellent' | 'good' | 'fair' | 'obstructed' | 'partial';
  viewObstructions?: string[]; // e.g., ["pole", "railing", "netting"]
  accessibility: {
    wheelchairAccessible: boolean;
    companionSeat: boolean;
    requiresStairs: boolean;
    elevatorAccess: boolean;
  };

  // Coverage and shade characteristics
  covered: boolean; // Under permanent roof/overhang
  overhangHeight?: number; // Height of overhang above seat (if covered)
  partialCoverage?: {
    type: 'morning' | 'afternoon' | 'evening' | 'weather-dependent';
    percentage: number; // 0-100
  };

  // Pricing and availability
  priceRange?: {
    min: number;
    max: number;
    typical: number;
    currency: string;
  };

  // Metadata
  notes?: string[]; // Special notes about this seat
  popularityScore?: number; // 0-100, based on historical sales/reviews
}

/**
 * Row-level aggregation with all seats in the row
 * Extends existing RowDetail concept with full seat tracking
 */
export interface SeatRow {
  // Identification
  rowNumber: string; // Row label (A, B, C... or 1, 2, 3...)
  sectionId: string; // Parent section

  // Row properties
  seatCount: number; // Total seats in this row
  elevation: number | null; // Height above field level in feet
  depth: number; // Distance from front of section in feet
  rowSpacing: number; // Inches between this row and next

  // All seats in this row (ordered left to right)
  seats: Seat[];

  // Row-level coverage
  covered: boolean;
  overhangHeight?: number;

  // Row-level aggregated data
  averageSunExposure?: number; // Average exposure across all seats (0-100%)
  shadeVariance?: number; // Variance in sun exposure across row (0-100)

  // Accessibility
  hasAisleSeats: boolean;
  wheelchairRow: boolean;
}

/**
 * Section with complete seat-level data
 * Links to existing StadiumSection structure
 */
export interface SectionSeatingData {
  sectionId: string;
  sectionName: string;
  stadiumId: string;

  // All rows in this section (ordered front to back)
  rows: SeatRow[];

  // Section-level aggregates
  totalSeats: number;
  totalRows: number;

  // Seat type distribution
  seatDistribution: {
    standard: number;
    aisle: number;
    wheelchair: number;
    companion: number;
    other: number;
  };

  // Sun exposure summary (if pre-computed)
  sunExposureSummary?: {
    fullyShaded: number; // Count of seats >80% shaded
    partiallyShaded: number; // Count of seats 20-80% shaded
    fullySunny: number; // Count of seats >80% sunny
    averageExposure: number; // 0-100%
  };
}

/**
 * Sun exposure calculation result for a specific seat
 */
export interface SeatSunExposure {
  seatId: string;
  calculatedAt: Date;
  gameDateTime: Date;

  // Exposure metrics
  sunExposurePercentage: number; // 0-100% of game duration in direct sun
  shadowPercentage: number; // 0-100% of game duration in shadow
  partialShadePercentage: number; // 0-100% of game duration in partial shade

  // Timeline data (sun exposure throughout game)
  timeline: SunExposureTimePoint[];

  // Peak sun period
  peakSunPeriod?: {
    start: Date;
    end: Date;
    intensity: number; // 0-100
  };

  // Obstructions causing shade
  shadowSources: string[]; // IDs of obstructions casting shadow

  // Weather-adjusted
  weatherAdjusted: boolean;
  cloudCoverPercentage?: number;

  // Calculation metadata
  calculationMethod: 'angle-based' | '3d-raycast' | 'hybrid' | 'pre-computed';
  confidence: number; // 0-100, accuracy confidence
}

/**
 * Single time point in sun exposure timeline
 */
export interface SunExposureTimePoint {
  time: Date;
  inDirectSun: boolean;
  inPartialShade: boolean;
  inFullShade: boolean;
  sunIntensity: number; // 0-100, accounts for sun angle
  sunAltitude: number; // Degrees above horizon
  sunAzimuth: number; // Compass bearing 0-360
}

/**
 * Pre-computed sun exposure data for common game times
 * Used to speed up initial load
 */
export interface PreComputedSeatExposure {
  stadiumId: string;
  seatId: string;

  // Pre-computed for common game times and months
  computedData: {
    month: number; // 1-12 (April-October for baseball)
    time: string; // "13:00", "16:00", "19:00", "19:30"
    exposure: number; // 0-100%
  }[];

  // Metadata
  computedDate: string; // ISO date when computed
  dataVersion: string; // Version for cache invalidation
}

/**
 * Batch calculation request for multiple seats
 */
export interface SeatBatchCalculationRequest {
  stadiumId: string;
  seatIds: string[];
  gameDateTime: Date;
  includeTimeline: boolean;
  weatherData?: {
    cloudCover: number;
    precipitation: number;
  };
}

/**
 * Result from batch seat calculation
 */
export interface SeatBatchCalculationResult {
  stadiumId: string;
  gameDateTime: Date;
  results: SeatSunExposure[];
  calculationTimeMs: number;
  cached: boolean;
}

/**
 * Seat search query interface
 */
export interface SeatSearchQuery {
  stadiumId: string;

  // Search criteria
  sectionIds?: string[];
  rows?: string[];
  seatNumbers?: string[];

  // Sun exposure filters
  maxSunExposure?: number; // 0-100%
  minShadePercentage?: number; // 0-100%
  requiresFullShade?: boolean;

  // Other filters
  priceRange?: {
    min: number;
    max: number;
  };
  accessibility?: {
    wheelchair?: boolean;
    elevator?: boolean;
    noStairs?: boolean;
  };
  viewQuality?: ('excellent' | 'good' | 'fair')[];

  // Game info for sun calculations
  gameDateTime?: Date;

  // Sorting
  sortBy?: 'sun-exposure' | 'price' | 'view-quality' | 'distance-to-field';
  sortOrder?: 'asc' | 'desc';

  // Pagination
  limit?: number;
  offset?: number;
}

/**
 * Search result with matching seats
 */
export interface SeatSearchResult {
  query: SeatSearchQuery;
  seats: Seat[];
  totalMatches: number;
  sunExposureData?: Record<string, SeatSunExposure>; // Map of seatId to exposure
  executionTimeMs: number;
}

/**
 * Stadium seating statistics
 */
export interface StadiumSeatingStats {
  stadiumId: string;
  totalSeats: number;
  totalSections: number;

  // Distribution by level
  byLevel: {
    field: number;
    lower: number;
    club: number;
    upper: number;
    suite: number;
  };

  // Coverage statistics
  coveredSeats: number;
  uncoveredSeats: number;
  partialCoverage: number;

  // Accessibility
  wheelchairSeats: number;
  companionSeats: number;
  elevatorAccessible: number;

  // Average sun exposure (if computed)
  averageSunExposure?: {
    afternoon: number; // 1pm games
    evening: number; // 7pm games
    byMonth: Record<number, number>; // Average by month
  };
}

/**
 * Data generation metadata
 */
export interface SeatDataMetadata {
  stadiumId: string;
  generatedDate: string; // ISO date
  dataVersion: string; // Semantic version
  source: 'official' | 'generated' | 'hybrid' | 'manual';
  accuracy: 'verified' | 'estimated' | 'approximate';
  notes: string[];

  // Validation
  validated: boolean;
  validationDate?: string;
  capacityMatch: boolean; // Does total seats match official capacity?
  officialCapacity?: number;

  // Coverage
  sectionsComplete: number;
  sectionsMissing: number;
  seatsComplete: number;
  seatsMissing: number;
}

/**
 * Export format for seat data files
 */
export interface SeatDataExport {
  metadata: SeatDataMetadata;
  sections: SectionSeatingData[];
}
