'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MLBGame, mlbApi } from '../services/mlbApi';
import { format, parseISO } from 'date-fns';

interface UpcomingGamesSelectorProps {
  stadiumId: string;
  onGameSelect: (date: string, time: string, opponent: string) => void;
  selectedDate?: string;
  selectedTime?: string;
}

export const UpcomingGamesSelector: React.FC<UpcomingGamesSelectorProps> = ({
  stadiumId,
  onGameSelect,
  selectedDate,
  selectedTime
}) => {
  const [games, setGames] = useState<MLBGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fetch upcoming home games for this stadium
  const loadGames = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const now = new Date();
      // Get games for next 30 days
      const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

      const schedule = await mlbApi.getSchedule(
        now.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );

      const homeGames = mlbApi.getHomeGamesForStadium(stadiumId, schedule);

      // Sort by date
      homeGames.sort((a, b) =>
        new Date(a.gameDate).getTime() - new Date(b.gameDate).getTime()
      );

      setGames(homeGames.slice(0, 10)); // Show next 10 games
    } catch (err) {
      console.error('Error loading games:', err);
      setError('Could not load game schedule');
    } finally {
      setIsLoading(false);
    }
  }, [stadiumId]);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  // Format game date/time for display
  const formatGameDateTime = (gameDate: string) => {
    try {
      const date = parseISO(gameDate);
      return {
        date: format(date, 'EEE, MMM d'),
        time: format(date, 'h:mm a'),
        isoDate: format(date, 'yyyy-MM-dd'),
        hourMinute: format(date, 'HH:mm')
      };
    } catch {
      return null;
    }
  };

  // Check if a game is selected
  const isGameSelected = (game: MLBGame) => {
    const formatted = formatGameDateTime(game.gameDate);
    if (!formatted) return false;
    return selectedDate === formatted.isoDate && selectedTime === formatted.hourMinute;
  };

  if (isLoading) {
    return (
      <div className="bg-blue-50 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-blue-700">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm">Loading upcoming games...</span>
        </div>
      </div>
    );
  }

  if (error || games.length === 0) {
    return null; // Don't show anything if no games
  }

  const displayGames = isExpanded ? games : games.slice(0, 3);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-4 border border-blue-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="font-semibold text-blue-800">Upcoming Home Games</span>
        </div>
        {games.length > 3 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {isExpanded ? 'Show less' : `Show all ${games.length}`}
          </button>
        )}
      </div>

      <div className="grid gap-2">
        {displayGames.map((game) => {
          const formatted = formatGameDateTime(game.gameDate);
          if (!formatted) return null;

          const isSelected = isGameSelected(game);
          const opponent = game.teams.away.team.name;

          return (
            <button
              key={game.gamePk}
              onClick={() => onGameSelect(formatted.isoDate, formatted.hourMinute, opponent)}
              className={`flex items-center justify-between p-3 rounded-lg transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white hover:bg-blue-50 text-gray-800 border border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`text-sm font-medium ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                  {formatted.date}
                </div>
                <div className="font-semibold">
                  vs {opponent.replace(/^(Los Angeles|New York|Chicago|San Francisco|San Diego|Kansas City|St\. Louis|Tampa Bay) /, '')}
                </div>
              </div>
              <div className={`flex items-center gap-2 ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                <span className="text-sm font-medium">{formatted.time}</span>
                {isSelected && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <p className="text-xs text-gray-500 mt-3">
        Select a game to see shade predictions for that time, or choose a custom date/time below.
      </p>
    </div>
  );
};

export default UpcomingGamesSelector;
