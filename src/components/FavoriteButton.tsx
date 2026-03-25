'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { preferencesStorage } from '../utils/preferences';

interface FavoriteButtonProps {
  stadiumId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function FavoriteButton({
  stadiumId,
  className = '',
  size = 'md',
  showLabel = false,
}: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if favorite on mount
  useEffect(() => {
    setIsFavorite(preferencesStorage.isFavoriteStadium(stadiumId));
  }, [stadiumId]);

  // Toggle favorite
  const handleToggle = useCallback(() => {
    if (isFavorite) {
      preferencesStorage.removeFavoriteStadium(stadiumId);
      setIsFavorite(false);
    } else {
      preferencesStorage.addFavoriteStadium(stadiumId);
      setIsFavorite(true);
      // Animate on add
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isFavorite, stadiumId]);

  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6 text-lg',
    md: 'w-8 h-8 text-xl',
    lg: 'w-10 h-10 text-2xl',
  };

  return (
    <button
      onClick={handleToggle}
      className={`
        inline-flex items-center justify-center gap-1.5 rounded-full
        transition-all duration-200
        ${isFavorite ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-400'}
        ${isAnimating ? 'scale-125' : 'scale-100'}
        ${className}
      `}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
    >
      <span className={sizeClasses[size]}>
        {isFavorite ? '★' : '☆'}
      </span>
      {showLabel && (
        <span className="text-sm font-medium">
          {isFavorite ? 'Favorited' : 'Favorite'}
        </span>
      )}
    </button>
  );
}

export default FavoriteButton;
