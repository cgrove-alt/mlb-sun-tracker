import React, { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { MLBGame, mlbApi } from '../services/mlbApi';
import { Stadium } from '../data/stadiums';
import { preferencesStorage } from '../utils/preferences';
import { FavoriteButton } from './FavoriteButton';
import { useUserProfile } from '../contexts/UserProfileContext';
import { formatDateTimeWithTimezone } from '../utils/timeUtils';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { useTranslation } from '../i18n/i18nContext';
import './GameSelector.css';

interface GameSelectorProps {
  selectedStadium: Stadium | null;
  onGameSelect: (game: MLBGame | null, dateTime: Date | null) => void;
  onStadiumChange: (stadium: Stadium | null) => void;
  stadiums: Stadium[];
}

export const GameSelector: React.FC<GameSelectorProps> = ({
  selectedStadium,
  onGameSelect,
  onStadiumChange,
  stadiums
}) => {
  const haptic = useHapticFeedback();
  const { t } = useTranslation();
  const [games, setGames] = useState<MLBGame[]>([]);
  const [loading, setLoading] = useState(false);
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

  const { currentProfile } = useUserProfile();
  
  // Sort stadiums with favorites first
  const sortedStadiums = [...stadiums].sort((a, b) => {
    const aIsFavorite = currentProfile?.favorites.stadiums.includes(a.id) || false;
    const bIsFavorite = currentProfile?.favorites.stadiums.includes(b.id) || false;
    
    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return a.name.localeCompare(b.name);
  });
  
  const stadiumOptions = sortedStadiums.map(stadium => ({
    value: stadium.id,
    label: `${stadium.name} - ${stadium.team}`,
    stadium: stadium,
    isFavorite: currentProfile?.favorites.stadiums.includes(stadium.id) || false
  }));

  const loadGamesForStadium = useCallback(async () => {
    if (!selectedStadium) return;
    
    setLoading(true);
    try {
      const today = new Date();
      const endDate = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000); // Next 60 days
      
      const allGames = await mlbApi.getSchedule(
        today.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );
      
      const homeGames = mlbApi.getHomeGamesForStadium(selectedStadium.id, allGames);
      setGames(homeGames);
    } catch (error) {
      console.error('Error loading games:', error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  }, [selectedStadium]);

  useEffect(() => {
    if (selectedStadium && viewMode === 'games') {
      loadGamesForStadium();
    }
    // Reset selected game when stadium changes
    setSelectedGameOption(null);
  }, [selectedStadium, viewMode, loadGamesForStadium]);

  const handleGameSelect = (gameOption: any) => {
    setSelectedGameOption(gameOption);
    if (gameOption?.game) {
      const gameDateTime = new Date(gameOption.game.gameDate);
      onGameSelect(gameOption.game, gameDateTime);
    } else {
      onGameSelect(null, null);
    }
  };

  const handleCustomDateTime = () => {
    if (customDate && customTime) {
      const dateTime = new Date(`${customDate}T${customTime}:00`);
      onGameSelect(null, dateTime);
      
      // Save custom date and time to localStorage
      preferencesStorage.update('lastUsedDate', customDate);
      preferencesStorage.update('lastUsedTime', customTime);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const handleTabKeyDown = (event: React.KeyboardEvent, mode: 'games' | 'custom') => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setViewMode(mode);
      preferencesStorage.update('viewMode', mode);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      const newMode = mode === 'games' ? 'custom' : 'games';
      setViewMode(newMode);
      preferencesStorage.update('viewMode', newMode);
    }
  };

  const formatGameOption = (game: MLBGame) => {
    const gameDate = new Date(game.gameDate);
    
    // Get team IDs from stadium data for translation
    const homeTeamId = stadiums.find(s => s.team === game.teams.home.team.name)?.id || '';
    const awayTeamId = stadiums.find(s => s.team === game.teams.away.team.name)?.id || '';
    
    // Use original team names directly
    const homeTeamName = game.teams.home.team.name;
    const awayTeamName = game.teams.away.team.name;
    
    // Format date and time with stadium's local timezone
    const homeStadium = stadiums.find(s => s.id === homeTeamId);
    const timezone = homeStadium?.timezone || 'America/New_York';
    const dateTimeStr = formatDateTimeWithTimezone(gameDate, timezone);
    
    return {
      value: game.gamePk,
      label: `${dateTimeStr} - ${awayTeamName} @ ${homeTeamName}`,
      game: game
    };
  };

  const gameOptions = games.map(formatGameOption);

  return (
    <div className="game-selector">
      <div className="selector-header">
        <h3 id="game-selector-title">{t('gameSelector.title')}</h3>
        <div className="view-mode-toggle" role="tablist" aria-labelledby="game-selector-title">
          <button 
            className={`toggle-btn ${viewMode === 'games' ? 'active' : ''}`}
            onClick={() => {
              haptic.light();
              setViewMode('games');
              preferencesStorage.update('viewMode', 'games');
            }}
            onKeyDown={(e) => handleTabKeyDown(e, 'games')}
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
            onKeyDown={(e) => handleTabKeyDown(e, 'custom')}
            role="tab"
            aria-selected={viewMode === 'custom'}
            aria-controls="custom-panel"
            id="custom-tab"
            tabIndex={viewMode === 'custom' ? 0 : -1}
          >
            🕒 {t('gameSelector.customTime')}
          </button>
        </div>
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
          formatOptionLabel={(option) => (
            <div className="stadium-option">
              <div className="stadium-option-content">
                {option.isFavorite && <span className="favorite-indicator">★</span>}
                <span>{option.label}</span>
              </div>
              <FavoriteButton
                stadiumId={option.stadium.id}
                stadiumName={option.stadium.name}
                size="small"
              />
            </div>
          )}
        />
      </div>

      {viewMode === 'games' ? (
        <div className="games-section" role="tabpanel" id="games-panel" aria-labelledby="games-tab">
          {selectedStadium ? (
            <>
              <div className="control-group">
                <label htmlFor="game-select">{t('gameSelector.upcomingGames')}:</label>
                {loading ? (
                  <div className="loading" role="status" aria-live="polite">
                    {t('gameSelector.loadingGames')}
                  </div>
                ) : (
                  <Select
                    inputId="game-select"
                    value={selectedGameOption}
                    options={gameOptions}
                    onChange={handleGameSelect}
                    placeholder={games.length > 0 ? t('gameSelector.chooseGame') : t('gameSelector.noGamesFound')}
                    className="game-select"
                    isDisabled={games.length === 0}
                    aria-label={t('gameSelector.selectGame')}
                    formatOptionLabel={(option) => (
                      <div className="game-option">
                        <div className="game-date-time">
                          {option.label.split(' - ')[0]}
                        </div>
                        <div className="game-matchup">
                          {option.label.split(' - ')[1]}
                        </div>
                      </div>
                    )}
                  />
                )}
              </div>
              
              {games.length === 0 && !loading && (
                <div className="no-games">
                  <p>{t('gameSelector.noGamesForStadium')}</p>
                  <p>{t('gameSelector.tryCustomTime')}</p>
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
      ) : (
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
                handleCustomDateTime();
              }}
              onKeyDown={(e) => handleKeyDown(e, handleCustomDateTime)}
              className="apply-custom-btn"
              disabled={!customDate || !customTime || !selectedStadium}
              aria-label={t('gameSelector.applyCustomTime')}
            >
              {t('gameSelector.applyCustomTime')}
            </button>
          </div>

          <div className="custom-info">
            <p>💡 {t('gameSelector.customTimeInfo')}</p>
          </div>
        </div>
      )}
    </div>
  );
};