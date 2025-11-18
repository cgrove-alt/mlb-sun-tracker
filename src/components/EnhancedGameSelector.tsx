'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Select from 'react-select';
import { format, parse, isAfter, isBefore, isWithinInterval } from 'date-fns';
import { MLBGame, mlbApi } from '../services/mlbApi';
import { Stadium } from '../data/stadiums';
import { Calendar, Clock, Sun, Search, Filter, ChevronDown } from 'lucide-react';
import './GameSelector.css';

interface EnhancedGameSelectorProps {
  selectedStadium: Stadium | null;
  onGameSelect: (game: MLBGame | null, dateTime: Date | null) => void;
  onStadiumChange: (stadium: Stadium | null) => void;
  stadiums: Stadium[];
  onGamesLoaded?: (games: MLBGame[]) => void;
}

export const EnhancedGameSelector: React.FC<EnhancedGameSelectorProps> = ({
  selectedStadium,
  onGameSelect,
  onStadiumChange,
  stadiums,
  onGamesLoaded
}) => {
  // State for 2026 games
  const [games, setGames] = useState<MLBGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<MLBGame[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedYear] = useState(2026); // Fixed to 2026
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedOpponent, setSelectedOpponent] = useState<string | null>(null);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<'day' | 'night' | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Stadium options
  const stadiumOptions = useMemo(() =>
    stadiums
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(stadium => ({
        value: stadium.id,
        label: `${stadium.name} - ${stadium.team}`,
        stadium: stadium
      })),
    [stadiums]
  );

  // Opponent teams for filtering
  const opponentOptions = useMemo(() => {
    if (!games.length) return [];

    const opponents = new Set<string>();
    games.forEach(game => {
      const awayTeam = game.teams?.away?.team?.name;
      if (awayTeam && awayTeam !== selectedStadium?.team) {
        opponents.add(awayTeam);
      }
    });

    return Array.from(opponents)
      .sort()
      .map(team => ({
        value: team,
        label: team
      }));
  }, [games, selectedStadium]);

  // Month options
  const monthOptions = [
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' }
  ];

  // Load games for 2026
  const loadGames = useCallback(async () => {
    if (!selectedStadium) return;

    setIsLoading(true);
    setError(null);

    try {
      // Load full 2026 season
      const startDate = '2026-03-01';
      const endDate = '2026-10-31';

      const allGames = await mlbApi.getSchedule(startDate, endDate, 2026);
      const homeGames = mlbApi.getHomeGamesForStadium(selectedStadium.id, allGames);

      setGames(homeGames);
      setFilteredGames(homeGames);

      if (onGamesLoaded) {
        onGamesLoaded(homeGames);
      }
    } catch (err) {
      console.error('Error loading 2026 games:', err);
      setError('Unable to load 2026 schedule. Please try again.');
      setGames([]);
      setFilteredGames([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStadium, onGamesLoaded]);

  // Apply filters
  useEffect(() => {
    let filtered = [...games];

    // Month filter
    if (selectedMonth !== null) {
      filtered = filtered.filter(game => {
        const gameDate = new Date(game.gameDate);
        return gameDate.getMonth() + 1 === selectedMonth;
      });
    }

    // Date range filter
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(game => {
        const gameDate = new Date(game.gameDate);
        return isWithinInterval(gameDate, { start: dateRange.start!, end: dateRange.end! });
      });
    }

    // Opponent filter
    if (selectedOpponent) {
      filtered = filtered.filter(game => {
        const awayTeam = game.teams?.away?.team?.name;
        return awayTeam === selectedOpponent;
      });
    }

    // Time filter (day/night games)
    if (selectedTimeFilter !== 'all') {
      filtered = filtered.filter(game => {
        const gameTime = new Date(game.gameDate);
        const hour = gameTime.getHours();

        if (selectedTimeFilter === 'day') {
          return hour < 17; // Before 5 PM
        } else {
          return hour >= 17; // 5 PM or later
        }
      });
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(game => {
        const awayTeam = game.teams?.away?.team?.name?.toLowerCase() || '';
        const gameDate = format(new Date(game.gameDate), 'MMMM d').toLowerCase();
        return awayTeam.includes(query) || gameDate.includes(query);
      });
    }

    setFilteredGames(filtered);
  }, [games, selectedMonth, selectedOpponent, selectedTimeFilter, dateRange, searchQuery]);

  // Load games when stadium changes
  useEffect(() => {
    if (selectedStadium) {
      loadGames();
    }
  }, [selectedStadium, loadGames]);

  // Helper to get sun condition preview
  const getSunCondition = (game: MLBGame) => {
    const gameTime = new Date(game.gameDate);
    const hour = gameTime.getHours();

    if (hour < 12) return { label: 'Morning Sun', color: 'text-yellow-500' };
    if (hour < 15) return { label: 'Peak Sun', color: 'text-orange-500' };
    if (hour < 17) return { label: 'Afternoon Sun', color: 'text-yellow-600' };
    if (hour < 19) return { label: 'Golden Hour', color: 'text-orange-400' };
    return { label: 'Night Game', color: 'text-blue-500' };
  };

  return (
    <div className="enhanced-game-selector">
      {/* Stadium Selector */}
      <div className="selector-section">
        <label className="selector-label">
          <Calendar className="label-icon" />
          Select Stadium for 2026 Season
        </label>
        <Select
          options={stadiumOptions}
          value={stadiumOptions.find(opt => opt.value === selectedStadium?.id)}
          onChange={(option) => onStadiumChange(option?.stadium || null)}
          placeholder="Choose a stadium..."
          className="stadium-selector"
          classNamePrefix="select"
        />
      </div>

      {selectedStadium && (
        <>
          {/* Search Bar */}
          <div className="search-section">
            <div className="search-input-wrapper">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search by opponent or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="filter-toggle"
            >
              <Filter className="filter-icon" />
              Filters
              <ChevronDown className={`chevron-icon ${showAdvancedFilters ? 'rotated' : ''}`} />
            </button>
          </div>

          {/* Advanced Filters */}
          {showAdvancedFilters && (
            <div className="filters-panel">
              <div className="filter-row">
                {/* Month Filter */}
                <div className="filter-item">
                  <label>Month</label>
                  <Select
                    options={monthOptions}
                    value={monthOptions.find(opt => opt.value === selectedMonth)}
                    onChange={(option) => setSelectedMonth(option?.value || null)}
                    placeholder="All months"
                    isClearable
                  />
                </div>

                {/* Opponent Filter */}
                <div className="filter-item">
                  <label>Opponent</label>
                  <Select
                    options={opponentOptions}
                    value={opponentOptions.find(opt => opt.value === selectedOpponent)}
                    onChange={(option) => setSelectedOpponent(option?.value || null)}
                    placeholder="All teams"
                    isClearable
                  />
                </div>

                {/* Time Filter */}
                <div className="filter-item">
                  <label>Game Time</label>
                  <div className="time-filter-buttons">
                    <button
                      className={`time-btn ${selectedTimeFilter === 'all' ? 'active' : ''}`}
                      onClick={() => setSelectedTimeFilter('all')}
                    >
                      All
                    </button>
                    <button
                      className={`time-btn ${selectedTimeFilter === 'day' ? 'active' : ''}`}
                      onClick={() => setSelectedTimeFilter('day')}
                    >
                      <Sun className="btn-icon" />
                      Day
                    </button>
                    <button
                      className={`time-btn ${selectedTimeFilter === 'night' ? 'active' : ''}`}
                      onClick={() => setSelectedTimeFilter('night')}
                    >
                      <Clock className="btn-icon" />
                      Night
                    </button>
                  </div>
                </div>
              </div>

              {/* Date Range */}
              <div className="filter-row">
                <div className="filter-item">
                  <label>Date Range</label>
                  <div className="date-range">
                    <input
                      type="date"
                      min="2026-03-01"
                      max="2026-10-31"
                      onChange={(e) => setDateRange(prev => ({
                        ...prev,
                        start: e.target.value ? new Date(e.target.value) : null
                      }))}
                      className="date-input"
                    />
                    <span className="date-separator">to</span>
                    <input
                      type="date"
                      min="2026-03-01"
                      max="2026-10-31"
                      onChange={(e) => setDateRange(prev => ({
                        ...prev,
                        end: e.target.value ? new Date(e.target.value) : null
                      }))}
                      className="date-input"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Games List */}
          <div className="games-section">
            <div className="games-header">
              <h3 className="games-title">
                2026 Home Games ({filteredGames.length} games)
              </h3>
              {filteredGames.length > 0 && (
                <button className="sun-optimizer">
                  <Sun className="optimizer-icon" />
                  Find Games with Least Sun
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading 2026 schedule...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p className="error-message">{error}</p>
                <button onClick={loadGames} className="retry-button">
                  Try Again
                </button>
              </div>
            ) : filteredGames.length === 0 ? (
              <div className="no-games">
                <p>No games match your filters</p>
              </div>
            ) : (
              <div className="games-list">
                {filteredGames.map((game) => {
                  const gameDate = new Date(game.gameDate);
                  const sunCondition = getSunCondition(game);

                  return (
                    <button
                      key={game.gamePk}
                      onClick={() => onGameSelect(game, gameDate)}
                      className="game-card"
                    >
                      <div className="game-date">
                        <div className="date-day">{format(gameDate, 'EEE')}</div>
                        <div className="date-full">{format(gameDate, 'MMM d')}</div>
                      </div>

                      <div className="game-info">
                        <div className="game-teams">
                          vs {game.teams?.away?.team?.name}
                        </div>
                        <div className="game-time">
                          {format(gameDate, 'h:mm a')}
                        </div>
                      </div>

                      <div className={`sun-condition ${sunCondition.color}`}>
                        <Sun className="sun-icon" />
                        {sunCondition.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      <style jsx>{`
        .enhanced-game-selector {
          max-width: 800px;
          margin: 0 auto;
          padding: 1.5rem;
        }

        .selector-section {
          margin-bottom: 1.5rem;
        }

        .selector-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .search-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .search-input-wrapper {
          flex: 1;
          position: relative;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1rem;
        }

        .search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          color: #6b7280;
        }

        .filter-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
        }

        .chevron-icon {
          width: 16px;
          height: 16px;
          transition: transform 0.2s;
        }

        .chevron-icon.rotated {
          transform: rotate(180deg);
        }

        .filters-panel {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .filter-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .filter-row:last-child {
          margin-bottom: 0;
        }

        .filter-item label {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #6b7280;
          margin-bottom: 0.5rem;
        }

        .time-filter-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .time-btn {
          flex: 1;
          padding: 0.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }

        .time-btn.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }

        .date-range {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .date-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
        }

        .date-separator {
          color: #6b7280;
        }

        .games-section {
          margin-top: 2rem;
        }

        .games-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .games-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1f2937;
        }

        .sun-optimizer {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
          border-radius: 0.5rem;
          cursor: pointer;
          font-weight: 500;
        }

        .games-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .game-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .game-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .game-date {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.5rem;
          background: #f9fafb;
          border-radius: 0.375rem;
        }

        .date-day {
          font-size: 0.75rem;
          color: #6b7280;
          text-transform: uppercase;
        }

        .date-full {
          font-weight: 600;
          color: #1f2937;
        }

        .game-info {
          flex: 1;
          margin: 0 1rem;
        }

        .game-teams {
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.25rem;
        }

        .game-time {
          font-size: 0.875rem;
          color: #6b7280;
        }

        .sun-condition {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .loading-state,
        .error-state,
        .no-games {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f4f6;
          border-top-color: #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .retry-button {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .filter-row {
            grid-template-columns: 1fr;
          }

          .games-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>

      <style jsx global>{`
        .label-icon,
        .filter-icon,
        .btn-icon,
        .optimizer-icon,
        .sun-icon {
          width: 16px;
          height: 16px;
        }
      `}</style>
    </div>
  );
};

export default EnhancedGameSelector;