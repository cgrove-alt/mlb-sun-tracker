// World Cup 2026 Badge Component
// Displays a distinctive badge to identify World Cup venues

import React from 'react';

export interface WorldCupBadgeProps {
  /** Venue ID to check if it's a World Cup stadium */
  stadiumId?: string;
  /** Number of matches hosted at this venue */
  matchCount?: number;
  /** Display variant */
  variant?: 'small' | 'medium' | 'large';
  /** Show match count */
  showMatchCount?: boolean;
  /** Country hosting this venue */
  country?: 'USA' | 'Mexico' | 'Canada';
}

/**
 * World Cup 2026 Badge
 * Displays a visual indicator for World Cup venues
 */
export const WorldCupBadge: React.FC<WorldCupBadgeProps> = ({
  stadiumId,
  matchCount = 0,
  variant = 'medium',
  showMatchCount = true,
  country
}) => {
  // Check if this stadium is a World Cup venue
  const isWorldCupVenue = stadiumId?.includes('-wc');

  if (!isWorldCupVenue) {
    return null;
  }

  // Size configurations
  const sizeClasses = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  };

  // Country colors
  const countryColors = {
    USA: 'bg-blue-600 text-white',
    Mexico: 'bg-green-600 text-white',
    Canada: 'bg-red-600 text-white'
  };

  const bgColor = country ? countryColors[country] : 'bg-purple-600 text-white';
  const sizeClass = sizeClasses[variant];

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${bgColor} ${sizeClass}`}>
      <span className="inline-block w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
      <span>World Cup 2026</span>
      {showMatchCount && matchCount > 0 && (
        <span className="opacity-90">• {matchCount} {matchCount === 1 ? 'match' : 'matches'}</span>
      )}
    </div>
  );
};

export default WorldCupBadge;
