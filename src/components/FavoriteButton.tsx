import React, { useState } from 'react';
import { useUserProfile } from '../contexts/UserProfileContext';
import { Tooltip } from './Tooltip';
import './FavoriteButton.css';

interface FavoriteButtonProps {
  stadiumId: string;
  stadiumName: string;
  size?: 'small' | 'medium' | 'large';
  showLabel?: boolean;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  stadiumId,
  stadiumName,
  size = 'medium',
  showLabel = false
}) => {
  const { isFavoriteStadium, addFavoriteStadium, removeFavoriteStadium } = useUserProfile();
  const [isAnimating, setIsAnimating] = useState(false);
  
  const isFavorite = isFavoriteStadium(stadiumId);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    
    if (isFavorite) {
      removeFavoriteStadium(stadiumId);
    } else {
      addFavoriteStadium(stadiumId);
    }
  };

  const sizeClasses = {
    small: 'favorite-btn-small',
    medium: 'favorite-btn-medium',
    large: 'favorite-btn-large'
  };

  return (
    <Tooltip content={isFavorite ? `Remove ${stadiumName} from favorites` : `Add ${stadiumName} to favorites`}>
      <button
        className={`favorite-button ${sizeClasses[size]} ${isFavorite ? 'is-favorite' : ''} ${isAnimating ? 'animating' : ''}`}
        onClick={handleToggleFavorite}
        aria-label={isFavorite ? `Remove ${stadiumName} from favorites` : `Add ${stadiumName} to favorites`}
        aria-pressed={isFavorite}
      >
        <span className="favorite-icon" aria-hidden="true">
          {isFavorite ? '★' : '☆'}
        </span>
        {showLabel && (
          <span className="favorite-label">
            {isFavorite ? 'Favorited' : 'Favorite'}
          </span>
        )}
      </button>
    </Tooltip>
  );
};