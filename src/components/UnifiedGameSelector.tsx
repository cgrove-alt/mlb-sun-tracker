import React, { useState, useEffect, useCallback, useRef } from 'react';
import { customSelectStyles } from './selectStyles';
import { groupOptionsByMonth } from './groupOptionsByMonth';
import Select, { SelectInstance } from 'react-select';
import { format } from 'date-fns';
import { MLBGame, mlbApi, upcomingScheduleRange } from '../services/mlbApi';
import { MiLBGame, milbApi, MILB_LEVELS } from '../services/milbApi';
import { NFLGame, nflApi } from '../services/nflApi';
import { UnifiedVenue, getAllLeagues, getVenuesByLeague, getLeagueInfo, getMiLBVenuesByLevel, getMiLBLevels, isMiLBVenue } from '../data/unifiedVenues';
import { getTeamIdFromVenueId, getVenueIdFromStringId } from '../data/milbTeamMapping';
import { preferencesStorage } from '../utils/preferences';
import { formatGameTimeInStadiumTZ } from '../utils/dateTimeUtils';
import { formatStadiumLocal, stadiumLocalToUTC, utcToStadiumLocal } from '../utils/stadiumTime';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { useTranslation } from '../i18n/i18nContext';
import { GameSelectorSkeleton } from './SkeletonScreens';
import { useLoadingState } from '../hooks/useLoadingState';
import NFLCustomGameSelector from './NFLCustomGameSelector';
import './GameSelector.css';

interface UnifiedGameSelectorProps {
  selectedVenue: UnifiedVenue | null;
  selectedGame: MLBGame | MiLBGame | NFLGame | null;
  onGameSelect: (game: MLBGame | MiLBGame | NFLGame | null, dateTime: Date | null) => void;
  onVenueChange: (venue: UnifiedVenue | null) => void;
  onGamesLoaded?: (games: (MLBGame | MiLBGame | NFLGame)[]) => void;
}

/** A game as the list and the box show it. */
const gameOption = (game: MLBGame | MiLBGame | NFLGame, timezone = 'America/New_York') => {
  const gameDate = new Date(game.gameDate);
  // Its date is right, but its time is a placeholder.
  const timeTBD = 'teams' in game && game.status.startTimeTBD;
  const formattedTime = timeTBD
    ? `${formatStadiumLocal(gameDate, timezone, 'MMM d')}, time TBD`
    : formatGameTimeInStadiumTZ(gameDate, timezone, true);

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

  return { value: gameId, label, game, isDisabled: timeTBD };
};

/**
 * react-select scrolls to the chosen option when it updates, but the portal puts
 * the list on the page after that. So update it once more, with the list there.
 */
const scrollToChosen = (select: React.RefObject<SelectInstance<any, any, any>>) => {
  requestAnimationFrame(() => select.current?.forceUpdate());
};

export const UnifiedGameSelector: React.FC<UnifiedGameSelectorProps> = ({
  selectedVenue,
  selectedGame,
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
  const [error, setError] = useState<string | null>(null);
  const venueSelect = useRef<SelectInstance<any, any, any>>(null);
  const gameSelect = useRef<SelectInstance<any, any, any>>(null);
  
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
  
  // Show the league of a park chosen elsewhere (a link). The saved league is
  // the fan's own choice, so it stays.
  useEffect(() => {
    if (!selectedVenue) return;
    setSelectedLeague(selectedVenue.league);
    if (isMiLBVenue(selectedVenue) && selectedVenue.level) setSelectedMiLBLevel(selectedVenue.level);
  }, [selectedVenue]);

  // Get all leagues and venues
  const leagues = getAllLeagues();
  const leagueInfo = getLeagueInfo(selectedLeague);
  const milbLevels = getMiLBLevels();
  
  // Alphabetical. Built once: react-select loses its place in an open list whose
  // options are new objects.
  const venueOptions = React.useMemo(() => {
    const venues = selectedLeague === 'MiLB' ? getMiLBVenuesByLevel(selectedMiLBLevel) : getVenuesByLeague(selectedLeague);
    return [...venues].sort((a, b) => a.name.localeCompare(b.name)).map(venue => ({
      value: venue.id,
      label: `${venue.name} - ${venue.team}`,
      venue: venue
    }));
  }, [selectedLeague, selectedMiLBLevel]);

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

  // Also true before a venue's first load, which starts a moment after it's picked.
  const stillLoading = gamesLoading.loading || gamesLoading.isInitialLoad;

  // Counts the loads, and the changes of venue. A load that is no longer the
  // latest must not land on the venue chosen since.
  const latestLoad = useRef(0);

  // Load games for MLB, MiLB, and NFL venues
  const loadGames = useCallback(async () => {
    const load = ++latestLoad.current;
    const isStale = () => load !== latestLoad.current;

    if (!selectedVenue || (selectedVenue.league !== 'MLB' && selectedVenue.league !== 'MiLB' && selectedVenue.league !== 'NFL')) {
      setGames([]);
      return;
    }

    try {
      setError(null);
      gamesLoading.setLoading(true);
      
      const now = new Date();

      if (selectedVenue.league === 'MLB') {
        const range = upcomingScheduleRange(now);
        const schedule = await mlbApi.getSchedule(range.startDate, range.endDate);
        if (isStale()) return;

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

        // 30 days, for the API's limit with multiple sport IDs
        const range = upcomingScheduleRange(now, 30);
        const schedule = await milbApi.getTeamScheduleByLevel(teamId, range.startDate, range.endDate, sportId);
        if (isStale()) return;

        const homeGames = milbApi.getHomeGamesForVenue(venueId, schedule);

        setGames(homeGames);
        gamesLoading.setData(homeGames);
        
        if (onGamesLoaded) {
          onGamesLoaded(homeGames);
        }
      } else if (selectedVenue.league === 'NFL') {

        const nflGames = await nflApi.getUpcomingVenueGames(selectedVenue.id);
        if (isStale()) return;

        setGames(nflGames);
        gamesLoading.setData(nflGames);
        
        if (onGamesLoaded) {
          onGamesLoaded(nflGames);
        }
      }
      
    } catch (error) {
      if (isStale()) return;
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
      if (!isStale()) gamesLoading.setLoading(false);
    }
  }, [selectedVenue, gamesLoading, onGamesLoaded]);

  // Load games when venue changes (MLB, MiLB, and NFL)
  useEffect(() => {
    latestLoad.current += 1;
    if (selectedVenue && viewMode === 'games' && (selectedVenue.league === 'MLB' || selectedVenue.league === 'MiLB' || selectedVenue.league === 'NFL')) {
      gamesLoading.reset();
      setGames([]);
      setError(null);
      
      const timeoutId = setTimeout(() => {
        loadGames();
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [selectedVenue, viewMode]);

  const handleLeagueChange = (league: string) => {
    haptic.light();
    setSelectedLeague(league);
    preferencesStorage.update('selectedLeague', league);
    
    // Clear selected venue when switching leagues
    if (selectedVenue && selectedVenue.league !== league) {
      onVenueChange(null);
    }
  };

  const handleMiLBLevelChange = (level: string) => {
    haptic.light();
    setSelectedMiLBLevel(level);
    preferencesStorage.update('selectedMiLBLevel', level);
    
    // Clear selected venue when switching levels
    if (selectedVenue && isMiLBVenue(selectedVenue) && selectedVenue.level !== level) {
      onVenueChange(null);
    }
  };

  const handleCustomApply = () => {
    if (customDate && customTime && selectedVenue) {
      onGameSelect(
        null,
        stadiumLocalToUTC(customDate, customTime, selectedVenue.timezone || 'UTC'),
      );
      preferencesStorage.update('lastUsedDate', customDate);
      preferencesStorage.update('lastUsedTime', customTime);
    }
  };

  // Games grouped by month, so a full home schedule (78+ entries) is navigable
  // instead of one flat list. react-select renders `{ label, options }` entries
  // as group headings. GameSelector.tsx has always done this; this component —
  // the one the app actually renders — did a flat `.map()`.
  //
  // Memoized: this used to rebuild every option object on every render (parent
  // re-render, filter change, scroll), which also gave react-select a brand-new
  // options array each time.
  const gameOptions = React.useMemo(() => {
    return groupOptionsByMonth(
      games,
      game => utcToStadiumLocal(new Date(game.gameDate), selectedVenue?.timezone ?? 'America/New_York'),
      game => gameOption(game, selectedVenue?.timezone),
    );
  }, [games, selectedVenue?.timezone]);
  const listed = gameOptions.flatMap(month => month.options);
  // False when no game is listed, and when none of them has a start time yet.
  const canChoose = listed.some(option => !option.isDisabled);

  // The list's own entry for the chosen game: react-select opens the list on it
  // only if it's the same object. One of its own when the list doesn't have the
  // game as it was chosen, so the box still shows what the answer is for.
  const chosen = selectedGame && gameOption(selectedGame, selectedVenue?.timezone);
  const chosenOption = chosen && (listed
    .find(option => option.value === chosen.value && option.label === chosen.label) ?? chosen);

  // Custom styles to ensure dropdown text is always visible

  const formatOptionLabel = (option: any) => {
    return <span style={{ color: '#000', fontWeight: 600 }}>{option.label}</span>;
  };

  return (
    <div className="game-selector">
      {!isMobileContext && (
        <div className="selector-header">
          <h3 id="game-selector-title">{t('gameSelector.title')}</h3>
          
          {(selectedVenue?.league === 'MLB' || selectedVenue?.league === 'MiLB' || selectedVenue?.league === 'NFL') && (
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
      {isMobileContext && (selectedVenue?.league === 'MLB' || selectedVenue?.league === 'MiLB' || selectedVenue?.league === 'NFL') && (
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
          ref={venueSelect}
          onMenuOpen={() => scrollToChosen(venueSelect)}
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
                  {stillLoading ? (
                    <GameSelectorSkeleton />
                  ) : error ? (
                    selectedVenue.league === 'NFL' ? (
                      <NFLCustomGameSelector
                        selectedVenue={selectedVenue}
                        onGameSelect={onGameSelect}
                        scheduleFailed
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
                        ref={gameSelect}
                        onMenuOpen={() => scrollToChosen(gameSelect)}
                        inputId="game-select"
                        value={chosenOption}
                        isOptionSelected={(option) => option === chosenOption}
                        options={gameOptions}
                        onChange={(option) => {
                          if (option === chosenOption) return; // kept, not chosen again
                          if (option?.game) {
                            const gameDate = new Date(option.game.gameDate);
                            onGameSelect(option.game, gameDate);
                          } else {
                            onGameSelect(null, null);
                          }
                        }}
                        placeholder={
                          canChoose ? t('gameSelector.chooseGame')
                            : games.length > 0 ? t('gameSelector.noStartTimes')
                            : t('gameSelector.noGamesFound')
                        }
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
                {!canChoose && !stillLoading && !error && (
                  selectedVenue.league === 'NFL' ? (
                    <NFLCustomGameSelector
                      selectedVenue={selectedVenue}
                      onGameSelect={onGameSelect}
                      initialDate={customDate}
                      initialTime={customTime}
                    />
                  ) : (
                    <div className="no-games">
                      {games.length === 0 && <p>{t('gameSelector.noGamesForStadium')}</p>}
                      <p>{t('gameSelector.tryCustomTime')}</p>
                      <button
                        type="button"
                        className="apply-custom-btn"
                        onClick={() => {
                          haptic.light();
                          setViewMode('custom');
                          preferencesStorage.update('viewMode', 'custom');
                        }}
                      >
                        🕐 {t('gameSelector.customTime')}
                      </button>
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