'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ALL_WORLD_CUP_VENUES,
  WORLD_CUP_USA_VENUES,
  WORLD_CUP_MEXICO_VENUES,
  WORLD_CUP_CANADA_VENUES
} from '../../../src/data/worldcup2026/venues';
import { getMatchesByVenue } from '../../../src/data/worldcup2026/matches';
import { VenueCard } from '../../../src/components/worldcup/VenueCard';
import { ClimateMessaging } from '../../../src/components/worldcup/ClimateMessaging';
import { useTranslation } from '../../../src/i18n/i18nContext';

type CountryFilter = 'All' | 'USA' | 'Mexico' | 'Canada';

export function VenuesPageClient() {
  const { t } = useTranslation();
  const [countryFilter, setCountryFilter] = useState<CountryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVenues = useMemo(() => {
    let venues = ALL_WORLD_CUP_VENUES;

    // Filter by country
    if (countryFilter !== 'All') {
      venues = venues.filter(v => v.country === countryFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      venues = venues.filter(v =>
        v.commonName.toLowerCase().includes(query) ||
        v.fifaName.toLowerCase().includes(query) ||
        v.city.toLowerCase().includes(query)
      );
    }

    return venues;
  }, [countryFilter, searchQuery]);

  const venuesByCountry = useMemo(() => {
    return {
      USA: WORLD_CUP_USA_VENUES,
      Mexico: WORLD_CUP_MEXICO_VENUES,
      Canada: WORLD_CUP_CANADA_VENUES
    };
  }, []);

  const getCountryFlag = (country: string) => {
    const flags = {
      'USA': '🇺🇸',
      'Mexico': '🇲🇽',
      'Canada': '🇨🇦'
    };
    return flags[country as keyof typeof flags] || '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            FIFA World Cup 2026 Venues
          </h1>
          <p className="text-xl text-purple-100 mb-2">
            16 stadiums across 3 countries hosting 104 matches
          </p>
          <p className="text-lg text-purple-200">
            All venues with row-level shade data for perfect seat selection
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Venues
                </label>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by stadium name or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Country Filter */}
              <div className="md:w-64">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Country
                </label>
                <select
                  id="country"
                  value={countryFilter}
                  onChange={(e) => setCountryFilter(e.target.value as CountryFilter)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="All">All Countries (16)</option>
                  <option value="USA">🇺🇸 USA (11)</option>
                  <option value="Mexico">🇲🇽 Mexico (3)</option>
                  <option value="Canada">🇨🇦 Canada (2)</option>
                </select>
              </div>
            </div>

            {/* Active Filters */}
            {(countryFilter !== 'All' || searchQuery) && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-600">Active filters:</span>
                {countryFilter !== 'All' && (
                  <button
                    onClick={() => setCountryFilter('All')}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200"
                  >
                    {getCountryFlag(countryFilter)} {countryFilter}
                    <span>×</span>
                  </button>
                )}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm hover:bg-purple-200"
                  >
                    Search: "{searchQuery}"
                    <span>×</span>
                  </button>
                )}
                <button
                  onClick={() => {
                    setCountryFilter('All');
                    setSearchQuery('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900 underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Climate Messaging - Show for specific country filter */}
        {countryFilter !== 'All' && (
          <div className="mb-8">
            <ClimateMessaging country={countryFilter} variant="detailed" />
          </div>
        )}

        {/* Results Count & Compare Button */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-700">
            Showing <span className="font-bold text-purple-600">{filteredVenues.length}</span> venue{filteredVenues.length !== 1 ? 's' : ''}
          </p>
          <Link
            href="/worldcup2026/compare"
            className="inline-flex items-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors shadow-md"
          >
            <span>⚖️</span>
            Compare Venues
            <span>→</span>
          </Link>
        </div>

        {/* Venues Grid - Grouped by Country */}
        {countryFilter === 'All' && !searchQuery ? (
          // Show grouped by country
          <div className="space-y-12">
            {(['USA', 'Mexico', 'Canada'] as const).map(country => (
              <div key={country}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{getCountryFlag(country)}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {country}
                    </h2>
                    <p className="text-gray-600">
                      {venuesByCountry[country].length} venue{venuesByCountry[country].length !== 1 ? 's' : ''} • {venuesByCountry[country].reduce((sum, v) => sum + v.hostMatches, 0)} matches
                    </p>
                  </div>
                </div>

                {/* Climate Messaging for each country */}
                <div className="mb-6">
                  <ClimateMessaging country={country} variant="compact" />
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {venuesByCountry[country].map(venue => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      matchCount={getMatchesByVenue(venue.id).length}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Show filtered results
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVenues.map(venue => (
              <VenueCard
                key={venue.id}
                venue={venue}
                matchCount={getMatchesByVenue(venue.id).length}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">
              No venues found matching your filters
            </p>
            <button
              onClick={() => {
                setCountryFilter('All');
                setSearchQuery('');
              }}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl shadow-lg p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">
            View Full Match Schedule
          </h2>
          <p className="text-xl text-purple-100 mb-6">
            See all 104 World Cup 2026 matches with shade finder integration
          </p>
          <Link
            href="/worldcup2026/schedule"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors text-lg font-semibold"
          >
            <span>📅</span>
            View Schedule
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
