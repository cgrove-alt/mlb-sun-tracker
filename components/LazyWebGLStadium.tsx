'use client';

import React, { lazy, Suspense } from 'react';
import { LoadingSpinner } from '../src/components/LoadingSpinner';
import { Stadium } from '../src/data/stadiums';

// Lazy load the WebGL component only when needed
const OptimizedWebGLStadium = lazy(() => 
  import('./OptimizedWebGLStadium').then(module => ({
    default: module.default
  }))
);

interface LazyWebGLStadiumProps {
  stadium: Stadium;
  sunPosition: { azimuthDegrees: number; altitudeDegrees: number };
  gameDateTime: Date;
  selectedSections?: string[];
  onSectionClick?: (sectionId: string) => void;
}

export default function LazyWebGLStadium(props: LazyWebGLStadiumProps) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <LoadingSpinner />
      </div>
    }>
      <OptimizedWebGLStadium {...props} />
    </Suspense>
  );
}