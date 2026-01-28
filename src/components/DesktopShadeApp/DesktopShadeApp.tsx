'use client';

import React, { useState, useMemo } from 'react';
import { LeagueTabs } from '../LeagueTabs';
import { LeagueId, DesktopShadeAppProps } from '../../types/desktop-app';
import { UnifiedVenue, getVenuesByLeague, getMiLBVenuesByLevel } from '../../data/unifiedVenues';
import styles from './DesktopShadeApp.module.css';

/**
 * DesktopShadeApp - Main container for the desktop shade finder experience
 *
 * Provides:
 * - League tabs at top (MLB | MiLB | NFL | World Cup 2026)
 * - State management for selected league and venue
 * - Layout structure for subsequent phases (filters, diagram, cards)
 */
export const DesktopShadeApp: React.FC<DesktopShadeAppProps> = ({
  initialLeague = 'MLB',
  className = '',
}) => {
  // Core state
  const [selectedLeague, setSelectedLeague] = useState<LeagueId>(initialLeague);
  const [selectedVenue, setSelectedVenue] = useState<UnifiedVenue | null>(null);

  // Get venues for the selected league
  const venues = useMemo(() => {
    // Map league ID to the format expected by getVenuesByLeague
    const leagueMap: Record<LeagueId, string> = {
      MLB: 'MLB',
      MiLB: 'MiLB',
      NFL: 'NFL',
      WorldCup: 'WorldCup',
    };
    return getVenuesByLeague(leagueMap[selectedLeague]);
  }, [selectedLeague]);

  // Handle league change - clear venue selection when switching leagues
  const handleLeagueChange = (league: LeagueId) => {
    setSelectedLeague(league);
    setSelectedVenue(null);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {/* League Tabs */}
      <LeagueTabs
        selectedLeague={selectedLeague}
        onLeagueChange={handleLeagueChange}
      />

      {/* Main content area - placeholder for future phases */}
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

        {/* Placeholder: Horizontal filters (Phase 2) */}
        <div className={styles.filterBar}>
          <span className={styles.placeholderLabel}>Filter Pills</span>
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
