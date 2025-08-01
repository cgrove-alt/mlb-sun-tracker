import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { MLBGame, mlbApi } from '../services/mlbApi';
import { MiLBGame, milbApi, MILB_LEVELS } from '../services/milbApi';
import { Stadium } from '../data/stadiums';
import { UnifiedVenue, getAllLeagues, getVenuesByLeague, getLeagueInfo, getMiLBVenuesByLevel, getMiLBLevels, isMiLBVenue } from '../data/unifiedVenues';
import { getTeamIdFromVenueId } from '../data/milbTeamMapping';
import { preferencesStorage } from '../utils/preferences';
import { FavoriteButton } from './FavoriteButton';
import { useUserProfile } from '../contexts/UserProfileContext';
import { formatDateTimeWithTimezone } from '../utils/timeUtils';
import { formatGameTimeInStadiumTZ } from '../utils/dateTimeUtils';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { useTranslation } from '../i18n/i18nContext';
import { GameSelectorSkeleton, StadiumSelectorSkeleton } from './SkeletonScreens';
import { useLoadingState } from '../hooks/useLoadingState';
import './GameSelector.css';

interface UnifiedGameSelectorProps {
  selectedVenue: UnifiedVenue | null;
  onGameSelect: (game: MLBGame | MiLBGame | null, dateTime: Date | null) => void;
  onVenueChange: (venue: UnifiedVenue | null) => void;
  onGamesLoaded?: (games: (MLBGame | MiLBGame)[]) => void;
}

export const UnifiedGameSelector: React.FC<UnifiedGameSelectorProps> = ({
  selectedVenue,
  onGameSelect,
  onVenueChange,
  onGamesLoaded
}) => {
  const haptic = useHapticFeedback();
  const { t } = useTranslation();
  const [games, setGames] = useState<(MLBGame | MiLBGame)[]>([]);
  const gamesLoading = useLoadingState<(MLBGame | MiLBGame)[]>({ minLoadingTime: 500, initialLoading: false });
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

  const { currentProfile } = useUserProfile();
  
  // Get all leagues and venues
  const leagues = getAllLeagues();
  const venuesInLeague = selectedLeague === 'MiLB' ? getMiLBVenuesByLevel(selectedMiLBLevel) : getVenuesByLeague(selectedLeague);
  const leagueInfo = getLeagueInfo(selectedLeague);
  const milbLevels = getMiLBLevels();
  
  // Sort venues with favorites first
  const sortedVenues = [...venuesInLeague].sort((a, b) => {
    const aFavorite = currentProfile?.favorites.stadiums.includes(a.id) || false;
    const bFavorite = currentProfile?.favorites.stadiums.includes(b.id) || false;
    
    if (aFavorite && !bFavorite) return -1;
    if (!aFavorite && bFavorite) return 1;
    return a.name.localeCompare(b.name);
  });

  const venueOptions = sortedVenues.map(venue => ({
    value: venue.id,
    label: `${venue.name} - ${venue.team}`,
    venue: venue,
    isFavorite: currentProfile?.favorites.stadiums.includes(venue.id) || false
  }));

  const leagueOptions = leagues.map(league => {
    const info = getLeagueInfo(league);
    const venues = getVenuesByLeague(league);
    return {
      value: league,
      label: info?.name || league,
      count: venues.length,
      icon: league === 'MLB' ? '⚾' : league === 'MiLB' ? '⚾' : league === 'NFL' ? '🏈' : league === 'MLS' ? '⚽' : '🏟️'
    };
  });

  // Load games for MLB and MiLB venues
  const loadGames = useCallback(async () => {
    if (!selectedVenue || (selectedVenue.league !== 'MLB' && selectedVenue.league !== 'MiLB')) {
      setGames([]);
      return;
    }

    console.log('[GameSelector] Loading games for:', selectedVenue.name);
    
    try {
      setError(null);
      gamesLoading.setLoading(true);
      
      const now = new Date();
      const currentYear = now.getFullYear();
      const endDate = new Date(currentYear, 9, 31); // End of October
      
      if (selectedVenue.league === 'MLB') {
        const schedule = await mlbApi.getSchedule(
          now.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
        
        const homeGames = mlbApi.getHomeGamesForStadium(selectedVenue.id, schedule);
        
        console.log('[GameSelector] Found', homeGames.length, 'MLB games');
        setGames(homeGames);
        gamesLoading.setData(homeGames);
        
        if (onGamesLoaded) {
          onGamesLoaded(homeGames);
        }
      } else if (selectedVenue.league === 'MiLB' && selectedVenue.venueId) {
        // Get the team ID for this venue
        const teamId = getTeamIdFromVenueId(selectedVenue.venueId);
        
        if (!teamId) {
          console.error('[GameSelector] No team ID found for venue:', selectedVenue.venueId);
          setError('Unable to find team information for this venue');
          setGames([]);
          gamesLoading.setData([]);
          return;
        }
        
        console.log('[GameSelector] Loading MiLB games for team:', teamId, 'venue:', selectedVenue.venueId);
        
        const schedule = await milbApi.getTeamSchedule(
          teamId,
          now.toISOString().split('T')[0],
          endDate.toISOString().split('T')[0]
        );
        
        const homeGames = milbApi.getHomeGamesForVenue(selectedVenue.venueId, schedule);
        
        console.log('[GameSelector] Found', homeGames.length, 'MiLB games');
        setGames(homeGames);
        gamesLoading.setData(homeGames);
        
        if (onGamesLoaded) {
          onGamesLoaded(homeGames);
        }
      }
      
    } catch (error) {
      console.error('[GameSelector] Error loading games:', error);
      setError('Unable to load games. Please try again.');
      setGames([]);
      gamesLoading.setError(error as Error);
    } finally {
      gamesLoading.setLoading(false);
    }
  }, [selectedVenue, gamesLoading, onGamesLoaded]);

  // Load games when venue changes (MLB and MiLB only)
  useEffect(() => {
    if (selectedVenue && viewMode === 'games' && (selectedVenue.league === 'MLB' || selectedVenue.league === 'MiLB')) {
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
    if (selectedVenue && isMiLBVenue(selectedVenue) && selectedVenue.milbLevel !== level) {
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
    
    return {
      value: game.gamePk,
      label: `${formattedTime} - ${game.teams.away.team.name} @ ${game.teams.home.team.name}`,
      game: game
    };
  });

  const formatOptionLabel = (option: any) => {
    if ('venue' in option) {
      return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {option.isFavorite && <span style={{ color: '#FFD700' }}>★</span>}
            <span>{option.label}</span>
          </div>
          <FavoriteButton
            stadiumId={option.venue.id}
            stadiumName={option.venue.name}
            size="small"
          />
        </div>
      );
    }
    return option.label;
  };

  return (
    <div className="game-selector">
      <div className="selector-header">
        <h3 id="game-selector-title">{t('gameSelector.title')}</h3>
        
        {/* League Selector */}
        <div className="league-selector">
          {leagueOptions.map(league => (
            <button
              key={league.value}
              className={`league-btn ${selectedLeague === league.value ? 'active' : ''}`}
              onClick={() => handleLeagueChange(league.value)}
              title={`${league.label} (${league.count} venues)`}
            >
              <span className="league-icon">{league.icon}</span>
              <span className="league-label">{league.value}</span>
              <span className="league-count">{league.count}</span>
            </button>
          ))}
        </div>

        {/* MiLB Level Selector */}
        {selectedLeague === 'MiLB' && (
          <div className="milb-level-selector">
            <label>Minor League Level:</label>
            <div className="level-buttons">
              {milbLevels.map(level => (
                <button
                  key={level}
                  className={`level-btn ${selectedMiLBLevel === level ? 'active' : ''}`}
                  onClick={() => handleMiLBLevelChange(level)}
                  title={(MILB_LEVELS as any)[level.replace('+', '_').replace('A', level === 'A+' ? 'HIGH_A' : level === 'AA' ? 'AA' : level === 'AAA' ? 'AAA' : 'LOW_A')]?.name || level}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        )}

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

      <div className="control-group">
        <label htmlFor="venue-select">
          {selectedLeague === 'MLB' ? t('gameSelector.stadium') : 'Venue'}:
        </label>
        <Select
          inputId="venue-select"
          options={venueOptions}
          value={venueOptions.find(opt => opt.venue.id === selectedVenue?.id) || null}
          onChange={(option) => onVenueChange(option?.venue || null)}
          placeholder={`Choose ${leagueInfo?.name || selectedLeague} venue`}
          className="venue-select"
          aria-label={t('gameSelector.selectStadium')}
          formatOptionLabel={formatOptionLabel}
          blurInputOnSelect={true}
        />
      </div>

      {(selectedVenue?.league === 'MLB' || selectedVenue?.league === 'MiLB') ? (
        // MLB and MiLB venues show games or custom time
        viewMode === 'games' ? (
          <div className="games-section" role="tabpanel" id="games-panel" aria-labelledby="games-tab">
            {selectedVenue ? (
              <>
                <div className="control-group">
                  <label htmlFor="game-select">{t('gameSelector.upcomingGames')}:</label>
                  {gamesLoading.loading ? (
                    <GameSelectorSkeleton />
                  ) : error ? (
                    <div className="error-message" role="alert">
                      {error}
                      <button onClick={loadGames} className="retry-button" aria-label="Retry loading games">
                        Retry
                      </button>
                    </div>
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
                      />
                    </>
                  )}
                </div>
                {games.length === 0 && !gamesLoading.loading && !error && (
                  <div className="no-games">
                    <p>{t('gameSelector.noGamesForStadium')}</p>
                    <p>{t('gameSelector.tryCustomTime')}</p>
                  </div>
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
          // Custom time mode for MLB
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

      <style jsx>{`
        .league-selector {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .league-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }

        .league-btn:hover {
          border-color: #2196f3;
          background-color: #f5f5f5;
        }

        .league-btn.active {
          border-color: #2196f3;
          background-color: #e3f2fd;
          color: #1976d2;
        }

        .league-icon {
          font-size: 18px;
        }

        .league-label {
          font-weight: 500;
        }

        .league-count {
          font-size: 12px;
          color: #666;
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 10px;
        }

        .league-btn.active .league-count {
          background: #bbdefb;
          color: #1565c0;
        }

        .non-mlb-notice {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          color: #856404;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 16px;
          font-size: 14px;
        }

        .milb-level-selector {
          margin-bottom: 16px;
        }

        .milb-level-selector label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        .level-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .level-btn {
          padding: 8px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
          font-weight: 600;
        }

        .level-btn:hover {
          border-color: #2196f3;
          background-color: #f5f5f5;
        }

        .level-btn.active {
          border-color: #2196f3;
          background-color: #e3f2fd;
          color: #1976d2;
        }

        @media (max-width: 768px) {
          .league-selector {
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
          }

          .league-btn {
            white-space: nowrap;
          }

          .level-buttons {
            width: 100%;
          }

          .level-btn {
            flex: 1;
            min-width: 60px;
          }
        }
      `}</style>
    </div>
  );
};