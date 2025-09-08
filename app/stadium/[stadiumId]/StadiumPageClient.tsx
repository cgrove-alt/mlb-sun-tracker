'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { LoadingSpinner } from '../../../src/components/LoadingSpinner';

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