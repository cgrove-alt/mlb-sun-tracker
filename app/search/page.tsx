'use client';

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SeatCard } from '../../src/components/seats/SeatCard';
import { SeatFilters, DEFAULT_FILTERS, type SeatFilterState, type ShadeLevel } from '../../src/components/filters/SeatFilters';
import { useSunExposure } from '../../src/hooks/useSunExposure';
import { LoadingSpinner } from '../../src/components/common/LoadingSpinner';
import { MLB_STADIUMS } from '../../src/data/stadiums';
import { toDataStadiumId } from '../../src/utils/ids';
import type { Seat } from '../../src/types/seat';

type SortOption = 'shade' | 'distance' | 'view-quality';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get search parameters
  const stadiumId = searchParams.get('stadium') || 'dodgers';
  const gameTime = searchParams.get('gameTime') || '13:10';
  const gameDateStr = searchParams.get('gameDate');
  const gameDate = gameDateStr ? new Date(gameDateStr) : new Date();

  // Find stadium info
  const stadium = MLB_STADIUMS.find((s) => s.id === stadiumId);

  // State
  const [seats, setSeats] = useState<Seat[]>([]);
  const [isLoadingSeats, setIsLoadingSeats] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<SeatFilterState>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<SortOption>('shade');

  // Load sun exposure data
  const { data: sunExposureData, isLoading: isLoadingSun } = useSunExposure({
    stadiumId,
    gameTime,
    gameDate,
    enabled: true,
  });

  // Load seat data
  useEffect(() => {
    loadSeats();
  }, [stadiumId]);

  async function loadSeats() {
    try {
      setIsLoadingSeats(true);
      setError(null);

      const seatDataStadiumId = toDataStadiumId(stadiumId);
      const indexResponse = await fetch(`/data/search/${seatDataStadiumId}-seats.min.json`);

      if (!indexResponse.ok) {
        throw new Error(`Failed to load seat index for ${stadiumId}`);
      }

      const seatIndex = await indexResponse.json();

      // Convert search index to full Seat objects
      const allSeats: Seat[] = seatIndex.seats.map((entry: any) => ({
        id: entry.id,
        sectionId: entry.sectionId,
        row: entry.row,
        seatNumber: entry.seatNumber,
        level: entry.level || 'lower', // Default to lower if not specified
        covered: entry.covered || false,
        seatType: entry.isAisle ? 'aisle' : 'standard',
        viewQuality: entry.viewQuality,
        accessibility: {
          wheelchairAccessible: entry.wheelchairAccessible || false,
          companionSeat: false,
          reducedMobility: false,
        },
        elevation: entry.elevation || null,
        distanceFromHomeplate: entry.distanceFromHomeplate || 0,
        position3D: entry.position3D || { x: 0, y: 0, z: 0 },
        price: entry.price || null,
      }));

      setSeats(allSeats);
    } catch (err) {
      console.error('Failed to load seats:', err);
      setError('Unable to load seat data for this stadium');
    } finally {
      setIsLoadingSeats(false);
    }
  }

  // Filter and sort seats
  const filteredSeats = useMemo(() => {
    if (!seats.length || !sunExposureData) return [];

    let filtered = seats.filter((seat) => {
      const sunExposure = sunExposureData[seat.id] ?? 50; // Default to partial if no data

      // Shade level filter
      if (filters.shadeLevel !== 'any') {
        const matchesShade = matchesShadeLevel(sunExposure, filters.shadeLevel);
        if (!matchesShade) return false;
      }

      // Section level filter
      if (filters.sectionLevel !== 'any') {
        if (seat.level !== filters.sectionLevel) return false;
      }

      // View quality filter
      if (filters.viewQuality !== 'any') {
        if (seat.viewQuality !== filters.viewQuality) return false;
      }

      // Price filter
      if (filters.priceRange !== 'any') {
        if (seat.price !== filters.priceRange) return false;
      }

      // Accessibility filters
      if (filters.accessibility.wheelchairAccessible) {
        if (!seat.accessibility?.wheelchairAccessible) return false;
      }
      if (filters.accessibility.companionSeat) {
        if (!seat.accessibility?.companionSeat) return false;
      }

      return true;
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
      const sunA = sunExposureData[a.id] ?? 50;
      const sunB = sunExposureData[b.id] ?? 50;

      switch (sortBy) {
        case 'shade':
          return sunA - sunB; // Lower sun exposure first (more shade)
        case 'distance':
          return (a.distanceFromHomeplate || 999) - (b.distanceFromHomeplate || 999);
        case 'view-quality':
          const viewOrder: Record<string, number> = { excellent: 0, good: 1, fair: 2, partial: 3, obstructed: 4, poor: 5 };
          return (viewOrder[a.viewQuality || 'fair'] || 2) - (viewOrder[b.viewQuality || 'fair'] || 2);
        default:
          return 0;
      }
    });

    return filtered;
  }, [seats, sunExposureData, filters, sortBy]);

  // Helper function to check if sun exposure matches shade level
  function matchesShadeLevel(sunExposure: number, shadeLevel: ShadeLevel): boolean {
    switch (shadeLevel) {
      case 'full-shade':
        return sunExposure === 0;
      case 'mostly-shade':
        return sunExposure > 0 && sunExposure < 30;
      case 'partial':
        return sunExposure >= 30 && sunExposure <= 70;
      case 'any':
        return true;
      default:
        return true;
    }
  }

  // Handle seat selection
  function handleSelectSeat(seat: Seat) {
    // Navigate to seat detail or section page
    router.push(`/stadium/${stadiumId}/section/${seat.sectionId}?seat=${seat.id}`);
  }

  // Loading state
  if (isLoadingSeats || isLoadingSun) {
    return (
      <div className="search-page">
        <LoadingSpinner message="Loading seats..." />
        <style jsx>{`
          .search-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f9fafb;
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (error || !stadium) {
    return (
      <div className="search-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h1 className="error-title">Unable to Load Seats</h1>
          <p className="error-message">{error || 'Stadium not found'}</p>
          <button onClick={() => router.push('/')} className="back-button">
            Back to Home
          </button>
        </div>

        <style jsx>{`
          .search-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f9fafb;
            padding: 2rem;
          }

          .error-container {
            text-align: center;
            max-width: 500px;
          }

          .error-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
          }

          .error-title {
            font-size: 1.875rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.5rem;
          }

          .error-message {
            font-size: 1rem;
            color: #6b7280;
            margin-bottom: 2rem;
          }

          .back-button {
            padding: 0.75rem 1.5rem;
            background: #3b82f6;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
          }

          .back-button:hover {
            background: #2563eb;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="search-page">
      {/* Header */}
      <header className="search-header">
        <div className="search-header-content">
          <button onClick={() => router.push('/')} className="back-link">
            ← Back
          </button>
          <div>
            <h1 className="page-title">{stadium.name}</h1>
            <p className="page-subtitle">
              {gameDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} at {gameTime}
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="search-content">
        {/* Filters sidebar */}
        <aside className="filters-sidebar">
          <SeatFilters
            filters={filters}
            onFilterChange={setFilters}
            showPriceFilter={false} // Enable when price data is available
          />
        </aside>

        {/* Results */}
        <main className="results-main">
          {/* Results header */}
          <div className="results-header">
            <div className="results-count">
              <span className="count-number">{filteredSeats.length}</span>
              <span className="count-label">seats found</span>
            </div>

            <div className="results-controls">
              <label className="sort-label">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="sort-select"
              >
                <option value="shade">Most Shade</option>
                <option value="distance">Closest to Field</option>
                <option value="view-quality">Best View</option>
              </select>
            </div>
          </div>

          {/* Results grid */}
          {filteredSeats.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3 className="empty-title">No seats match your filters</h3>
              <p className="empty-message">Try adjusting your filter settings to see more results</p>
              <button onClick={() => setFilters(DEFAULT_FILTERS)} className="reset-filters-button">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="results-grid">
              {filteredSeats.map((seat) => (
                <SeatCard
                  key={seat.id}
                  seat={seat}
                  sunExposure={sunExposureData?.[seat.id] ?? 50}
                  onSelect={handleSelectSeat}
                  showSection={true}
                  showPrice={false}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .search-page {
          min-height: 100vh;
          background: #f9fafb;
        }

        .search-header {
          background: white;
          border-bottom: 1px solid #e5e7eb;
          padding: 1.5rem 2rem;
        }

        .search-header-content {
          max-width: 1400px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .back-link {
          background: none;
          border: none;
          color: #3b82f6;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0.5rem;
        }

        .back-link:hover {
          color: #2563eb;
        }

        .page-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .page-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
          margin: 0.25rem 0 0 0;
        }

        .search-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
        }

        .filters-sidebar {
          position: sticky;
          top: 2rem;
          height: fit-content;
        }

        .results-main {
          min-width: 0;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding: 1rem 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .results-count {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
        }

        .count-number {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
        }

        .count-label {
          font-size: 1rem;
          color: #6b7280;
        }

        .results-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .sort-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
        }

        .sort-select {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
        }

        .results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .empty-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .empty-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin-bottom: 0.5rem;
        }

        .empty-message {
          font-size: 1rem;
          color: #6b7280;
          margin-bottom: 2rem;
        }

        .reset-filters-button {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
        }

        .reset-filters-button:hover {
          background: #2563eb;
        }

        @media (max-width: 1024px) {
          .search-content {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .filters-sidebar {
            position: static;
          }

          .results-grid {
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .search-header {
            padding: 1rem;
          }

          .results-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .results-controls {
            width: 100%;
            justify-content: space-between;
          }

          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<LoadingSpinner message="Loading search..." />}>
      <SearchPageContent />
    </Suspense>
  );
}
