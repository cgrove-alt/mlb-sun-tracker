import React, { useState, useEffect } from 'react';
import { MLBGame } from '../services/mlbApi';
import { format, isToday, isTomorrow, differenceInDays } from 'date-fns';
import { formatGameTime } from '../utils/dateTimeUtils';
import './MobileGameScheduler.css';

interface MobileGameSchedulerProps {
  games: MLBGame[];
  selectedGame: MLBGame | null;
  onGameSelect: (game: MLBGame) => void;
  loading?: boolean;
}

export const MobileGameScheduler: React.FC<MobileGameSchedulerProps> = ({
  games,
  selectedGame,
  onGameSelect,
  loading = false
}) => {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);

  // Group games by month
  const gamesByMonth = games.reduce((acc, game) => {
    const monthKey = format(new Date(game.gameDate), 'MMMM yyyy');
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(game);
    return acc;
  }, {} as Record<string, MLBGame[]>);

  // Auto-expand current month or month with selected game
  useEffect(() => {
    if (selectedGame) {
      const selectedMonth = format(new Date(selectedGame.gameDate), 'MMMM yyyy');
      setExpandedMonth(selectedMonth);
    } else if (!expandedMonth && games.length > 0) {
      const firstMonth = Object.keys(gamesByMonth)[0];
      setExpandedMonth(firstMonth);
    }
  }, [selectedGame, games]);

  const getGameDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    
    const days = differenceInDays(date, new Date());
    if (days > 0 && days <= 7) {
      return format(date, 'EEEE');
    }
    
    return format(date, 'MMM d');
  };

  const getGameTimeLabel = (date: Date) => {
    return formatGameTime(date, false);
  };

  if (loading) {
    return (
      <div className="mobile-game-scheduler loading">
        <div className="mobile-game-skeleton">
          <div className="skeleton-header" />
          <div className="skeleton-games">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-game" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="mobile-game-scheduler empty">
        <div className="mobile-game-empty">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" />
          </svg>
          <p>No upcoming games</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-game-scheduler">
      <div className="mobile-game-months">
        {Object.entries(gamesByMonth).map(([month, monthGames]) => (
          <div key={month} className="mobile-game-month">
            <button
              className={`mobile-game-month-header ${expandedMonth === month ? 'expanded' : ''}`}
              onClick={() => setExpandedMonth(expandedMonth === month ? null : month)}
              aria-expanded={expandedMonth === month}
            >
              <div className="mobile-game-month-info">
                <h3>{month}</h3>
                <span className="mobile-game-count">{monthGames.length} games</span>
              </div>
              <svg 
                className="mobile-game-chevron" 
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>

            {expandedMonth === month && (
              <div className="mobile-game-list">
                {monthGames.map(game => {
                  const gameDate = new Date(game.gameDate);
                  const isSelected = selectedGame?.gamePk === game.gamePk;
                  
                  return (
                    <button
                      key={game.gamePk}
                      className={`mobile-game-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => onGameSelect(game)}
                      aria-pressed={isSelected}
                    >
                      <div className="mobile-game-date">
                        <div className="mobile-game-date-day">{format(gameDate, 'd')}</div>
                        <div className="mobile-game-date-label">{getGameDateLabel(gameDate)}</div>
                      </div>
                      
                      <div className="mobile-game-details">
                        <div className="mobile-game-teams">
                          <span className="mobile-game-opponent">vs {game.teams.away.team.name}</span>
                        </div>
                        <div className="mobile-game-meta">
                          <span className="mobile-game-time">{getGameTimeLabel(gameDate)}</span>
                          {/* Weather will be loaded separately */}
                        </div>
                      </div>

                      {isSelected && (
                        <svg className="mobile-game-check" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};