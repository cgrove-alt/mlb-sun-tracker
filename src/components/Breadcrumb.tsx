import React from 'react';
import { Stadium, MLB_STADIUMS } from '../data/stadiums';
import { MLBGame } from '../services/mlbApi';
import { MiLBGame } from '../services/milbApi';
import { NFLGame } from '../services/nflApi';
import { formatDateTimeWithTimezone } from '../utils/timeUtils';
import './Breadcrumb.css';

interface BreadcrumbProps {
  selectedStadium: Stadium | null;
  selectedGame: MLBGame | MiLBGame | NFLGame | null;
  gameDateTime: Date | null;
  onStadiumChange: (stadium: Stadium | null) => void;
  onGameSelect: (game: MLBGame | MiLBGame | NFLGame | null, dateTime: Date | null) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  selectedStadium,
  selectedGame,
  gameDateTime,
  onStadiumChange,
  onGameSelect
}) => {
  const handleBackToStadiumSelection = () => {
    onStadiumChange(null);
  };

  const handleBackToGameSelection = () => {
    onGameSelect(null, null);
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const formatDateTime = (dateTime: Date): string => {
    if (selectedStadium) {
      return formatDateTimeWithTimezone(dateTime, selectedStadium.timezone);
    }
    return dateTime.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <nav className="breadcrumb" role="navigation" aria-label="Current selection breadcrumb">
      <ol className="breadcrumb-list">
        <li className="breadcrumb-item">
          <button
            className="breadcrumb-button"
            onClick={handleBackToStadiumSelection}
            onKeyDown={(e) => handleKeyDown(e, handleBackToStadiumSelection)}
            aria-label="Back to stadium selection"
            title="Select a different stadium"
          >
            🏟️ Select Stadium
          </button>
        </li>
        
        {selectedStadium && (
          <>
            <li className="breadcrumb-separator" aria-hidden="true">›</li>
            <li className="breadcrumb-item">
              {gameDateTime ? (
                <button
                  className="breadcrumb-button"
                  onClick={handleBackToGameSelection}
                  onKeyDown={(e) => handleKeyDown(e, handleBackToGameSelection)}
                  aria-label="Back to game selection"
                  title="Select a different game"
                >
                  {selectedStadium.name}
                </button>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {selectedStadium.name}
                </span>
              )}
            </li>
          </>
        )}
        
        {selectedStadium && gameDateTime && (
          <>
            <li className="breadcrumb-separator" aria-hidden="true">›</li>
            <li className="breadcrumb-item">
              <span className="breadcrumb-current" aria-current="page">
                {selectedGame ? (
                  <>
                    {(() => {
                      // Handle different game structures
                      if ('teams' in selectedGame) {
                        // MLB/MiLB game structure
                        const homeTeamId = MLB_STADIUMS.find(s => s.team === selectedGame.teams.home.team.name)?.id || '';
                        const awayTeamId = MLB_STADIUMS.find(s => s.team === selectedGame.teams.away.team.name)?.id || '';
                        
                        const homeTeamName = selectedGame.teams.home.team.name;
                        const awayTeamName = selectedGame.teams.away.team.name;
                        
                        return `${awayTeamName} @ ${homeTeamName}`;
                      } else {
                        // NFL game structure
                        const nflGame = selectedGame as NFLGame;
                        return `${nflGame.awayTeam.name} @ ${nflGame.homeTeam.name}`;
                      }
                    })()}
                    <span className="breadcrumb-subtitle">
                      {formatDateTime(gameDateTime)}
                    </span>
                  </>
                ) : (
                  <>
                    Custom Time
                    <span className="breadcrumb-subtitle">
                      {formatDateTime(gameDateTime)}
                    </span>
                  </>
                )}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};