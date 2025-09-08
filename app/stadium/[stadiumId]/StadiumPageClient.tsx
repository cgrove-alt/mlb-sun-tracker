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
  () => import('../../../components/StadiumVisualizationSection'),
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
      
      {/* Add 3D Visualization Section */}
      <Suspense fallback={<LoadingSpinner />}>
        <div className="mt-8">
          <StadiumVisualizationSection 
            stadium={stadium}
            defaultDate={new Date()}
            defaultTime="13:00"
          />
        </div>
      </Suspense>
    </>
  );
}