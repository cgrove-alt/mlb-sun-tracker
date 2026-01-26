'use client';

// World Cup 2026 Landing Page Client Component
// Overview of all 16 venues with stats and navigation

import React, { useState, useMemo } from 'react';
import {
  ALL_WORLD_CUP_VENUES,
  WORLD_CUP_USA_VENUES,
  WORLD_CUP_MEXICO_VENUES,
  WORLD_CUP_CANADA_VENUES,
  getWorldCupVenuesByCountry,
  WORLD_CUP_VENUE_STATS
} from '../../src/data/worldcup2026/venues';
import {
  getMatchesByVenue,
  getNextMatch
} from '../../src/data/worldcup2026/matches';
import { WORLD_CUP_2026_INFO } from '../../src/data/worldcup2026/types';
import type { WorldCupVenue } from '../../src/data/worldcup2026/types';
import { WorldCupBadge } from '../../src/components/WorldCupBadge';
import { MatchCountdown } from '../../src/components/MatchCountdown';
import Link from 'next/link';

type CountryFilter = 'All' | 'USA' | 'Mexico' | 'Canada';

export function WorldCupLandingClient() {
  const [countryFilter, setCountryFilter] = useState<CountryFilter>('All');

  const nextMatch = useMemo(() => getNextMatch(), []);

  const filteredVenues = useMemo(() => {
    if (countryFilter === 'All') return ALL_WORLD_CUP_VENUES;
    return getWorldCupVenuesByCountry(countryFilter);
  }, [countryFilter]);

  const venuesByCountry = useMemo(() => ({
    USA: WORLD_CUP_USA_VENUES.length,
    Mexico: WORLD_CUP_MEXICO_VENUES.length,
    Canada: WORLD_CUP_CANADA_VENUES.length
  }), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
              FIFA World Cup 2026
            </h1>
            <p className="text-2xl md:text-3xl text-purple-100 mb-4">
              Find the Best Shaded Seats
            </p>
            <p className="text-xl text-purple-200 mb-8">
              Row-level shade analysis for all {WORLD_CUP_VENUE_STATS.total} venues
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{WORLD_CUP_2026_INFO.totalVenues}</div>
                <div className="text-sm text-purple-200">Venues</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{WORLD_CUP_2026_INFO.totalMatches}</div>
                <div className="text-sm text-purple-200">Matches</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{WORLD_CUP_2026_INFO.participatingTeams}</div>
                <div className="text-sm text-purple-200">Teams</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold">{WORLD_CUP_2026_INFO.totalCountries}</div>
                <div className="text-sm text-purple-200">Countries</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/worldcup2026/schedule"
                className="px-8 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-purple-50 transition-colors shadow-lg"
              >
                View Full Schedule
              </Link>
              <a
                href="#venues"
                className="px-8 py-4 bg-purple-500 text-white rounded-lg font-bold text-lg hover:bg-purple-400 transition-colors shadow-lg"
              >
                Browse Venues
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Next Match Countdown */}
        {nextMatch && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Next Match Countdown
            </h2>
            <div className="max-w-2xl mx-auto">
              <MatchCountdown
                matchDate={nextMatch.date}
                kickoffTime={nextMatch.kickoffTime}
                timezone={ALL_WORLD_CUP_VENUES.find(v => v.id === nextMatch.venue)?.timezone}
                teamA={nextMatch.teamA}
                teamB={nextMatch.teamB}
                venueName={ALL_WORLD_CUP_VENUES.find(v => v.id === nextMatch.venue)?.commonName}
                size="large"
              />
            </div>
          </div>
        )}

        {/* Tournament Info */}
        <div className="mb-12 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Tournament Information
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Opening Match</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Date:</strong> {WORLD_CUP_2026_INFO.openingMatch.date}</p>
                <p><strong>Venue:</strong> {WORLD_CUP_2026_INFO.openingMatch.city}</p>
                <p><strong>Teams:</strong> {WORLD_CUP_2026_INFO.openingMatch.teams}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Final</h3>
              <div className="space-y-2 text-gray-700">
                <p><strong>Date:</strong> {WORLD_CUP_2026_INFO.final.date}</p>
                <p><strong>Venue:</strong> {WORLD_CUP_2026_INFO.final.city}</p>
                <p><strong>Stadium:</strong> MetLife Stadium</p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Host Countries</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{venuesByCountry.USA}</div>
                <div className="text-sm text-gray-600">USA Venues</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{venuesByCountry.Mexico}</div>
                <div className="text-sm text-gray-600">Mexico Venues</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{venuesByCountry.Canada}</div>
                <div className="text-sm text-gray-600">Canada Venues</div>
              </div>
            </div>
          </div>
        </div>

        {/* Venues Section */}
        <div id="venues" className="scroll-mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">All Venues</h2>

          {/* Country Filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            <button
              onClick={() => setCountryFilter('All')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                countryFilter === 'All'
                  ? 'bg-purple-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All ({ALL_WORLD_CUP_VENUES.length})
            </button>
            <button
              onClick={() => setCountryFilter('USA')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                countryFilter === 'USA'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              USA ({venuesByCountry.USA})
            </button>
            <button
              onClick={() => setCountryFilter('Mexico')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                countryFilter === 'Mexico'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Mexico ({venuesByCountry.Mexico})
            </button>
            <button
              onClick={() => setCountryFilter('Canada')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                countryFilter === 'Canada'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Canada ({venuesByCountry.Canada})
            </button>
          </div>

          {/* Venue Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map(venue => {
              const matches = getMatchesByVenue(venue.id);

              return (
                <div
                  key={venue.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    {/* Badge */}
                    <div className="mb-3">
                      <WorldCupBadge
                        stadiumId={venue.id}
                        matchCount={venue.hostMatches}
                        variant="small"
                        showMatchCount={true}
                        country={venue.country}
                      />
                    </div>

                    {/* Venue Name */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {venue.commonName}
                    </h3>

                    {/* FIFA Name (if different) */}
                    {venue.fifaName !== venue.commonName && (
                      <p className="text-sm text-gray-600 mb-2">
                        FIFA: {venue.fifaName}
                      </p>
                    )}

                    {/* Location */}
                    <p className="text-sm text-gray-600 mb-3">
                      {venue.city}, {venue.country}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-xs text-gray-600">Capacity</div>
                        <div className="text-lg font-bold text-gray-900">
                          {venue.soccerCapacity.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-xs text-gray-600">Matches</div>
                        <div className="text-lg font-bold text-gray-900">
                          {venue.hostMatches}
                        </div>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                        {venue.surfaceType}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {venue.roof}
                      </span>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {venue.sections.length} sections
                      </span>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/stadium/${venue.id}`}
                      className="block w-full px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      Find Shaded Seats
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Why This Matters Section */}
        <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Why Shade Matters for World Cup Matches
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">☀️</div>
              <h3 className="text-xl font-semibold mb-2">Summer Heat</h3>
              <p className="text-purple-100">
                World Cup 2026 takes place in June-July. Many venues can exceed 95°F (35°C).
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-3">🎟️</div>
              <h3 className="text-xl font-semibold mb-2">Premium Comfort</h3>
              <p className="text-purple-100">
                Shaded seats provide comfort during 2+ hour matches without sacrificing view quality.
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-3">📊</div>
              <h3 className="text-xl font-semibold mb-2">Row-Level Precision</h3>
              <p className="text-purple-100">
                Our analysis shows shade coverage down to individual rows at every venue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
