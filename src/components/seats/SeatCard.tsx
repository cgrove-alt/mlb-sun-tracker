'use client';

import React from 'react';
import type { Seat } from '../../types/seat';

interface SeatCardProps {
  seat: Seat;
  sunExposure: number; // 0-100 percentage
  onSelect?: (seat: Seat) => void;
  showSection?: boolean; // Show section name?
  showPrice?: boolean; // Show price tier when available
  compact?: boolean; // Compact view for mobile
}

/**
 * SeatCard Component
 * Displays an individual seat with sun exposure info
 *
 * This is the primary building block for the seat-first interface
 * Used in search results, recommendations, and comparison views
 */
export const SeatCard: React.FC<SeatCardProps> = ({
  seat,
  sunExposure,
  onSelect,
  showSection = true,
  showPrice = true,
  compact = false,
}) => {
  // Get sun exposure category and styling
  const getSunCategory = () => {
    if (sunExposure === 0) return { label: 'Full Shade', icon: '🌑', color: 'bg-gray-100 border-gray-300' };
    if (sunExposure < 30) return { label: 'Mostly Shade', icon: '🌤️', color: 'bg-green-50 border-green-300' };
    if (sunExposure < 70) return { label: 'Partial Sun', icon: '⛅', color: 'bg-yellow-50 border-yellow-300' };
    if (sunExposure < 90) return { label: 'Mostly Sun', icon: '☀️', color: 'bg-orange-50 border-orange-300' };
    return { label: 'Full Sun', icon: '🔥', color: 'bg-red-50 border-red-300' };
  };

  const sunCategory = getSunCategory();

  // Get view quality badge
  const getViewQualityBadge = () => {
    if (!seat.viewQuality) return null;

    const colors: Record<string, string> = {
      excellent: 'bg-blue-100 text-blue-800',
      good: 'bg-green-100 text-green-800',
      fair: 'bg-yellow-100 text-yellow-800',
      partial: 'bg-yellow-100 text-yellow-800',
      obstructed: 'bg-red-100 text-red-800',
      poor: 'bg-gray-100 text-gray-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[seat.viewQuality] || colors.fair}`}>
        {seat.viewQuality.charAt(0).toUpperCase() + seat.viewQuality.slice(1)} View
      </span>
    );
  };

  // Get price tier badge
  const getPriceBadge = () => {
    if (!showPrice || !seat.price) return null;

    const priceColors = {
      value: 'bg-green-100 text-green-800',
      moderate: 'bg-blue-100 text-blue-800',
      premium: 'bg-purple-100 text-purple-800',
      luxury: 'bg-amber-100 text-amber-800',
    };

    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priceColors[seat.price] || priceColors.moderate}`}>
        {seat.price.charAt(0).toUpperCase() + seat.price.slice(1)}
      </span>
    );
  };

  // Get accessibility badges
  const getAccessibilityBadges = () => {
    const badges = [];

    if (seat.accessibility?.wheelchairAccessible) {
      badges.push(
        <span key="wheelchair" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
          ♿ Wheelchair
        </span>
      );
    }

    if (seat.accessibility?.companionSeat) {
      badges.push(
        <span key="companion" className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
          Companion
        </span>
      );
    }

    return badges;
  };

  // Compact view for mobile/dense layouts
  if (compact) {
    return (
      <button
        onClick={() => onSelect?.(seat)}
        className={`w-full p-3 rounded-lg border-2 ${sunCategory.color} hover:shadow-md transition-shadow text-left`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {showSection && (
              <p className="text-xs text-gray-600 font-medium">{seat.sectionId}</p>
            )}
            <p className="text-sm font-semibold text-gray-900">
              Row {seat.row}, Seat {seat.seatNumber}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl">{sunCategory.icon}</div>
            <p className="text-xs text-gray-600 mt-1">{sunExposure}%</p>
          </div>
        </div>
      </button>
    );
  }

  // Full card view
  return (
    <button
      onClick={() => onSelect?.(seat)}
      className={`w-full p-4 rounded-lg border-2 ${sunCategory.color} hover:shadow-lg transition-all text-left`}
    >
      {/* Header: Sun exposure */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-3xl">{sunCategory.icon}</span>
          <div>
            <p className="text-sm font-semibold text-gray-900">{sunCategory.label}</p>
            <p className="text-xs text-gray-600">{sunExposure}% sun exposure</p>
          </div>
        </div>
        {seat.covered && (
          <span className="text-lg" title="Covered section">
            🏛️
          </span>
        )}
      </div>

      {/* Seat identification */}
      {showSection && (
        <p className="text-xs text-gray-500 font-medium mb-1">Section {seat.sectionId}</p>
      )}
      <p className="text-base font-bold text-gray-900 mb-3">
        Row {seat.row}, Seat {seat.seatNumber}
      </p>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3"></div>

      {/* Details grid */}
      <div className="space-y-2">
        {/* View quality */}
        {seat.viewQuality && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">View:</span>
            {getViewQualityBadge()}
          </div>
        )}

        {/* Level */}
        {seat.level && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Level:</span>
            <span className="font-medium text-gray-900">
              {seat.level.charAt(0).toUpperCase() + seat.level.slice(1)}
            </span>
          </div>
        )}

        {/* Distance from home plate */}
        {seat.distanceFromHomeplate && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Distance:</span>
            <span className="font-medium text-gray-900">
              {Math.round(seat.distanceFromHomeplate)} ft
            </span>
          </div>
        )}

        {/* Price tier */}
        {showPrice && seat.price && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            {getPriceBadge()}
          </div>
        )}
      </div>

      {/* Accessibility badges */}
      {(seat.accessibility?.wheelchairAccessible || seat.accessibility?.companionSeat) && (
        <>
          <div className="border-t border-gray-200 my-3"></div>
          <div className="flex flex-wrap gap-2">
            {getAccessibilityBadges()}
          </div>
        </>
      )}

      {/* Seat type indicators */}
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {seat.seatType === 'aisle' && (
          <span className="text-gray-500">🚶 Aisle</span>
        )}
        {seat.hasArmrests && (
          <span className="text-gray-500">🪑 Armrests</span>
        )}
        {seat.cupHolders && (
          <span className="text-gray-500">🥤 Cup holders</span>
        )}
      </div>

      {/* Call to action */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-sm font-medium text-blue-600">
          Select Seat →
        </p>
      </div>
    </button>
  );
};

// Memoize to prevent unnecessary re-renders
export default React.memo(SeatCard);
