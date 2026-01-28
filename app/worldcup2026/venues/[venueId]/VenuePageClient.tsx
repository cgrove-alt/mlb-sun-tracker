'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { WorldCupVenue } from '../../../../src/data/worldcup2026/types';
import { getMatchesByVenue } from '../../../../src/data/worldcup2026/matches';
import { MatchCountdown } from '../../../../src/components/MatchCountdown';
import { ClimateMessaging } from '../../../../src/components/worldcup/ClimateMessaging';
import { useTranslation } from '../../../../src/i18n/i18nContext';

interface VenuePageClientProps {
  venue: WorldCupVenue;
}

export function VenuePageClient({ venue }: VenuePageClientProps) {
  const { t } = useTranslation();
  const matches = useMemo(() => getMatchesByVenue(venue.id), [venue.id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const groupMatchesByRound = () => {
    const grouped = new Map<string, typeof matches>();
    matches.forEach(match => {
      const existing = grouped.get(match.round) || [];
      grouped.set(match.round, [...existing, match]);
    });
    return grouped;
  };

  const matchesByRound = useMemo(() => groupMatchesByRound(), [matches]);
  const rounds = ['Group Stage', 'Round of 32', 'Round of 16', 'Quarterfinal', 'Semifinal', 'Third Place', 'Final'];
  const sortedRounds = Array.from(matchesByRound.keys()).sort((a, b) => rounds.indexOf(a) - rounds.indexOf(b));

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
    if (roof === 'retractable') return 'Retractable Roof';
    if (roof === 'fixed') return 'Fixed Roof';
    return 'Open Air';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-5xl">{getCountryFlag(venue.country)}</span>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    {venue.commonName}
                  </h1>
                  {venue.fifaName !== venue.commonName && (
                    <p className="text-xl text-purple-100">
                      FIFA: {venue.fifaName}
                    </p>
                  )}
                </div>
              </div>
              <p className="text-xl text-purple-100 mb-2">
                {venue.city}, {venue.country}
              </p>
              <div className="flex flex-wrap gap-4 text-lg">
                <span className="bg-white/20 px-4 py-2 rounded-lg">
                  ⚽ {venue.hostMatches} Matches
                </span>
                <span className="bg-white/20 px-4 py-2 rounded-lg">
                  👥 {venue.soccerCapacity.toLocaleString()} Capacity
                </span>
                <span className="bg-white/20 px-4 py-2 rounded-lg">
                  {getRoofIcon(venue.roof)} {getRoofLabel(venue.roof)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Climate Messaging */}
        <div className="mb-8">
          <ClimateMessaging country={venue.country as 'USA' | 'Mexico' | 'Canada'} variant="detailed" />
        </div>

        {/* Venue Details Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Stadium Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏟️</span>
              Stadium Details
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Opened:</span>
                <span>{venue.openingYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Surface:</span>
                <span className="capitalize">{venue.surfaceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Field Size:</span>
                <span>{venue.fieldDimensions.length}m × {venue.fieldDimensions.width}m</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sections:</span>
                <span>{venue.sections.length}</span>
              </div>
            </div>
          </div>

          {/* Location Info */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>📍</span>
              Location
            </h2>
            <div className="space-y-3 text-gray-700">
              <div>
                <span className="font-medium block mb-1">City:</span>
                <span>{venue.city}</span>
              </div>
              <div>
                <span className="font-medium block mb-1">Timezone:</span>
                <span>{venue.timezone}</span>
              </div>
              <div>
                <span className="font-medium block mb-1">Coordinates:</span>
                <span className="text-sm">{venue.latitude.toFixed(4)}°, {venue.longitude.toFixed(4)}°</span>
              </div>
            </div>
          </div>

          {/* World Cup Stats */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🏆</span>
              World Cup 2026
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex justify-between">
                <span className="font-medium">Total Matches:</span>
                <span className="text-2xl font-bold text-purple-600">{venue.hostMatches}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Capacity:</span>
                <span>{venue.soccerCapacity.toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium block mb-2">Coverage:</span>
                <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
                  ✓ Row-level shade data
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Match Schedule */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📅</span>
            Match Schedule ({matches.length} matches)
          </h2>

          {sortedRounds.map(round => {
            const roundMatches = matchesByRound.get(round) || [];
            return (
              <div key={round} className="mb-6 last:mb-0">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 pb-2 border-b-2 border-purple-200">
                  {round} ({roundMatches.length} {roundMatches.length === 1 ? 'match' : 'matches'})
                </h3>
                <div className="space-y-3">
                  {roundMatches.map(match => (
                    <div
                      key={match.matchId}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-purple-400 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-sm font-medium text-gray-600">
                              {formatDate(match.date)}
                            </span>
                            <span className="text-sm font-semibold text-purple-600">
                              {match.kickoffTime}
                            </span>
                            {match.group && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {match.group}
                              </span>
                            )}
                          </div>
                          <div className="text-lg font-semibold text-gray-900">
                            {match.teamA} <span className="text-gray-400 mx-2">vs</span> {match.teamB}
                          </div>
                          {match.tvChannels && match.tvChannels.length > 0 && (
                            <div className="text-sm text-gray-600 mt-1">
                              📺 {match.tvChannels.join(', ')}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <MatchCountdown
                            matchDate={match.date}
                            kickoffTime={match.kickoffTime}
                            timezone={venue.timezone}
                            size="small"
                          />
                          <Link
                            href={`/venue/${venue.id}?date=${match.date}&time=${match.kickoffTime}`}
                            className="inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium whitespace-nowrap"
                          >
                            🌤️ Find Shaded Seats
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Shade Finder CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            Find the Perfect Shaded Seats
          </h2>
          <p className="text-xl text-purple-100 mb-6">
            Get row-level shade analysis for every section at {venue.commonName}
          </p>
          <Link
            href={`/venue/${venue.id}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            <span>🌤️</span>
            Explore Shade Finder
            <span>→</span>
          </Link>
        </div>

        {/* Back to All Venues */}
        <div className="mt-8 text-center">
          <Link
            href="/worldcup2026/venues"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium"
          >
            <span>←</span>
            View All World Cup Venues
          </Link>
        </div>
      </div>
    </div>
  );
}
