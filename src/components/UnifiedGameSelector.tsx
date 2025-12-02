import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { MLBGame, mlbApi } from '../services/mlbApi';
import { MiLBGame, milbApi, MILB_LEVELS } from '../services/milbApi';
import { NFLGame, nflApi } from '../services/nflApi';
import { Stadium } from '../data/stadiums';
import { UnifiedVenue, getAllLeagues, getVenuesByLeague, getLeagueInfo, getMiLBVenuesByLevel, getMiLBLevels, isMiLBVenue } from '../data/unifiedVenues';
import { getTeamIdFromVenueId, getVenueIdFromStringId } from '../data/milbTeamMapping';
import { preferencesStorage } from '../utils/preferences';
import { formatDateTimeWithTimezone } from '../utils/timeUtils';
import { formatGameTimeInStadiumTZ } from '../utils/dateTimeUtils';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { useTranslation } from '../i18n/i18nContext';
import { GameSelectorSkeleton, StadiumSelectorSkeleton } from './SkeletonScreens';
import { useLoadingState } from '../hooks/useLoadingState';
import NFLCustomGameSelector from './NFLCustomGameSelector';
import './GameSelector.css';

interface UnifiedGameSelectorProps {
  selectedVenue: UnifiedVenue | null;
  onGameSelect: (game: MLBGame | MiLBGame | NFLGame | null, dateTime: Date | null) => void;
  onVenueChange: (venue: UnifiedVenue | null) => void;
  onGamesLoaded?: (games: (MLBGame | MiLBGame | NFLGame)[]) => void;
}

export const UnifiedGameSelector: React.FC<UnifiedGameSelectorProps> = ({
  selectedVenue,
  onGameSelect,
  onVenueChange,
  onGamesLoaded
}) => {
  const haptic = useHapticFeedback();
  const { t } = useTranslation();
  const [games, setGames] = useState<(MLBGame | MiLBGame | NFLGame)[]>([]);
  const [isMobileContext, setIsMobileContext] = useState(false);
  const gamesLoading = useLoadingState<(MLBGame | MiLBGame | NFLGame)[]>({ minLoadingTime: 500, initialLoading: false });
  const [selectedLeague, setSelectedLeague] = useState<string>(() => {
    return preferencesStorage.get('selectedLeague', 'MLB');
  });
  const [selectedMiLBLevel, setSelectedMiLBLevel] = useState<string>(() => {
    return preferencesStorage.get('selectedMiLBLevel', 'AAA');
  });
  const [viewMode, setViewMode] = useState<'games' | 'custom'>(() => {
    return preferencesStorage.get('viewMode', 'games');
  });
  const [customDate, setCustomDate] = useState<string>(() => {
    return preferencesStorage.get('lastUsedDate', format(new Date(), 'yyyy-MM-dd'));
  });
  const [customTime, setCustomTime] = useState<string>(() => {
    return preferencesStorage.get('lastUsedTime', format(new Date(), 'HH:mm'));
  });
  const [selectedGameOption, setSelectedGameOption] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Check if we're in mobile context
  useEffect(() => {
    // Check if parent has mobile-app class
    const checkMobileContext = () => {
      const mobileApp = document.querySelector('.mobile-app');
      setIsMobileContext(!!mobileApp);
    };
    
    checkMobileContext();
    // Also check on resize
    window.addEventListener('resize', checkMobileContext);
    return () => window.removeEventListener('resize', checkMobileContext);
  }, []);
  
  // Get all leagues and venues
  const leagues = getAllLeagues();
  const venuesInLeague = selectedLeague === 'MiLB' ? getMiLBVenuesByLevel(selectedMiLBLevel) : getVenuesByLeague(selectedLeague);
  const leagueInfo = getLeagueInfo(selectedLeague);
  const milbLevels = getMiLBLevels();
  
  // Sort venues alphabetically
  const sortedVenues = [...venuesInLeague].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  const venueOptions = sortedVenues.map(venue => ({
    value: venue.id,
    label: `${venue.name} - ${venue.team}`,
    venue: venue
  }));

  const leagueOptions = leagues.map(league => {
    const info = getLeagueInfo(league);
    const venues = getVenuesByLeague(league);
    return {
      value: league,
      label: `${league === 'MLB' ? '⚾' : league === 'MiLB' ? '⚾' : league === 'NFL' ? '🏈' : '🏟️'} ${info?.name || league} (${venues.length})`,
    };
  });

  const milbLevelOptions = milbLevels.map(level => {
    const venues = getMiLBVenuesByLevel(level);
    // Use consistent abbreviation-based naming
    let displayName = level;
    switch (level) {
      case 'AAA':
        displayName = 'Triple-A (AAA)';
        break;
      case 'AA':
        displayName = 'Double-A (AA)';
        break;
      case 'A+':
        displayName = 'High-A (A+)';
        break;
      case 'A':
        displayName = 'Single-A (A)';
        break;
    }
    return {
      value: level,
      label: `${displayName} - ${venues.length} venues`
    };
  });

  // Load games for MLB, MiLB, and NFL venues
  const loadGames = useCallback(async () => {
    if (!selectedVenue || (selectedVenue.league !== 'MLB' && selectedVenue.league !== 'MiLB' && selectedVenue.league !== 'NFL')) {
      setGames([]);
      return;
    }

    try {
      setError(null);
      gamesLoading.setLoading(true);
      
      const now = new Date();
      const currentYear = now.getFullYear();
      // For MiLB, use 30 days due to API limitation with multiple sport IDs
      const endDate = selectedVenue.league === 'MiLB'
        ? new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
        : new Date(currentYear + 1, 9, 31); // End of October next year for MLB
      
      if (selectedVenue.league === 'MLB') {
        const schedule = await mlbApi.getSchedule(
          now.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
        
        const homeGames = mlbApi.getHomeGamesForStadium(selectedVenue.id, schedule);

        setGames(homeGames);
        gamesLoading.setData(homeGames);
        
        if (onGamesLoaded) {
          onGamesLoaded(homeGames);
        }
      } else if (selectedVenue.league === 'MiLB') {

        // Get the numeric venue ID from the string ID
        const venueId = getVenueIdFromStringId(selectedVenue.id);
        
        if (!venueId) {
          console.error('[GameSelector] MiLB venue ID not found for:', selectedVenue.id);
          setError('Venue configuration error - venue not recognized');
          setGames([]);
          gamesLoading.setData([]);
          return;
        }
        
        // Get the team ID for this venue
        const teamId = getTeamIdFromVenueId(venueId);
        
        if (!teamId) {
          console.error('[GameSelector] No team ID found for venue:', venueId, 'in mapping');
          setError('Unable to find team information for this venue');
          setGames([]);
          gamesLoading.setData([]);
          return;
        }

        // Get the sport ID for this MiLB level
        let sportId = 11; // Default to AAA
        if (selectedVenue.level) {
          switch (selectedVenue.level) {
            case 'AAA':
              sportId = MILB_LEVELS.AAA.id;
              break;
            case 'AA':
              sportId = MILB_LEVELS.AA.id;
              break;
            case 'A+':
              sportId = MILB_LEVELS.HIGH_A.id;
              break;
            case 'A':
              sportId = MILB_LEVELS.LOW_A.id;
              break;
            case 'R':
              sportId = MILB_LEVELS.ROOKIE.id;
              break;
            case 'ACL':
              sportId = MILB_LEVELS.COMPLEX_AZL.id;
              break;
            case 'FCL':
              sportId = MILB_LEVELS.COMPLEX_FCL.id;
              break;
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
        gamesLoading.setData(homeGames);
        
        if (onGamesLoaded) {
          onGamesLoaded(homeGames);
        }
      } else if (selectedVenue.league === 'NFL') {

        const nflGames = await nflApi.getUpcomingVenueGames(selectedVenue.id);

        setGames(nflGames);
        gamesLoading.setData(nflGames);
        
        if (onGamesLoaded) {
          onGamesLoaded(nflGames);
        }
      }
      
    } catch (error) {
      console.error('[GameSelector] Error loading games:', error);
      
      // Set specific error message based on league
      if (selectedVenue?.league === 'NFL') {
        setError('NFL schedule data is currently unavailable. Please try again later.');
      } else {
        setError('Unable to load games. Please try again.');
      }
      
      setGames([]);
      gamesLoading.setError(error as Error);
    } finally {
      gamesLoading.setLoading(false);
    }
  }, [selectedVenue, gamesLoading, onGamesLoaded]);

  // Load games when venue changes (MLB, MiLB, and NFL)
  useEffect(() => {
    if (selectedVenue && viewMode === 'games' && (selectedVenue.league === 'MLB' || selectedVenue.league === 'MiLB' || selectedVenue.league === 'NFL')) {
      gamesLoading.reset();
      setGames([]);
      setError(null);
      
      const timeoutId = setTimeout(() => {
        loadGames();
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
    setSelectedGameOption(null);
  }, [selectedVenue, viewMode]);

  const handleLeagueChange = (league: string) => {
    haptic.light();
    setSelectedLeague(league);
    preferencesStorage.update('selectedLeague', league);
    
    // Clear selected venue when switching leagues
    if (selectedVenue && selectedVenue.league !== league) {
      onVenueChange(null);
      setSelectedGameOption(null);
    }
  };

  const handleMiLBLevelChange = (level: string) => {
    haptic.light();
    setSelectedMiLBLevel(level);
    preferencesStorage.update('selectedMiLBLevel', level);
    
    // Clear selected venue when switching levels
    if (selectedVenue && isMiLBVenue(selectedVenue) && selectedVenue.level !== level) {
      onVenueChange(null);
      setSelectedGameOption(null);
    }
  };

  const handleCustomApply = () => {
    if (customDate && customTime) {
      onGameSelect(null, new Date(`${customDate}T${customTime}:00`));
      preferencesStorage.update('lastUsedDate', customDate);
      preferencesStorage.update('lastUsedTime', customTime);
    }
  };

  const gameOptions = games.map(game => {
    const gameDate = new Date(game.gameDate);
    const venueTimezone = selectedVenue?.timezone || 'America/New_York';
    const formattedTime = formatGameTimeInStadiumTZ(gameDate, venueTimezone, true);
    
    // Handle different game structures
    let label: string;
    let gameId: string;
    
    if ('teams' in game) {
      // MLB/MiLB game structure
      label = `${formattedTime} - ${game.teams.away.team.name} @ ${game.teams.home.team.name}`;
      gameId = game.gamePk.toString();
    } else {
      // NFL game structure
      const nflGame = game as NFLGame;
      label = `${formattedTime} - ${nflGame.awayTeam.name} @ ${nflGame.homeTeam.name}`;
      gameId = nflGame.gameId;
    }
    
    return {
      value: gameId,
      label: label,
      game: game
    };
  });

  // Custom styles to ensure dropdown text is always visible
  const customSelectStyles = {
    control: (provided: any) => ({
      ...provided,
      backgroundColor: 'white',
      color: '#000',
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: '#000',
      fontWeight: 600,
      opacity: 1,
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: '#666',
      fontWeight: 500,
      opacity: 1,
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      color: state.isSelected ? 'white' : '#000',
      backgroundColor: state.isSelected ? '#1a237e' : state.isFocused ? '#f5f5f5' : 'white',
      fontWeight: state.isSelected ? 600 : 500,
      opacity: 1,
      '&:hover': {
        backgroundColor: '#f5f5f5',
      },
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: 'white',
    }),
    input: (provided: any) => ({
      ...provided,
      color: '#000',
      opacity: 1,
    }),
  };

  const formatOptionLabel = (option: any) => {
    return <span style={{ color: '#000', fontWeight: 600 }}>{option.label}</span>;
  };

  return (
    <div className="game-selector">
      {!isMobileContext && (
        <div className="selector-header">
          <h3 id="game-selector-title">{t('gameSelector.title')}</h3>
          
          {(selectedVenue?.league === 'MLB' || selectedVenue?.league === 'MiLB') && (
            <div className="view-mode-toggle" role="tablist" aria-labelledby="game-selector-title">
              <button
                className={`toggle-btn ${viewMode === 'games' ? 'active' : ''}`}
                onClick={() => {
                  haptic.light();
                  setViewMode('games');
                  preferencesStorage.update('viewMode', 'games');
                }}
                role="tab"
                aria-selected={viewMode === 'games'}
                aria-controls="games-panel"
                id="games-tab"
                tabIndex={viewMode === 'games' ? 0 : -1}
              >
                📅 {t('gameSelector.realGames')}
              </button>
              <button
                className={`toggle-btn ${viewMode === 'custom' ? 'active' : ''}`}
                onClick={() => {
                  haptic.light();
                  setViewMode('custom');
                  preferencesStorage.update('viewMode', 'custom');
                }}
                role="tab"
                aria-selected={viewMode === 'custom'}
                aria-controls="custom-panel"
                id="custom-tab"
                tabIndex={viewMode === 'custom' ? 0 : -1}
              >
                🕐 {t('gameSelector.customTime')}
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Show toggle buttons for mobile but without the header wrapper */}
      {isMobileContext && (selectedVenue?.league === 'MLB' || selectedVenue?.league === 'MiLB') && (
        <div className="view-mode-toggle mobile-toggle" role="tablist">
          <button
            className={`toggle-btn ${viewMode === 'games' ? 'active' : ''}`}
            onClick={() => {
              haptic.light();
              setViewMode('games');
              preferencesStorage.update('viewMode', 'games');
            }}
            role="tab"
            aria-selected={viewMode === 'games'}
            aria-controls="games-panel"
            id="games-tab-mobile"
            tabIndex={viewMode === 'games' ? 0 : -1}
          >
            📅 {t('gameSelector.realGames')}
          </button>
          <button
            className={`toggle-btn ${viewMode === 'custom' ? 'active' : ''}`}
            onClick={() => {
              haptic.light();
              setViewMode('custom');
              preferencesStorage.update('viewMode', 'custom');
            }}
            role="tab"
            aria-selected={viewMode === 'custom'}
            aria-controls="custom-panel"
            id="custom-tab-mobile"
            tabIndex={viewMode === 'custom' ? 0 : -1}
          >
            🕐 {t('gameSelector.customTime')}
          </button>
        </div>
      )}

      {/* League Selection Dropdown */}
      <div className="control-group">
        <label htmlFor="league-select">League:</label>
        <Select
          inputId="league-select"
          options={leagueOptions}
          value={leagueOptions.find(opt => opt.value === selectedLeague)}
          onChange={(option) => {
            if (option) {
              handleLeagueChange(option.value);
            }
          }}
          placeholder="Select a league"
          className="league-select"
          aria-label="Select league"
          isSearchable={false}
          styles={customSelectStyles}
          menuPosition="fixed"
          menuPlacement="auto"
          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        />
      </div>

      {/* MiLB Level Selection Dropdown - Only shown when MiLB is selected */}
      {selectedLeague === 'MiLB' && (
        <div className="control-group">
          <label htmlFor="milb-level-select">Minor League Level:</label>
          <Select
            inputId="milb-level-select"
            options={milbLevelOptions}
            value={milbLevelOptions.find(opt => opt.value === selectedMiLBLevel)}
            onChange={(option) => {
              if (option) {
                handleMiLBLevelChange(option.value);
              }
            }}
            placeholder="Select MiLB level"
            className="milb-level-select"
            aria-label="Select MiLB level"
            isSearchable={false}
            styles={customSelectStyles}
            menuPosition="fixed"
            menuPlacement="auto"
            menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
          />
        </div>
      )}

      {/* Venue Selection Dropdown */}
      <div className="control-group">
        <label htmlFor="venue-select">
          {selectedLeague === 'MLB' ? t('gameSelector.stadium') : 'Venue'}:
        </label>
        <Select
          inputId="venue-select"
          options={venueOptions}
          value={venueOptions.find(opt => opt.venue.id === selectedVenue?.id) || null}
          onChange={(option) => onVenueChange(option?.venue || null)}
          placeholder={selectedLeague ? `Choose ${leagueInfo?.name || selectedLeague} venue` : 'Select a league first'}
          className="venue-select"
          aria-label={t('gameSelector.selectStadium')}
          formatOptionLabel={formatOptionLabel}
          blurInputOnSelect={true}
          isDisabled={!selectedLeague}
          styles={customSelectStyles}
          menuPosition="fixed"
          menuPlacement="auto"
          menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
        />
      </div>

      {(selectedVenue?.league === 'MLB' || selectedVenue?.league === 'MiLB' || selectedVenue?.league === 'NFL') ? (
        // MLB, MiLB, and NFL venues show games or custom time
        viewMode === 'games' ? (
          <div className="games-section" role="tabpanel" id="games-panel" aria-labelledby="games-tab">
            {selectedVenue ? (
              <>
                <div className="control-group">
                  <label htmlFor="game-select">{t('gameSelector.upcomingGames')}:</label>
                  {gamesLoading.loading ? (
                    <GameSelectorSkeleton />
                  ) : error ? (
                    selectedVenue.league === 'NFL' ? (
                      <NFLCustomGameSelector
                        selectedVenue={selectedVenue}
                        onGameSelect={onGameSelect}
                        initialDate={customDate}
                        initialTime={customTime}
                      />
                    ) : (
                      <div className="error-message" role="alert">
                        {error}
                        <button onClick={loadGames} className="retry-button" aria-label="Retry loading games">
                          Retry
                        </button>
                      </div>
                    )
                  ) : (
                    <>
                      {games.length > 0 && (
                        <div style={{ fontSize: '12px', color: 'green', marginBottom: '8px' }}>
                          ✓ {games.length} games loaded successfully
                        </div>
                      )}
                      <Select
                        inputId="game-select"
                        value={selectedGameOption}
                        options={gameOptions}
                        onChange={(option) => {
                          setSelectedGameOption(option);
                          if (option?.game) {
                            const gameDate = new Date(option.game.gameDate);
                            onGameSelect(option.game, gameDate);
                          } else {
                            onGameSelect(null, null);
                          }
                        }}
                        placeholder={t(games.length > 0 ? 'gameSelector.chooseGame' : 'gameSelector.noGamesFound')}
                        className={`game-select ${gamesLoading.isRefreshing ? 'refreshing' : ''}`}
                        isDisabled={games.length === 0 || gamesLoading.isRefreshing}
                        aria-label={t('gameSelector.selectGame')}
                        styles={customSelectStyles}
                        menuPosition="fixed"
                        menuPlacement="auto"
                        menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                      />
                    </>
                  )}
                </div>
                {games.length === 0 && !gamesLoading.loading && !error && (
                  selectedVenue.league === 'NFL' ? (
                    <NFLCustomGameSelector
                      selectedVenue={selectedVenue}
                      onGameSelect={onGameSelect}
                      initialDate={customDate}
                      initialTime={customTime}
                    />
                  ) : (
                    <div className="no-games">
                      <p>{t('gameSelector.noGamesForStadium')}</p>
                      <p>{t('gameSelector.tryCustomTime')}</p>
                    </div>
                  )
                )}
                {games.length > 0 && (
                  <div className="games-info">
                    <p className="games-count">📊 {t('gameSelector.foundGames', { count: games.length })}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="no-stadium">
                <p>{t('gameSelector.selectStadiumPrompt')}</p>
              </div>
            )}
          </div>
        ) : (
          // Custom time mode for MLB, MiLB, and NFL
          <div className="custom-section" role="tabpanel" id="custom-panel" aria-labelledby="custom-tab">
            <div className="custom-controls">
              <div className="control-group">
                <label htmlFor="custom-date">{t('gameSelector.date')}:</label>
                <input
                  id="custom-date"
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="date-input"
                  aria-label={t('gameSelector.selectDate')}
                />
              </div>
              <div className="control-group">
                <label htmlFor="custom-time">{t('gameSelector.timeLocal')}:</label>
                <input
                  id="custom-time"
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="time-input"
                  aria-label={t('gameSelector.selectTime')}
                />
              </div>
              <button
                onClick={() => {
                  haptic.medium();
                  handleCustomApply();
                }}
                className="apply-custom-btn"
                disabled={!customDate || !customTime || !selectedVenue}
                aria-label={t('gameSelector.applyCustomDateTime')}
              >
                {t('gameSelector.apply')}
              </button>
            </div>
          </div>
        )
      ) : (
        // Non-MLB venues only show custom time
        selectedVenue && (
          <div className="custom-section">
            <p className="non-mlb-notice">
              {selectedLeague} games not available. Use custom date/time for shade calculations.
            </p>
            <div className="custom-controls">
              <div className="control-group">
                <label htmlFor="custom-date">{t('gameSelector.date')}:</label>
                <input
                  id="custom-date"
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="date-input"
                  aria-label={t('gameSelector.selectDate')}
                />
              </div>
              <div className="control-group">
                <label htmlFor="custom-time">{t('gameSelector.timeLocal')}:</label>
                <input
                  id="custom-time"
                  type="time"
                  value={customTime}
                  onChange={(e) => setCustomTime(e.target.value)}
                  className="time-input"
                  aria-label={t('gameSelector.selectTime')}
                />
              </div>
              <button
                onClick={() => {
                  haptic.medium();
                  handleCustomApply();
                }}
                className="apply-custom-btn"
                disabled={!customDate || !customTime || !selectedVenue}
                aria-label={t('gameSelector.applyCustomDateTime')}
              >
                {t('gameSelector.apply')}
              </button>
            </div>
          </div>
        )
      )}

    </div>
  );
};