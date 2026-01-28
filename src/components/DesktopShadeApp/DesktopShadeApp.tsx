'use client';

import React, { useState, useMemo, useEffect, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import { LeagueTabs } from '../LeagueTabs';
import { HorizontalFilterPills, FilterValues } from '../HorizontalFilterPills';
import { StadiumGameBar } from '../StadiumGameBar';
import { SectionList } from '../SectionList';
import { LoadingSpinner } from '../LoadingSpinner';
import { LeagueId, DesktopShadeAppProps, DesktopShadeAppRef, LEAGUE_TABS } from '../../types/desktop-app';
import { UnifiedVenue, getVenuesByLeague } from '../../data/unifiedVenues';
import { getStadiumSectionsAsync } from '../../data/getStadiumSections';
import { getSunPosition } from '../../utils/sunCalculations';
import { useSunCalculations } from '../../hooks/useSunCalculations';
import type { StadiumSection } from '../../data/stadiumSectionTypes';
import styles from './DesktopShadeApp.module.css';

/**
 * Initialize filters from URL params
 */
function parseMaxSun(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 0 || parsed > 100) return undefined;
  return parsed;
}

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
    maxSunExposure: parseMaxSun(maxSunParam),
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
export const DesktopShadeApp = forwardRef<DesktopShadeAppRef, DesktopShadeAppProps>(({
  initialLeague = 'MLB',
  className = '',
}, ref) => {
  // Core state
  const [selectedLeague, setSelectedLeague] = useState<LeagueId>(initialLeague);
  const [selectedVenue, setSelectedVenue] = useState<UnifiedVenue | null>(null);
  const [selectedGameTime, setSelectedGameTime] = useState<Date | null>(null);
  const [filters, setFilters] = useState<FilterValues>(getInitialFilters);
  const [isLoading, setIsLoading] = useState(false);
  // Selected section for bidirectional sync between diagram and cards
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  // Sections data for the selected venue
  const [sections, setSections] = useState<StadiumSection[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(false);
  const loadingTimeoutRef = useRef<number | null>(null);
  // Ref for the stadium selector bar (for scroll-to)
  const selectorBarRef = useRef<HTMLDivElement>(null);
  // Ref for screen reader announcements
  const announcerRef = useRef<HTMLDivElement>(null);
  // Ref to the section list for scroll-to-section
  const sectionListRef = useRef<HTMLDivElement>(null);

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

  // Load sections when venue changes
  useEffect(() => {
    if (!selectedVenue) {
      setSections([]);
      setSectionsLoading(false);
      return;
    }

    let cancelled = false;
    setSectionsLoading(true);

    getStadiumSectionsAsync(selectedVenue.id)
      .then((loadedSections) => {
        if (!cancelled) {
          setSections(loadedSections);
          setSectionsLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error loading sections:', error);
        if (!cancelled) {
          setSections([]);
          setSectionsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedVenue?.id]);

  // Calculate sun position for the selected game time
  const sunPosition = useMemo(() => {
    if (!selectedVenue) return null;

    const gameDateTime = selectedGameTime || new Date();
    // Default to 1 PM if no game time selected
    if (!selectedGameTime) {
      gameDateTime.setHours(13, 0, 0, 0);
    }

    return getSunPosition(
      gameDateTime,
      selectedVenue.latitude,
      selectedVenue.longitude,
      selectedVenue.timezone
    );
  }, [selectedVenue, selectedGameTime]);

  // Create stadium object for useSunCalculations
  const stadiumForCalc = useMemo(() => {
    if (!selectedVenue) return null;
    return {
      id: selectedVenue.id,
      latitude: selectedVenue.latitude,
      longitude: selectedVenue.longitude,
      timezone: selectedVenue.timezone,
      orientation: selectedVenue.orientation,
      roofHeight: selectedVenue.roofHeight,
      roofOverhang: selectedVenue.roofOverhang,
      upperDeckHeight: selectedVenue.upperDeckHeight,
    };
  }, [selectedVenue]);

  // Default sun position fallback (1 PM, roughly overhead)
  const defaultSunPosition = useMemo(() => ({
    altitude: Math.PI / 4, // 45 degrees in radians
    azimuth: Math.PI, // 180 degrees in radians (south)
    altitudeDegrees: 45,
    azimuthDegrees: 180,
  }), []);

  // Use Web Worker for sun calculations
  const {
    data: sectionsWithSunData,
    rowData,
    isLoading: isCalculatingSun,
  } = useSunCalculations({
    stadium: stadiumForCalc || { id: '', latitude: 0, longitude: 0, timezone: 'UTC' },
    sunPosition: sunPosition || defaultSunPosition,
    sections,
    enabled: !!selectedVenue && !!sunPosition && sections.length > 0,
    includeRows: true,
  });

  // Transform worker data into SeatingSectionSun format for SectionList
  // Worker returns: { sectionId, averageCoverage, rows, ... } for row calculations
  // SectionList expects: { section: StadiumSection, sunExposure: number, inSun: boolean }
  const sectionsForList = useMemo(() => {
    if (!sections.length) return [];

    // If we have worker data, create a map for quick lookup
    const workerDataMap = new Map<string, any>();
    if (sectionsWithSunData) {
      sectionsWithSunData.forEach((data: any) => {
        const id = data.sectionId || data.section?.id;
        if (id) workerDataMap.set(id, data);
      });
    }

    // Merge original sections with worker sun data
    return sections
      .filter(section => section && section.id) // Guard against invalid sections
      .map(section => {
        const workerData = workerDataMap.get(section.id);
        const sunExposure = workerData
          ? (100 - (workerData.averageCoverage ?? (100 - (workerData.sunExposure ?? 50))))
          : 50;

        return {
          section,
          sunExposure,
          inSun: sunExposure > 50,
          timeInSun: workerData?.timeInSun,
        };
      });
  }, [sectionsWithSunData, sections]);

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

  // Announce message to screen readers
  const announce = useCallback((message: string) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message;
      // Clear after announcement to allow repeat announcements
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  // Handle league change - clear venue and section selection when switching leagues
  const handleLeagueChange = useCallback((league: LeagueId) => {
    setSelectedLeague(league);
    setSelectedVenue(null);
    setSelectedSectionId(null);
    setSelectedGameTime(null);
    // Announce league change to screen readers
    const leagueLabel = LEAGUE_TABS.find(t => t.id === league)?.label || league;
    announce(`Switched to ${leagueLabel}`);
  }, [announce]);

  // Handle venue change
  const handleVenueChange = useCallback((venue: UnifiedVenue | null) => {
    if (loadingTimeoutRef.current !== null) {
      window.clearTimeout(loadingTimeoutRef.current);
    }
    setIsLoading(true);
    setSelectedVenue(venue);
    setSelectedSectionId(null);
    setSelectedGameTime(null);
    if (venue) {
      announce(`Selected ${venue.name}`);
    }
    loadingTimeoutRef.current = window.setTimeout(() => {
      setIsLoading(false);
      loadingTimeoutRef.current = null;
    }, 300);
  }, [announce]);

  // Handle game/time selection
  const handleGameSelect = useCallback((game: any, dateTime: Date | null) => {
    setSelectedGameTime(dateTime);
  }, []);

  useEffect(() => () => {
    if (loadingTimeoutRef.current !== null) {
      window.clearTimeout(loadingTimeoutRef.current);
    }
  }, []);

  // Scroll to and focus the stadium selector bar
  const scrollToSelector = useCallback(() => {
    if (selectorBarRef.current) {
      selectorBarRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Focus the first focusable element in the selector bar
      const focusable = selectorBarRef.current.querySelector('input, button, [tabindex]:not([tabindex="-1"])') as HTMLElement;
      if (focusable) {
        setTimeout(() => focusable.focus(), 500); // After scroll completes
      }
    }
  }, []);

  // Expose scrollToSelector method via ref
  useImperativeHandle(ref, () => ({
    scrollToSelector,
  }), [scrollToSelector]);

  // Handle section selection from card
  const handleCardSectionSelect = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
    announce(`Selected ${sectionId}`);
  }, [announce]);

  return (
    <div className={`${styles.container} ${className}`}>
      {/* Screen reader announcer for live updates */}
      <div
        ref={announcerRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className={styles.srOnly}
      />

      {/* League Tabs */}
      <LeagueTabs
        selectedLeague={selectedLeague}
        onLeagueChange={handleLeagueChange}
      />

      {/* Main content area */}
      <div
        className={styles.mainContent}
        role="tabpanel"
        id={`panel-${selectedLeague}`}
        aria-labelledby={`tab-${selectedLeague}`}
      >
        {/* Stadium/Game Selector Bar */}
        <div ref={selectorBarRef} className={styles.selectorBar}>
          <StadiumGameBar
            selectedLeague={selectedLeague}
            selectedVenue={selectedVenue}
            onVenueChange={handleVenueChange}
            onGameSelect={handleGameSelect}
          />
        </div>

        {/* Horizontal Filter Pills (Phase 2) */}
        <div className={styles.filterBar}>
          <HorizontalFilterPills
            filters={filters}
            onChange={handleFilterChange}
          />
        </div>

        {/* Section cards content */}
        <div className={styles.cardsWrapper} ref={sectionListRef}>
          {!selectedVenue ? (
            <div className={styles.panelPlaceholder}>
              <span className={styles.placeholderLabel}>Section Cards</span>
              <span className={styles.placeholderSubtext}>
                Select a venue to view seating sections
              </span>
            </div>
          ) : sectionsLoading || isCalculatingSun ? (
            <div className={styles.panelPlaceholder}>
              <LoadingSpinner message="Calculating sun exposure..." />
            </div>
          ) : sectionsForList.length > 0 ? (
            <SectionList
              sections={sectionsForList}
              loading={false}
              showFilters={false}
              rowData={rowData}
              showRowToggle={!!rowData && rowData.length > 0}
              stadiumId={selectedVenue.id}
              highlightedSectionId={selectedSectionId}
              onSectionSelect={handleCardSectionSelect}
            />
          ) : (
            <div className={styles.panelPlaceholder}>
              <span className={styles.placeholderLabel}>Section Cards</span>
              <span className={styles.placeholderSubtext}>
                No section data available for this venue
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

DesktopShadeApp.displayName = 'DesktopShadeApp';

export default DesktopShadeApp;
