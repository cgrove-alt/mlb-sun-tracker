'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { getSunPosition } from '../../../src/utils/sunCalculations';
import { useSunCalculations } from '../../../src/hooks/useSunCalculations';
import { usePullToRefresh } from '../../../src/hooks/usePullToRefresh';
import { PullToRefreshIndicator } from '../../../src/components/PullToRefreshIndicator';
import { StadiumDiagram, SectionShadeData } from '../../../src/components/StadiumDiagram/StadiumDiagram';
import { getStadiumCompleteData } from '../../../src/data/stadium-data-aggregator';
import { DataFreshness } from '../../../src/components/DataFreshness';
import { getStadiumLastUpdated } from '../../../src/data/stadium-data-freshness';
import { ReportInaccuracyButton } from '../../../src/components/ReportInaccuracy/ReportInaccuracyButton';
import { TimeSlider } from '../../../src/components/TimeSlider/TimeSlider';
import { FindMyShadeWizard } from '../../../src/components/FindMyShade/FindMyShadeWizard';
import { SectionDetailSheet } from '../../../src/components/SectionDetailSheet';

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
  const [showReportModal, setShowReportModal] = useState(false);
  const [gameHour, setGameHour] = useState(13);
  const [mobileSheetSection, setMobileSheetSection] = useState<string | null>(null);
  const sectionListRef = useRef<HTMLDivElement>(null);

  // Debug: Log what's being rendered
  console.log('StadiumPageClient rendering:', {
    stadiumId: stadium?.id,
    useComprehensive,
    hasGuide: !!guide
  });

  // Calculate sun position based on selected game hour
  const sunPosition = useMemo(() => {
    const gameDateTime = new Date();
    const hours = Math.floor(gameHour);
    const minutes = Math.round((gameHour - hours) * 60);
    gameDateTime.setHours(hours, minutes, 0, 0);

    return getSunPosition(
      gameDateTime,
      stadium.latitude || 40.7128,
      stadium.longitude || -74.0060,
      stadium.timezone || 'America/New_York'
    );
  }, [stadium.id, refreshKey, gameHour]);

  // Use Web Worker for sun calculations with row-level data
  const {
    data: sectionsWithSunData,
    rowData,
    isLoading: isCalculating,
    error: sunCalcError,
    refetch: refetchSunData,
  } = useSunCalculations({
    stadium,
    sunPosition,
    sections,
    enabled: !!sections.length,
    includeRows: true, // Enable row-level calculations
  });

  // Log sun calculation errors
  useEffect(() => {
    if (sunCalcError) {
      console.error('[StadiumPageClient] Sun calculation error:', sunCalcError.message);
    }
  }, [sunCalcError]);

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

    // On mobile, show bottom sheet instead of scrolling
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileSheetSection(sectionId);
      return;
    }

    // On desktop, scroll to the section card in the list
    if (sectionListRef.current) {
      const sectionCard = sectionListRef.current.querySelector(`[data-section-id="${sectionId}"]`);
      if (sectionCard) {
        sectionCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
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

      {/* Data Freshness Indicator */}
      <div className="container mx-auto px-4 mt-6 max-w-5xl">
        <DataFreshness
          lastUpdated={getStadiumLastUpdated(stadium.id) || undefined}
          stadiumName={stadium.name}
          showReportLink={true}
          onReportClick={() => setShowReportModal(true)}
        />
      </div>

      {/* Report Inaccuracy Button - Floating on mobile, inline on desktop */}
      <div className="container mx-auto px-4 mt-4 max-w-5xl">
        <div className="flex justify-end">
          <ReportInaccuracyButton
            stadiumId={stadium.id}
            stadiumName={stadium.name}
            variant="secondary"
            size="md"
          />
        </div>
      </div>

      {/* Find My Shade Wizard */}
      <div className="container mx-auto px-4 mt-6 max-w-5xl">
        <FindMyShadeWizard
          stadiumId={stadium.id}
          onViewOnMap={(sectionId) => {
            setSelectedSectionId(sectionId);
            const diagramEl = document.querySelector('.stadium-diagram-wrapper');
            if (diagramEl) diagramEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />
      </div>

      {/* Stadium Diagram - Skeleton while loading */}
      {(!stadiumCompleteData || stadiumCompleteData.sections.length === 0) && (
        <div className="stadium-diagram-wrapper mt-8 mb-8">
          <div style={{
            height: '300px', background: '#f1f5f9', borderRadius: '0.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: '200px', height: '140px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #e2e8f0, #f1f5f9)',
              animation: 'pulse 1.5s ease-in-out infinite',
            }} />
          </div>
        </div>
      )}

      {/* Stadium Diagram - Interactive shade visualization */}
      {stadiumCompleteData && stadiumCompleteData.sections.length > 0 && (
        <div className="stadium-diagram-wrapper mt-8 mb-8">
          <div className="diagram-header mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Interactive Stadium Map</h2>
            <p className="text-sm text-gray-600 mt-1">
              Click any section to see detailed shade information and scroll to its details below
            </p>
          </div>
          <TimeSlider
            value={gameHour}
            onChange={setGameHour}
            stadiumTimezone={stadium.timezone}
            disabled={isCalculating}
          />
          <div style={{ position: 'relative', marginTop: '1rem' }}>
            <StadiumDiagram
              sections={stadiumCompleteData.sections}
              shadeData={shadeData}
              selectedSectionId={selectedSectionId}
              onSectionSelect={handleDiagramSectionSelect}
              sunAzimuthDegrees={sunPosition.azimuthDegrees}
              className="max-w-5xl mx-auto"
            />
            {isCalculating && (
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(255,255,255,0.7)', borderRadius: '0.5rem',
                zIndex: 10
              }}>
                <span style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: 500 }}>Updating shade...</span>
              </div>
            )}
          </div>
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
            gameTime={`${Math.floor(gameHour)}:${Math.round((gameHour - Math.floor(gameHour)) * 60).toString().padStart(2, '0')}`}
            gameDate={new Date()}
            rowData={rowData}
            selectedSectionId={selectedSectionId}
          />
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-lg">
            <div className="text-gray-600 mb-2">
              AI Recommendations Unavailable
            </div>
            <p className="text-sm text-gray-500 mb-4">
              {sunCalcError
                ? `Calculation error: ${sunCalcError.message}`
                : 'Sun exposure data could not be calculated for this stadium. Basic section information is still available above.'}
            </p>
            <button
              onClick={() => refetchSunData()}
              className="px-4 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors"
            >
              Retry Calculation
            </button>
          </div>
        )}
      </div>

      {/* Mobile Section Detail Bottom Sheet */}
      {mobileSheetSection && (() => {
        const shadeEntry = shadeData.find(d => d.sectionId === mobileSheetSection);
        const sectionInfo = stadiumCompleteData?.sections.find(s => s.id === mobileSheetSection);
        const sectionRowData = rowData?.find(r => r.sectionId === mobileSheetSection) || null;
        return (
          <SectionDetailSheet
            isOpen={!!mobileSheetSection}
            onClose={() => setMobileSheetSection(null)}
            sectionName={sectionInfo?.name || mobileSheetSection}
            shadePercentage={shadeEntry?.shadePercentage ?? 50}
            rowData={sectionRowData}
            onSeeDetails={() => {
              setMobileSheetSection(null);
              if (sectionListRef.current) {
                const card = sectionListRef.current.querySelector(`[data-section-id="${mobileSheetSection}"]`);
                if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
          />
        );
      })()}
    </>
  );
}