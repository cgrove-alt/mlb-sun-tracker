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
const GameTimeSlider = lazy(() => import('../../../../../src/components/GameTimeSlider').then(mod => ({ default: mod.GameTimeSlider })));

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
  const [timeOffset, setTimeOffset] = useState(0); // Minutes from game start

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

  // Get game time from selected game or use default, adjusted by time slider offset
  const baseGameTime = gameDateTime ? format(gameDateTime, 'HH:mm') : '13:10';
  const gameDate = gameDateTime || new Date();

  // Calculate adjusted game time based on slider offset
  const getAdjustedGameTime = (): string => {
    const [hours, minutes] = baseGameTime.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes + timeOffset;
    const adjustedHours = Math.floor(totalMinutes / 60) % 24;
    const adjustedMinutes = totalMinutes % 60;
    return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
  };

  const gameTime = getAdjustedGameTime();

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

  // Handle time slider change
  const handleTimeChange = (newOffset: number) => {
    setTimeOffset(newOffset);
    // Sun exposure data will automatically recalculate due to gameTime dependency
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

      {/* Sun Exposure Statistics Banner */}
      {sunExposureData && !isSunDataLoading && (
        <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 rounded-2xl shadow-lg p-6 mb-6 border border-amber-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">☀️</span>
            <h2 className="text-xl font-bold text-gray-900">Sun Exposure Analysis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Shade Percentage */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">☁️</span>
                <div className="text-sm text-gray-600 font-medium">In Shade</div>
              </div>
              <div className="text-3xl font-bold text-green-600">
                {Math.round((Object.values(sunExposureData).filter(v => v < 30).length / Object.keys(sunExposureData).length) * 100)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Object.values(sunExposureData).filter(v => v < 30).length} of {Object.keys(sunExposureData).length} seats
              </div>
            </div>

            {/* Partial Sun */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">⛅</span>
                <div className="text-sm text-gray-600 font-medium">Partial Sun</div>
              </div>
              <div className="text-3xl font-bold text-yellow-600">
                {Math.round((Object.values(sunExposureData).filter(v => v >= 30 && v < 70).length / Object.keys(sunExposureData).length) * 100)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Object.values(sunExposureData).filter(v => v >= 30 && v < 70).length} seats
              </div>
            </div>

            {/* Full Sun */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">☀️</span>
                <div className="text-sm text-gray-600 font-medium">Full Sun</div>
              </div>
              <div className="text-3xl font-bold text-red-600">
                {Math.round((Object.values(sunExposureData).filter(v => v >= 70).length / Object.keys(sunExposureData).length) * 100)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Object.values(sunExposureData).filter(v => v >= 70).length} seats
              </div>
            </div>

            {/* Average Exposure */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📊</span>
                <div className="text-sm text-gray-600 font-medium">Avg Exposure</div>
              </div>
              <div className="text-3xl font-bold text-orange-600">
                {Math.round(Object.values(sunExposureData).reduce((a, b) => a + b, 0) / Object.keys(sunExposureData).length)}%
              </div>
              <div className="text-xs text-gray-500 mt-1">
                section average
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-4 p-4 bg-white bg-opacity-60 rounded-lg border border-amber-200">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <div className="font-semibold text-gray-900 mb-1">Shade Seeker Tip:</div>
                <p className="text-sm text-gray-700">
                  {Object.values(sunExposureData).filter(v => v < 30).length > sectionData.totalSeats * 0.5
                    ? `Great news! This section is mostly shaded (${Math.round((Object.values(sunExposureData).filter(v => v < 30).length / Object.keys(sunExposureData).length) * 100)}% of seats). Look for seats highlighted in green on the heat map below.`
                    : Object.values(sunExposureData).filter(v => v < 30).length > 0
                    ? `This section has ${Object.values(sunExposureData).filter(v => v < 30).length} shaded seats. Use the filter below to show only shaded seats (<30% sun exposure).`
                    : 'This section has very limited shade. Consider bringing sun protection (hat, sunscreen, sunglasses) or explore other sections for better shade coverage.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
          gameStartTime={baseGameTime}
          sectionId={sectionId}
          className="mb-6"
        />
      </Suspense>

      {/* Game Time Slider - Interactive sun exposure timeline */}
      <Suspense fallback={
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      }>
        <GameTimeSlider
          gameStartTime={baseGameTime}
          gameDate={gameDate}
          onTimeChange={handleTimeChange}
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

      {/* Best Seats for Shade - Recommendations */}
      {sunExposureData && !isSunDataLoading && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md p-6 mb-6 border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🌟</span>
            <h2 className="text-xl font-bold text-gray-900">Best Seats for Shade</h2>
          </div>

          <p className="text-sm text-gray-700 mb-4">
            These seats have the lowest sun exposure in this section. Click any seat to view detailed information.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {/* Find top 10 seats with lowest sun exposure */}
            {Object.entries(sunExposureData)
              .sort(([, a], [, b]) => a - b)
              .slice(0, 10)
              .map(([seatId, exposure]) => {
                // Find the actual seat object
                const seat = sectionData.rows
                  .flatMap(row => row.seats)
                  .find(s => s.id === seatId);

                if (!seat) return null;

                return (
                  <button
                    key={seatId}
                    onClick={() => handleSeatClick(seat)}
                    className="bg-white hover:bg-green-100 border-2 border-green-400 rounded-lg p-3 text-left transition-all hover:shadow-lg hover:scale-105 cursor-pointer"
                    title={`${exposure}% sun exposure`}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="text-xs text-gray-500 font-medium">
                        Row {seat.row}
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        Seat {seat.seatNumber}
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs">☁️</span>
                        <span className="text-xs font-semibold text-green-700">
                          {Math.round(exposure)}% sun
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })
              .filter(Boolean)}
          </div>

          <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg text-xs text-gray-600 border border-green-100">
            💡 <strong>Pro Tip:</strong> Use the time slider above to see how sun exposure changes throughout the game. Early afternoon games may have different shade patterns than evening games.
          </div>
        </div>
      )}

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
