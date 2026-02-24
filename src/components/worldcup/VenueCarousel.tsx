'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ALL_WORLD_CUP_VENUES } from '../../data/worldcup2026/venues';
import { getMatchesByVenue } from '../../data/worldcup2026/matches';
import { useTranslation } from '../../i18n/i18nContext';

interface VenueCarouselProps {
  autoPlayInterval?: number; // milliseconds, default 5000
  className?: string;
}

export function VenueCarousel({ autoPlayInterval = 5000, className = '' }: VenueCarouselProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Featured venues (stadiums with most matches or iconic venues)
  const featuredVenues = ALL_WORLD_CUP_VENUES
    .sort((a, b) => b.hostMatches - a.hostMatches)
    .slice(0, 8);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % featuredVenues.length);
  }, [featuredVenues.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + featuredVenues.length) % featuredVenues.length);
  }, [featuredVenues.length]);

  const goToSlide = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false); // Stop auto-play when user manually navigates
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(goToNext, autoPlayInterval);
    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, goToNext]);

  const currentVenue = featuredVenues[currentIndex];
  const matches = currentVenue ? getMatchesByVenue(currentVenue.id) : [];

  if (!currentVenue) return null;

  return (
    <div className={`relative ${className}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Carousel Content */}
        <div className="relative h-[400px] md:h-[500px]">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700"></div>

          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-8 text-white">
            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{currentVenue.country === 'USA' ? '🇺🇸' : currentVenue.country === 'Mexico' ? '🇲🇽' : '🇨🇦'}</span>
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
                    {currentVenue.hostMatches} {t('worldcup.badge.matches')}
                  </span>
                </div>
                <button
                  onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium hover:bg-white/30 transition-colors"
                  aria-label={isAutoPlaying ? 'Pause carousel' : 'Play carousel'}
                >
                  {isAutoPlaying ? '⏸️ Pause' : '▶️ Play'}
                </button>
              </div>

              <h3 className="text-4xl md:text-5xl font-bold mb-2">
                {currentVenue.commonName}
              </h3>

              {currentVenue.fifaName !== currentVenue.commonName && (
                <p className="text-xl text-purple-100 mb-3">
                  FIFA: {currentVenue.fifaName}
                </p>
              )}

              <p className="text-lg text-purple-200 mb-6">
                {currentVenue.city}, {currentVenue.country}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-2xl font-bold">{currentVenue.soccerCapacity.toLocaleString()}</div>
                  <div className="text-xs text-purple-200">{t('stadium.capacity')}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-2xl font-bold">{currentVenue.sections.length}</div>
                  <div className="text-xs text-purple-200">{t('sections.title')}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-2xl font-bold">{currentVenue.roof === 'retractable' ? 'Retract.' : currentVenue.roof === 'fixed' ? 'Fixed' : 'Open'}</div>
                  <div className="text-xs text-purple-200">Roof Type</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-2xl font-bold">{currentVenue.openingYear}</div>
                  <div className="text-xs text-purple-200">Opened</div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href={currentVenue.nflStadiumId ? `/venue/${currentVenue.nflStadiumId}` : `/venue/${currentVenue.id}`}
                className="inline-block px-6 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-all shadow-lg transform hover:scale-105"
              >
                ☀️ {t('worldcup.subtitle')}
              </Link>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors border border-white/20"
            aria-label="Previous venue"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors border border-white/20"
            aria-label="Next venue"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 p-4 bg-gray-50">
          {featuredVenues.map((venue, index) => (
            <button
              key={venue.id}
              onClick={() => goToSlide(index)}
              className={`transition-all rounded-full ${
                index === currentIndex
                  ? 'w-8 h-3 bg-purple-600'
                  : 'w-3 h-3 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to ${venue.commonName}`}
              aria-current={index === currentIndex ? 'true' : 'false'}
            />
          ))}
        </div>

        {/* Match List */}
        {matches.length > 0 && (
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <h4 className="text-lg font-bold text-gray-900 mb-3">
              Upcoming Matches ({matches.length})
            </h4>
            <div className="space-y-2">
              {matches.slice(0, 3).map((match) => (
                <div key={match.matchId} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{match.teamA} vs {match.teamB}</span>
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs">
                      {match.round}
                    </span>
                  </div>
                  <span className="text-gray-600">{match.date}</span>
                </div>
              ))}
              {matches.length > 3 && (
                <Link
                  href={`/worldcup2026/venues/${currentVenue.id}`}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  View all {matches.length} matches →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
