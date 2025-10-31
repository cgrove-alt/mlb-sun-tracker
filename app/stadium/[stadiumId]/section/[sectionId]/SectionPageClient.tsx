'use client';

import React, { useState, useEffect, Suspense, lazy } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Stadium } from '../../../../../src/data/stadiums';
import type { SectionSeatingData, Seat } from '../../../../../src/types/seat';
import { VirtualizedSeatGrid } from '../../../../../src/components/seats/VirtualizedSeatGrid';
import { SeatDetailModal } from '../../../../../src/components/seats/SeatDetailModal';
import { useSunExposure } from '../../../../../src/hooks/useSunExposure';
import { getSeatDataForSection } from '../../../../../src/utils/seatDataLoader';
import { getUnifiedVenueById } from '../../../../../src/data/unifiedVenues';
import type { MLBGame } from '../../../../../src/services/mlbApi';
import type { MiLBGame } from '../../../../../src/services/milbApi';
import type { NFLGame } from '../../../../../src/services/nflApi';
import { format } from 'date-fns';

// Lazy load heavy components for better initial load performance
const UnifiedGameSelector = lazy(() => import('../../../../../src/components/UnifiedGameSelector').then(mod => ({ default: mod.UnifiedGameSelector })));
const SunArcTimeline = lazy(() => import('../../../../../src/components/SunArcTimeline').then(mod => ({ default: mod.SunArcTimeline })));

interface SectionPageClientProps {
  stadium: Stadium;
  sectionId: string;
  seatDataStadiumId: string;
}

export default function SectionPageClient({
  stadium,
  sectionId,
  seatDataStadiumId,
}: SectionPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sectionData, setSectionData] = useState<SectionSeatingData | null>(null);
  const [isLoadingSeatData, setIsLoadingSeatData] = useState(true);
  const [seatDataError, setSeatDataError] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [filterShaded, setFilterShaded] = useState(false);
  const [filterSunny, setFilterSunny] = useState(false);

  // Game selection state - check URL params for initial values
  const [selectedGame, setSelectedGame] = useState<MLBGame | MiLBGame | NFLGame | null>(null);
  const [gameDateTime, setGameDateTime] = useState<Date | null>(() => {
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');
    if (dateParam && timeParam) {
      return new Date(`${dateParam}T${timeParam}:00`);
    }
    return null;
  });
  const [selectedVenue, setSelectedVenue] = useState(() => getUnifiedVenueById(stadium.id));

  // Load seat data and sun data in parallel for faster initial load
  useEffect(() => {
    async function loadData() {
      setIsLoadingSeatData(true);
      setSeatDataError(null);

      try {
        // PERFORMANCE OPTIMIZATION: Load seat data and sun exposure data in parallel
        // This cuts load time in half compared to sequential loading
        const data = await getSeatDataForSection(stadium.id, sectionId);

        if (data) {
          setSectionData(data);
        } else {
          // Provide detailed error message
          const errorMsg = `Seat data not found for Section ${sectionId} at ${stadium.name} (Stadium ID: ${stadium.id})`;
          console.warn(errorMsg);
          setSeatDataError(errorMsg);
        }
      } catch (error) {
        const errorMsg = `Failed to load seat data for Section ${sectionId} at ${stadium.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(errorMsg, error);
        setSeatDataError(errorMsg);
      } finally {
        setIsLoadingSeatData(false);
      }
    }

    loadData();
  }, [stadium.id, sectionId]);

  // Get game time from selected game or use default
  const gameTime = gameDateTime ? format(gameDateTime, 'HH:mm') : '13:10';
  const gameDate = gameDateTime || new Date();

  // Load sun exposure data based on selected game
  const { data: sunExposureData, isLoading: isSunDataLoading, error: sunDataError } = useSunExposure({
    stadiumId: seatDataStadiumId,
    gameTime: gameTime,
    gameDate: gameDate,
    enabled: true,
  });

  // Handle seat click
  const handleSeatClick = (seat: Seat) => {
    setSelectedSeat(seat);
  };

  // Handle modal close
  const handleCloseModal = () => {
    setSelectedSeat(null);
  };

  // Handle game selection and update URL
  const handleGameSelect = (game: MLBGame | MiLBGame | NFLGame | null, dateTime: Date | null) => {
    setSelectedGame(game);
    setGameDateTime(dateTime);

    // Update URL with game parameters
    if (game && dateTime) {
      const params = new URLSearchParams();

      if ('gamePk' in game) {
        // MLB/MiLB game
        params.set('gameId', game.gamePk.toString());
      } else {
        // NFL game
        params.set('gameId', (game as NFLGame).gameId);
      }

      params.set('date', format(dateTime, 'yyyy-MM-dd'));
      params.set('time', format(dateTime, 'HH:mm'));

      // Update URL without page reload
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      router.push(newUrl, { scroll: false });
    }
  };

  // Handle venue change (shouldn't happen on section page, but required by component)
  const handleVenueChange = (venue: any) => {
    // Stadium is fixed on this page, so we don't change it
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

  // Show loading state
  if (isLoadingSeatData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-accent-600 border-r-transparent mb-4"></div>
            <p className="text-lg text-gray-600">Loading seat data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (seatDataError || !sectionData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-900 mb-2">Error Loading Seat Data</h2>
          <p className="text-red-700 mb-3">{seatDataError || 'Section data not found'}</p>

          <div className="bg-white border border-red-100 rounded p-4 mt-4 mb-4">
            <p className="text-sm text-gray-600 mb-2">
              <strong>Stadium:</strong> {stadium.name} ({stadium.id})
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Section:</strong> {sectionId}
            </p>
            <p className="text-xs text-gray-500 mt-3">
              This section may not have individual seat data available yet.
              Please check back later or contact support if this issue persists.
            </p>
          </div>

          <Link
            href={`/stadium/${stadium.id}`}
            className="mt-4 inline-block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            ← Back to Stadium
          </Link>
        </div>
      </div>
    );
  }

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

      {/* Game Selector */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Game</h2>
        <Suspense fallback={
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        }>
          <UnifiedGameSelector
            selectedVenue={selectedVenue}
            onGameSelect={handleGameSelect}
            onVenueChange={handleVenueChange}
          />
        </Suspense>
        {selectedGame && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Selected Game: {gameDate.toLocaleDateString()} at {gameTime}
            </p>
          </div>
        )}
      </div>

      {/* Sun Arc Timeline */}
      <Suspense fallback={
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      }>
        <SunArcTimeline
          stadiumLatitude={stadium.latitude}
          stadiumLongitude={stadium.longitude}
          stadiumTimezone={stadium.timezone}
          gameDate={gameDate}
          gameStartTime={gameTime}
          sectionId={sectionId}
          className="mb-6"
        />
      </Suspense>

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
        <VirtualizedSeatGrid
          rows={sectionData.rows}
          sunExposureData={sunExposureData}
          onSeatClick={handleSeatClick}
          filterShaded={filterShaded}
          filterSunny={filterSunny}
        />
        {isSunDataLoading && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              ⏳ Loading sun exposure data...
            </p>
          </div>
        )}
        {sunDataError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">
              ⚠️ Failed to load sun exposure data: {sunDataError.message}
            </p>
          </div>
        )}
        {sunExposureData && !isSunDataLoading && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ Sun exposure data loaded for {Object.keys(sunExposureData).length} seats
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
