import React, { useState } from 'react';
import { MLBGame } from '../services/mlbApi';
import { format, isToday, isTomorrow } from 'date-fns';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import './SwipeableGameCard.css';

interface SwipeableGameCardProps {
  game: MLBGame;
  isSelected: boolean;
  onSelect: () => void;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const SwipeableGameCard: React.FC<SwipeableGameCardProps> = ({
  game,
  isSelected,
  onSelect,
  onSwipeLeft,
  onSwipeRight
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipingLeft, setIsSwipingLeft] = useState(false);
  const [isSwipingRight, setIsSwipingRight] = useState(false);

  const gameDate = new Date(game.gameDate);

  const getDateLabel = () => {
    if (isToday(gameDate)) return 'Today';
    if (isTomorrow(gameDate)) return 'Tomorrow';
    return format(gameDate, 'EEE, MMM d');
  };

  const swipeRef = useSwipeGesture({
    onSwipeLeft: () => {
      setIsSwipingLeft(true);
      setTimeout(() => {
        onSwipeLeft?.();
        setIsSwipingLeft(false);
        setSwipeOffset(0);
      }, 300);
    },
    onSwipeRight: () => {
      setIsSwipingRight(true);
      setTimeout(() => {
        onSwipeRight?.();
        setIsSwipingRight(false);
        setSwipeOffset(0);
      }, 300);
    }
  }, {
    threshold: 50,
    velocity: 0.3
  });

  const handleTouchStart = (e: React.TouchEvent) => {
    // Store initial touch position
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // Calculate swipe offset for visual feedback
    const touch = e.touches[0];
    const startX = (e.target as any)._touchStartX || touch.clientX;
    (e.target as any)._touchStartX = startX;
    const offset = touch.clientX - startX;
    setSwipeOffset(Math.max(-100, Math.min(100, offset)));
  };

  const handleTouchEnd = () => {
    setSwipeOffset(0);
  };

  return (
    <div 
      ref={swipeRef as React.RefObject<HTMLDivElement>}
      className={`swipeable-game-card ${isSelected ? 'selected' : ''} ${isSwipingLeft ? 'swiping-left' : ''} ${isSwipingRight ? 'swiping-right' : ''}`}
      onClick={onSelect}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.1}deg)`,
        transition: swipeOffset === 0 ? 'all 0.3s ease-out' : 'none'
      }}
    >
      <div className="game-card-content">
        <div className="game-card-header">
          <div className="game-date-badge">
            <span className="game-date-day">{format(gameDate, 'd')}</span>
            <span className="game-date-month">{format(gameDate, 'MMM')}</span>
          </div>
          <div className="game-info">
            <h3 className="game-date-label">{getDateLabel()}</h3>
            <p className="game-time">{format(gameDate, 'h:mm a')}</p>
          </div>
        </div>

        <div className="game-teams">
          <div className="team home">
            <span className="team-label">HOME</span>
            <span className="team-name">{game.teams.home.team.name}</span>
          </div>
          <div className="game-vs">VS</div>
          <div className="team away">
            <span className="team-label">AWAY</span>
            <span className="team-name">{game.teams.away.team.name}</span>
          </div>
        </div>

        {isSelected && (
          <div className="game-selected-indicator">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Swipe action indicators */}
      <div className="swipe-action swipe-action-left">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
      </div>
      <div className="swipe-action swipe-action-right">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
    </div>
  );
};