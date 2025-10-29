'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadAllUnifiedVenues, getAllLeagues, getLeagueInfo } from '../data/unifiedVenuesLoader';
import type { UnifiedVenue } from '../data/unifiedVenues';

interface LeagueNavigationProps {
  currentLeague?: string;
  className?: string;
}

const LeagueNavigation: React.FC<LeagueNavigationProps> = ({ currentLeague, className = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [venues, setVenues] = useState<UnifiedVenue[]>([]);
  const leagues = getAllLeagues();

  // Load venues on mount
  useEffect(() => {
    loadAllUnifiedVenues().then(setVenues).catch(console.error);
  }, []);

  // Helper to get venues by league from loaded data
  const getVenuesByLeague = (league: string) => {
    return venues.filter(v => v.league === league);
  };

  return (
    <nav className={`league-navigation ${className}`}>
      <div className="league-nav-container">
        <button
          className="league-nav-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-label="Toggle sports leagues menu"
        >
          <span className="league-nav-label">
            {currentLeague ? getLeagueInfo(currentLeague)?.name : 'All Sports'}
          </span>
          <span className={`league-nav-arrow ${isExpanded ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>

        <div className={`league-nav-dropdown ${isExpanded ? 'expanded' : ''}`}>
          <Link
            href="/"
            className={`league-nav-item ${!currentLeague ? 'active' : ''}`}
            onClick={() => setIsExpanded(false)}
          >
            <span className="league-icon">🏟️</span>
            <div className="league-info">
              <span className="league-name">All Sports</span>
              <span className="league-count">
                {leagues.reduce((total, league) => total + getVenuesByLeague(league).length, 0)} venues
              </span>
            </div>
          </Link>

          {leagues.map(leagueKey => {
            const league = getLeagueInfo(leagueKey);
            const venues = getVenuesByLeague(leagueKey);
            
            if (!league || venues.length === 0) return null;

            const icon = leagueKey === 'MLB' ? '⚾' : 
                        leagueKey === 'NFL' ? '🏈' : '🏟️';

            return (
              <Link
                key={leagueKey}
                href={`/league/${leagueKey.toLowerCase()}`}
                className={`league-nav-item ${currentLeague === leagueKey ? 'active' : ''}`}
                onClick={() => setIsExpanded(false)}
              >
                <span className="league-icon">{icon}</span>
                <div className="league-info">
                  <span className="league-name">{league.name}</span>
                  <span className="league-count">{venues.length} venues</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .league-navigation {
          position: relative;
          display: inline-block;
        }

        .league-nav-container {
          position: relative;
        }

        .league-nav-toggle {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          transition: all 0.2s;
        }

        .league-nav-toggle:hover {
          border-color: #3b82f6;
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
        }

        .league-nav-arrow {
          transition: transform 0.2s;
          font-size: 12px;
        }

        .league-nav-arrow.expanded {
          transform: rotate(180deg);
        }

        .league-nav-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 50;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-8px);
          transition: all 0.2s;
          min-width: 200px;
        }

        .league-nav-dropdown.expanded {
          opacity: 1;
          visibility: visible;
          transform: translateY(4px);
        }

        .league-nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          text-decoration: none;
          color: #374151;
          transition: background-color 0.2s;
          border-bottom: 1px solid #f3f4f6;
        }

        .league-nav-item:last-child {
          border-bottom: none;
        }

        .league-nav-item:hover {
          background-color: #f9fafb;
        }

        .league-nav-item.active {
          background-color: #eff6ff;
          color: #1d4ed8;
        }

        .league-icon {
          font-size: 18px;
          width: 24px;
          text-align: center;
        }

        .league-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .league-name {
          font-weight: 500;
          font-size: 14px;
        }

        .league-count {
          font-size: 12px;
          color: #6b7280;
        }

        @media (max-width: 768px) {
          .league-nav-dropdown {
            position: fixed;
            top: auto;
            bottom: 0;
            left: 0;
            right: 0;
            border-radius: 16px 16px 0 0;
            max-height: 70vh;
            overflow-y: auto;
          }

          .league-nav-dropdown.expanded {
            transform: translateY(0);
          }

          .league-nav-item {
            padding: 16px;
          }
        }
      `}</style>
    </nav>
  );
};

export default LeagueNavigation;