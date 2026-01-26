'use client';

// World Cup 2026 Schedule Client Component
// Interactive schedule display with filtering and countdown

import React, { useState, useMemo } from 'react';
import {
  WORLD_CUP_2026_MATCHES,
  getMatchesByRound,
  getMatchesByVenue,
  getAllMatchesSorted,
  getNextMatch
} from '../../../src/data/worldcup2026/matches';
import {
  ALL_WORLD_CUP_VENUES,
  getWorldCupVenueById
} from '../../../src/data/worldcup2026/venues';
import type { WorldCupMatch } from '../../../src/data/worldcup2026/types';
import { WORLD_CUP_2026_INFO } from '../../../src/data/worldcup2026/types';
import { MatchCountdown } from '../../../src/components/MatchCountdown';
import Link from 'next/link';

type RoundFilter = 'All' | 'Group Stage' | 'Round of 16' | 'Quarterfinal' | 'Semifinal' | 'Third Place' | 'Final';
type CountryFilter = 'All' | 'USA' | 'Mexico' | 'Canada';

export function WorldCupScheduleClient() {
  const [roundFilter, setRoundFilter] = useState<RoundFilter>('All');
  const [countryFilter, setCountryFilter] = useState<CountryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const nextMatch = useMemo(() => getNextMatch(), []);
  const allMatches = useMemo(() => getAllMatchesSorted(), []);

  // Filter matches
  const filteredMatches = useMemo(() => {
    let matches = allMatches;

    // Filter by round
    if (roundFilter !== 'All') {
      matches = matches.filter(m => m.round === roundFilter);
    }

    // Filter by country
    if (countryFilter !== 'All') {
      matches = matches.filter(m => {
        const venue = getWorldCupVenueById(m.venue);
        return venue?.country === countryFilter;
      });
    }

    // Filter by search query (team names or venue)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      matches = matches.filter(m => {
        const venue = getWorldCupVenueById(m.venue);
        return (
          m.teamA.toLowerCase().includes(query) ||
          m.teamB.toLowerCase().includes(query) ||
          venue?.commonName.toLowerCase().includes(query) ||
          venue?.city.toLowerCase().includes(query)
        );
      });
    }

    return matches;
  }, [allMatches, roundFilter, countryFilter, searchQuery]);

  // Group matches by date
  const matchesByDate = useMemo(() => {
    const grouped = new Map<string, WorldCupMatch[]>();
    filteredMatches.forEach(match => {
      const existing = grouped.get(match.date) || [];
      grouped.set(match.date, [...existing, match]);
    });
    return grouped;
  }, [filteredMatches]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatMatchDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            FIFA World Cup 2026 Schedule
          </h1>
          <p className="text-xl text-purple-100 mb-2">
            {WORLD_CUP_2026_INFO.totalMatches} matches across {WORLD_CUP_2026_INFO.totalVenues} venues
          </p>
          <p className="text-lg text-purple-200">
            {WORLD_CUP_2026_INFO.startDate} to {WORLD_CUP_2026_INFO.endDate}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Next Match Countdown */}
        {nextMatch && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Match</h2>
            <MatchCountdown
              matchDate={nextMatch.date}
              kickoffTime={nextMatch.kickoffTime}
              timezone={getWorldCupVenueById(nextMatch.venue)?.timezone}
              teamA={nextMatch.teamA}
              teamB={nextMatch.teamB}
              venueName={getWorldCupVenueById(nextMatch.venue)?.commonName}
              size="large"
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Filter Matches</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Round Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Round
              </label>
              <select
                value={roundFilter}
                onChange={(e) => setRoundFilter(e.target.value as RoundFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="All">All Rounds</option>
                <option value="Group Stage">Group Stage</option>
                <option value="Round of 16">Round of 16</option>
                <option value="Quarterfinal">Quarterfinals</option>
                <option value="Semifinal">Semifinals</option>
                <option value="Third Place">Third Place</option>
                <option value="Final">Final</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value as CountryFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="All">All Countries</option>
                <option value="USA">USA</option>
                <option value="Mexico">Mexico</option>
                <option value="Canada">Canada</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Team, city, or venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredMatches.length} of {allMatches.length} matches
          </div>
        </div>

        {/* Matches by Date */}
        <div className="space-y-8">
          {Array.from(matchesByDate.entries()).map(([date, matches]) => (
            <div key={date}>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 sticky top-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 py-2 z-10">
                {formatDate(date)}
              </h3>

              <div className="grid gap-4">
                {matches.map(match => {
                  const venue = getWorldCupVenueById(match.venue);

                  return (
                    <div
                      key={match.matchId}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        {/* Match Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-sm font-semibold rounded-full">
                              {match.round}
                            </span>
                            {match.group && (
                              <span className="text-sm text-gray-600">
                                {match.group}
                              </span>
                            )}
                          </div>

                          <div className="text-2xl font-bold text-gray-900 mb-2">
                            {match.teamA} <span className="text-gray-400">vs</span> {match.teamB}
                          </div>

                          {venue && (
                            <div className="text-sm text-gray-600 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{venue.commonName}</span>
                                <span className="text-gray-400">•</span>
                                <span>{venue.city}, {venue.country}</span>
                              </div>
                              <div>
                                Kickoff: {match.kickoffTime} ({venue.timezone})
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2">
                          {venue && (
                            <Link
                              href={`/stadium/${venue.id}`}
                              className="px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition-colors font-medium"
                            >
                              Find Shaded Seats
                            </Link>
                          )}

                          <div className="text-xs text-gray-500 text-center">
                            {formatMatchDate(match.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {filteredMatches.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No matches found matching your filters</p>
            </div>
          )}
        </div>

        {/* Note about sample data */}
        {allMatches.length < WORLD_CUP_2026_INFO.totalMatches && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Currently showing a sample of matches.
              Full 104-match schedule will be populated as teams qualify and official schedule is released.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
