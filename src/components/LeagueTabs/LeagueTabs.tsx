'use client';

import React from 'react';
import { LeagueId, LEAGUE_TABS, LeagueTabsProps } from '../../types/desktop-app';
import styles from './LeagueTabs.module.css';

/**
 * LeagueTabs - Top-level navigation tabs for switching between leagues
 *
 * Displays horizontal tabs for MLB, MiLB, NFL, and World Cup 2026.
 */
export const LeagueTabs: React.FC<LeagueTabsProps> = ({
  selectedLeague,
  onLeagueChange,
  className = '',
}) => {
  return (
    <nav
      className={`${styles.tabsContainer} ${className}`}
      role="tablist"
      aria-label="League selection"
    >
      {LEAGUE_TABS.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={selectedLeague === tab.id}
          aria-controls={`panel-${tab.id}`}
          className={`${styles.tab} ${selectedLeague === tab.id ? styles.tabActive : ''}`}
          onClick={() => onLeagueChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default LeagueTabs;
