'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { mlbApi, MLBGame } from '../services/mlbApi';

interface GameContextBannerProps {
  gamePk: string;
  gameDate: Date;
}

export function GameContextBanner({ gamePk, gameDate }: GameContextBannerProps) {
  const [game, setGame] = useState<MLBGame | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setIsLoading(true);
        // Fetch game details from MLB API
        const dateStr = format(gameDate, 'yyyy-MM-dd');
        const startDate = dateStr;
        const endDate = dateStr;
        const games = await mlbApi.getSchedule(startDate, endDate, 2026);

        // Find the specific game by gamePk
        const foundGame = games.find(g => g.gamePk.toString() === gamePk);
        setGame(foundGame || null);
      } catch (error) {
        console.error('Failed to fetch game details:', error);
        setGame(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (gamePk && gameDate) {
      fetchGameDetails();
    }
  }, [gamePk, gameDate]);

  if (isLoading) {
    return (
      <div className="game-context-banner loading">
        <div className="banner-content">
          Loading game details...
        </div>
      </div>
    );
  }

  if (!game) {
    return null; // Don't show banner if no game selected
  }

  const formattedDate = format(gameDate, 'EEEE, MMMM d, yyyy');
  const formattedTime = format(gameDate, 'h:mm a');
  const dayNightIcon = game.dayNight === 'day' ? '☀️' : '🌙';
  const opponent = game.teams.away.team.name;

  return (
    <div className="game-context-banner">
      <div className="banner-content">
        <span className="game-icon">📅</span>
        <span className="game-details">
          <strong>Viewing Game:</strong> {formattedDate} · {formattedTime} {dayNightIcon} vs {opponent}
        </span>
      </div>

      <style jsx>{`
        .game-context-banner {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          padding: 1rem 1.5rem;
          margin-bottom: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          animation: slideDown 0.3s ease-out;
        }

        .game-context-banner.loading {
          background: linear-gradient(135deg, #64748b 0%, #475569 100%);
        }

        .banner-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          justify-content: center;
          flex-wrap: wrap;
          text-align: center;
        }

        .game-icon {
          font-size: 1.5rem;
        }

        .game-details {
          font-size: 1rem;
          line-height: 1.5;
        }

        .game-details strong {
          font-weight: 700;
          margin-right: 0.5rem;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .game-context-banner {
            padding: 0.875rem 1rem;
          }

          .game-details {
            font-size: 0.9rem;
          }

          .game-icon {
            font-size: 1.25rem;
          }
        }
      `}</style>
    </div>
  );
}
