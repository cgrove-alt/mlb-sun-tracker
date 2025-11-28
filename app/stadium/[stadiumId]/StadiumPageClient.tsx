'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo, useState, useCallback } from 'react';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { getSunPosition } from '../../../src/utils/sunCalculations';
import { useSunCalculations } from '../../../src/hooks/useSunCalculations';
import { usePullToRefresh } from '../../../src/hooks/usePullToRefresh';
import { PullToRefreshIndicator } from '../../../src/components/PullToRefreshIndicator';
import { UpcomingGamesSelector } from '../../../src/components/UpcomingGamesSelector';

const ComprehensiveStadiumGuide = dynamic(
  () => import('../../../src/components/ComprehensiveStadiumGuide'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

const SeatRecommendationsSection = dynamic(
  () => import('../../../src/components/SeatRecommendationsSection'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

// Common MLB game times
const GAME_TIMES = [
  { value: '11:00', label: '11:00 AM' },
  { value: '12:00', label: '12:00 PM' },
  { value: '13:00', label: '1:00 PM' },
  { value: '13:30', label: '1:30 PM' },
  { value: '14:00', label: '2:00 PM' },
  { value: '15:00', label: '3:00 PM' },
  { value: '16:00', label: '4:00 PM' },
  { value: '17:00', label: '5:00 PM' },
  { value: '18:00', label: '6:00 PM' },
  { value: '19:00', label: '7:00 PM' },
  { value: '19:30', label: '7:30 PM' },
  { value: '20:00', label: '8:00 PM' },
];

interface StadiumPageClientProps {
  stadium: any;
  sections: any[];
  amenities: any;
  guide: any;
  useComprehensive?: boolean;
}

export default function StadiumPageClient({
  stadium,
  sections,
  amenities,
  guide,
  useComprehensive = false
}: StadiumPageClientProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedTime, setSelectedTime] = useState('13:00'); // Default to 1 PM
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedOpponent, setSelectedOpponent] = useState<string | null>(null);

  // Handler for when user selects a game from upcoming games
  const handleGameSelect = useCallback((date: string, time: string, opponent: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setSelectedOpponent(opponent);
    setRefreshKey(prev => prev + 1); // Trigger recalculation
  }, []);

  // Calculate sun position based on selected date/time
  const sunPosition = useMemo(() => {
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const gameDateTime = new Date(selectedDate);
    gameDateTime.setHours(hours, minutes, 0, 0);

    return getSunPosition(
      gameDateTime,
      stadium.latitude || 40.7128,
      stadium.longitude || -74.0060,
      stadium.timezone || 'America/New_York'
    );
  }, [stadium.id, selectedTime, selectedDate, refreshKey]);

  // Use Web Worker for sun calculations
  const {
    data: sectionsWithSunData,
    isLoading: isCalculating,
    refetch: refetchSunData,
  } = useSunCalculations({
    stadium,
    sunPosition,
    sections,
    enabled: !!sections.length,
  });

  // Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    // Simulate delay for better UX
    await new Promise(resolve => setTimeout(resolve, 300));

    // Trigger data refresh
    setRefreshKey(prev => prev + 1);

    // Refetch sun calculations if available
    if (refetchSunData) {
      await refetchSunData();
    }
  }, [refetchSunData]);

  // Pull-to-refresh hook (only enabled on mobile)
  const pullToRefresh = usePullToRefresh({
    onRefresh: handleRefresh,
    enabled: typeof window !== 'undefined' && window.innerWidth < 768,
  });

  // Format selected time for display
  const formatTimeDisplay = (time: string) => {
    const found = GAME_TIMES.find(t => t.value === time);
    return found ? found.label : time;
  };

  return (
    <>
      {/* Pull-to-refresh indicator */}
      <PullToRefreshIndicator
        pullDistance={pullToRefresh.pullDistance}
        isRefreshing={pullToRefresh.isRefreshing}
        progress={pullToRefresh.progress}
      />

      {/* Upcoming Games Selector - Shows real MLB schedule */}
      <UpcomingGamesSelector
        stadiumId={stadium.id}
        onGameSelect={handleGameSelect}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />

      {/* Manual Game Time Selector */}
      <div className="bg-gradient-to-r from-teal-700 to-cyan-600 rounded-xl p-4 mb-6 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <span className="font-semibold">When is your game?</span>
          </div>

          <div className="flex flex-wrap gap-3 w-full sm:w-auto">
            {/* Date Picker */}
            <div className="flex-1 sm:flex-none">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border-0 bg-white/90 text-gray-800 font-medium shadow-sm focus:ring-2 focus:ring-white/50 focus:outline-none"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Time Picker */}
            <div className="flex-1 sm:flex-none">
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full sm:w-auto px-4 py-2 rounded-lg border-0 bg-white/90 text-gray-800 font-medium shadow-sm focus:ring-2 focus:ring-white/50 focus:outline-none cursor-pointer"
              >
                {GAME_TIMES.map((time) => (
                  <option key={time.value} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sun info badge */}
          <div className="hidden md:flex items-center gap-2 ml-auto bg-white/20 px-3 py-1.5 rounded-full text-white text-sm">
            <span>Sun altitude: {sunPosition.altitudeDegrees.toFixed(0)}°</span>
            {sunPosition.altitudeDegrees < 0 && <span className="text-yellow-200">(Night)</span>}
          </div>
        </div>
      </div>

      {/* Stadium Guide - with smaller loading state */}
      <div className="stadium-guide-wrapper">
        <Suspense fallback={
          <div className="flex justify-center items-center p-8">
            <LoadingSpinner message="Loading stadium guide..." />
          </div>
        }>
          <ComprehensiveStadiumGuide
            stadiumId={stadium.id}
          />
        </Suspense>
      </div>

      {/* AI Seat Recommendations Section - Outside Suspense */}
      <div className="mt-8" style={{ display: 'block' }}>
        {isCalculating ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSpinner message="Calculating sun exposure..." />
          </div>
        ) : sectionsWithSunData && sectionsWithSunData.length > 0 ? (
          <SeatRecommendationsSection
            sections={sectionsWithSunData}
            stadiumId={stadium.id}
            gameTime={selectedTime}
            gameDate={new Date(selectedDate)}
          />
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <div className="text-gray-600 mb-2">
              Sun data unavailable
            </div>
            <p className="text-sm text-gray-500">
              Sun exposure data could not be calculated for this stadium.
              Basic section information is still available above.
            </p>
          </div>
        )}
      </div>
    </>
  );
}