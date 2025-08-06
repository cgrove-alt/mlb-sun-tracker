'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';
import { LoadingSpinner } from '../src/components/LoadingSpinner';

const WebGLStadiumVisualization = dynamic(
  () => import('./WebGLStadiumVisualization'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false,
  }
);

interface LazyThreeVisualizationProps {
  stadium: any;
  sunPosition: any;
  selectedSection?: string;
  onSectionClick?: (section: string) => void;
  enableInteraction?: boolean;
  gameDateTime?: Date;
}

export default function LazyThreeVisualization(props: LazyThreeVisualizationProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    // Load Three.js after initial page load or on user interaction
    const loadTimer = setTimeout(() => {
      setShouldLoad(true);
    }, 2000); // 2 second delay

    const handleInteraction = () => {
      if (!hasInteracted) {
        setHasInteracted(true);
        setShouldLoad(true);
      }
    };

    // Load on scroll or click
    window.addEventListener('scroll', handleInteraction, { once: true });
    window.addEventListener('click', handleInteraction, { once: true });
    window.addEventListener('touchstart', handleInteraction, { once: true });

    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, [hasInteracted]);

  if (!shouldLoad) {
    return (
      <div className="three-visualization-placeholder" style={{
        minHeight: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '8px',
        color: 'white',
        fontSize: '18px',
        cursor: 'pointer'
      }} onClick={() => setShouldLoad(true)}>
        <div>
          <LoadingSpinner />
          <p style={{ marginTop: '16px' }}>Click to load 3D stadium view</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <WebGLStadiumVisualization 
        {...props} 
        gameDateTime={props.gameDateTime || new Date()}
      />
    </Suspense>
  );
}