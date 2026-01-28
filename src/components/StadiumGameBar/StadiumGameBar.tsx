'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { format } from 'date-fns';
import { UnifiedVenue, getVenuesByLeague, getMiLBVenuesByLevel, getMiLBLevels, isMiLBVenue } from '../../data/unifiedVenues';
import { MLBGame, mlbApi } from '../../services/mlbApi';
import { MiLBGame, milbApi, MILB_LEVELS } from '../../services/milbApi';
import { NFLGame, nflApi } from '../../services/nflApi';
import { WorldCupGame, worldCupApi } from '../../services/worldCupApi';
import { getTeamIdFromVenueId, getVenueIdFromStringId } from '../../data/milbTeamMapping';
import { preferencesStorage } from '../../utils/preferences';
import { formatGameTimeInStadiumTZ } from '../../utils/dateTimeUtils';
import { LeagueId } from '../../types/desktop-app';
import styles from './StadiumGameBar.module.css';

type GameType = MLBGame | MiLBGame | NFLGame | WorldCupGame;

interface StadiumGameBarProps {
  selectedLeague: LeagueId;
  selectedVenue: UnifiedVenue | null;
  onVenueChange: (venue: UnifiedVenue | null) => void;
  onGameSelect?: (game: GameType | null, dateTime: Date | null) => void;
  className?: string;
}

interface VenueOption {
  value: string;
  label: string;
  venue: UnifiedVenue;
}

interface GameOption {
  value: string;
  label: string;
  game: GameType;
}

// Custom select styles for the bar
const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    backgroundColor: 'white',
    borderColor: state.isFocused ? '#3b82f6' : '#e2e8f0',
    borderRadius: '8px',
    minHeight: '44px',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
    '&:hover': {
      borderColor: '#94a3b8',
    },
  }),
  singleValue: (provided: any) => ({
    ...provided,
    color: '#1e293b',
    fontWeight: 500,
  }),
  placeholder: (provided: any) => ({
    ...provided,
    color: '#94a3b8',
  }),
  option: (provided: any, state: any) => ({
    ...provided,
    color: state.isSelected ? 'white' : '#1e293b',
    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#f1f5f9' : 'white',
    fontWeight: state.isSelected ? 600 : 400,
    padding: '10px 12px',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: '#e2e8f0',
    },
  }),
  menu: (provided: any) => ({
    ...provided,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid #e2e8f0',
    zIndex: 100,
  }),
  menuList: (provided: any) => ({
    ...provided,
    padding: '4px',
    maxHeight: '300px',
  }),
  input: (provided: any) => ({
    ...provided,
    color: '#1e293b',
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided: any) => ({
    ...provided,
    color: '#94a3b8',
    '&:hover': {
      color: '#64748b',
    },
  }),
};

export const StadiumGameBar: React.FC<StadiumGameBarProps> = ({
  selectedLeague,
  selectedVenue,
  onVenueChange,
  onGameSelect,
  className = '',
}) => {
  const [selectedMiLBLevel, setSelectedMiLBLevel] = useState<string>(() => {
    return preferencesStorage.get('selectedMiLBLevel', 'AAA');
  });
  const [games, setGames] = useState<GameType[]>([]);
  const [gamesLoading, setGamesLoading] = useState(false);
  const [selectedGameOption, setSelectedGameOption] = useState<GameOption | null>(null);
  const [viewMode, setViewMode] = useState<'games' | 'custom'>(() => {
    return preferencesStorage.get('viewMode', 'games');
  });
  const [customDate, setCustomDate] = useState<string>(() => {
    return preferencesStorage.get('lastUsedDate', format(new Date(), 'yyyy-MM-dd'));
  });
  const [customTime, setCustomTime] = useState<string>(() => {
    return preferencesStorage.get('lastUsedTime', '13:00');
  });

  // Get all venues for the selected league
  const allVenuesForLeague = useMemo(() => {
    if (selectedLeague === 'MiLB') {
      return getMiLBVenuesByLevel(selectedMiLBLevel);
    }
    return getVenuesByLeague(selectedLeague);
  }, [selectedLeague, selectedMiLBLevel]);

  // MiLB level options
  const milbLevelOptions = useMemo(() => {
    const levels = getMiLBLevels();
    return levels.map(level => {
      const venues = getMiLBVenuesByLevel(level);
      let displayName = level;
      switch (level) {
        case 'AAA': displayName = 'Triple-A (AAA)'; break;
        case 'AA': displayName = 'Double-A (AA)'; break;
        case 'A+': displayName = 'High-A (A+)'; break;
        case 'A': displayName = 'Single-A (A)'; break;
      }
      return {
        value: level,
        label: `${displayName} - ${venues.length} venues`,
      };
    });
  }, []);

  // Async load venues for search (all venues)
  const loadVenueOptions = useCallback(
    async (inputValue: string): Promise<VenueOption[]> => {
      const searchTerm = inputValue.toLowerCase().trim();

      // Filter venues by search term
      const filtered = allVenuesForLeague.filter(venue => {
        if (!searchTerm) return true;
        return (
          venue.name.toLowerCase().includes(searchTerm) ||
          venue.team.toLowerCase().includes(searchTerm) ||
          venue.city.toLowerCase().includes(searchTerm)
        );
      });

      // Sort alphabetically and limit to 50 for performance
      const sorted = filtered.sort((a, b) => a.name.localeCompare(b.name)).slice(0, 50);

      return sorted.map(venue => ({
        value: venue.id,
        label: `${venue.name} - ${venue.team}`,
        venue,
      }));
    },
    [allVenuesForLeague]
  );

  // Default venue options (first 20)
  const defaultVenueOptions = useMemo(() => {
    return allVenuesForLeague
      .sort((a, b) => a.name.localeCompare(b.name))
      .slice(0, 20)
      .map(venue => ({
        value: venue.id,
        label: `${venue.name} - ${venue.team}`,
        venue,
      }));
  }, [allVenuesForLeague]);

  // Load games when venue changes
  useEffect(() => {
    const loadGames = async () => {
      if (!selectedVenue || viewMode !== 'games') {
        setGames([]);
        setSelectedGameOption(null);
        return;
      }

      setGamesLoading(true);
      setGames([]);
      setSelectedGameOption(null);

      try {
        const now = new Date();
        const currentYear = now.getFullYear();

        if (selectedVenue.league === 'MLB') {
          const endDate = new Date(currentYear, 9, 31);
          const schedule = await mlbApi.getSchedule(
            now.toISOString().split('T')[0],
            endDate.toISOString().split('T')[0]
          );
          const homeGames = mlbApi.getHomeGamesForStadium(selectedVenue.id, schedule);
          setGames(homeGames);
        } else if (selectedVenue.league === 'MiLB') {
          const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          const venueId = getVenueIdFromStringId(selectedVenue.id);
          const teamId = venueId ? getTeamIdFromVenueId(venueId) : null;

          if (teamId && venueId) {
            let sportId = 11;
            if (selectedVenue.level) {
              switch (selectedVenue.level) {
                case 'AAA': sportId = MILB_LEVELS.AAA.id; break;
                case 'AA': sportId = MILB_LEVELS.AA.id; break;
                case 'A+': sportId = MILB_LEVELS.HIGH_A.id; break;
                case 'A': sportId = MILB_LEVELS.LOW_A.id; break;
                case 'R': sportId = MILB_LEVELS.ROOKIE.id; break;
                case 'ACL': sportId = MILB_LEVELS.COMPLEX_AZL.id; break;
                case 'FCL': sportId = MILB_LEVELS.COMPLEX_FCL.id; break;
              }
            }
            const schedule = await milbApi.getTeamScheduleByLevel(
              teamId,
              now.toISOString().split('T')[0],
              endDate.toISOString().split('T')[0],
              sportId
            );
            const homeGames = milbApi.getHomeGamesForVenue(venueId, schedule);
            setGames(homeGames);
          }
        } else if (selectedVenue.league === 'NFL') {
          const nflGames = await nflApi.getUpcomingVenueGames(selectedVenue.id);
          setGames(nflGames);
        } else if (selectedVenue.league === 'WorldCup') {
          const wcMatches = await worldCupApi.getGamesForVenue(selectedVenue.id);
          setGames(wcMatches);
        }
      } catch (error) {
        console.error('[StadiumGameBar] Error loading games:', error);
        setGames([]);
      } finally {
        setGamesLoading(false);
      }
    };

    const timeoutId = setTimeout(loadGames, 200);
    return () => clearTimeout(timeoutId);
  }, [selectedVenue, viewMode]);

  // Convert games to options
  const gameOptions: GameOption[] = useMemo(() => {
    return games.map(game => {
      let gameDate: Date;
      if ('gameDate' in game) {
        gameDate = new Date(game.gameDate);
      } else if ('date' in game && 'time' in game) {
        const wcGame = game as WorldCupGame;
        gameDate = new Date(`${wcGame.date}T${wcGame.time}`);
      } else {
        gameDate = new Date();
      }

      const venueTimezone = selectedVenue?.timezone || 'America/New_York';
      const formattedTime = formatGameTimeInStadiumTZ(gameDate, venueTimezone, true);

      let label: string;
      let gameId: string;

      if ('teams' in game) {
        label = `${formattedTime} - ${game.teams.away.team.name} @ ${game.teams.home.team.name}`;
        gameId = game.gamePk.toString();
      } else if ('matchId' in game) {
        const wcGame = game as WorldCupGame;
        label = `${formattedTime} - ${wcGame.homeTeam} vs ${wcGame.awayTeam}`;
        gameId = wcGame.matchId;
      } else {
        const nflGame = game as NFLGame;
        label = `${formattedTime} - ${nflGame.awayTeam.name} @ ${nflGame.homeTeam.name}`;
        gameId = nflGame.gameId;
      }

      return { value: gameId, label, game };
    });
  }, [games, selectedVenue]);

  // Handle venue change
  const handleVenueChange = useCallback((option: VenueOption | null) => {
    onVenueChange(option?.venue || null);
  }, [onVenueChange]);

  // Handle MiLB level change
  const handleMiLBLevelChange = useCallback((option: { value: string } | null) => {
    if (option) {
      setSelectedMiLBLevel(option.value);
      preferencesStorage.update('selectedMiLBLevel', option.value);
      // Clear venue if switching levels
      if (selectedVenue && isMiLBVenue(selectedVenue) && selectedVenue.level !== option.value) {
        onVenueChange(null);
      }
    }
  }, [selectedVenue, onVenueChange]);

  // Handle game selection
  const handleGameSelect = useCallback((option: GameOption | null) => {
    setSelectedGameOption(option);
    if (option?.game && onGameSelect) {
      let gameDate: Date;
      if ('gameDate' in option.game) {
        gameDate = new Date(option.game.gameDate);
      } else if ('date' in option.game && 'time' in option.game) {
        const wcGame = option.game as WorldCupGame;
        gameDate = new Date(`${wcGame.date}T${wcGame.time}`);
      } else {
        gameDate = new Date();
      }
      onGameSelect(option.game, gameDate);
    } else if (onGameSelect) {
      onGameSelect(null, null);
    }
  }, [onGameSelect]);

  // Handle custom time apply
  const handleCustomApply = useCallback(() => {
    if (customDate && customTime && onGameSelect) {
      onGameSelect(null, new Date(`${customDate}T${customTime}:00`));
      preferencesStorage.update('lastUsedDate', customDate);
      preferencesStorage.update('lastUsedTime', customTime);
    }
  }, [customDate, customTime, onGameSelect]);

  // Selected venue option for controlled select
  const selectedVenueOption = useMemo(() => {
    if (!selectedVenue) return null;
    return {
      value: selectedVenue.id,
      label: `${selectedVenue.name} - ${selectedVenue.team}`,
      venue: selectedVenue,
    };
  }, [selectedVenue]);

  // Show custom time for leagues without real game data
  const showCustomTimeOnly = selectedVenue && selectedVenue.league === 'WorldCup';

  return (
    <div className={`${styles.container} ${className}`}>
      {/* MiLB Level Selector - Only shown when MiLB tab is selected */}
      {selectedLeague === 'MiLB' && (
        <div className={styles.selectorGroup}>
          <label className={styles.selectorLabel}>Level:</label>
          <Select
            options={milbLevelOptions}
            value={milbLevelOptions.find(opt => opt.value === selectedMiLBLevel)}
            onChange={handleMiLBLevelChange}
            placeholder="Select level..."
            className={styles.levelSelect}
            styles={selectStyles}
            isSearchable={false}
            aria-label="Select MiLB level"
          />
        </div>
      )}

      {/* Stadium/Venue Selector with Async Search */}
      <div className={`${styles.selectorGroup} ${styles.venueGroup}`}>
        <label className={styles.selectorLabel}>
          {selectedLeague === 'NFL' ? 'Stadium' : 'Venue'}:
        </label>
        <AsyncSelect
          cacheOptions
          defaultOptions={defaultVenueOptions}
          loadOptions={loadVenueOptions}
          value={selectedVenueOption}
          onChange={handleVenueChange}
          placeholder={`Search ${allVenuesForLeague.length} ${selectedLeague} venues...`}
          className={styles.venueSelect}
          styles={selectStyles}
          isClearable
          aria-label={`Select ${selectedLeague} venue`}
          noOptionsMessage={() => 'No venues found'}
          loadingMessage={() => 'Searching...'}
        />
      </div>

      {/* Game/Time Selector - Only shown when venue is selected */}
      {selectedVenue && !showCustomTimeOnly && (
        <>
          {/* View Mode Toggle */}
          <div className={styles.viewToggle}>
            <button
              className={`${styles.toggleBtn} ${viewMode === 'games' ? styles.toggleBtnActive : ''}`}
              onClick={() => {
                setViewMode('games');
                preferencesStorage.update('viewMode', 'games');
              }}
              aria-pressed={viewMode === 'games'}
            >
              Games
            </button>
            <button
              className={`${styles.toggleBtn} ${viewMode === 'custom' ? styles.toggleBtnActive : ''}`}
              onClick={() => {
                setViewMode('custom');
                preferencesStorage.update('viewMode', 'custom');
              }}
              aria-pressed={viewMode === 'custom'}
            >
              Custom Time
            </button>
          </div>

          {viewMode === 'games' ? (
            <div className={styles.selectorGroup}>
              <label className={styles.selectorLabel}>Game:</label>
              <Select
                options={gameOptions}
                value={selectedGameOption}
                onChange={handleGameSelect}
                placeholder={gamesLoading ? 'Loading games...' : games.length > 0 ? 'Select a game...' : 'No games available'}
                className={styles.gameSelect}
                styles={selectStyles}
                isLoading={gamesLoading}
                isDisabled={gamesLoading || games.length === 0}
                isClearable
                aria-label="Select game"
              />
            </div>
          ) : (
            <div className={styles.customTimeGroup}>
              <div className={styles.dateTimeInput}>
                <label className={styles.selectorLabel}>Date:</label>
                <input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className={styles.dateInput}
                  aria-label="Select date"
                />
              </div>
              <div className={styles.dateTimeInput}>
                <label className={styles.selectorLabel}>Time:</label>
                <input
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className={styles.timeInput}
                  aria-label="Select time"
                />
              </div>
              <button
                onClick={handleCustomApply}
                className={styles.applyBtn}
                disabled={!customDate || !customTime}
                aria-label="Apply custom date and time"
              >
                Apply
              </button>
            </div>
          )}
        </>
      )}

      {/* World Cup - Custom time only */}
      {showCustomTimeOnly && (
        <div className={styles.customTimeGroup}>
          <span className={styles.wcNote}>Select match time:</span>
          <div className={styles.dateTimeInput}>
            <label className={styles.selectorLabel}>Date:</label>
            <input
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              className={styles.dateInput}
              aria-label="Select date"
            />
          </div>
          <div className={styles.dateTimeInput}>
            <label className={styles.selectorLabel}>Time:</label>
            <input
              type="time"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              className={styles.timeInput}
              aria-label="Select time"
            />
          </div>
          <button
            onClick={handleCustomApply}
            className={styles.applyBtn}
            disabled={!customDate || !customTime}
            aria-label="Apply custom date and time"
          >
            Apply
          </button>
        </div>
      )}

      {/* Venue count info */}
      <div className={styles.venueCount}>
        {allVenuesForLeague.length} venues
      </div>
    </div>
  );
};

export default StadiumGameBar;
