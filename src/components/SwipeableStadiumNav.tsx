import React, { useState, useEffect } from 'react';
import { Stadium } from '../data/stadiums';
import { useSwipeableCarousel } from '../hooks/useSwipeGesture';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { FavoriteButton } from './FavoriteButton';
import { useUserProfile } from '../contexts/UserProfileContext';
import './SwipeableStadiumNav.css';

interface SwipeableStadiumNavProps {
  stadiums: Stadium[];
  selectedStadium: Stadium | null;
  onStadiumSelect: (stadium: Stadium) => void;
}

export const SwipeableStadiumNav: React.FC<SwipeableStadiumNavProps> = ({
  stadiums,
  selectedStadium,
  onStadiumSelect
}) => {
  const { currentProfile } = useUserProfile();
  const haptic = useHapticFeedback();
  
  // Sort stadiums with favorites first
  const sortedStadiums = [...stadiums].sort((a, b) => {
    const aFav = currentProfile?.favorites.stadiums.includes(a.id) || false;
    const bFav = currentProfile?.favorites.stadiums.includes(b.id) || false;
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return a.name.localeCompare(b.name);
  });

  // Find initial index
  const initialIndex = selectedStadium 
    ? sortedStadiums.findIndex(s => s.id === selectedStadium.id)
    : 0;

  const {
    currentIndex,
    currentItem,
    goToNext,
    goToPrevious,
    goToIndex,
    swipeRef,
    isFirst,
    isLast
  } = useSwipeableCarousel(sortedStadiums, initialIndex, (index, stadium) => {
    onStadiumSelect(stadium);
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  const handleDotClick = (index: number) => {
    haptic.light();
    goToIndex(index);
  };

  const handleNavButtonClick = (direction: 'prev' | 'next') => {
    haptic.medium();
    if (direction === 'prev') {
      goToPrevious();
    } else {
      goToNext();
    }
  };

  return (
    <div className="swipeable-stadium-nav">
      <div className="stadium-nav-container" ref={swipeRef}>
        <button
          className="nav-button nav-button-prev"
          onClick={() => handleNavButtonClick('prev')}
          disabled={isFirst}
          aria-label="Previous stadium"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>

        <div className="stadium-card-wrapper">
          <div 
            className="stadium-cards-track"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {sortedStadiums.map((stadium, index) => (
              <div
                key={stadium.id}
                className={`stadium-card ${index === currentIndex ? 'active' : ''}`}
              >
                <div className="stadium-card-header">
                  <h3>{stadium.name}</h3>
                  <FavoriteButton
                    stadiumId={stadium.id}
                    stadiumName={stadium.name}
                    size="small"
                  />
                </div>
                <div className="stadium-card-content">
                  <p className="stadium-team">{stadium.team}</p>
                  <p className="stadium-location">{stadium.city}, {stadium.state}</p>
                  <div className="stadium-details">
                    <div className="detail-item">
                      <span className="detail-label">Capacity</span>
                      <span className="detail-value">{stadium.capacity?.toLocaleString() || 'N/A'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Orientation</span>
                      <span className="detail-value">{stadium.orientation || 'N/A'}°</span>
                    </div>
                  </div>
                </div>
                {currentProfile?.favorites.stadiums.includes(stadium.id) && (
                  <div className="favorite-indicator">
                    <span>★ Favorite</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          className="nav-button nav-button-next"
          onClick={() => handleNavButtonClick('next')}
          disabled={isLast}
          aria-label="Next stadium"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
      </div>

      <div className="stadium-nav-indicators">
        {sortedStadiums.map((_, index) => (
          <button
            key={index}
            className={`nav-dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to stadium ${index + 1}`}
          />
        ))}
      </div>

      <div className="stadium-nav-info">
        <p className="stadium-counter">
          {currentIndex + 1} of {sortedStadiums.length}
        </p>
        <p className="swipe-hint">Swipe or use arrows to navigate</p>
      </div>
    </div>
  );
};