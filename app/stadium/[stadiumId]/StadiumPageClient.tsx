'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { getSunPosition } from '../../../src/utils/sunCalculations';
import { useSunCalculations } from '../../../src/hooks/useSunCalculations';

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
  }, [stadium.id]);
  
  // Use Web Worker for sun calculations
  const { 
    data: sectionsWithSunData, 
    isLoading: isCalculating 
  } = useSunCalculations({
    stadium,
    sunPosition,
    sections,
    enabled: !!sections.length,
  });

  return (
    <>
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
            gameTime="13:00"
            gameDate={new Date()}
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