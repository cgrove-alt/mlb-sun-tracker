'use client';

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
import { useTranslation } from '../../../src/i18n/i18nContext';
import Link from 'next/link';

type RoundFilter = 'All' | 'Group Stage' | 'Round of 32' | 'Round of 16' | 'Quarterfinal' | 'Semifinal' | 'Third Place' | 'Final';
type CountryFilter = 'All' | 'USA' | 'Mexico' | 'Canada';
type SortColumn = 'date' | 'venue' | 'round';
type SortDirection = 'asc' | 'desc';

export function WorldCupScheduleClient() {
  const { t } = useTranslation();
  const [roundFilter, setRoundFilter] = useState<RoundFilter>('All');
  const [countryFilter, setCountryFilter] = useState<CountryFilter>('All');
  const [venueFilter, setVenueFilter] = useState<string>('All');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const nextMatch = useMemo(() => getNextMatch(), []);
  const allMatches = useMemo(() => getAllMatchesSorted(), []);

  // Get unique venues for filter dropdown
  const uniqueVenues = useMemo(() => {
    const venues = new Map<string, string>();
    allMatches.forEach(match => {
      const venue = getWorldCupVenueById(match.venue);
      if (venue) {
        venues.set(match.venue, venue.commonName);
      }
    });
    return Array.from(venues.entries()).sort((a, b) => a[1].localeCompare(b[1]));
  }, [allMatches]);

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

    // Filter by venue
    if (venueFilter !== 'All') {
      matches = matches.filter(m => m.venue === venueFilter);
    }

    // Filter by date range
    if (startDate) {
      matches = matches.filter(m => m.date >= startDate);
    }
    if (endDate) {
      matches = matches.filter(m => m.date <= endDate);
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
  }, [allMatches, roundFilter, countryFilter, venueFilter, startDate, endDate, searchQuery]);

  // Sort matches
  const sortedMatches = useMemo(() => {
    const sorted = [...filteredMatches];
    sorted.sort((a, b) => {
      let comparison = 0;

      if (sortColumn === 'date') {
        comparison = a.date.localeCompare(b.date) || a.kickoffTime.localeCompare(b.kickoffTime);
      } else if (sortColumn === 'venue') {
        const venueA = getWorldCupVenueById(a.venue)?.commonName || '';
        const venueB = getWorldCupVenueById(b.venue)?.commonName || '';
        comparison = venueA.localeCompare(venueB);
      } else if (sortColumn === 'round') {
        const roundOrder = ['Group Stage', 'Round of 32', 'Round of 16', 'Quarterfinal', 'Semifinal', 'Third Place', 'Final'];
        comparison = roundOrder.indexOf(a.round) - roundOrder.indexOf(b.round);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredMatches, sortColumn, sortDirection]);

  // Toggle sort
  const toggleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Group matches by date
  const matchesByDate = useMemo(() => {
    const grouped = new Map<string, WorldCupMatch[]>();
    sortedMatches.forEach(match => {
      const existing = grouped.get(match.date) || [];
      grouped.set(match.date, [...existing, match]);
    });
    return grouped;
  }, [sortedMatches]);

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
            {t('worldcup.schedule.title')}
          </h1>
          <p className="text-xl text-purple-100 mb-2">
            {t('worldcup.schedule.matchCount', { count: WORLD_CUP_2026_INFO.totalMatches })}
          </p>
          <p className="text-lg text-purple-200">
            {WORLD_CUP_2026_INFO.startDate} {t('worldcup.countdown.until')} {WORLD_CUP_2026_INFO.endDate}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Timezone Notice */}
        <div className="mb-6">
          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-800 font-medium">
                  {t('worldcup.schedule.timezoneNote')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Next Match Countdown */}
        {nextMatch && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('worldcup.nextMatch')}</h2>
            <MatchCountdown
              matchDate={nextMatch.date}
              kickoffTime={nextMatch.kickoffTime}
              timezone={getWorldCupVenueById(nextMatch.venue)?.timezone || 'UTC'}
              teamA={nextMatch.teamA}
              teamB={nextMatch.teamB}
              venueName={getWorldCupVenueById(nextMatch.venue)?.commonName || 'TBD'}
              size="large"
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">{t('worldcup.filterByCountry')}</h2>
            {/* Clear Filters Button */}
            {(roundFilter !== 'All' || countryFilter !== 'All' || venueFilter !== 'All' || startDate || endDate || searchQuery) && (
              <button
                onClick={() => {
                  setRoundFilter('All');
                  setCountryFilter('All');
                  setVenueFilter('All');
                  setStartDate('');
                  setEndDate('');
                  setSearchQuery('');
                }}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>

          {/* First Row: Round, Country, Venue */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Round Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('worldcup.schedule.round')}
              </label>
              <select
                value={roundFilter}
                onChange={(e) => setRoundFilter(e.target.value as RoundFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="All">{t('worldcup.schedule.rounds.all')}</option>
                <option value="Group Stage">{t('worldcup.schedule.rounds.groupStage')}</option>
                <option value="Round of 32">Round of 32</option>
                <option value="Round of 16">{t('worldcup.schedule.rounds.roundOf16')}</option>
                <option value="Quarterfinal">{t('worldcup.schedule.rounds.quarterFinals')}</option>
                <option value="Semifinal">{t('worldcup.schedule.rounds.semiFinals')}</option>
                <option value="Third Place">{t('worldcup.schedule.rounds.thirdPlace')}</option>
                <option value="Final">{t('worldcup.schedule.rounds.final')}</option>
              </select>
            </div>

            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('worldcup.hostCountries')}
              </label>
              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value as CountryFilter)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="All">{t('worldcup.countries.all')}</option>
                <option value="USA">{t('worldcup.countries.usa')}</option>
                <option value="Mexico">{t('worldcup.countries.mexico')}</option>
                <option value="Canada">{t('worldcup.countries.canada')}</option>
              </select>
            </div>

            {/* Venue Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Venue
              </label>
              <select
                value={venueFilter}
                onChange={(e) => setVenueFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="All">All Venues</option>
                {uniqueVenues.map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Second Row: Date Range and Search */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min="2026-06-11"
                max="2026-07-26"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min="2026-06-11"
                max="2026-07-26"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('sections.search')}
              </label>
              <input
                type="text"
                placeholder={t('worldcup.schedule.searchMatches')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Sort Controls */}
          <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <button
              onClick={() => toggleSort('date')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                sortColumn === 'date'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Date {sortColumn === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleSort('venue')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                sortColumn === 'venue'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Venue {sortColumn === 'venue' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
            <button
              onClick={() => toggleSort('round')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                sortColumn === 'round'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Round {sortColumn === 'round' && (sortDirection === 'asc' ? '↑' : '↓')}
            </button>
          </div>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {t('sections.summaryStats.searchResults', { shown: sortedMatches.length, total: allMatches.length })}
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
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-4 md:p-6 border-l-4 border-purple-400"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        {/* Match Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-3">
                            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 text-xs md:text-sm font-semibold rounded-full whitespace-nowrap">
                              {match.round}
                            </span>
                            {match.group && (
                              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs md:text-sm font-medium rounded-full whitespace-nowrap">
                                {match.group}
                              </span>
                            )}
                            <span className="text-xs md:text-sm text-gray-500 whitespace-nowrap">
                              Match #{match.matchId.split('-')[1]}
                            </span>
                          </div>

                          <div className="text-xl md:text-2xl font-bold text-gray-900 mb-3 break-words">
                            {match.teamA} <span className="text-gray-400">vs</span> {match.teamB}
                          </div>

                          {venue && (
                            <div className="text-sm text-gray-600 space-y-2">
                              <div className="flex items-start gap-2">
                                <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium truncate">{venue.commonName}</div>
                                  <div className="text-xs text-gray-500">{venue.city}, {venue.country}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                  <span className="font-medium">{match.kickoffTime}</span>
                                  <span className="text-xs text-gray-500 ml-1">({venue.timezone})</span>
                                </div>
                              </div>
                              {match.tvChannels && match.tvChannels.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <svg className="w-5 h-5 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  <div className="flex flex-wrap gap-1">
                                    {match.tvChannels.map((channel, idx) => (
                                      <span key={idx} className="inline-block px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                        {channel}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions and Countdown */}
                        <div className="flex flex-col gap-3 lg:min-w-[220px]">
                          {/* Mini Countdown */}
                          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-2 md:p-3 border border-purple-100">
                            <MatchCountdown
                              matchDate={match.date}
                              kickoffTime={match.kickoffTime}
                              timezone={venue?.timezone}
                              size="small"
                            />
                          </div>

                          {venue && (
                            <>
                              <Link
                                href={`/stadium/${venue.nflStadiumId || venue.id}?date=${match.date}&time=${match.kickoffTime}`}
                                className="px-4 py-2.5 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm shadow-sm hover:shadow-md min-h-[44px] flex items-center justify-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                {t('worldcup.subtitle')}
                              </Link>
                              <Link
                                href={`/worldcup2026/venues/${venue.id}`}
                                className="px-4 py-2 bg-gray-100 text-gray-700 text-center rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm min-h-[44px] flex items-center justify-center"
                              >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Venue Info
                              </Link>
                            </>
                          )}
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
              <p className="text-xl text-gray-600">{t('worldcup.schedule.noMatches')}</p>
            </div>
          )}
        </div>

        {/* Note about match data */}
        {allMatches.length < WORLD_CUP_2026_INFO.totalMatches && (
          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              {t('worldcup.schedule.matchCount', { count: allMatches.length })} {t('worldcup.stats.totalMatches').toLowerCase()}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
