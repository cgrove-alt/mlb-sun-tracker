'use client';

import React, { useState, useMemo } from 'react';
import type { Seat, SeatRow } from '@/types/seat';

interface SeatGridProps {
  rows: SeatRow[];
  sunExposureData: Record<string, boolean> | null; // seatId -> inSun
  onSeatClick?: (seat: Seat) => void;
  filterShaded?: boolean;
  filterSunny?: boolean;
}

/**
 * SeatGrid Component
 * Displays all seats in a section with color-coded sun exposure
 *
 * Color scheme:
 * - Green: Shaded seat (< 30% sun)
 * - Yellow: Partial sun (30-70% sun)
 * - Orange/Red: Direct sun (> 70% sun)
 */
export const SeatGrid: React.FC<SeatGridProps> = ({
  rows,
  sunExposureData,
  onSeatClick,
  filterShaded = false,
  filterSunny = false,
}) => {
  // Calculate sun exposure percentage for each seat
  const seatExposureMap = useMemo(() => {
    if (!sunExposureData) return new Map<string, number>();

    const map = new Map<string, number>();
    Object.entries(sunExposureData).forEach(([seatId, inSun]) => {
      // For now, simplified: inSun = 100%, not inSun = 0%
      // Future: load full timeline data for accurate percentage
      map.set(seatId, inSun ? 100 : 0);
    });
    return map;
  }, [sunExposureData]);

  // Get color class based on sun exposure percentage
  const getSeatColorClass = (exposure: number): string => {
    if (exposure === 0) return 'bg-gray-200 border-gray-400 text-gray-700'; // Full shade
    if (exposure < 30) return 'bg-green-100 border-green-400 text-green-800'; // Mostly shade
    if (exposure < 70) return 'bg-yellow-100 border-yellow-400 text-yellow-800'; // Partial sun
    if (exposure < 90) return 'bg-orange-100 border-orange-400 text-orange-800'; // Mostly sun
    return 'bg-red-100 border-red-500 text-red-800'; // Full sun
  };

  // Check if seat should be dimmed based on filters
  const shouldDimSeat = (exposure: number): boolean => {
    if (filterShaded && exposure >= 30) return true;
    if (filterSunny && exposure <= 70) return true;
    return false;
  };

  // Handle seat click
  const handleSeatClick = (seat: Seat) => {
    if (onSeatClick) {
      onSeatClick(seat);
    }
  };

  if (rows.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <p>No seat data available for this section.</p>
      </div>
    );
  }

  return (
    <div className="seat-grid-container">
      {/* Legend */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Sun Exposure Legend</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 bg-gray-200 border-gray-400" />
            <span className="text-xs text-gray-600">Full Shade</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 bg-green-100 border-green-400" />
            <span className="text-xs text-gray-600">Mostly Shade (&lt;30%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 bg-yellow-100 border-yellow-400" />
            <span className="text-xs text-gray-600">Partial Sun (30-70%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 bg-orange-100 border-orange-400" />
            <span className="text-xs text-gray-600">Mostly Sun (70-90%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 bg-red-100 border-red-500" />
            <span className="text-xs text-gray-600">Full Sun (&gt;90%)</span>
          </div>
        </div>
      </div>

      {/* Seat Grid */}
      <div className="space-y-4">
        {rows.map((row) => (
          <div key={row.rowNumber} className="row-container">
            {/* Row label */}
            <div className="flex items-center gap-4 mb-2">
              <span className="text-sm font-semibold text-gray-700 w-12">
                Row {row.rowNumber}
              </span>
              <div className="flex-1 h-px bg-gray-300" />
              <span className="text-xs text-gray-500">
                {row.seatCount} seats
              </span>
            </div>

            {/* Seats in row */}
            <div className="flex flex-wrap gap-2">
              {row.seats.map((seat) => {
                const exposure = seatExposureMap.get(seat.id) ?? 50; // Default to 50% if no data
                const colorClass = getSeatColorClass(exposure);
                const isDimmed = shouldDimSeat(exposure);

                return (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    className={`
                      seat-button
                      ${colorClass}
                      ${isDimmed ? 'opacity-30' : 'opacity-100'}
                      px-3 py-2 rounded border-2 text-xs font-semibold
                      hover:shadow-md hover:scale-105 hover:z-10
                      transition-all duration-200
                      cursor-pointer
                      min-w-[3rem]
                    `}
                    aria-label={`Seat ${seat.seatNumber}, Row ${row.rowNumber}, ${exposure}% sun exposure`}
                    title={`Seat ${seat.seatNumber}\n${exposure}% sun exposure`}
                  >
                    {seat.seatNumber}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile optimization note */}
      <style jsx>{`
        .seat-grid-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .row-container {
          padding: 0.75rem;
          background: white;
          border-radius: 0.5rem;
          border: 1px solid #e5e7eb;
        }

        @media (max-width: 640px) {
          .seat-button {
            min-width: 2.5rem;
            padding: 0.5rem 0.625rem;
            font-size: 0.625rem;
          }
        }
      `}</style>
    </div>
  );
};

export default SeatGrid;
