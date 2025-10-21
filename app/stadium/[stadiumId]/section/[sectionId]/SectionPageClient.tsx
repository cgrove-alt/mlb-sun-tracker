'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Stadium } from '../../../../../src/data/stadiums';
import type { SectionSeatingData, Seat } from '../../../../../src/types/seat';
import { SeatGrid } from '../../../../../src/components/SeatGrid';
import { SeatDetailModal } from '../../../../../src/components/SeatDetailModal';

interface SectionPageClientProps {
  stadium: Stadium;
  sectionData: SectionSeatingData;
  sectionId: string;
}

export default function SectionPageClient({
  stadium,
  sectionData,
  sectionId,
}: SectionPageClientProps) {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [sunExposureData] = useState<Record<string, boolean> | null>(null); // TODO: Load client-side via API
  const [filterShaded, setFilterShaded] = useState(false);
  const [filterSunny, setFilterSunny] = useState(false);

  // Handle seat click
  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedSeat(null);
  };

  // Calculate selected seat's sun exposure
  const selectedSeatExposure = selectedSeat && sunExposureData
    ? sunExposureData[selectedSeat.id] ? 100 : 0
    : 0;

  // Reset filters
  const resetFilters = () => {
    setFilterShaded(false);
    setFilterSunny(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2 text-gray-600">
          <li>
            <Link href="/" className="hover:text-accent-600 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <Link
              href={`/stadium/${stadium.id}`}
              className="hover:text-accent-600 transition-colors"
            >
              {stadium.name}
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
          </li>
          <li>
            <span className="text-gray-900 font-semibold">Section {sectionId}</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Section {sectionData.sectionName || sectionId}
            </h1>
            <p className="text-lg text-gray-600">
              {stadium.name} • {sectionData.totalSeats} seats
            </p>
          </div>
        </div>

        {/* Section Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
              Total Rows
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {sectionData.totalRows}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
              Total Seats
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {sectionData.totalSeats}
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-500 uppercase tracking-wide mb-1">
              Wheelchair Seats
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {sectionData.seatDistribution.wheelchair}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Filter Seats:</h2>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterShaded}
              onChange={(e) => setFilterShaded(e.target.checked)}
              className="w-5 h-5 text-accent-600 rounded focus:ring-accent-500"
            />
            <span className="text-sm text-gray-700">Show Only Shaded (&lt;30% sun)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filterSunny}
              onChange={(e) => setFilterSunny(e.target.checked)}
              className="w-5 h-5 text-accent-600 rounded focus:ring-accent-500"
            />
            <span className="text-sm text-gray-700">Show Only Sunny (&gt;70% sun)</span>
          </label>

          {(filterShaded || filterSunny) && (
            <button
              onClick={resetFilters}
              className="ml-auto px-4 py-2 text-sm font-medium text-accent-700 hover:text-accent-900 hover:bg-accent-50 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Seat Grid */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Seat Map</h2>
        <SeatGrid
          rows={sectionData.rows}
          sunExposureData={sunExposureData}
          onSeatClick={handleSeatClick}
          filterShaded={filterShaded}
          filterSunny={filterSunny}
        />
        {!sunExposureData && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ℹ️ Sun exposure data is loading... Seats will show sun/shade information once data is available.
            </p>
          </div>
        )}
      </div>

      {/* Seat Detail Modal */}
      <SeatDetailModal
        seat={selectedSeat}
        sunExposure={selectedSeatExposure}
        onClose={handleCloseModal}
      />
    </div>
  );
}
