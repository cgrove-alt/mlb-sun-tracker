'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { getVenuesByLeague } from '../../data/unifiedVenues';

type League = 'MLB' | 'NFL' | 'MiLB' | 'WorldCup';

const LEAGUES: { id: League; label: string; icon: string; color: string }[] = [
  { id: 'MLB', label: 'MLB', icon: '⚾', color: '#002d72' },
  { id: 'NFL', label: 'NFL', icon: '🏈', color: '#013369' },
  { id: 'MiLB', label: 'MiLB', icon: '⚾', color: '#1a7a3a' },
  { id: 'WorldCup', label: 'World Cup 2026', icon: '⚽', color: '#8a1538' },
];

export const ShadeFinder: React.FC = () => {
  const router = useRouter();
  const [selectedLeague, setSelectedLeague] = useState<League | null>(null);
  const [selectedVenueId, setSelectedVenueId] = useState('');

  const venues = useMemo(() => {
    if (!selectedLeague) return [];
    return getVenuesByLeague(selectedLeague).sort((a, b) => a.team.localeCompare(b.team));
  }, [selectedLeague]);

  const venueCounts = useMemo(() => ({
    MLB: getVenuesByLeague('MLB').length,
    NFL: getVenuesByLeague('NFL').length,
    MiLB: getVenuesByLeague('MiLB').length,
    WorldCup: getVenuesByLeague('WorldCup').length,
  }), []);

  const handleLeagueSelect = (league: League) => {
    setSelectedLeague(league);
    setSelectedVenueId('');
  };

  const handleVenueSelect = (venueId: string) => {
    setSelectedVenueId(venueId);
  };

  const handleGo = () => {
    if (!selectedVenueId || !selectedLeague) return;
    const path = selectedLeague === 'MLB' ? `/stadium/${selectedVenueId}` : `/venue/${selectedVenueId}`;
    router.push(path);
  };

  return (
    <section className="shade-finder" id="shade-finder">
      <div className="shade-finder-container">
        <h2 className="shade-finder-title">Find Your Shade</h2>
        <p className="shade-finder-subtitle">Pick a league, then choose your stadium</p>

        {/* Step 1: League buttons */}
        <div className="league-grid">
          {LEAGUES.map((league) => (
            <button
              key={league.id}
              className={`league-btn ${selectedLeague === league.id ? 'selected' : ''}`}
              onClick={() => handleLeagueSelect(league.id)}
              style={{
                '--league-color': league.color,
              } as React.CSSProperties}
              aria-pressed={selectedLeague === league.id}
            >
              <span className="league-icon">{league.icon}</span>
              <span className="league-label">{league.label}</span>
              <span className="league-count">{venueCounts[league.id]} venues</span>
            </button>
          ))}
        </div>

        {/* Step 2: Stadium selector */}
        {selectedLeague && (
          <div className="stadium-picker">
            <div className="stadium-picker-row">
              <select
                className="stadium-select"
                value={selectedVenueId}
                onChange={(e) => handleVenueSelect(e.target.value)}
                aria-label="Select a stadium"
              >
                <option value="">Select a stadium...</option>
                {venues.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.team} — {v.name}
                  </option>
                ))}
              </select>
              <button
                className="go-btn"
                onClick={handleGo}
                disabled={!selectedVenueId}
                aria-label="Go to stadium shade page"
              >
                Go
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .shade-finder {
          padding: 4rem 1.5rem;
          background: linear-gradient(to bottom, #ffffff 0%, #f0fdfa 100%);
          scroll-margin-top: 60px;
        }

        .shade-finder-container {
          max-width: 700px;
          margin: 0 auto;
          text-align: center;
        }

        .shade-finder-title {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 0.5rem;
          letter-spacing: -0.02em;
        }

        .shade-finder-subtitle {
          font-size: 1.125rem;
          color: #64748b;
          margin-bottom: 2.5rem;
        }

        /* League grid — 2x2 on mobile, 4 across on desktop */
        .league-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        @media (min-width: 640px) {
          .league-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .league-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.375rem;
          padding: 1.25rem 0.75rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 48px;
        }

        .league-btn:hover {
          border-color: var(--league-color);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .league-btn.selected {
          border-color: var(--league-color);
          background: color-mix(in srgb, var(--league-color) 8%, white);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .league-icon {
          font-size: 1.75rem;
        }

        .league-label {
          font-size: 1rem;
          font-weight: 700;
          color: #1f2937;
        }

        .league-count {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Stadium picker */
        .stadium-picker {
          animation: fadeIn 0.25s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .stadium-picker-row {
          display: flex;
          gap: 0.75rem;
          max-width: 560px;
          margin: 0 auto;
        }

        .stadium-select {
          flex: 1;
          padding: 0.875rem 1rem;
          font-size: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          background: white;
          color: #1f2937;
          cursor: pointer;
          appearance: auto;
          min-height: 48px;
        }

        .stadium-select:focus {
          outline: none;
          border-color: #0f766e;
          box-shadow: 0 0 0 3px rgba(15, 118, 110, 0.15);
        }

        .go-btn {
          padding: 0.875rem 2rem;
          font-size: 1rem;
          font-weight: 700;
          background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          min-height: 48px;
          min-width: 80px;
        }

        .go-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 14px rgba(15, 118, 110, 0.4);
        }

        .go-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Mobile */
        @media (max-width: 480px) {
          .shade-finder {
            padding: 3rem 1rem;
          }

          .stadium-picker-row {
            flex-direction: column;
          }

          .go-btn {
            width: 100%;
          }
        }

        /* Reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .league-btn,
          .go-btn {
            transition: none;
          }

          .league-btn:hover,
          .go-btn:hover:not(:disabled) {
            transform: none;
          }

          .stadium-picker {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default ShadeFinder;
