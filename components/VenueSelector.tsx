'use client';

import { useState, useMemo } from 'react';
import { UnifiedVenue } from '../src/data/unifiedVenues';
import dynamic from 'next/dynamic';
import { HomePageSkeleton } from '../src/components/SkeletonScreens';

// Lazy load the full app only when a venue is selected
const UnifiedApp = dynamic(() => import('../src/UnifiedApp'), {
  ssr: false,
  loading: () => <HomePageSkeleton />,
});

interface VenueSelectorProps {
  venues: UnifiedVenue[];
}

export default function VenueSelector({ venues }: VenueSelectorProps) {
  const [selectedVenue, setSelectedVenue] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredVenues = useMemo(() => {
    if (!searchTerm) return venues.slice(0, 20); // Show top 20 initially

    return venues.filter(v =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [venues, searchTerm]);

  // If venue selected, show full app
  if (selectedVenue) {
    return <UnifiedApp />;
  }

  return (
    <div className="venue-selector">
      <div className="search-container">
        <input
          type="search"
          placeholder="Search stadiums by name, team, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="venue-search"
          aria-label="Search venues"
        />
      </div>

      <div className="venue-grid">
        {filteredVenues.map((venue) => (
          <button
            key={venue.id}
            onClick={() => setSelectedVenue(venue.id)}
            className="venue-card"
            aria-label={`Select ${venue.name}`}
          >
            <h3>{venue.name}</h3>
            <p className="venue-team">{venue.team}</p>
            <p className="venue-location">{venue.city}, {venue.state || venue.country}</p>
            <span className="venue-league">{venue.league}</span>
          </button>
        ))}
      </div>

      <style jsx>{`
        .venue-selector {
          padding: 2rem 1rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .search-container {
          margin-bottom: 2rem;
        }

        .venue-search {
          width: 100%;
          max-width: 600px;
          padding: 1rem;
          font-size: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          margin: 0 auto;
          display: block;
        }

        .venue-search:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .venue-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .venue-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: left;
          cursor: pointer;
          transition: all 0.2s ease;
          position: relative;
        }

        .venue-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border-color: #3b82f6;
        }

        .venue-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .venue-team {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .venue-location {
          font-size: 0.875rem;
          color: #94a3b8;
          margin-bottom: 1rem;
        }

        .venue-league {
          display: inline-block;
          background: #eff6ff;
          color: #1e40af;
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        @media (max-width: 768px) {
          .venue-selector {
            padding: 1rem;
          }

          .venue-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>
    </div>
  );
}
