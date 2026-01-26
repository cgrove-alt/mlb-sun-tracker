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

type RoundFilter = 'All' | 'Group Stage' | 'Round of 16' | 'Quarterfinal' | 'Semifinal' | 'Third Place' | 'Final';
type CountryFilter = 'All' | 'USA' | 'Mexico' | 'Canada';

export function WorldCupScheduleClient() {
  const { t } = useTranslation();
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
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('worldcup.filterByCountry')}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-600">
            {t('sections.summaryStats.searchResults', { shown: filteredMatches.length, total: allMatches.length })}
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
                                {t('worldcup.schedule.kickoff')}: {match.kickoffTime} ({venue.timezone})
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
                              {t('worldcup.subtitle')}
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
