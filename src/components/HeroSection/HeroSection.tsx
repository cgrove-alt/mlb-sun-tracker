'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from '../Icons';
import { ALL_UNIFIED_VENUES } from '../../data/unifiedVenues';
import Link from 'next/link';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

const POPULAR_VENUES = [
  { id: 'yankees', label: 'Yankees' },
  { id: 'dodgers', label: 'Dodgers' },
  { id: 'cubs', label: 'Cubs' },
  { id: 'redsox', label: 'Red Sox' },
  { id: 'giants', label: 'Giants' },
  { id: 'braves', label: 'Braves' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return ALL_UNIFIED_VENUES
      .filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.team.toLowerCase().includes(q) ||
        v.city.toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [searchQuery]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navigateToVenue = (venue: { id: string; league: string }) => {
    const path = venue.league === 'MLB' ? `/stadium/${venue.id}` : `/venue/${venue.id}`;
    router.push(path);
    setShowDropdown(false);
    setSearchQuery('');
  };

  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-particles"></div>
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-icon">☀️</span>
          <span className="badge-text">250+ Stadiums | Row-Level Accuracy | Real-Time Sun Tracking</span>
        </div>

        <h1 className="hero-headline">
          Find Your Shade.<br />Enjoy the Game.
        </h1>

        <p className="hero-subheadline">
          The most accurate stadium shade finder for MLB, NFL, MiLB, and World Cup 2026.
          Know exactly which seats will be in the shade before you buy.
        </p>

        {/* Search Bar */}
        <div className="hero-search-wrapper" ref={dropdownRef}>
          <div className="hero-search-input-wrap">
            <SearchIcon size={20} color="#9ca3af" />
            <input
              type="text"
              placeholder="Search stadiums, teams, or cities..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              className="hero-search-input"
              aria-label="Search stadiums"
            />
          </div>
          {showDropdown && searchResults.length > 0 && (
            <div className="hero-search-dropdown">
              {searchResults.map(v => (
                <button
                  key={v.id}
                  className="hero-search-result"
                  onClick={() => navigateToVenue(v)}
                >
                  <span className="hero-search-result-name">{v.name}</span>
                  <span className="hero-search-result-meta">{v.team} &middot; {v.league}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Popular chips */}
        <div className="hero-popular">
          <span className="hero-popular-label">Popular:</span>
          {POPULAR_VENUES.map(v => (
            <Link key={v.id} href={`/stadium/${v.id}`} className="hero-popular-chip">
              {v.label}
            </Link>
          ))}
        </div>

        {/* Browse links */}
        <div className="hero-browse">
          <Link href="/mlb" className="hero-browse-link">MLB</Link>
          <span className="hero-browse-divider">|</span>
          <Link href="/nfl" className="hero-browse-link">NFL</Link>
          <span className="hero-browse-divider">|</span>
          <Link href="/world-cup-2026" className="hero-browse-link">World Cup 2026</Link>
          <span className="hero-browse-divider">|</span>
          <Link href="/milb" className="hero-browse-link">MiLB</Link>
        </div>

        <div className="hero-cta-group">
          <button
            onClick={() => {
              if (onGetStarted) {
                onGetStarted();
              } else {
                const appElement = document.getElementById('app-section');
                if (appElement) {
                  appElement.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
            className="hero-cta-primary"
            aria-label="Get started finding shaded seats"
          >
            <SearchIcon size={20} color="currentColor" />
            <span>Browse All Stadiums</span>
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">250+</div>
            <div className="stat-label">Stadiums</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">Row-Level</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">Real-Time</div>
            <div className="stat-label">Sun Tracking</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 2rem 1rem;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .hero-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #0c4a6e 100%);
        }

        .hero-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: float 25s ease-in-out infinite;
          opacity: 0.4;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.6;
          }
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 900px;
          text-align: center;
          color: white;
          animation: fadeInUp 0.8s ease-out;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 0.625rem 1.25rem;
          border-radius: 9999px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        .badge-icon {
          font-size: 1.125rem;
        }

        .badge-text {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hero-headline {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .hero-subheadline {
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          line-height: 1.6;
          margin-bottom: 3rem;
          opacity: 0.95;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          font-weight: 400;
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .hero-search-wrapper {
          position: relative;
          max-width: 500px;
          margin: 0 auto 1.5rem;
          animation: fadeInUp 0.8s ease-out 0.35s both;
        }

        .hero-search-input-wrap {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255, 255, 255, 0.95);
          border-radius: 12px;
          padding: 0.875rem 1.25rem;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }

        .hero-search-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 1rem;
          color: #1f2937;
        }

        .hero-search-input::placeholder {
          color: #9ca3af;
        }

        .hero-search-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          z-index: 50;
        }

        .hero-search-result {
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: 0.75rem 1.25rem;
          border: none;
          background: transparent;
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }

        .hero-search-result:hover {
          background: #f0fdfa;
        }

        .hero-search-result-name {
          font-weight: 600;
          color: #1f2937;
          font-size: 0.875rem;
        }

        .hero-search-result-meta {
          font-size: 0.75rem;
          color: #6b7280;
        }

        .hero-popular {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
          animation: fadeInUp 0.8s ease-out 0.38s both;
        }

        .hero-popular-label {
          font-size: 0.8125rem;
          opacity: 0.8;
        }

        .hero-popular-chip {
          padding: 0.375rem 0.75rem;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
          text-decoration: none;
          transition: background 0.2s;
        }

        .hero-popular-chip:hover {
          background: rgba(255, 255, 255, 0.35);
        }

        .hero-browse {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 2rem;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .hero-browse-link {
          font-size: 0.875rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          text-decoration: none;
          transition: color 0.2s;
        }

        .hero-browse-link:hover {
          color: white;
          text-decoration: underline;
        }

        .hero-browse-divider {
          color: rgba(255, 255, 255, 0.4);
        }

        .hero-cta-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 4rem;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          background: white;
          color: #0f766e;
          border: none;
          padding: 1rem 2.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          min-height: 44px;
        }

        .hero-cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          background: #f8fafc;
        }

        .hero-cta-primary:active {
          transform: translateY(-1px);
        }

        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          animation: fadeInUp 0.8s ease-out 0.5s both;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: clamp(1.25rem, 3vw, 1.75rem);
          font-weight: 700;
          margin-bottom: 0.25rem;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .stat-label {
          font-size: clamp(0.75rem, 1.5vw, 0.875rem);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.9;
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.3);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .hero-section {
            min-height: 100vh;
            padding: 1.5rem 1rem;
          }

          .hero-particles {
            display: none;
          }

          .hero-badge {
            padding: 0.5rem 1rem;
            margin-bottom: 1.5rem;
          }

          .badge-text {
            font-size: 0.625rem;
          }

          .hero-headline {
            margin-bottom: 1rem;
          }

          .hero-subheadline {
            margin-bottom: 2rem;
            font-size: 1rem;
          }

          .hero-cta-group {
            margin-bottom: 3rem;
            flex-direction: column;
            align-items: stretch;
          }

          .hero-cta-primary {
            width: 100%;
            justify-content: center;
          }

          .hero-stats {
            gap: 1rem;
            flex-wrap: wrap;
          }

          .stat-divider {
            display: none;
          }

          .stat-item {
            flex: 1;
            min-width: 80px;
          }
        }

        /* Accessibility: reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-content,
          .hero-badge,
          .hero-headline,
          .hero-subheadline,
          .hero-cta-group,
          .hero-stats {
            animation: none;
          }

          .hero-particles {
            animation: none;
          }

          .hero-cta-primary {
            transition: none;
          }

          .hero-cta-primary:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
