import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { format } from 'date-fns';
import { MLBGame, mlbApi } from '../services/mlbApi';
import { Stadium } from '../data/stadiums';
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
  const [games, setGames] = useState<MLBGame[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'games' | 'custom'>('games');
  const [customDate, setCustomDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [customTime, setCustomTime] = useState<string>(format(new Date(), 'HH:mm'));

  const stadiumOptions = stadiums.map(stadium => ({
    value: stadium.id,
    label: `${stadium.name} - ${stadium.team}`,
    stadium: stadium
  }));

  const loadGamesForStadium = async () => {
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
  };

  useEffect(() => {
    if (selectedStadium && viewMode === 'games') {
      loadGamesForStadium();
    }
  }, [selectedStadium, viewMode]);

  const handleGameSelect = (gameOption: any) => {
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
    }
  };

  const formatGameOption = (game: MLBGame) => {
    const gameDate = new Date(game.gameDate);
    const dateStr = format(gameDate, 'MMM dd, yyyy');
    const timeStr = format(gameDate, 'h:mm a');
    
    return {
      value: game.gamePk,
      label: `${dateStr} at ${timeStr} - ${game.teams.away.team.name} @ ${game.teams.home.team.name}`,
      game: game
    };
  };

  const gameOptions = games.map(formatGameOption);

  return (
    <div className="game-selector">
      <div className="selector-header">
        <h3>Select Game or Time</h3>
        <div className="view-mode-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'games' ? 'active' : ''}`}
            onClick={() => setViewMode('games')}
          >
            📅 Real Games
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'custom' ? 'active' : ''}`}
            onClick={() => setViewMode('custom')}
          >
            🕒 Custom Time
          </button>
        </div>
      </div>

      <div className="control-group">
        <label>Stadium:</label>
        <Select
          options={stadiumOptions}
          value={stadiumOptions.find(option => option.stadium.id === selectedStadium?.id) || null}
          onChange={(option) => onStadiumChange(option?.stadium || null)}
          placeholder="Choose a stadium..."
          className="stadium-select"
        />
      </div>

      {viewMode === 'games' ? (
        <div className="games-section">
          {selectedStadium ? (
            <>
              <div className="control-group">
                <label>Upcoming Home Games:</label>
                {loading ? (
                  <div className="loading">Loading games...</div>
                ) : (
                  <Select
                    options={gameOptions}
                    onChange={handleGameSelect}
                    placeholder={games.length > 0 ? "Choose a game..." : "No upcoming games found"}
                    className="game-select"
                    isDisabled={games.length === 0}
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
                  <p>No upcoming home games found for this stadium.</p>
                  <p>Try selecting "Custom Time" to analyze any date and time.</p>
                </div>
              )}

              {games.length > 0 && (
                <div className="games-info">
                  <p className="games-count">
                    📊 Found {games.length} upcoming home games
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="no-stadium">
              <p>Please select a stadium to see upcoming games.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="custom-section">
          <div className="custom-controls">
            <div className="control-group">
              <label>Date:</label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                className="date-input"
              />
            </div>

            <div className="control-group">
              <label>Time (local):</label>
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="time-input"
              />
            </div>

            <button 
              onClick={handleCustomDateTime}
              className="apply-custom-btn"
              disabled={!customDate || !customTime || !selectedStadium}
            >
              Apply Custom Time
            </button>
          </div>

          <div className="custom-info">
            <p>💡 Use custom time to analyze sun exposure for any date and time, even during off-season.</p>
          </div>
        </div>
      )}
    </div>
  );
};