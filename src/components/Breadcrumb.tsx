import React from 'react';
import { Stadium } from '../data/stadiums';
import { MLBGame } from '../services/mlbApi';
import './Breadcrumb.css';

interface BreadcrumbProps {
  selectedStadium: Stadium | null;
  selectedGame: MLBGame | null;
  gameDateTime: Date | null;
  onStadiumChange: (stadium: Stadium | null) => void;
  onGameSelect: (game: MLBGame | null, dateTime: Date | null) => void;
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
            aria-label={t('breadcrumb.backToStadium')}
            title={t('breadcrumb.selectDifferentStadium')}
          >
            🏟️ {t('breadcrumb.selectStadium')}
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
                  aria-label={t('breadcrumb.backToGame')}
                  title={t('breadcrumb.selectDifferentGame')}
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
                    {selectedGame.teams.away.team.name} @ {selectedGame.teams.home.team.name}
                    <span className="breadcrumb-subtitle">
                      {formatDateTime(gameDateTime)}
                    </span>
                  </>
                ) : (
                  <>
                    {t('breadcrumb.customTime')}
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