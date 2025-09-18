'use client';

import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

// Lazy load the heavy 3D component
const Stadium3DVisualization = lazy(() => 
  import('./Stadium3DVisualization').then(module => ({
    default: module.Stadium3DVisualization
  }))
);

interface Lazy3DVisualizationProps {
  stadium: any;
  sunPosition: any;
  sections?: any[];
  showPreview?: boolean;
}

export const Lazy3DVisualization: React.FC<Lazy3DVisualizationProps> = ({
  stadium,
  sunPosition,
  sections = [],
  showPreview = true,
}) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create intersection observer to detect when component is near viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // Load component when user is close (within 200px)
            if (!shouldLoad) {
              setShouldLoad(true);
            }
          }
        });
      },
      {
        // Start loading when component is 200px away from viewport
        rootMargin: '200px',
        threshold: 0.01,
      }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [shouldLoad]);
  
  return (
    <div ref={containerRef} className="lazy-3d-container">
      {!shouldLoad ? (
        // Show lightweight preview or placeholder
        <div className="visualization-placeholder">
          <div className="placeholder-content">
            <svg 
              width="100%" 
              height="400" 
              viewBox="0 0 800 400"
              className="stadium-preview"
            >
              {/* Simple SVG stadium outline */}
              <rect x="100" y="100" width="600" height="200" rx="20" 
                fill="none" stroke="#e0e0e0" strokeWidth="2"/>
              <circle cx="400" cy="200" r="50" 
                fill="none" stroke="#e0e0e0" strokeWidth="2"/>
              <text x="400" y="350" textAnchor="middle" 
                fill="#666" fontSize="18">
                3D Visualization
              </text>
            </svg>
            <button 
              onClick={() => setShouldLoad(true)}
              className="load-3d-btn"
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                background: '#2196f3',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
              }}
            >
              Load 3D View
            </button>
          </div>
        </div>
      ) : (
        // Load the actual 3D component
        <Suspense 
          fallback={
            <div className="visualization-loading">
              <LoadingSpinner message="Loading 3D visualization..." />
            </div>
          }
        >
          <Stadium3DVisualization
            sections={sections}
            obstructions={[]}
            sunPosition={sunPosition}
            currentTime={new Date()}
            showSunPath={true}
            showShadows={true}
            showLabels={false}
          />
        </Suspense>
      )}
    </div>
  );
};

export default Lazy3DVisualization;