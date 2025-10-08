import React from 'react';
import { Stadium, MLB_STADIUMS } from '../data/stadiums';
import { UnifiedVenue, getLeagueInfo } from '../data/unifiedVenues';
import { MLBGame } from '../services/mlbApi';
import { MiLBGame } from '../services/milbApi';
import { NFLGame } from '../services/nflApi';
import { formatDateTimeWithTimezone } from '../utils/timeUtils';

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
    <nav className="bg-white rounded-lg py-3 px-4 md:py-2 md:px-3 mb-4 md:mb-3 shadow-sm border border-gray-200" role="navigation" aria-label="Current selection breadcrumb">
      <ol className="flex items-center flex-wrap m-0 p-0 list-none gap-2 md:gap-1 sm:flex-col sm:items-start sm:gap-2">
        {/* League Selection */}
        <li className="flex items-center">
          <button
            className="bg-transparent border-0 text-blue-600 cursor-pointer text-sm md:text-xs py-1 px-2 rounded transition-all duration-200 flex items-center gap-1 hover:bg-blue-50 hover:text-blue-700 focus:outline focus:outline-2 focus:outline-blue-600 focus:outline-offset-2 sm:w-full sm:justify-start sm:py-3 sm:px-4 sm:bg-gray-50 sm:border sm:border-gray-300 sm:rounded-md sm:min-h-[48px] sm:text-base"
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
            <li className="text-gray-500 text-sm md:text-xs mx-1 md:mx-0.5 select-none sm:hidden" aria-hidden="true">›</li>
            <li className="flex items-center sm:w-full">
              {selectedLeague === 'MiLB' && !selectedMiLBLevel ? (
                <span className="text-gray-600 font-medium text-sm md:text-xs flex flex-col items-start sm:py-3 sm:px-4 sm:bg-gray-200 sm:rounded-md sm:w-full sm:min-h-[48px] sm:text-base" aria-current="page">
                  {getLeagueInfo(selectedLeague)?.name || selectedLeague}
                </span>
              ) : (selectedVenue || selectedStadium) ? (
                <button
                  className="bg-transparent border-0 text-blue-600 cursor-pointer text-sm md:text-xs py-1 px-2 rounded transition-all duration-200 flex items-center gap-1 hover:bg-blue-50 hover:text-blue-700 focus:outline focus:outline-2 focus:outline-blue-600 focus:outline-offset-2 sm:w-full sm:justify-start sm:py-3 sm:px-4 sm:bg-gray-50 sm:border sm:border-gray-300 sm:rounded-md sm:min-h-[48px] sm:text-base"
                  onClick={handleBackToLeagueSelection}
                  onKeyDown={(e) => handleKeyDown(e, handleBackToLeagueSelection)}
                  aria-label="Back to league selection"
                  title="Select a different league"
                >
                  {getLeagueInfo(selectedLeague)?.name || selectedLeague}
                </button>
              ) : (
                <span className="text-gray-600 font-medium text-sm md:text-xs flex flex-col items-start sm:py-3 sm:px-4 sm:bg-gray-200 sm:rounded-md sm:w-full sm:min-h-[48px] sm:text-base" aria-current="page">
                  {getLeagueInfo(selectedLeague)?.name || selectedLeague}
                </span>
              )}
            </li>
          </>
        )}

        {/* MiLB Level Selection (only for MiLB) */}
        {selectedLeague === 'MiLB' && selectedMiLBLevel && (
          <>
            <li className="text-gray-500 text-sm md:text-xs mx-1 md:mx-0.5 select-none sm:hidden" aria-hidden="true">›</li>
            <li className="flex items-center sm:w-full">
              {(selectedVenue || selectedStadium) ? (
                <button
                  className="bg-transparent border-0 text-blue-600 cursor-pointer text-sm md:text-xs py-1 px-2 rounded transition-all duration-200 flex items-center gap-1 hover:bg-blue-50 hover:text-blue-700 focus:outline focus:outline-2 focus:outline-blue-600 focus:outline-offset-2 sm:w-full sm:justify-start sm:py-3 sm:px-4 sm:bg-gray-50 sm:border sm:border-gray-300 sm:rounded-md sm:min-h-[48px] sm:text-base"
                  onClick={handleBackToLevelSelection}
                  onKeyDown={(e) => handleKeyDown(e, handleBackToLevelSelection)}
                  aria-label="Back to level selection"
                  title="Select a different level"
                >
                  {getMiLBLevelDisplayName(selectedMiLBLevel)}
                </button>
              ) : (
                <span className="text-gray-600 font-medium text-sm md:text-xs flex flex-col items-start sm:py-3 sm:px-4 sm:bg-gray-200 sm:rounded-md sm:w-full sm:min-h-[48px] sm:text-base" aria-current="page">
                  {getMiLBLevelDisplayName(selectedMiLBLevel)}
                </span>
              )}
            </li>
          </>
        )}

        {/* Selected Venue/Stadium */}
        {(selectedVenue || selectedStadium) && (
          <>
            <li className="text-gray-500 text-sm md:text-xs mx-1 md:mx-0.5 select-none sm:hidden" aria-hidden="true">›</li>
            <li className="flex items-center sm:w-full">
              {gameDateTime ? (
                <button
                  className="bg-transparent border-0 text-blue-600 cursor-pointer text-sm md:text-xs py-1 px-2 rounded transition-all duration-200 flex items-center gap-1 hover:bg-blue-50 hover:text-blue-700 focus:outline focus:outline-2 focus:outline-blue-600 focus:outline-offset-2 sm:w-full sm:justify-start sm:py-3 sm:px-4 sm:bg-gray-50 sm:border sm:border-gray-300 sm:rounded-md sm:min-h-[48px] sm:text-base"
                  onClick={handleBackToVenueSelection}
                  onKeyDown={(e) => handleKeyDown(e, handleBackToVenueSelection)}
                  aria-label="Back to venue selection"
                  title="Select a different venue"
                >
                  {selectedVenue?.name || selectedStadium?.name}
                </button>
              ) : (
                <span className="text-gray-600 font-medium text-sm md:text-xs flex flex-col items-start sm:py-3 sm:px-4 sm:bg-gray-200 sm:rounded-md sm:w-full sm:min-h-[48px] sm:text-base" aria-current="page">
                  {selectedVenue?.name || selectedStadium?.name}
                </span>
              )}
            </li>
          </>
        )}

        {/* Selected Game/Time */}
        {(selectedVenue || selectedStadium) && gameDateTime && (
          <>
            <li className="text-gray-500 text-sm md:text-xs mx-1 md:mx-0.5 select-none sm:hidden" aria-hidden="true">›</li>
            <li className="flex items-center sm:w-full">
              <span className="text-gray-600 font-medium text-sm md:text-xs flex flex-col items-start sm:py-3 sm:px-4 sm:bg-gray-200 sm:rounded-md sm:w-full sm:min-h-[48px] sm:text-base" aria-current="page">
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
                    <span className="text-xs md:text-[0.7rem] text-gray-500 font-normal mt-0.5">
                      {formatDateTime(gameDateTime)}
                    </span>
                  </>
                ) : (
                  <>
                    Custom Time
                    <span className="text-xs md:text-[0.7rem] text-gray-500 font-normal mt-0.5">
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