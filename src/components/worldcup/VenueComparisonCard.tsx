'use client';

import React from 'react';
import Link from 'next/link';
import { WorldCupVenue } from '../../data/worldcup2026/types';
import { CloseIcon } from '../Icons';

interface VenueComparisonCardProps {
  venue: WorldCupVenue;
  matchCount: number;
  onRemove: (venueId: string) => void;
  isBestShade?: boolean;
  isBestCapacity?: boolean;
  isMostMatches?: boolean;
  isNewest?: boolean;
}

export function VenueComparisonCard({
  venue,
  matchCount,
  onRemove,
  isBestShade = false,
  isBestCapacity = false,
  isMostMatches = false,
  isNewest = false,
}: VenueComparisonCardProps) {
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

  const getShadeScore = () => {
    // Calculate shade score based on roof type
    if (venue.roof === 'fixed') return 100; // Best shade
    if (venue.roof === 'retractable') return 75; // Good shade option
    return 25; // Open air - least shade
  };

  const shadeScore = getShadeScore();
  const getShadeLabel = () => {
    if (shadeScore >= 75) return 'Excellent Shade';
    if (shadeScore >= 50) return 'Good Shade';
    if (shadeScore >= 25) return 'Limited Shade';
    return 'Open Air';
  };

  const getShadeColorClass = () => {
    if (shadeScore >= 75) return 'text-green-600 bg-green-50';
    if (shadeScore >= 50) return 'text-blue-600 bg-blue-50';
    return 'text-orange-600 bg-orange-50';
  };

  return (
    <div className="venue-comparison-card bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden relative">
      {/* Remove button */}
      <button
        onClick={() => onRemove(venue.id)}
        className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
        aria-label={`Remove ${venue.commonName} from comparison`}
      >
        <CloseIcon size={20} />
      </button>

      {/* Badges */}
      {(isBestShade || isBestCapacity || isMostMatches || isNewest) && (
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {isBestShade && (
            <div className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <span>☂️</span> Best Shade
            </div>
          )}
          {isBestCapacity && (
            <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <span>🏟️</span> Largest
            </div>
          )}
          {isMostMatches && (
            <div className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <span>⚽</span> Most Matches
            </div>
          )}
          {isNewest && (
            <div className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <span>✨</span> Newest
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-6 pt-16">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">
              {venue.commonName}
            </h3>
            <p className="text-purple-100 text-base mb-1">
              {venue.city}, {venue.country}
            </p>
            <p className="text-purple-200 text-sm">
              {venue.fifaName}
            </p>
          </div>
          <span className="text-5xl">{getCountryFlag(venue.country)}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Matches</div>
            <div className="text-3xl font-bold text-purple-600">{matchCount}</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-sm text-gray-600 mb-1">Capacity</div>
            <div className="text-2xl font-bold text-blue-600">
              {(venue.soccerCapacity / 1000).toFixed(0)}k
            </div>
          </div>
        </div>

        {/* Shade Analysis */}
        <div className={`rounded-lg p-4 mb-4 ${getShadeColorClass()}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Shade Conditions</span>
            <span className="text-2xl font-bold">{shadeScore}%</span>
          </div>
          <div className="text-sm font-semibold">{getShadeLabel()}</div>
        </div>

        {/* Stadium Details */}
        <div className="space-y-3 text-sm mb-6">
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Roof Type:</span>
            <span className="font-semibold flex items-center gap-2">
              {getRoofIcon(venue.roof)} {getRoofLabel(venue.roof)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Surface:</span>
            <span className="font-semibold capitalize">{venue.surfaceType}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Opened:</span>
            <span className="font-semibold">{venue.openingYear}</span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-gray-600 font-medium">Soccer Capacity:</span>
            <span className="font-semibold">{venue.soccerCapacity.toLocaleString()}</span>
          </div>
        </div>

        {/* Data Availability Badge */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-green-800">
              {venue.sections.length} sections with row-level shade data
            </span>
          </div>
        </div>

        {/* View Details Link */}
        <Link
          href={`/worldcup2026/venues/${venue.id}`}
          className="block bg-purple-600 text-white rounded-lg px-4 py-3 text-center font-semibold hover:bg-purple-700 transition-colors"
        >
          View Full Details →
        </Link>
      </div>
    </div>
  );
}
