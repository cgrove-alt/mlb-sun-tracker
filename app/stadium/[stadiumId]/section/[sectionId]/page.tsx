/**
 * Section Detail Page
 *
 * Shows seat-level sun exposure for a specific section.
 * Features:
 * - Interactive seat grid with color-coded sun exposure
 * - Seat detail modal on click
 * - Section statistics (% in shade, best seats)
 * - Back navigation to stadium page
 */

'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SeatGrid } from '../../../../../src/components/SeatGrid';
import { SeatDetailModal } from '../../../../../src/components/SeatDetailModal';
import { useSeatLevelSunCalculations, SeatSunExposure } from '../../../../../src/hooks/useSeatLevelSunCalculations';
import { SunPosition, getSunPosition } from '../../../../../src/utils/sunCalculations';
import { MLB_STADIUMS } from '../../../../../src/data/stadiums';

export default function SectionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stadiumId = params.stadiumId as string;
  const sectionId = params.sectionId as string;

  // Get stadium data
  const stadium = useMemo(() =>
    MLB_STADIUMS.find(s => s.id === stadiumId),
    [stadiumId]
  );

  // For now, use current time. In production, this would come from GameSelector
  const [gameTime] = useState(() => new Date());
  const sunPosition: SunPosition | null = useMemo(() => {
    if (!stadium) return null;
    return getSunPosition(gameTime, stadium.latitude, stadium.longitude);
  }, [gameTime, stadium]);

  // Load seat-level sun calculations
  const {
    seats,
    isLoading,
    error,
    sectionName,
    totalSeats,
    seatsInShade,
    averageExposure,
  } = useSeatLevelSunCalculations({
    stadiumId,
    sectionId,
    sunPosition: sunPosition || { altitude: 0, azimuth: 0, altitudeDegrees: 0, azimuthDegrees: 0 },
    enabled: !!stadium && !!sunPosition,
  });

  // Modal state
  const [selectedSeat, setSelectedSeat] = useState<SeatSunExposure | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle seat selection
  const handleSeatClick = (seat: SeatSunExposure) => {
    setSelectedSeat(seat);
    setIsModalOpen(true);
  };

  // Find best seats (lowest sun exposure)
  const bestSeats = useMemo(() => {
    if (!seats) return [];
    return [...seats]
      .sort((a, b) => a.sunExposure - b.sunExposure)
      .slice(0, 5);
  }, [seats]);

  if (!stadium) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Stadium Not Found</h1>
          <p className="text-gray-400">The requested stadium could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Stadium</span>
          </button>

          <h1 className="text-3xl font-bold mb-2">{stadium.name}</h1>
          <h2 className="text-xl text-blue-100">
            {sectionName || `Section ${sectionId}`}
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="mt-4 text-gray-400">Loading seat data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold mb-2">Error Loading Seat Data</h3>
            <p className="text-gray-300">{error.message}</p>
            <button
              onClick={() => router.back()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
            >
              Go Back
            </button>
          </div>
        )}

        {/* Section Statistics */}
        {!isLoading && !error && seats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400">Total Seats</div>
                <div className="text-3xl font-bold mt-1">{totalSeats}</div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400">Seats in Shade</div>
                <div className="text-3xl font-bold mt-1 text-blue-400">
                  {seatsInShade}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {((seatsInShade / totalSeats) * 100).toFixed(0)}%
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400">Average Exposure</div>
                <div className="text-3xl font-bold mt-1">
                  {averageExposure.toFixed(0)}%
                </div>
              </div>

              <div className="bg-gray-800 rounded-lg p-4">
                <div className="text-sm text-gray-400">Sun Position</div>
                <div className="text-lg font-bold mt-1">
                  {sunPosition && sunPosition.altitude > 0 ? '☀️ Above Horizon' : '🌙 Below Horizon'}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Alt: {sunPosition?.altitudeDegrees.toFixed(1) || '0'}°
                </div>
              </div>
            </div>

            {/* Best Seats Recommendation */}
            {bestSeats.length > 0 && (
              <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700/30 rounded-lg p-6 mb-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🌟</span>
                  <span>Best Seats for Shade</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {bestSeats.map((seat) => (
                    <button
                      key={seat.seatId}
                      onClick={() => handleSeatClick(seat)}
                      className="bg-gray-800 hover:bg-gray-700 rounded-lg p-3 transition-colors text-left"
                    >
                      <div className="font-semibold">
                        Row {seat.rowNumber}, Seat {seat.seatNumber}
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {seat.sunExposure.toFixed(0)}% sun
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seat Grid */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Seat Map</h3>
              <SeatGrid
                seats={seats}
                onSeatClick={handleSeatClick}
                width={900}
                height={600}
              />
            </div>
          </>
        )}
      </div>

      {/* Seat Detail Modal */}
      <SeatDetailModal
        seat={selectedSeat}
        sectionName={sectionName || `Section ${sectionId}`}
        onClose={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />
    </div>
  );
}
