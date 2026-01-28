'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { LeagueTabs } from '../LeagueTabs';
import { HorizontalFilterPills, FilterValues } from '../HorizontalFilterPills';
import { LeagueId, DesktopShadeAppProps } from '../../types/desktop-app';
import { UnifiedVenue, getVenuesByLeague } from '../../data/unifiedVenues';
import styles from './DesktopShadeApp.module.css';

/**
 * Initialize filters from URL params
 */
function getInitialFilters(): FilterValues {
  if (typeof window === 'undefined') {
    return {
      maxSunExposure: undefined,
      sectionType: [],
      priceRange: [],
    };
  }

  const params = new URLSearchParams(window.location.search);
  const maxSunParam = params.get('maxSun');
  const sectionTypeParam = params.get('sectionType');
  const priceRangeParam = params.get('priceRange');

  return {
    maxSunExposure: maxSunParam ? parseInt(maxSunParam, 10) : undefined,
    sectionType: sectionTypeParam ? sectionTypeParam.split(',').filter(Boolean) : [],
    priceRange: priceRangeParam ? priceRangeParam.split(',').filter(Boolean) : [],
  };
}

/**
 * DesktopShadeApp - Main container for the desktop shade finder experience
 *
 * Provides:
 * - League tabs at top (MLB | MiLB | NFL | World Cup 2026)
 * - Horizontal filter pills with dropdown popovers
 * - State management for selected league, venue, and filters
 * - Layout structure for subsequent phases (diagram, cards)
 */
export const DesktopShadeApp: React.FC<DesktopShadeAppProps> = ({
  initialLeague = 'MLB',
  className = '',
}) => {
  // Core state
  const [selectedLeague, setSelectedLeague] = useState<LeagueId>(initialLeague);
  const [selectedVenue, setSelectedVenue] = useState<UnifiedVenue | null>(null);
  const [filters, setFilters] = useState<FilterValues>(getInitialFilters);

  // Get venues for the selected league
  const venues = useMemo(() => {
    const leagueMap: Record<LeagueId, string> = {
      MLB: 'MLB',
      MiLB: 'MiLB',
      NFL: 'NFL',
      WorldCup: 'WorldCup',
    };
    return getVenuesByLeague(leagueMap[selectedLeague]);
  }, [selectedLeague]);

  // Update URL when filters change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);

    // Clear existing filter params
    params.delete('maxSun');
    params.delete('sectionType');
    params.delete('priceRange');

    // Add filter params if they have values
    if (filters.maxSunExposure !== undefined && filters.maxSunExposure !== 100) {
      params.set('maxSun', filters.maxSunExposure.toString());
    }

    if (filters.sectionType.length > 0) {
      params.set('sectionType', filters.sectionType.join(','));
    }

    if (filters.priceRange.length > 0) {
      params.set('priceRange', filters.priceRange.join(','));
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
  }, []);

  // Handle league change - clear venue selection when switching leagues
  const handleLeagueChange = useCallback((league: LeagueId) => {
    setSelectedLeague(league);
    setSelectedVenue(null);
  }, []);

  return (
    <div className={`${styles.container} ${className}`}>
      {/* League Tabs */}
      <LeagueTabs
        selectedLeague={selectedLeague}
        onLeagueChange={handleLeagueChange}
      />

      {/* Main content area */}
      <div className={styles.mainContent} role="tabpanel" id={`panel-${selectedLeague}`}>
        {/* Placeholder: Stadium/Game selector bar (Phase 5) */}
        <div className={styles.selectorBar}>
          <div className={styles.selectorPlaceholder}>
            <span className={styles.placeholderLabel}>Stadium Selector</span>
            <span className={styles.placeholderInfo}>
              {venues.length} {selectedLeague} venues available
            </span>
          </div>
        </div>

        {/* Horizontal Filter Pills (Phase 2) */}
        <div className={styles.filterBar}>
          <HorizontalFilterPills
            filters={filters}
            onChange={handleFilterChange}
          />
        </div>

        {/* Placeholder: Side-by-side layout (Phase 4) */}
        <div className={styles.contentLayout}>
          {/* Left: Stadium diagram (40%) */}
          <div className={styles.diagramPanel}>
            <div className={styles.panelPlaceholder}>
              <span className={styles.placeholderLabel}>Stadium Diagram</span>
              <span className={styles.placeholderSubtext}>40% width</span>
            </div>
          </div>

          {/* Right: Section cards (60%) */}
          <div className={styles.cardsPanel}>
            <div className={styles.panelPlaceholder}>
              <span className={styles.placeholderLabel}>Section Cards</span>
              <span className={styles.placeholderSubtext}>60% width</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesktopShadeApp;
