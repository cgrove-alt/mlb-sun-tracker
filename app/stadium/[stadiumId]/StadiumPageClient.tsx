'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo, useState, useCallback, useEffect } from 'react';
import { LoadingSpinner } from '../../../src/components/common/LoadingSpinner';
import { getSunPosition } from '../../../src/utils/sunCalculations';
import { useSunCalculations } from '../../../src/hooks/useSunCalculations';
import { usePullToRefresh } from '../../../src/hooks/usePullToRefresh';
import { PullToRefreshIndicator } from '../../../src/components/PullToRefreshIndicator';
import { SeatSearchBar } from '../../../src/components/SeatSearchBar';
import { GameContextBanner } from '../../../src/components/GameContextBanner';
import { useSearchParams } from 'next/navigation';
import type { Stadium } from '../../../src/data/stadiums';

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

// REMOVED: IndividualSeatRecommendationsSection - Was loading 16-28MB of data
// Replaced with lightweight SectionNavigationGrid for better performance
const SectionNavigationGrid = dynamic(
  () => import('../../../src/components/SectionNavigationGrid'),
  {
    loading: () => <LoadingSpinner message="Loading sections..." />,
    ssr: false,
  }
);

const ShadeVisualization = dynamic(
  () => import('../../../src/components/ShadeVisualization').then(mod => ({ default: mod.ShadeVisualization })),
  {
    loading: () => <LoadingSpinner message="Loading shade analysis..." />,
    ssr: false,
  }
);

interface StadiumPageClientProps {
  stadium: any;
  sections: any[];
  amenities: any;
  guide: any;
  useComprehensive?: boolean;
  availableSections?: string[];
  gameId?: string;
  gameTime?: string;
}

export default function StadiumPageClient({
  stadium,
  sections,
  amenities,
  guide,
  useComprehensive = false,
  availableSections,
  gameId,
  gameTime
}: StadiumPageClientProps) {
  const [refreshKey, setRefreshKey] = useState(0);
  const searchParams = useSearchParams();

  // Check if we're in shade view mode
  const isShadeView = searchParams.get('view') === 'shade';

  // Parse game date and time from URL params
  const gameDateParam = searchParams.get('gameDate');
  const timeParam = gameTime || searchParams.get('time') || '13:00';
  const [selectedTime, setSelectedTime] = useState(timeParam);

  // Create actual game date/time (use game date if provided, otherwise fall back to today)
  const gameDateTime = useMemo(() => {
    if (gameDateParam && timeParam) {
      // Use actual game date from URL
      const dateTime = new Date(`${gameDateParam}T${timeParam}:00`);
      return dateTime;
    }
    // Fallback to today with selected time
    const today = new Date();
    const [hours, minutes] = timeParam.split(':').map(Number);
    today.setHours(hours, minutes, 0, 0);
    return today;
  }, [gameDateParam, timeParam]);

  // Debug: Log what's being rendered
  console.log('StadiumPageClient rendering:', {
    stadiumId: stadium?.id,
    useComprehensive,
    hasGuide: !!guide,
    isShadeView,
    selectedTime
  });

  // Calculate sun position using actual game date/time
  const sunPosition = useMemo(() => {
    return getSunPosition(
      gameDateTime,
      stadium.latitude || 40.7128,
      stadium.longitude || -74.0060,
      stadium.timezone || 'America/New_York'
    );
  }, [stadium.id, gameDateTime]); // Use gameDateTime which includes correct date

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

  return (
    <>
      {/* Pull-to-refresh indicator */}
      <PullToRefreshIndicator
        pullDistance={pullToRefresh.pullDistance}
        isRefreshing={pullToRefresh.isRefreshing}
        progress={pullToRefresh.progress}
      />

      {/* Game Context Banner - Show selected game */}
      {gameId && gameDateParam && (
        <div className="max-w-4xl mx-auto px-4 pt-4">
          <GameContextBanner gamePk={gameId} gameDate={gameDateTime} />
        </div>
      )}

      {/* Search Bar - Prominent at top */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <SeatSearchBar
          stadiumId={stadium.id}
          placeholder={`Search sections or seats at ${stadium.name}...`}
          className="w-full"
        />
      </div>

      {/* Show Shade Visualization when in shade view mode */}
      {isShadeView && sectionsWithSunData && (
        <div className="shade-view-container">
          <ShadeVisualization
            sections={sectionsWithSunData}
            stadiumId={stadium.id}
            gameTime={selectedTime}
            gameDate={gameDateTime}
          />
        </div>
      )}

      {/* Stadium Guide - Hidden in shade view mode */}
      {!isShadeView && (
        <div className="stadium-guide-wrapper">
          <Suspense fallback={
            <div className="flex justify-center items-center p-8">
              <LoadingSpinner message="Loading stadium guide..." />
            </div>
          }>
            <ComprehensiveStadiumGuide
              stadiumId={stadium.id}
              guide={guide}
              availableSections={availableSections}
            />
          </Suspense>
        </div>
      )}
      
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
            gameTime={timeParam}
            gameDate={gameDateTime}
          />
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <div className="text-gray-600 mb-2">
              ⚠️ AI Recommendations Unavailable
            </div>
            <p className="text-sm text-gray-500">
              Sun exposure data could not be calculated for this stadium.
              Basic section information is still available above.
            </p>
          </div>
        )}
      </div>

      {/* Section Navigation - Progressive Loading Pattern */}
      {/* Users select a section first, then view seats within that section */}
      <div className="mt-8" style={{ display: 'block' }}>
        <SectionNavigationGrid
          stadiumId={stadium.id}
          sections={sectionsWithSunData && sectionsWithSunData.length > 0 ? sectionsWithSunData : sections}
          gameDate={gameDateParam || undefined}
          gameTime={timeParam}
          isCalculating={isCalculating}
        />
      </div>
    </>
  );
}