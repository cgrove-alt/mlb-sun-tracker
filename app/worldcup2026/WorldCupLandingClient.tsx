'use client';

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
import { WorldCupHero } from '../../src/components/worldcup/WorldCupHero';
import { VenueCarousel } from '../../src/components/worldcup/VenueCarousel';
import { KeyDatesTimeline } from '../../src/components/worldcup/KeyDatesTimeline';
import { TravelGuide } from '../../src/components/worldcup/TravelGuide';
import { useTranslation } from '../../src/i18n/i18nContext';
import Link from 'next/link';

type CountryFilter = 'All' | 'USA' | 'Mexico' | 'Canada';

export function WorldCupLandingClient() {
  const { t } = useTranslation();
  const [countryFilter, setCountryFilter] = useState<CountryFilter>('All');

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
      <WorldCupHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Venue Carousel */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            🏟️ Featured World Cup Venues
          </h2>
          <VenueCarousel autoPlayInterval={6000} />
        </div>

        {/* Tournament Timeline */}
        <div className="mb-12">
          <KeyDatesTimeline />
        </div>

        {/* Travel Guide */}
        <div className="mb-12">
          <TravelGuide />
        </div>

        {/* Venues Section */}
        <div id="venues" className="scroll-mt-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">{t('worldcup.allVenues')}</h2>

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
              {t('worldcup.countries.all')} ({ALL_WORLD_CUP_VENUES.length})
            </button>
            <button
              onClick={() => setCountryFilter('USA')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                countryFilter === 'USA'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('worldcup.countries.usa')} ({venuesByCountry.USA})
            </button>
            <button
              onClick={() => setCountryFilter('Mexico')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                countryFilter === 'Mexico'
                  ? 'bg-green-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('worldcup.countries.mexico')} ({venuesByCountry.Mexico})
            </button>
            <button
              onClick={() => setCountryFilter('Canada')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                countryFilter === 'Canada'
                  ? 'bg-red-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('worldcup.countries.canada')} ({venuesByCountry.Canada})
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
                        <div className="text-xs text-gray-600">{t('stadium.capacity')}</div>
                        <div className="text-lg font-bold text-gray-900">
                          {venue.soccerCapacity.toLocaleString()}
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <div className="text-xs text-gray-600">{t('worldcup.badge.matches')}</div>
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
                        {venue.sections.length} {t('sections.title').toLowerCase()}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={venue.nflStadiumId ? `/venue/${venue.nflStadiumId}` : `/venue/${venue.id}`}
                      className="block w-full px-4 py-2 bg-purple-600 text-white text-center rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                      {t('worldcup.subtitle')}
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
            {t('worldcup.info.historicEvent')}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-3">☀️</div>
              <h3 className="text-xl font-semibold mb-2">{t('weather.conditions.clear')}</h3>
              <p className="text-purple-100">
                {t('worldcup.info.firstWorldCup')}
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-3">🎟️</div>
              <h3 className="text-xl font-semibold mb-2">{t('recommendations.title')}</h3>
              <p className="text-purple-100">
                {t('worldcup.subtitle')}
              </p>
            </div>

            <div className="text-center">
              <div className="text-5xl mb-3">📊</div>
              <h3 className="text-xl font-semibold mb-2">{t('sections.rowCount', { count: '' }).replace('Approximately ', '')}</h3>
              <p className="text-purple-100">
                {t('worldcup.info.threeCountries')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
