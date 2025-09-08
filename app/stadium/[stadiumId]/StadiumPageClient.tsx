'use client';

import dynamic from 'next/dynamic';
import { Suspense, useMemo } from 'react';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';
import { calculateDetailedSectionSunExposure, getSunPosition } from '../../../src/utils/sunCalculations';
import { MLB_STADIUMS } from '../../../src/data/stadiums';

const ComprehensiveStadiumGuide = dynamic(
  () => import('../../../src/components/ComprehensiveStadiumGuide'),
  {
    loading: () => <LoadingSpinner />,
    ssr: true,
  }
);

const StadiumGuide = dynamic(
  () => import('../../../src/components/StadiumGuideLazy'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

const StadiumVisualizationSection = dynamic(
  () => import('../../../src/components/StadiumVisualizationSection'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
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

  // Calculate sections with sun exposure data for recommendations
  const sectionsWithSunData = useMemo(() => {
    try {
      // Find the full stadium data for calculations
      const fullStadium = MLB_STADIUMS.find(s => s.id === stadium.id);
      if (!fullStadium) {
        console.error('Stadium not found for sun calculations:', stadium.id);
        return [];
      }

      // Calculate sun position for current time (13:00 default game time)
      const gameDateTime = new Date();
      gameDateTime.setHours(13, 0, 0, 0); // 1:00 PM game time
      
      const sunPosition = getSunPosition(
        gameDateTime, 
        fullStadium.latitude, 
        fullStadium.longitude, 
        fullStadium.timezone
      );

      // Calculate detailed sun exposure for all sections
      const sectionsWithSun = calculateDetailedSectionSunExposure(
        fullStadium, 
        sunPosition
      );

      console.log('Calculated sun data for', sectionsWithSun.length, 'sections');
      return sectionsWithSun;
    } catch (error) {
      console.error('Failed to calculate sun data:', error);
      return [];
    }
  }, [stadium.id]); // Only recalculate if stadium changes

  return (
    <>
      <Suspense fallback={<LoadingSpinner />}>
        {useComprehensive ? (
          <ComprehensiveStadiumGuide 
            stadiumId={stadium.id}
          />
        ) : (
          <StadiumGuide 
            stadium={stadium}
            sections={sections}
            amenities={amenities}
          />
        )}
      </Suspense>
      
      {/* AI Seat Recommendations Section */}
      <div className="mt-8" style={{ display: 'block' }}>
        <Suspense fallback={
          <div className="text-center p-8">
            <LoadingSpinner />
            <p>Loading AI Recommendations...</p>
          </div>
        }>
          {sectionsWithSunData.length > 0 ? (
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
        </Suspense>
      </div>

      {/* 3D Visualization Section - Always render */}
      <div className="mt-8" style={{ display: 'block' }}>
        <Suspense fallback={
          <div className="text-center p-8">
            <LoadingSpinner />
            <p>Loading 3D Visualization...</p>
          </div>
        }>
          <StadiumVisualizationSection 
            stadium={stadium}
            defaultDate={new Date()}
            defaultTime="13:00"
          />
        </Suspense>
      </div>
    </>
  );
}