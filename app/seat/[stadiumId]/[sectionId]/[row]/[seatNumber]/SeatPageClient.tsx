'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { SeatSearchBar } from '../../../../../../src/components/SeatSearchBar';
import type { Stadium } from '../../../../../../src/data/stadiums';
import type { SectionSeatingData, Seat } from '../../../../../../src/types/seat';

interface SeatPageClientProps {
  stadium: Stadium;
  section: SectionSeatingData;
  seat: Seat;
  stadiumId: string;
  sectionId: string;
}

export default function SeatPageClient({
  stadium,
  section,
  seat,
  stadiumId,
  sectionId,
}: SeatPageClientProps) {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState<'details' | 'nearby' | 'section'>('details');
  const [comparisonSeats, setComparisonSeats] = useState<string[]>([]);
  const [isInComparison, setIsInComparison] = useState(false);

  // Load comparison list from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('comparisonSeats');
    if (stored) {
      try {
        const seats = JSON.parse(stored);
        setComparisonSeats(seats);
        setIsInComparison(seats.includes(seat.id));
      } catch (e) {
        console.error('Failed to parse comparison seats:', e);
      }
    }
  }, [seat.id]);

  // Handle adding/removing seat from comparison
  const handleToggleComparison = () => {
    let newSeats: string[];

    if (isInComparison) {
      // Remove from comparison
      newSeats = comparisonSeats.filter(id => id !== seat.id);
      setIsInComparison(false);
    } else {
      // Add to comparison (max 4 seats)
      newSeats = [...comparisonSeats, seat.id].slice(0, 4);
      setIsInComparison(true);
    }

    setComparisonSeats(newSeats);
    localStorage.setItem('comparisonSeats', JSON.stringify(newSeats));
  };

  // Navigate to comparison page
  const handleViewComparison = () => {
    if (comparisonSeats.length > 0) {
      router.push(`/compare?seats=${comparisonSeats.join(',')}`);
    }
  };

  // Find nearby seats (same row, adjacent seats)
  const nearbySeatsList = useMemo(() => {
    const rowData = section.rows.find(r => r.rowNumber === seat.row);
    if (!rowData) return [];

    const seatNum = parseInt(seat.seatNumber);
    if (isNaN(seatNum)) return [];

    return rowData.seats
      .filter(s => {
        const num = parseInt(s.seatNumber);
        return !isNaN(num) && Math.abs(num - seatNum) <= 2 && s.seatNumber !== seat.seatNumber;
      })
      .sort((a, b) => parseInt(a.seatNumber) - parseInt(b.seatNumber));
  }, [section, seat]);

  // Get sun exposure percentage if available (will be enhanced later with actual sun data loading)
  const sunExposure: number | null = useMemo(() => {
    // For now, return null - sun data loading will be added in future enhancement
    return null;
  }, [seat]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <SeatSearchBar
            stadiumId={stadiumId}
            placeholder={`Search sections or seats at ${stadium.name}...`}
            className="w-full"
          />
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-accent-600 hover:text-accent-700 hover:underline">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/stadium/${stadiumId}`}
              className="text-accent-600 hover:text-accent-700 hover:underline"
            >
              {stadium.name}
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href={`/stadium/${stadiumId}/section/${sectionId}`}
              className="text-accent-600 hover:text-accent-700 hover:underline"
            >
              {section.sectionName}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-700 font-medium">
              Row {seat.row} Seat {seat.seatNumber}
            </span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {section.sectionName} • Row {seat.row} • Seat {seat.seatNumber}
              </h1>
              <p className="text-lg text-gray-600">
                {stadium.name} • {stadium.city}, {stadium.state}
              </p>
            </div>

            {/* Comparison Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleToggleComparison}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
                  isInComparison
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-accent-600 text-white hover:bg-accent-700'
                }`}
              >
                {isInComparison ? '✓ In Comparison' : '+ Add to Compare'}
              </button>
              {comparisonSeats.length > 0 && (
                <button
                  onClick={handleViewComparison}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition"
                >
                  Compare ({comparisonSeats.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setSelectedTab('details')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'details'
                    ? 'border-accent-500 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Seat Details
              </button>
              <button
                onClick={() => setSelectedTab('nearby')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'nearby'
                    ? 'border-accent-500 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Nearby Seats ({nearbySeatsList.length})
              </button>
              <button
                onClick={() => setSelectedTab('section')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === 'section'
                    ? 'border-accent-500 text-accent-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Section Overview
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {selectedTab === 'details' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Seat Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Seat Information</h2>

              <div className="space-y-4">
                {/* Characteristics */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Characteristics</h3>
                  <div className="flex flex-wrap gap-2">
                    {seat.covered && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        Covered
                      </span>
                    )}
                    {!seat.covered && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        Open Air
                      </span>
                    )}
                    {seat.seatType === 'aisle' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        Aisle Seat
                      </span>
                    )}
                    {seat.accessibility.wheelchairAccessible && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Wheelchair Accessible
                      </span>
                    )}
                    {seat.seatType === 'wheelchair' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Wheelchair Space
                      </span>
                    )}
                    {seat.seatType === 'companion' && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        Companion Seat
                      </span>
                    )}
                  </div>
                </div>

                {/* View Quality */}
                {seat.viewQuality && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">View Quality</h3>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize ${
                          seat.viewQuality === 'excellent'
                            ? 'bg-green-100 text-green-800'
                            : seat.viewQuality === 'good'
                            ? 'bg-blue-100 text-blue-800'
                            : seat.viewQuality === 'fair'
                            ? 'bg-yellow-100 text-yellow-800'
                            : seat.viewQuality === 'obstructed'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {seat.viewQuality}
                      </span>
                    </div>
                  </div>
                )}

                {/* Position */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">3D Position</h3>
                  <div className="bg-gray-50 rounded p-3 space-y-1 font-mono text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">X (Left-Right):</span>
                      <span className="text-gray-900">{seat.position3D.x.toFixed(2)} ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Y (Front-Back):</span>
                      <span className="text-gray-900">{seat.position3D.y.toFixed(2)} ft</span>
                    </div>
                    {seat.position3D.z !== undefined && seat.position3D.z !== null && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Z (Elevation):</span>
                        <span className="text-gray-900">{seat.position3D.z.toFixed(2)} ft</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Elevation */}
                {seat.elevation && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Elevation</h3>
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-2xl font-bold text-gray-900">
                        {seat.elevation.toFixed(0)} ft
                      </p>
                      <p className="text-sm text-gray-600">above field level</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sun Exposure Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sun Exposure</h2>

              {sunExposure !== null ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Sun Exposure During Game
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        {(sunExposure as number).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className={`h-4 rounded-full transition-all ${
                          (sunExposure as number) > 75
                            ? 'bg-red-500'
                            : (sunExposure as number) > 50
                            ? 'bg-orange-500'
                            : (sunExposure as number) > 25
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${sunExposure}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="text-sm font-semibold text-blue-900 mb-2">
                      Sun Exposure Guide
                    </h3>
                    <div className="text-sm text-blue-800 space-y-1">
                      <div>
                        <span className="font-medium">0-25%:</span> Mostly shaded
                      </div>
                      <div>
                        <span className="font-medium">25-50%:</span> Partially shaded
                      </div>
                      <div>
                        <span className="font-medium">50-75%:</span> Mostly sunny
                      </div>
                      <div>
                        <span className="font-medium">75-100%:</span> Full sun
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">Sun exposure data not available</p>
                  <p className="text-sm text-gray-400">
                    Sun calculations are available for select stadiums
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {selectedTab === 'nearby' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Nearby Seats</h2>

            {nearbySeatsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nearbySeatsList.map(nearbySeat => {
                  return (
                    <Link
                      key={nearbySeat.id}
                      href={`/seat/${stadiumId}/${sectionId}/${nearbySeat.row}/${nearbySeat.seatNumber}`}
                      className="block border border-gray-200 rounded-lg p-4 hover:border-accent-500 hover:shadow-md transition-all"
                    >
                      <div className="font-bold text-lg text-gray-900 mb-2">
                        Seat {nearbySeat.seatNumber}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {nearbySeat.covered && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                            Covered
                          </span>
                        )}
                        {nearbySeat.seatType === 'aisle' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Aisle
                          </span>
                        )}
                        {nearbySeat.viewQuality && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                            {nearbySeat.viewQuality}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No nearby seats found</p>
            )}
          </div>
        )}

        {selectedTab === 'section' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Section Overview</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {section.sectionName}
                </h3>
                <p className="text-gray-600">
                  Total Rows: {section.rows.length} • Total Seats:{' '}
                  {section.rows.reduce((sum, row) => sum + row.seats.length, 0)}
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Want to see all seats in this section with a visual seat map?
                </p>
                <Link
                  href={`/stadium/${stadiumId}/section/${sectionId}`}
                  className="mt-3 inline-flex items-center px-4 py-2 bg-accent-600 text-white rounded-md hover:bg-accent-700 transition-colors text-sm font-medium"
                >
                  View Full Section →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Back to Section Link */}
        <div className="mt-8">
          <Link
            href={`/stadium/${stadiumId}/section/${sectionId}`}
            className="inline-flex items-center text-accent-600 hover:text-accent-700 font-medium"
          >
            ← Back to {section.sectionName}
          </Link>
        </div>
      </div>
    </div>
  );
}
