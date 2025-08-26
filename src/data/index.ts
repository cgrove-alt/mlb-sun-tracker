// Main data module that exports all venue data with corrections and custom layouts
// This is the primary interface for accessing MiLB venue data

export * from './venueCorrections';
export type { VenueLayout, VenueSection } from './milbVenueLayouts';
export { getVenueLayout, validateVenueLayout, allMilbLayouts } from './milbVenueLayouts';
// Use named exports for consolidated layout files
export { aaaVenueLayouts, aaVenueLayouts } from './milbVenueLayouts';
export { aPlusVenueLayouts, aVenueLayouts, allLowerLevelLayouts, getLowerLevelVenueLayout } from './milbVenueLayoutsLower';
export * from './venueLayoutIntegration';

import { allMilbLayouts, aaaVenueLayouts, aaVenueLayouts, type VenueSection as VenueSectionType } from './milbVenueLayouts';
import { allLowerLevelLayouts, aPlusVenueLayouts, aVenueLayouts } from './milbVenueLayoutsLower';
import { integrateVenueLayout, getLayoutCoverage, validateAllLayouts } from './venueLayoutIntegration';

// Combine all venue layouts from consolidated files
export const allVenueLayouts = [
  ...allMilbLayouts,          // AAA and AA venues
  ...allLowerLevelLayouts     // A+ and A venues
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

// Export new real stadium data structures
export * from './realStadiumSections';
export * from './stadiumSectionGenerator';
export * from './stadiumDataIntegration';

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
  sections: VenueSectionType[];
  hasCustomLayout: boolean;
  layoutQuality?: any; // Quality tracking for stadium data
  specialFeatures?: any[]; // Stadium-specific features
  layoutNotes?: string; // Notes about the layout
}