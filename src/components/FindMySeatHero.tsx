'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Fuse from 'fuse.js';
import { MLB_STADIUMS } from '../data/stadiums';

interface UniversalSearchResult {
  type: 'stadium' | 'seat';
  stadiumId: string;
  stadiumName: string;
  teamName: string;
  sectionId?: string;
  sectionName?: string;
  row?: string;
  seatNumber?: string;
  url: string;
  matchText: string;
  badges?: string[];
}

interface QuickFilter {
  id: string;
  label: string;
  icon: string;
  description: string;
}

const QUICK_FILTERS: QuickFilter[] = [
  {
    id: 'covered',
    label: 'Covered Seats',
    icon: '☂️',
    description: 'Find seats protected from sun and rain',
  },
  {
    id: 'aisle',
    label: 'Aisle Seats',
    icon: '🚶',
    description: 'Easy access seats',
  },
  {
    id: 'wheelchair',
    label: 'Accessible',
    icon: '♿',
    description: 'Wheelchair accessible seating',
  },
  {
    id: 'excellent-view',
    label: 'Best Views',
    icon: '⭐',
    description: 'Premium sightlines',
  },
];

export function FindMySeatHero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UniversalSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoadingSeatIndices, setIsLoadingSeatIndices] = useState(false);
  const [seatIndicesLoaded, setSeatIndicesLoaded] = useState(false);
  const [allSeats, setAllSeats] = useState<any[]>([]);

  // Create Fuse instance for stadium search
  const stadiumFuse = useMemo(() => {
    const stadiumSearchData = MLB_STADIUMS.map(stadium => ({
      id: stadium.id,
      name: stadium.name,
      team: stadium.team,
      city: stadium.city,
      state: stadium.state,
      keywords: [
        stadium.name.toLowerCase(),
        stadium.team.toLowerCase(),
        stadium.city.toLowerCase(),
        `${stadium.city} ${stadium.team}`.toLowerCase(),
      ],
    }));

    return new Fuse(stadiumSearchData, {
      keys: [
        { name: 'name', weight: 2.0 },
        { name: 'team', weight: 1.5 },
        { name: 'city', weight: 1.0 },
        { name: 'keywords', weight: 0.8 },
      ],
      threshold: 0.3,
      includeScore: true,
    });
  }, []);

  // Load all seat indices (lazy load on first search)
  const loadAllSeatIndices = useCallback(async () => {
    if (seatIndicesLoaded || isLoadingSeatIndices) return;

    setIsLoadingSeatIndices(true);
    console.log('📥 Loading seat indices for universal search...');

    try {
      // Load the manifest first
      const manifestResponse = await fetch('/data/search/seat-indices-manifest.json');
      if (!manifestResponse.ok) {
        console.warn('Seat indices manifest not available');
        return;
      }

      const manifest = await manifestResponse.json();
      const allSeatData: any[] = [];

      // Load seat indices for top 10 stadiums (to avoid loading 1.2M seats)
      const topStadiums = manifest.stadiums.slice(0, 10);

      for (const stadiumInfo of topStadiums) {
        try {
          const seatDataStadiumId =
            stadiumInfo.id === 'dodgers' ? 'dodger-stadium' : stadiumInfo.id;
          const response = await fetch(
            `/data/search/${seatDataStadiumId}-seats.min.json`
          );

          if (response.ok) {
            const seatIndex = await response.json();
            allSeatData.push(...seatIndex.seats.map((seat: any) => ({
              ...seat,
              stadiumId: stadiumInfo.id,
              stadiumName: stadiumInfo.name,
            })));
          }
        } catch (error) {
          console.warn(`Failed to load seats for ${stadiumInfo.id}:`, error);
        }
      }

      setAllSeats(allSeatData);
      setSeatIndicesLoaded(true);
      console.log(`✅ Loaded ${allSeatData.length.toLocaleString()} seats from ${topStadiums.length} stadiums`);
    } catch (error) {
      console.error('Error loading seat indices:', error);
    } finally {
      setIsLoadingSeatIndices(false);
    }
  }, [seatIndicesLoaded, isLoadingSeatIndices]);

  // Perform universal search
  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setShowDropdown(true);

      const results: UniversalSearchResult[] = [];

      // 1. Search stadiums
      const stadiumMatches = stadiumFuse.search(query, { limit: 3 });
      stadiumMatches.forEach(match => {
        results.push({
          type: 'stadium',
          stadiumId: match.item.id,
          stadiumName: match.item.name,
          teamName: match.item.team,
          url: `/stadium/${match.item.id}`,
          matchText: `${match.item.name}`,
        });
      });

      // 2. Search seats (if loaded)
      if (seatIndicesLoaded && allSeats.length > 0) {
        const seatFuse = new Fuse(allSeats, {
          keys: [
            { name: 'sectionId', weight: 2.5 },
            { name: 'sectionName', weight: 2.0 },
            { name: 'row', weight: 2.5 },
            { name: 'seatNumber', weight: 2.5 },
            { name: 'keywords', weight: 1.0 },
          ],
          threshold: 0.3,
          includeScore: true,
        });

        const seatMatches = seatFuse.search(query, { limit: 5 });
        seatMatches.forEach(match => {
          const badges: string[] = [];
          if (match.item.covered) badges.push('Covered');
          if (match.item.isAisle) badges.push('Aisle');
          if (match.item.wheelchairAccessible) badges.push('Wheelchair');
          if (match.item.viewQuality) badges.push(match.item.viewQuality);

          results.push({
            type: 'seat',
            stadiumId: match.item.stadiumId,
            stadiumName: match.item.stadiumName,
            teamName: '',
            sectionId: match.item.sectionId,
            sectionName: match.item.sectionName,
            row: match.item.row,
            seatNumber: match.item.seatNumber,
            url: match.item.url,
            matchText: `${match.item.sectionName} • Row ${match.item.row} • Seat ${match.item.seatNumber}`,
            badges,
          });
        });
      }

      setSearchResults(results);
      setIsSearching(false);
      setSelectedIndex(-1);
    },
    [stadiumFuse, seatIndicesLoaded, allSeats]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    performSearch(value);
  };

  // Load seat indices on first user interaction
  useEffect(() => {
    if (searchQuery.length > 0 && !seatIndicesLoaded && !isLoadingSeatIndices) {
      loadAllSeatIndices();
    }
  }, [searchQuery, seatIndicesLoaded, isLoadingSeatIndices, loadAllSeatIndices]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          router.push(searchResults[selectedIndex].url);
          setShowDropdown(false);
          setSearchQuery('');
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle result selection
  const handleResultClick = (result: UniversalSearchResult) => {
    router.push(result.url);
    setShowDropdown(false);
    setSearchQuery('');
  };

  // Handle quick filter click
  const handleQuickFilterClick = (filterId: string) => {
    // Navigate to first available stadium with filter applied
    // For now, just navigate to first stadium (can be enhanced later)
    const firstStadium = MLB_STADIUMS[0];
    router.push(`/stadium/${firstStadium.id}?filter=${filterId}`);
  };

  return (
    <section className="find-my-seat-hero">
      <div className="hero-background"></div>

      <div className="hero-container">
        <div className="hero-content">
          {/* Main Headline */}
          <h1 className="hero-title">
            Find Your Perfect Seat
          </h1>
          <p className="hero-subtitle">
            Search 1.2M+ seats across all 30 MLB stadiums. Find covered seats, aisle access, or your exact seat number.
          </p>

          {/* Universal Search Bar */}
          <div className="search-container">
            <div className="search-wrapper">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                className="search-input"
                placeholder="Search by stadium, section, or seat (e.g., 'Dodgers 101 Row G Seat 12')"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              />
              {isSearching && (
                <div className="search-loading">
                  <div className="loading-spinner"></div>
                </div>
              )}
            </div>

            {/* Search Results Dropdown */}
            {showDropdown && searchResults.length > 0 && (
              <div className="search-dropdown">
                {/* Group by type */}
                {searchResults.filter(r => r.type === 'stadium').length > 0 && (
                  <>
                    <div className="dropdown-header">Stadiums</div>
                    {searchResults
                      .filter(r => r.type === 'stadium')
                      .map((result, index) => (
                        <button
                          key={`${result.type}-${result.url}`}
                          className={`dropdown-item ${
                            selectedIndex === index ? 'selected' : ''
                          }`}
                          onClick={() => handleResultClick(result)}
                          onMouseEnter={() => setSelectedIndex(index)}
                        >
                          <div className="item-icon">🏟️</div>
                          <div className="item-content">
                            <div className="item-title">{result.stadiumName}</div>
                            <div className="item-subtitle">{result.teamName}</div>
                          </div>
                        </button>
                      ))}
                  </>
                )}

                {searchResults.filter(r => r.type === 'seat').length > 0 && (
                  <>
                    <div className="dropdown-header">Individual Seats</div>
                    {searchResults
                      .filter(r => r.type === 'seat')
                      .map((result, index) => {
                        const adjustedIndex =
                          searchResults.filter(r => r.type === 'stadium').length + index;
                        return (
                          <button
                            key={`${result.type}-${result.url}`}
                            className={`dropdown-item ${
                              selectedIndex === adjustedIndex ? 'selected' : ''
                            }`}
                            onClick={() => handleResultClick(result)}
                            onMouseEnter={() => setSelectedIndex(adjustedIndex)}
                          >
                            <div className="item-icon">💺</div>
                            <div className="item-content">
                              <div className="item-title">{result.matchText}</div>
                              <div className="item-subtitle">{result.stadiumName}</div>
                              {result.badges && result.badges.length > 0 && (
                                <div className="item-badges">
                                  {result.badges.slice(0, 3).map(badge => (
                                    <span key={badge} className="badge">
                                      {badge}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                  </>
                )}

                {!seatIndicesLoaded && searchQuery.length > 0 && (
                  <div className="dropdown-footer">
                    <div className="loading-message">
                      Loading seat data for better results...
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Quick Filters */}
          <div className="quick-filters">
            <div className="filters-label">Popular Searches:</div>
            <div className="filters-grid">
              {QUICK_FILTERS.map(filter => (
                <button
                  key={filter.id}
                  className="filter-button"
                  onClick={() => handleQuickFilterClick(filter.id)}
                  title={filter.description}
                >
                  <span className="filter-icon">{filter.icon}</span>
                  <span className="filter-label">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Featured Stadiums */}
          <div className="featured-stadiums">
            <h2 className="featured-title">Browse by Stadium</h2>
            <div className="stadiums-grid">
              {MLB_STADIUMS.slice(0, 6).map(stadium => (
                <button
                  key={stadium.id}
                  className="stadium-card"
                  onClick={() => router.push(`/stadium/${stadium.id}`)}
                >
                  <div className="stadium-name">{stadium.team}</div>
                  <div className="stadium-venue">{stadium.name}</div>
                </button>
              ))}
            </div>
            <button
              className="view-all-button"
              onClick={() => {
                const appSection = document.getElementById('app-section');
                if (appSection) {
                  appSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              View All 30 MLB Stadiums →
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .find-my-seat-hero {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%);
          padding: 4rem 1rem 3rem;
          overflow: hidden;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 1px,
            transparent 1px
          );
          background-size: 50px 50px;
          opacity: 0.3;
          z-index: 0;
        }

        .hero-container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
        }

        .hero-content {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-radius: 24px;
          padding: 3rem 2rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .hero-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 800;
          color: #0f766e;
          text-align: center;
          margin-bottom: 1rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .hero-subtitle {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          color: #374151;
          text-align: center;
          margin-bottom: 2.5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.6;
        }

        .search-container {
          position: relative;
          max-width: 800px;
          margin: 0 auto 2.5rem;
        }

        .search-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 16px;
          padding: 0 1.5rem;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .search-wrapper:focus-within {
          border-color: #0f766e;
          box-shadow: 0 0 0 4px rgba(15, 118, 110, 0.1),
            0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .search-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          padding: 1.25rem 0;
          font-size: 1.125rem;
          background: transparent;
          color: #1f2937;
        }

        .search-input::placeholder {
          color: #9ca3af;
        }

        .search-loading {
          display: flex;
          align-items: center;
          margin-left: 1rem;
        }

        .loading-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #e5e7eb;
          border-top-color: #0f766e;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .search-dropdown {
          position: absolute;
          top: calc(100% + 0.5rem);
          left: 0;
          right: 0;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
          max-height: 400px;
          overflow-y: auto;
          z-index: 50;
        }

        .dropdown-header {
          padding: 0.75rem 1.25rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: #6b7280;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
          letter-spacing: 0.05em;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          width: 100%;
          padding: 1rem 1.25rem;
          border: none;
          background: none;
          cursor: pointer;
          transition: background-color 0.15s ease;
          text-align: left;
          border-bottom: 1px solid #f3f4f6;
        }

        .dropdown-item:hover,
        .dropdown-item.selected {
          background: #f0fdfa;
        }

        .item-icon {
          font-size: 1.5rem;
          margin-right: 1rem;
        }

        .item-content {
          flex: 1;
        }

        .item-title {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .item-subtitle {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .item-badges {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-block;
          padding: 0.125rem 0.5rem;
          background: #e0f2fe;
          color: #0c4a6e;
          border-radius: 9999px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .dropdown-footer {
          padding: 1rem 1.25rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }

        .loading-message {
          font-size: 0.875rem;
          color: #6b7280;
          text-align: center;
        }

        .quick-filters {
          max-width: 800px;
          margin: 0 auto 3rem;
        }

        .filters-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 1rem;
          text-align: center;
        }

        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 0.75rem;
        }

        .filter-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.25rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-weight: 500;
          color: #374151;
        }

        .filter-button:hover {
          border-color: #0f766e;
          background: #f0fdfa;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .filter-icon {
          font-size: 1.25rem;
        }

        .filter-label {
          font-size: 0.875rem;
        }

        .featured-stadiums {
          margin-top: 3rem;
          padding-top: 3rem;
          border-top: 2px solid #e5e7eb;
        }

        .featured-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #0f766e;
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .stadiums-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stadium-card {
          padding: 1.5rem;
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .stadium-card:hover {
          border-color: #0f766e;
          transform: translateY(-2px);
          box-shadow: 0 8px 12px -3px rgba(0, 0, 0, 0.1);
        }

        .stadium-name {
          font-weight: 700;
          color: #0f766e;
          margin-bottom: 0.25rem;
          font-size: 1.125rem;
        }

        .stadium-venue {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .view-all-button {
          display: block;
          width: 100%;
          padding: 1rem;
          background: #0f766e;
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .view-all-button:hover {
          background: #0d9488;
          transform: translateY(-2px);
          box-shadow: 0 8px 12px -3px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 768px) {
          .find-my-seat-hero {
            padding: 2rem 1rem;
          }

          .hero-content {
            padding: 2rem 1.5rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-subtitle {
            font-size: 1rem;
          }

          .search-input {
            font-size: 1rem;
            padding: 1rem 0;
          }

          .filters-grid {
            grid-template-columns: 1fr 1fr;
          }

          .stadiums-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .search-wrapper,
          .filter-button,
          .stadium-card,
          .view-all-button {
            transition: none;
          }

          .loading-spinner {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
