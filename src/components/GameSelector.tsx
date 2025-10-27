import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { MLBGame, mlbApi } from '../services/mlbApi';
import { Stadium } from '../data/stadiums';
import { preferencesStorage } from '../utils/preferences';
import { formatDateTimeWithTimezone } from '../utils/timeUtils';
import { formatGameTimeInStadiumTZ } from '../utils/dateTimeUtils';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { useTranslation } from '../i18n/i18nContext';
import { GameSelectorSkeleton, StadiumSelectorSkeleton } from './SkeletonScreens';
import { useLoadingState } from '../hooks/useLoadingState';
import { ModernButton } from './ModernButton';
import { CalendarIcon, BaseballIcon, SunIcon } from './Icons';
import './GameSelector.css';

interface GameSelectorProps {
  selectedStadium: Stadium | null;
  onGameSelect: (game: MLBGame | null, dateTime: Date | null) => void;
  onStadiumChange: (stadium: Stadium | null) => void;
  stadiums: Stadium[];
  onGamesLoaded?: (games: MLBGame[]) => void;
}

export const GameSelector: React.FC<GameSelectorProps> = ({
  selectedStadium,
  onGameSelect,
  onStadiumChange,
  stadiums,
  onGamesLoaded
}) => {
  const haptic = useHapticFeedback();
  const { t } = useTranslation();
  const [games, setGames] = useState<MLBGame[]>([]);
  const gamesLoading = useLoadingState<MLBGame[]>({ minLoadingTime: 500, initialLoading: false });
  // Always use real games mode - no custom time selection allowed
  const viewMode = 'games' as const;
  const [selectedYear, setSelectedYear] = useState<number>(() => {
    const currentYear = new Date().getFullYear();
    const savedYear = preferencesStorage.get('selectedYear', currentYear);
    // Ensure saved year is valid (2025 or 2026)
    return savedYear === 2026 ? 2026 : currentYear;
  });
  // Custom time selection removed - only real games allowed
  const [selectedGameOption, setSelectedGameOption] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Sort stadiums alphabetically
  const sortedStadiums = [...stadiums].sort((a, b) => {
    return a.name.localeCompare(b.name);
  });
  
  const stadiumOptions = sortedStadiums.map(stadium => ({
    value: stadium.id,
    label: `${stadium.name} - ${stadium.team}`,
    stadium: stadium
  }));

  const loadGamesForStadium = useCallback(async () => {
    if (!selectedStadium) return;

    // Simple direct loading without complex state management
    try {
      setError(null);
      gamesLoading.setLoading(true);

      const today = new Date();
      const currentYear = today.getFullYear();

      // Use selected year for fetching games
      let startDate: string;
      let endDate: string;

      if (selectedYear === currentYear) {
        // For current year, start from today
        startDate = today.toISOString().split('T')[0];
        endDate = `${selectedYear}-10-31`;
      } else {
        // For future years (2026), fetch entire season
        startDate = `${selectedYear}-03-01`;
        endDate = `${selectedYear}-10-31`;
      }

      const allGames = await mlbApi.getSchedule(
        startDate,
        endDate,
        selectedYear
      );

      const homeGames = mlbApi.getHomeGamesForStadium(selectedStadium.id, allGames);

      setGames(homeGames);
      gamesLoading.setData(homeGames);

      if (onGamesLoaded) {
        onGamesLoaded(homeGames);
      }
    } catch (error) {
      console.error('[GameSelector] Error loading games:', error);
      setError('Unable to load games. Please try again.');
      setGames([]);
      gamesLoading.setError(error as Error);
    } finally {
      gamesLoading.setLoading(false);
    }
  }, [selectedStadium, selectedYear, gamesLoading, onGamesLoaded]);

  useEffect(() => {
    if (selectedStadium && viewMode === 'games') {
      // Force reset any stuck state
      gamesLoading.reset();
      setGames([]);
      setError(null);

      // Defer loading to prevent UI blocking
      const timeoutId = setTimeout(() => {
        loadGamesForStadium();
      }, 200);

      return () => clearTimeout(timeoutId);
    }
    // Reset selected game when stadium or year changes
    setSelectedGameOption(null);
  }, [selectedStadium, selectedYear, viewMode]); // Remove loadGamesForStadium dependency to avoid loops

  const handleGameSelect = (gameOption: any) => {
    setSelectedGameOption(gameOption);
    if (gameOption?.game) {
      const gameDateTime = new Date(gameOption.game.gameDate);
      onGameSelect(gameOption.game, gameDateTime);
    } else {
      onGameSelect(null, null);
    }
  };

  // Custom date/time function removed - only real games allowed

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  // Tab navigation removed - only games mode available

  const formatGameOption = (game: MLBGame) => {
    const gameDate = new Date(game.gameDate);
    
    // Get team IDs from stadium data for translation
    const homeTeamId = stadiums.find(s => s.team === game.teams.home.team.name)?.id || '';
    const awayTeamId = stadiums.find(s => s.team === game.teams.away.team.name)?.id || '';
    
    // Use original team names directly
    const homeTeamName = game.teams.home.team.name;
    const awayTeamName = game.teams.away.team.name;
    
    // Format date and time in stadium's local timezone
    const homeStadium = stadiums.find(s => s.id === homeTeamId);
    const timezone = homeStadium?.timezone || 'America/New_York';
    const stadiumTimeStr = formatGameTimeInStadiumTZ(gameDate, timezone, true);
    
    return {
      value: game.gamePk,
      label: `${stadiumTimeStr} - ${awayTeamName} @ ${homeTeamName}`,
      game: game
    };
  };

  const gameOptions = games.map(formatGameOption);
  
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

  return (
    <div className="game-selector">
      <div className="selector-header">
        <h3 id="game-selector-title">{t('gameSelector.title')}</h3>
        {/* View mode toggle removed - always use real games */}
      </div>

      <div className="control-group">
        <label htmlFor="stadium-select">{t('gameSelector.stadium')}:</label>
        <Select
          inputId="stadium-select"
          options={stadiumOptions}
          value={stadiumOptions.find(option => option.stadium.id === selectedStadium?.id) || null}
          onChange={(option) => onStadiumChange(option?.stadium || null)}
          placeholder={t('gameSelector.chooseStadium')}
          className="stadium-select"
          aria-label={t('gameSelector.selectStadium')}
          styles={customSelectStyles}
        />
      </div>

      {/* Always show games panel - custom time removed */}
      <div className="games-section" role="tabpanel" id="games-panel" aria-labelledby="games-tab">
          {selectedStadium ? (
            <>
              <div className="control-group">
                <label htmlFor="year-select">Season Year:</label>
                <div className="year-selector-buttons">
                  <ModernButton
                    variant={selectedYear === 2025 ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => {
                      haptic.light();
                      setSelectedYear(2025);
                      preferencesStorage.update('selectedYear', 2025);
                    }}
                    className="year-button"
                    aria-pressed={selectedYear === 2025}
                  >
                    2025 Season
                  </ModernButton>
                  <ModernButton
                    variant={selectedYear === 2026 ? 'primary' : 'secondary'}
                    size="sm"
                    onClick={() => {
                      haptic.light();
                      setSelectedYear(2026);
                      preferencesStorage.update('selectedYear', 2026);
                    }}
                    className="year-button"
                    aria-pressed={selectedYear === 2026}
                  >
                    2026 Season
                  </ModernButton>
                </div>
              </div>

              <div className="control-group">
                <label htmlFor="game-select">{t('gameSelector.upcomingGames')}:</label>
                {gamesLoading.loading ? (
                  <GameSelectorSkeleton />
                ) : error ? (
                  <div className="error-message" role="alert">
                    {error}
                    <ModernButton
                      onClick={loadGamesForStadium}
                      variant="danger"
                      size="sm"
                      aria-label="Retry loading games"
                    >
                      Retry
                    </ModernButton>
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
                      onChange={handleGameSelect}
                      placeholder={games.length > 0 ? t('gameSelector.chooseGame') : t('gameSelector.noGamesFound')}
                      className={`game-select ${gamesLoading.isRefreshing ? 'refreshing' : ''}`}
                      isDisabled={games.length === 0 || gamesLoading.isRefreshing}
                      aria-label={t('gameSelector.selectGame')}
                      styles={customSelectStyles}
                      menuPortalTarget={typeof document !== 'undefined' ? document.body : null}
                    />
                  </>
                )}
              </div>
              
              {games.length === 0 && !gamesLoading.loading && !error && (
                <div className="no-games">
                  <p>{t('gameSelector.noGamesForStadium')}</p>
                </div>
              )}

              {games.length > 0 && (
                <div className="games-info">
                  <p className="games-count">
                    📊 {t('gameSelector.foundGames', { count: games.length })}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="no-stadium">
              <p>{t('gameSelector.selectStadiumPrompt')}</p>
            </div>
          )}
        </div>
    </div>
  );
};

// Memoize GameSelector to prevent unnecessary re-renders when game list hasn't changed
export default React.memo(GameSelector);