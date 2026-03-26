import React from 'react';
import { Stadium, MLB_STADIUMS } from '../data/stadiums';
import { UnifiedVenue, getLeagueInfo } from '../data/unifiedVenues';
import { MLBGame } from '../services/mlbApi';
import { MiLBGame } from '../services/milbApi';
import { NFLGame } from '../services/nflApi';
import { formatDateTimeWithTimezone } from '../utils/timeUtils';
import './Breadcrumb.css';

interface BreadcrumbProps {
  selectedVenue?: UnifiedVenue | null;
  selectedStadium?: Stadium | null;
  selectedGame?: MLBGame | MiLBGame | NFLGame | null;
  gameDateTime?: Date | null;
  selectedLeague?: string;
  selectedMiLBLevel?: string;
  onLeagueChange?: (league: string) => void;
  onMiLBLevelChange?: (level: string) => void;
  onVenueChange?: (venue: UnifiedVenue | null) => void;
  onStadiumChange?: (stadium: Stadium | null) => void;
  onGameSelect?: (game: MLBGame | MiLBGame | NFLGame | null, dateTime: Date | null) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  selectedVenue,
  selectedStadium,
  selectedGame,
  gameDateTime,
  selectedLeague,
  selectedMiLBLevel,
  onLeagueChange,
  onMiLBLevelChange,
  onVenueChange,
  onStadiumChange,
  onGameSelect
}) => {
  const getMiLBLevelDisplayName = (level: string): string => {
    switch (level) {
      case 'AAA':
        return 'Triple-A (AAA)';
      case 'AA':
        return 'Double-A (AA)';
      case 'A+':
        return 'High-A (A+)';
      case 'A':
        return 'Single-A (A)';
      default:
        return level;
    }
  };

  const handleBackToLeagueSelection = () => {
    if (onLeagueChange) {
      onLeagueChange('');
    }
    if (onVenueChange) {
      onVenueChange(null);
    }
    onStadiumChange?.(null);
  };

  const handleBackToLevelSelection = () => {
    if (onMiLBLevelChange) {
      onMiLBLevelChange('');
    }
    if (onVenueChange) {
      onVenueChange(null);
    }
    onStadiumChange?.(null);
  };

  const handleBackToVenueSelection = () => {
    if (onVenueChange) {
      onVenueChange(null);
    }
    onStadiumChange?.(null);
  };

  const handleBackToGameSelection = () => {
    onGameSelect?.(null, null);
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
        {/* League Selection */}
        <li className="breadcrumb-item">
          <button
            className="breadcrumb-button"
            onClick={handleBackToLeagueSelection}
            onKeyDown={(e) => handleKeyDown(e, handleBackToLeagueSelection)}
            aria-label="Back to league selection"
            title="Select a different league"
          >
            🏟️ Select League
          </button>
        </li>
        
        {/* Selected League */}
        {selectedLeague && (
          <>
            <li className="breadcrumb-separator" aria-hidden="true">›</li>
            <li className="breadcrumb-item">
              {selectedLeague === 'MiLB' && !selectedMiLBLevel ? (
                <span className="breadcrumb-current" aria-current="page">
                  {getLeagueInfo(selectedLeague)?.name || selectedLeague}
                </span>
              ) : (selectedVenue || selectedStadium) ? (
                <button
                  className="breadcrumb-button"
                  onClick={handleBackToLeagueSelection}
                  onKeyDown={(e) => handleKeyDown(e, handleBackToLeagueSelection)}
                  aria-label="Back to league selection"
                  title="Select a different league"
                >
                  {getLeagueInfo(selectedLeague)?.name || selectedLeague}
                </button>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {getLeagueInfo(selectedLeague)?.name || selectedLeague}
                </span>
              )}
            </li>
          </>
        )}
        
        {/* MiLB Level Selection (only for MiLB) */}
        {selectedLeague === 'MiLB' && selectedMiLBLevel && (
          <>
            <li className="breadcrumb-separator" aria-hidden="true">›</li>
            <li className="breadcrumb-item">
              {(selectedVenue || selectedStadium) ? (
                <button
                  className="breadcrumb-button"
                  onClick={handleBackToLevelSelection}
                  onKeyDown={(e) => handleKeyDown(e, handleBackToLevelSelection)}
                  aria-label="Back to level selection"
                  title="Select a different level"
                >
                  {getMiLBLevelDisplayName(selectedMiLBLevel)}
                </button>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {getMiLBLevelDisplayName(selectedMiLBLevel)}
                </span>
              )}
            </li>
          </>
        )}
        
        {/* Selected Venue/Stadium */}
        {(selectedVenue || selectedStadium) && (
          <>
            <li className="breadcrumb-separator" aria-hidden="true">›</li>
            <li className="breadcrumb-item">
              {gameDateTime ? (
                <button
                  className="breadcrumb-button"
                  onClick={handleBackToVenueSelection}
                  onKeyDown={(e) => handleKeyDown(e, handleBackToVenueSelection)}
                  aria-label="Back to venue selection"
                  title="Select a different venue"
                >
                  {selectedVenue?.name || selectedStadium?.name}
                </button>
              ) : (
                <span className="breadcrumb-current" aria-current="page">
                  {selectedVenue?.name || selectedStadium?.name}
                </span>
              )}
            </li>
          </>
        )}
        
        {/* Selected Game/Time */}
        {(selectedVenue || selectedStadium) && gameDateTime && (
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