'use client';

import React, { memo, useCallback, useRef } from 'react';
import { LEAGUE_TABS, LeagueTabsProps } from '../../types/desktop-app';
import styles from './LeagueTabs.module.css';

/**
 * LeagueTabs - Top-level navigation tabs for switching between leagues
 *
 * Displays horizontal tabs for MLB, MiLB, NFL, and World Cup 2026.
 * Supports keyboard navigation (arrow keys, Home, End).
 */
const LeagueTabsComponent: React.FC<LeagueTabsProps> = ({
  selectedLeague,
  onLeagueChange,
  className = '',
}) => {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Handle keyboard navigation between tabs
  const handleKeyDown = useCallback((event: React.KeyboardEvent, currentIndex: number) => {
    const tabCount = LEAGUE_TABS.length;
    let nextIndex: number | null = null;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = (currentIndex + 1) % tabCount;
        break;
      case 'ArrowLeft':
        nextIndex = (currentIndex - 1 + tabCount) % tabCount;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      case 'End':
        nextIndex = tabCount - 1;
        break;
      default:
        return;
    }

    event.preventDefault();
    const nextTab = LEAGUE_TABS[nextIndex];
    onLeagueChange(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  }, [onLeagueChange]);

  return (
    <nav
      className={`${styles.tabsContainer} ${className}`}
      role="tablist"
      aria-label="League selection"
    >
      {LEAGUE_TABS.map((tab, index) => (
        <button
          key={tab.id}
          ref={(el) => { tabRefs.current[index] = el; }}
          role="tab"
          tabIndex={selectedLeague === tab.id ? 0 : -1}
          aria-selected={selectedLeague === tab.id}
          aria-controls={`panel-${tab.id}`}
          className={`${styles.tab} ${selectedLeague === tab.id ? styles.tabActive : ''}`}
          onClick={() => onLeagueChange(tab.id)}
          onKeyDown={(e) => handleKeyDown(e, index)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

// Memoize to prevent unnecessary re-renders
export const LeagueTabs = memo(LeagueTabsComponent);

export default LeagueTabs;
