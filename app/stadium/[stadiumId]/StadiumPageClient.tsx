'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo, useState, useCallback, useRef } from 'react';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { getSunPosition } from '../../../src/utils/sunCalculations';
import { useSunCalculations } from '../../../src/hooks/useSunCalculations';
import { usePullToRefresh } from '../../../src/hooks/usePullToRefresh';
import { PullToRefreshIndicator } from '../../../src/components/PullToRefreshIndicator';
import { StadiumDiagram, SectionShadeData } from '../../../src/components/StadiumDiagram/StadiumDiagram';
import { getStadiumCompleteData } from '../../../src/data/stadium-data-aggregator';

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
  const [selectedSectionId, setSelectedSectionId] = useState<string | undefined>(undefined);
  const sectionListRef = useRef<HTMLDivElement>(null);

  // Debug: Log what's being rendered
  console.log('StadiumPageClient rendering:', {
    stadiumId: stadium?.id,
    useComprehensive,
    hasGuide: !!guide
  });

  // Calculate sun position once
  const sunPosition = useMemo(() => {
    const gameDateTime = new Date();
    gameDateTime.setHours(13, 0, 0, 0); // 1:00 PM game time

    return getSunPosition(
      gameDateTime,
      stadium.latitude || 40.7128,
      stadium.longitude || -74.0060,
      stadium.timezone || 'America/New_York'
    );
  }, [stadium.id, refreshKey]); // Add refreshKey to recalculate on refresh

  // Use Web Worker for sun calculations with row-level data
  const {
    data: sectionsWithSunData,
    rowData,
    isLoading: isCalculating,
    refetch: refetchSunData,
  } = useSunCalculations({
    stadium,
    sunPosition,
    sections,
    enabled: !!sections.length,
    includeRows: true, // Enable row-level calculations
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

  // Get complete stadium data with 3D vertices for diagram
  const stadiumCompleteData = useMemo(() => {
    try {
      return getStadiumCompleteData(stadium.id, 'MLB');
    } catch (error) {
      console.error('Error loading complete stadium data:', error);
      return null;
    }
  }, [stadium.id]);

  // Convert sun calculations to shade data for diagram
  const shadeData: SectionShadeData[] = useMemo(() => {
    if (!sectionsWithSunData) return [];
    return sectionsWithSunData.map(sectionData => ({
      sectionId: sectionData.section.id,
      shadePercentage: 100 - sectionData.sunExposure // Convert sun exposure to shade
    }));
  }, [sectionsWithSunData]);

  // Handle section selection from diagram
  const handleDiagramSectionSelect = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);

    // Scroll to the section card in the list
    if (sectionListRef.current) {
      const sectionCard = sectionListRef.current.querySelector(`[data-section-id="${sectionId}"]`);
      if (sectionCard) {
        sectionCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // Flash the card to draw attention
        sectionCard.classList.add('highlight-flash');
        setTimeout(() => {
          sectionCard.classList.remove('highlight-flash');
        }, 2000);
      }
    }
  }, []);

  // Handle section selection from list (for future bidirectional sync)
  const handleListSectionSelect = useCallback((sectionId: string) => {
    setSelectedSectionId(sectionId);
  }, []);

  return (
    <>
      {/* Pull-to-refresh indicator */}
      <PullToRefreshIndicator
        pullDistance={pullToRefresh.pullDistance}
        isRefreshing={pullToRefresh.isRefreshing}
        progress={pullToRefresh.progress}
      />

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

      {/* Stadium Diagram - Interactive shade visualization */}
      {stadiumCompleteData && stadiumCompleteData.sections.length > 0 && !isCalculating && (
        <div className="stadium-diagram-wrapper mt-8 mb-8">
          <div className="diagram-header mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Stadium Map</h2>
            <p className="text-sm text-gray-600 mt-1">
              Click any section to see detailed shade information and scroll to its details below
            </p>
          </div>
          <StadiumDiagram
            sections={stadiumCompleteData.sections}
            shadeData={shadeData}
            selectedSectionId={selectedSectionId}
            onSectionSelect={handleDiagramSectionSelect}
            className="max-w-5xl mx-auto"
          />
        </div>
      )}

      {/* AI Seat Recommendations Section - Outside Suspense */}
      <div className="mt-8" style={{ display: 'block' }} ref={sectionListRef}>
        {isCalculating ? (
          <div className="flex justify-center items-center p-8">
            <LoadingSpinner message="Calculating sun exposure..." />
          </div>
        ) : sectionsWithSunData && sectionsWithSunData.length > 0 ? (
          <SeatRecommendationsSection
            sections={sectionsWithSunData}
            stadiumId={stadium.id}
            gameTime="13:00"
            gameDate={new Date()}
            rowData={rowData}
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
    </>
  );
}