'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Stadium } from '../data/stadiums';
import VirtualScroll from './VirtualScroll';
import { useStadiumGuides, usePrefetchGuides } from '../hooks/useStadiumGuide';
import OptimizedImage from '../../components/OptimizedImage';

interface OptimizedStadiumsListProps {
  stadiums: Stadium[];
  league: 'MLB' | 'NFL' | 'AAA' | 'AA' | 'A+' | 'A';
  searchQuery?: string;
}

interface StadiumCardProps {
  stadium: Stadium;
  guide?: any;
}

function StadiumCard({ stadium, guide }: StadiumCardProps) {
  return (
    <Link
      href={`/stadium/${stadium.id}`}
      className="stadium-card"
      prefetch={false}
    >
      <div className="card-content">
        <div className="card-image">
          {guide?.images?.[0] ? (
            <OptimizedImage
              src={guide.images[0]}
              alt={stadium.name}
              width={300}
              height={200}
              className="stadium-thumb"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
            />
          ) : (
            <div className="placeholder-image">
              <span>📍</span>
            </div>
          )}
        </div>
        <div className="card-info">
          <h3 className="stadium-name">{stadium.name}</h3>
          <p className="team-name">{stadium.team || 'Unknown Team'}</p>
          <div className="stadium-meta">
            <span className="location">
              {stadium.city}, {stadium.state}
            </span>
            {stadium.capacity && (
              <span className="capacity">
                Capacity: {stadium.capacity.toLocaleString()}
              </span>
            )}
          </div>
          {guide?.description && (
            <p className="stadium-description">{guide.description}</p>
          )}
        </div>
      </div>
      <style jsx>{`
        .stadium-card {
          display: block;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
          text-decoration: none;
          color: inherit;
        }

        .stadium-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-2px);
        }

        .card-content {
          display: flex;
          gap: 16px;
          padding: 16px;
        }

        .card-image {
          flex-shrink: 0;
          width: 120px;
          height: 80px;
          position: relative;
          border-radius: 4px;
          overflow: hidden;
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }

        .card-info {
          flex: 1;
          min-width: 0;
        }

        .stadium-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #1f2937;
        }

        .team-name {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 8px 0;
        }

        .stadium-meta {
          display: flex;
          gap: 16px;
          font-size: 12px;
          color: #9ca3af;
          margin-bottom: 8px;
        }

        .stadium-description {
          font-size: 13px;
          color: #4b5563;
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        @media (max-width: 640px) {
          .card-content {
            flex-direction: column;
            gap: 12px;
          }

          .card-image {
            width: 100%;
            height: 150px;
          }
        }
      `}</style>
    </Link>
  );
}

export default function OptimizedStadiumsList({
  stadiums,
  league,
  searchQuery = '',
}: OptimizedStadiumsListProps) {
  const [sortBy, setSortBy] = useState<'name' | 'city' | 'capacity'>('name');
  const { guides, loading: guidesLoading } = useStadiumGuides(league);

  // Prefetch adjacent leagues
  usePrefetchGuides(league);

  // Filter and sort stadiums
  const filteredStadiums = useMemo(() => {
    let filtered = stadiums;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = stadiums.filter(
        stadium =>
          stadium.name.toLowerCase().includes(query) ||
          stadium.team?.toLowerCase().includes(query) ||
          stadium.city.toLowerCase().includes(query) ||
          stadium.state.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'city':
          return a.city.localeCompare(b.city);
        case 'capacity':
          return (b.capacity || 0) - (a.capacity || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [stadiums, searchQuery, sortBy]);

  // Render stadium item for virtual scroll
  const renderStadium = useCallback(
    (stadium: Stadium, index: number) => {
      const guide = guides[stadium.id];
      return <StadiumCard key={stadium.id} stadium={stadium} guide={guide} />;
    },
    [guides]
  );

  // Get item key for virtual scroll
  const getItemKey = useCallback((stadium: Stadium) => stadium.id, []);

  return (
    <div className="optimized-stadiums-list">
      <div className="list-controls">
        <div className="sort-controls">
          <label htmlFor="sort-by">Sort by:</label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="sort-select"
          >
            <option value="name">Stadium Name</option>
            <option value="city">City</option>
            <option value="capacity">Capacity</option>
          </select>
        </div>
        <div className="list-info">
          Showing {filteredStadiums.length} of {stadiums.length} stadiums
        </div>
      </div>

      {guidesLoading ? (
        <div className="loading-guides">
          <div className="spinner"></div>
          <p>Loading stadium information...</p>
        </div>
      ) : filteredStadiums.length > 0 ? (
        <VirtualScroll
          items={filteredStadiums}
          itemHeight={120} // Approximate height of each stadium card
          renderItem={renderStadium}
          containerHeight={600}
          overscan={5}
          className="stadiums-virtual-list"
          getItemKey={getItemKey}
        />
      ) : (
        <div className="no-results">
          <p>No stadiums found matching "{searchQuery}"</p>
        </div>
      )}

      <style jsx>{`
        .optimized-stadiums-list {
          width: 100%;
        }

        .list-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding: 16px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .sort-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .sort-controls label {
          font-size: 14px;
          color: #6b7280;
        }

        .sort-select {
          padding: 6px 12px;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 14px;
          background: white;
          cursor: pointer;
        }

        .list-info {
          font-size: 14px;
          color: #6b7280;
        }

        .loading-guides {
          text-align: center;
          padding: 60px 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          margin: 0 auto 16px;
          border: 3px solid #e5e7eb;
          border-radius: 50%;
          border-top-color: #3b82f6;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-guides p {
          color: #6b7280;
        }

        .no-results {
          text-align: center;
          padding: 60px 20px;
          color: #6b7280;
        }

        :global(.stadiums-virtual-list) {
          background: #f9fafb;
          border-radius: 8px;
          padding: 8px;
        }

        :global(.stadiums-virtual-list > div > div) {
          margin-bottom: 8px;
        }

        @media (max-width: 640px) {
          .list-controls {
            flex-direction: column;
            gap: 12px;
          }

          .sort-controls {
            width: 100%;
          }

          .sort-select {
            flex: 1;
          }
        }
      `}</style>
    </div>
  );
}