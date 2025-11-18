'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Select, { SingleValue } from 'react-select';
import { format, parse, isBefore, getMonth } from 'date-fns';
import { MLB_STADIUMS } from '../data/stadiums';
import { mlbApi, MLBGame } from '../services/mlbApi';

interface StadiumOption {
  value: string;
  label: string;
}

interface GameOption {
  value: number; // gamePk
  label: string;
  game: MLBGame;
}

const MONTHS = [
  { value: 3, label: 'Apr' },
  { value: 4, label: 'May' },
  { value: 5, label: 'Jun' },
  { value: 6, label: 'Jul' },
  { value: 7, label: 'Aug' },
  { value: 8, label: 'Sep' },
  { value: 9, label: 'Oct' },
];

const customSelectStyles = {
  control: (base: any) => ({
    ...base,
    backgroundColor: '#ffffff',
    borderColor: '#d1d5db',
    '&:hover': {
      borderColor: '#9ca3af',
    },
    minHeight: '48px',
    fontSize: '16px',
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#ffffff',
    zIndex: 9999,
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isFocused ? '#f3f4f6' : '#ffffff',
    color: '#111827',
    '&:active': {
      backgroundColor: '#e5e7eb',
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#111827',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#6b7280',
  }),
};

export function StadiumGameDropdownSelector() {
  const router = useRouter();
  const [selectedStadium, setSelectedStadium] = useState<StadiumOption | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameOption | null>(null);
  const [games, setGames] = useState<MLBGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<MLBGame[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  // Stadium options (all 30 MLB stadiums, sorted alphabetically)
  const stadiumOptions: StadiumOption[] = MLB_STADIUMS
    .map(stadium => ({
      value: stadium.id,
      label: stadium.name,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  // Load games when stadium is selected
  const loadGames = useCallback(async (stadiumId: string) => {
    setIsLoadingGames(true);
    setGames([]);
    setFilteredGames([]);
    setSelectedGame(null);
    setSelectedMonth(null);

    try {
      // Fetch all 2026 games
      const allGames = await mlbApi.getSchedule('2026-03-01', '2026-10-31', 2026);

      // Get home games for selected stadium
      const homeGames = mlbApi.getHomeGamesForStadium(stadiumId, allGames);

      // Filter to only show future/remaining games
      const today = new Date();
      const futureGames = homeGames.filter(game => {
        const gameDate = new Date(game.gameDate);
        return !isBefore(gameDate, today);
      });

      setGames(futureGames);
      setFilteredGames(futureGames);
    } catch (error) {
      console.error('Failed to load games:', error);
    } finally {
      setIsLoadingGames(false);
    }
  }, []);

  // Handle stadium selection
  const handleStadiumChange = (option: SingleValue<StadiumOption>) => {
    setSelectedStadium(option);
    if (option) {
      loadGames(option.value);
    } else {
      setGames([]);
      setFilteredGames([]);
      setSelectedGame(null);
    }
  };

  // Handle month filter
  const handleMonthFilter = (monthValue: number | null) => {
    setSelectedMonth(monthValue);
    setSelectedGame(null);

    if (monthValue === null) {
      setFilteredGames(games);
    } else {
      const filtered = games.filter(game => {
        const gameDate = new Date(game.gameDate);
        return getMonth(gameDate) === monthValue;
      });
      setFilteredGames(filtered);
    }
  };

  // Handle game selection
  const handleGameChange = (option: SingleValue<GameOption>) => {
    setSelectedGame(option);

    if (option && selectedStadium) {
      const game = option.game;
      const gameDate = new Date(game.gameDate);
      const gameTime = format(gameDate, 'HH:mm');
      const gameDateStr = format(gameDate, 'yyyy-MM-dd');

      // Navigate to stadium page with game context (including full date)
      router.push(`/stadium/${selectedStadium.value}?game=${game.gamePk}&gameDate=${gameDateStr}&gameTime=${gameTime}`);
    }
  };

  // Format game options for dropdown
  const gameOptions: GameOption[] = filteredGames.map(game => {
    const gameDate = new Date(game.gameDate);
    const dayNightIcon = game.dayNight === 'day' ? '☀️' : '🌙';
    const opponent = game.teams.away.team.name;

    return {
      value: game.gamePk,
      label: `${format(gameDate, 'MMM d')} · ${format(gameDate, 'h:mm a')} ${dayNightIcon} vs ${opponent}`,
      game,
    };
  });

  return (
    <div className="stadium-game-selector">
      <div className="selector-wrapper">
        {/* Stadium Dropdown */}
        <div className="selector-field">
          <label htmlFor="stadium-select" className="selector-label">
            🏟️ Select Stadium
          </label>
          <Select
            id="stadium-select"
            options={stadiumOptions}
            value={selectedStadium}
            onChange={handleStadiumChange}
            placeholder="Choose an MLB stadium..."
            styles={customSelectStyles}
            isClearable
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
          />
        </div>

        {/* Game Dropdown (only shown after stadium selection) */}
        {selectedStadium && (
          <>
            {/* Month Filter Buttons */}
            {games.length > 0 && (
              <div className="month-filters">
                <button
                  onClick={() => handleMonthFilter(null)}
                  className={`month-filter-btn ${selectedMonth === null ? 'active' : ''}`}
                >
                  All
                </button>
                {MONTHS.map(month => {
                  const monthGames = games.filter(g => getMonth(new Date(g.gameDate)) === month.value);
                  if (monthGames.length === 0) return null;

                  return (
                    <button
                      key={month.value}
                      onClick={() => handleMonthFilter(month.value)}
                      className={`month-filter-btn ${selectedMonth === month.value ? 'active' : ''}`}
                    >
                      {month.label} ({monthGames.length})
                    </button>
                  );
                })}
              </div>
            )}

            <div className="selector-field">
              <label htmlFor="game-select" className="selector-label">
                ⚾ Select 2026 Game
                {isLoadingGames && ' (Loading...)'}
                {!isLoadingGames && games.length > 0 && ` (${filteredGames.length} remaining games)`}
              </label>
              <Select
                id="game-select"
                options={gameOptions}
                value={selectedGame}
                onChange={handleGameChange}
                placeholder={
                  isLoadingGames
                    ? 'Loading games...'
                    : games.length === 0
                    ? 'No upcoming games found'
                    : 'Choose a game...'
                }
                styles={customSelectStyles}
                isDisabled={isLoadingGames || games.length === 0}
                isLoading={isLoadingGames}
                isClearable
                menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
              />
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        .stadium-game-selector {
          width: 100%;
          margin: 2rem 0;
        }

        .selector-wrapper {
          max-width: 600px;
          margin: 0 auto;
        }

        .selector-field {
          margin-bottom: 1.5rem;
        }

        .selector-label {
          display: block;
          margin-bottom: 0.5rem;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }

        .month-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .month-filter-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #d1d5db;
          background: #ffffff;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .month-filter-btn:hover {
          background: #f3f4f6;
          border-color: #9ca3af;
        }

        .month-filter-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: #ffffff;
        }

        .month-filter-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        @media (max-width: 640px) {
          .month-filters {
            justify-content: center;
          }

          .month-filter-btn {
            padding: 0.4rem 0.8rem;
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}
