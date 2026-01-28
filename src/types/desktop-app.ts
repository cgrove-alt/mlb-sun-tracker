// TypeScript types for Desktop Shade App

import { UnifiedVenue } from '../data/unifiedVenues';

/**
 * Supported league identifiers
 */
export type LeagueId = 'MLB' | 'MiLB' | 'NFL' | 'WorldCup';

/**
 * League tab configuration
 */
export interface LeagueTabConfig {
  id: LeagueId;
  label: string;
  icon?: string;
}

/**
 * Default league tabs configuration
 */
export const LEAGUE_TABS: LeagueTabConfig[] = [
  { id: 'MLB', label: 'MLB' },
  { id: 'MiLB', label: 'MiLB' },
  { id: 'NFL', label: 'NFL' },
  { id: 'WorldCup', label: 'World Cup 2026' },
];

/**
 * Filter state for section filtering
 */
export interface FilterState {
  maxSunExposure?: number;
  sectionTypes: string[];
  priceRanges: string[];
}

/**
 * Main state for the Desktop Shade App
 */
export interface DesktopAppState {
  selectedLeague: LeagueId;
  selectedVenue: UnifiedVenue | null;
  selectedSectionId: string | null;
  filters: FilterState;
}

/**
 * Props for LeagueTabs component
 */
export interface LeagueTabsProps {
  selectedLeague: LeagueId;
  onLeagueChange: (league: LeagueId) => void;
  className?: string;
}

/**
 * Props for DesktopShadeApp component
 */
export interface DesktopShadeAppProps {
  initialLeague?: LeagueId;
  className?: string;
}
