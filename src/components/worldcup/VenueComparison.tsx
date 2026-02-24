'use client';

import React, { useRef, useState, useEffect, useMemo } from 'react';
import { WorldCupVenue } from '../../data/worldcup2026/types';
import { VenueComparisonCard } from './VenueComparisonCard';
import { CloseIcon, ChevronLeftIcon, ChevronRightIcon } from '../Icons';
import {
  calculateDistance,
  formatDistance,
  estimateTravelTime,
  formatTravelTime,
  getClimateZone,
  getPackingTips,
} from '../../utils/venueDistance';

interface VenueComparisonProps {
  selectedVenues: WorldCupVenue[];
  venueCounts: Record<string, number>; // matchCount per venue
  onClose: () => void;
  onRemoveVenue: (venueId: string) => void;
}

export function VenueComparison({
  selectedVenues,
  venueCounts,
  onClose,
  onRemoveVenue,
}: VenueComparisonProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Calculate best/highlights
  const bestShadeVenue = useMemo(() => {
    return selectedVenues.reduce((best, venue) => {
      const bestScore = best.roof === 'fixed' ? 2 : best.roof === 'retractable' ? 1 : 0;
      const currentScore = venue.roof === 'fixed' ? 2 : venue.roof === 'retractable' ? 1 : 0;
      return currentScore > bestScore ? venue : best;
    });
  }, [selectedVenues]);

  const largestVenue = useMemo(() => {
    return selectedVenues.reduce((largest, venue) =>
      venue.soccerCapacity > largest.soccerCapacity ? venue : largest
    );
  }, [selectedVenues]);

  const mostMatchesVenue = useMemo(() => {
    return selectedVenues.reduce((most, venue) => {
      const currentCount = venueCounts[venue.id] || venue.hostMatches;
      const mostCount = venueCounts[most.id] || most.hostMatches;
      return currentCount > mostCount ? venue : most;
    });
  }, [selectedVenues, venueCounts]);

  const newestVenue = useMemo(() => {
    return selectedVenues.reduce((newest, venue) =>
      venue.openingYear > newest.openingYear ? venue : newest
    );
  }, [selectedVenues]);

  // Calculate distances between all venue pairs
  const venueDistances = useMemo(() => {
    const distances: Array<{
      from: string;
      to: string;
      distance: number;
      travelTime: number;
    }> = [];

    for (let i = 0; i < selectedVenues.length; i++) {
      for (let j = i + 1; j < selectedVenues.length; j++) {
        const venue1 = selectedVenues[i];
        const venue2 = selectedVenues[j];
        const distance = calculateDistance(
          venue1.latitude,
          venue1.longitude,
          venue2.latitude,
          venue2.longitude
        );
        const travelTime = estimateTravelTime(distance);
        distances.push({
          from: venue1.commonName,
          to: venue2.commonName,
          distance,
          travelTime,
        });
      }
    }

    return distances;
  }, [selectedVenues]);

  // Get climate zones for packing tips
  const climateZones = useMemo(() => {
    return selectedVenues.map(v => getClimateZone(v.latitude));
  }, [selectedVenues]);

  const packingTips = useMemo(() => {
    return getPackingTips(climateZones);
  }, [climateZones]);

  // Handle swipe on mobile
  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < selectedVenues.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Touch handling for swipe
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current - touchEndX.current > 50) {
      handleSwipe('left');
    } else if (touchEndX.current - touchStartX.current > 50) {
      handleSwipe('right');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && isMobile) {
      handleSwipe('right');
    } else if (e.key === 'ArrowRight' && isMobile) {
      handleSwipe('left');
    }
  };

  if (selectedVenues.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="min-h-screen px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-t-xl shadow-lg px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div>
              <h2 id="comparison-title" className="text-2xl font-bold text-gray-900">
                Compare Venues ({selectedVenues.length})
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Side-by-side comparison of World Cup 2026 stadiums
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close comparison"
            >
              <CloseIcon size={24} />
            </button>
          </div>

          {/* Desktop: Side-by-side view */}
          {!isMobile && (
            <div className="bg-gray-50 p-6">
              <div
                className="grid gap-6 mb-6"
                style={{
                  gridTemplateColumns: `repeat(${Math.min(selectedVenues.length, 4)}, minmax(0, 1fr))`,
                }}
                ref={scrollContainerRef}
              >
                {selectedVenues.map((venue) => (
                  <VenueComparisonCard
                    key={venue.id}
                    venue={venue}
                    matchCount={venueCounts[venue.id] || venue.hostMatches}
                    onRemove={onRemoveVenue}
                    isBestShade={venue.id === bestShadeVenue.id}
                    isBestCapacity={venue.id === largestVenue.id}
                    isMostMatches={venue.id === mostMatchesVenue.id}
                    isNewest={venue.id === newestVenue.id}
                  />
                ))}
              </div>

              {/* Distance Matrix */}
              {venueDistances.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🗺️</span> Travel Distances Between Venues
                  </h3>
                  <div className="space-y-3">
                    {venueDistances.map((dist, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {dist.from} → {dist.to}
                        </span>
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-semibold text-blue-600">
                            {formatDistance(dist.distance)}
                          </span>
                          <span className="text-sm text-gray-600">
                            ~{formatTravelTime(dist.travelTime)} travel
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-4">
                    * Travel times are estimates and include airport time for flights
                  </p>
                </div>
              )}

              {/* Packing Tips */}
              {packingTips.length > 0 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>🧳</span> Multi-City Travel Tips
                  </h3>
                  <ul className="space-y-2">
                    {packingTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-purple-600 mt-1">•</span>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Mobile: Swipeable cards */}
          {isMobile && (
            <div className="bg-gray-50 p-4">
              <div
                className="mb-6"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <VenueComparisonCard
                  venue={selectedVenues[currentIndex]}
                  matchCount={venueCounts[selectedVenues[currentIndex].id] || selectedVenues[currentIndex].hostMatches}
                  onRemove={onRemoveVenue}
                  isBestShade={selectedVenues[currentIndex].id === bestShadeVenue.id}
                  isBestCapacity={selectedVenues[currentIndex].id === largestVenue.id}
                  isMostMatches={selectedVenues[currentIndex].id === mostMatchesVenue.id}
                  isNewest={selectedVenues[currentIndex].id === newestVenue.id}
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <button
                  onClick={() => handleSwipe('right')}
                  disabled={currentIndex === 0}
                  className="p-3 bg-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  aria-label="Previous venue"
                >
                  <ChevronLeftIcon size={24} />
                </button>

                {/* Dots */}
                <div className="flex items-center gap-2">
                  {selectedVenues.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-purple-600 w-6'
                          : 'bg-gray-300'
                      }`}
                      aria-label={`Go to venue ${index + 1}`}
                      aria-current={index === currentIndex}
                    />
                  ))}
                </div>

                <button
                  onClick={() => handleSwipe('left')}
                  disabled={currentIndex === selectedVenues.length - 1}
                  className="p-3 bg-white rounded-full shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  aria-label="Next venue"
                >
                  <ChevronRightIcon size={24} />
                </button>
              </div>

              {/* Current position */}
              <div className="text-center text-sm text-gray-600 mb-6">
                Venue {currentIndex + 1} of {selectedVenues.length}
              </div>

              {/* Collapsible Sections for Mobile */}
              <div className="space-y-4">
                {/* Distance Matrix - Collapsible */}
                {venueDistances.length > 0 && (
                  <details className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <summary className="cursor-pointer px-6 py-4 font-bold text-gray-900 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>🗺️</span> Travel Distances
                      </span>
                      <span className="text-gray-400">▼</span>
                    </summary>
                    <div className="px-6 pb-6 space-y-3">
                      {venueDistances.map((dist, idx) => (
                        <div
                          key={idx}
                          className="py-3 px-4 bg-blue-50 rounded-lg"
                        >
                          <div className="text-sm font-medium text-gray-700 mb-1">
                            {dist.from} → {dist.to}
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-blue-600">
                              {formatDistance(dist.distance)}
                            </span>
                            <span className="text-gray-600">
                              ~{formatTravelTime(dist.travelTime)}
                            </span>
                          </div>
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 mt-4">
                        * Estimates include airport time for flights
                      </p>
                    </div>
                  </details>
                )}

                {/* Packing Tips - Collapsible */}
                {packingTips.length > 0 && (
                  <details className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <summary className="cursor-pointer px-6 py-4 font-bold text-gray-900 flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span>🧳</span> Travel Tips
                      </span>
                      <span className="text-gray-400">▼</span>
                    </summary>
                    <div className="px-6 pb-6">
                      <ul className="space-y-2">
                        {packingTips.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="text-purple-600 mt-1">•</span>
                            <span className="text-gray-700 text-sm">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </details>
                )}
              </div>
            </div>
          )}

          {/* Close button at bottom */}
          <div className="bg-white rounded-b-xl shadow-lg px-6 py-4 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Close Comparison
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
