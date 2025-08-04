// Main data module that exports all venue data with corrections and custom layouts
// This is the primary interface for accessing MiLB venue data

export * from './venueCorrections';
export * from './milbVenueLayouts';
export * from './milbVenueLayoutsExtended';
export * from './milbVenueLayoutsAAA';
export * from './milbVenueLayoutsAA';
export * from './milbVenueLayoutsAPlus';
export * from './milbVenueLayoutsA';
export * from './milbVenueLayoutsMissing';
export * from './venueLayoutIntegration';

import { allMilbLayouts } from './milbVenueLayouts';
import { allExtendedLayouts } from './milbVenueLayoutsExtended';
import { allAAALayouts } from './milbVenueLayoutsAAA';
import { allAALayouts } from './milbVenueLayoutsAA';
import { aPlusVenueLayouts } from './milbVenueLayoutsAPlus';
import { aVenueLayouts } from './milbVenueLayoutsA';
import { missingVenueLayouts } from './milbVenueLayoutsMissing';
import { integrateVenueLayout, getLayoutCoverage, validateAllLayouts } from './venueLayoutIntegration';

// Combine all venue layouts
export const allVenueLayouts = [
  ...allMilbLayouts,
  ...allExtendedLayouts,
  ...allAAALayouts,
  ...allAALayouts,
  ...aPlusVenueLayouts,
  ...aVenueLayouts,
  ...missingVenueLayouts
];

// Main function to get processed venue data
export function getProcessedVenueData(venueData: any[]): any[] {
  return venueData.map(venue => integrateVenueLayout(venue));
}

// Get venue by ID with all corrections and custom layout applied
export function getVenueById(venueId: string, venueData: any[]): any | undefined {
  const baseVenue = venueData.find(v => v.id === venueId);
  if (!baseVenue) return undefined;
  
  return integrateVenueLayout(baseVenue);
}

// Get all MiLB venues with corrections and custom layouts
export function getAllMilbVenues(venueData: any[]): any[] {
  return venueData
    .filter(v => v.league === 'MiLB')
    .map(v => integrateVenueLayout(v));
}

// Get venues by level
export function getVenuesByLevel(level: string, venueData: any[]): any[] {
  return getAllMilbVenues(venueData)
    .filter(v => v.level === level);
}

// Get implementation status
export function getImplementationStatus() {
  const coverage = getLayoutCoverage();
  const validation = validateAllLayouts();
  
  return {
    totalVenues: coverage.total,
    venuesWithCustomLayouts: coverage.withCustomLayouts,
    coveragePercent: Math.round(coverage.withCustomLayouts / coverage.total * 100),
    coverageByLevel: coverage.byLevel,
    validationStatus: validation.valid ? 'Valid' : `${validation.errors.length} errors`,
    validationErrors: validation.errors
  };
}

// Export types
export interface VenueData {
  id: string;
  name: string;
  league: string;
  level?: string;
  team: string;
  alternateTeams?: string[];
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  orientation: number;
  capacity: number;
  roof: 'open' | 'retractable' | 'fixed';
  timezone: string;
  seatingGeometry: any;
  venueType: string;
  sport: string;
  surface?: string;
  opened?: number;
  address: string;
  sections: VenueSection[];
  hasCustomLayout: boolean;
}

export interface VenueSection {
  id: string;
  name: string;
  level: 'field' | 'lower' | 'club' | 'upper' | 'suite' | 'ga' | 'berm';
  baseAngle: number;
  angleSpan: number;
  covered: boolean;
  price: 'premium' | 'moderate' | 'value' | 'luxury';
  rows?: number;
  capacity?: number;
}