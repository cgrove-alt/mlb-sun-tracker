'use client';

import React from 'react';
import Link from 'next/link';
import { WorldCupVenue } from '../../data/worldcup2026/types';

interface VenueCardProps {
  venue: WorldCupVenue;
  matchCount?: number;
  isCompareMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (venueId: string) => void;
}

export function VenueCard({ venue, matchCount, isCompareMode = false, isSelected = false, onToggleSelect }: VenueCardProps) {
  const getCountryFlag = (country: string) => {
    const flags = {
      'USA': '🇺🇸',
      'Mexico': '🇲🇽',
      'Canada': '🇨🇦'
    };
    return flags[country as keyof typeof flags] || '';
  };

  const getRoofIcon = (roof: string) => {
    if (roof === 'retractable') return '🔄';
    if (roof === 'fixed') return '🏠';
    return '☀️';
  };

  const getRoofLabel = (roof: string) => {
    if (roof === 'retractable') return 'Retractable';
    if (roof === 'fixed') return 'Fixed Roof';
    return 'Open Air';
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    if (isCompareMode && onToggleSelect) {
      e.preventDefault();
      e.stopPropagation();
      onToggleSelect(venue.id);
    }
  };

  const cardContent = (
    <>
      {/* Comparison Checkbox */}
      {isCompareMode && (
        <div className="absolute top-4 right-4 z-10">
          <label
            className="flex items-center justify-center w-10 h-10 bg-white rounded-lg shadow-lg cursor-pointer hover:bg-purple-50 transition-colors"
            onClick={handleCheckboxClick}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => {}}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
              aria-label={`Select ${venue.commonName} for comparison`}
            />
          </label>
        </div>
      )}

      {/* Header with Country Flag */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-100 transition-colors">
              {venue.commonName}
            </h3>
            <p className="text-purple-100 text-sm">
              {venue.city}, {venue.country}
            </p>
          </div>
          <span className="text-4xl">{getCountryFlag(venue.country)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Key Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Matches</div>
            <div className="text-2xl font-bold text-purple-600">
              {matchCount !== undefined ? matchCount : venue.hostMatches}
            </div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-gray-600 mb-1">Capacity</div>
            <div className="text-lg font-bold text-blue-600">
              {(venue.soccerCapacity / 1000).toFixed(0)}k
            </div>
          </div>
        </div>

        {/* Stadium Details */}
        <div className="space-y-2 text-sm text-gray-700 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Roof Type:</span>
            <span className="font-medium flex items-center gap-1">
              {getRoofIcon(venue.roof)} {getRoofLabel(venue.roof)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Surface:</span>
            <span className="font-medium capitalize">{venue.surfaceType}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Opened:</span>
            <span className="font-medium">{venue.openingYear}</span>
          </div>
        </div>

        {/* Row-level Data Badge */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-800">
              Row-level shade data available
            </span>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-2">
          {!isCompareMode && (
            <div className="flex-1 bg-purple-600 text-white rounded-lg px-4 py-3 text-center font-semibold group-hover:bg-purple-700 transition-colors">
              View Details →
            </div>
          )}
          {isCompareMode && (
            <div className="flex-1 bg-purple-100 text-purple-700 rounded-lg px-4 py-3 text-center font-semibold">
              {isSelected ? '✓ Selected for Comparison' : 'Click to Select'}
            </div>
          )}
        </div>
      </div>
    </>
  );

  if (isCompareMode) {
    return (
      <div
        onClick={handleCheckboxClick}
        className={`block bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden cursor-pointer border-2 ${
          isSelected ? 'border-purple-600 shadow-purple-200' : 'border-gray-200 hover:border-purple-400'
        }`}
      >
        {cardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/worldcup2026/venues/${venue.id}`}
      className="block bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-200 hover:border-purple-400"
    >
      {cardContent}
    </Link>
  );
}
