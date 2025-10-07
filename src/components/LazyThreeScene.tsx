'use client';

import React, { Suspense, lazy, useState, useEffect } from 'react';

// Lazy load the Three.js stadium component
const StadiumSunPathViewer = lazy(() =>
  import(/* webpackChunkName: "three-stadium" */ './StadiumSunPathViewer')
);

import { Stadium } from '../data/stadiums';
import { DetailedSection, Obstruction3D } from '../types/stadium-complete';

interface LazyThreeSceneProps {
  stadium: Stadium;
  sections: DetailedSection[];
  obstructions: Obstruction3D[];
  date?: Date;
  time?: string;
  fallback?: React.ReactNode;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  preload?: boolean;
}

// Loading placeholder component
function ThreeSceneLoader() {
  return (
    <div className="three-scene-loader">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading 3D visualization...</p>
      </div>
      <style jsx>{`
        .three-scene-loader {
          width: 100%;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 8px;
        }

        .loading-container {
          text-align: center;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          margin: 0 auto 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .loading-text {
          color: white;
          font-size: 16px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

// Error boundary for Three.js scene
class ThreeSceneErrorBoundary extends React.Component<
  { children: React.ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; onError?: (error: Error) => void }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error) {
    console.error('Three.js scene error:', error);
    if (this.props.onError) {
      this.props.onError(error);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="three-scene-error">
          <h3>Unable to load 3D visualization</h3>
          <p>Please try refreshing the page or use the 2D view.</p>
          <style jsx>{`
            .three-scene-error {
              padding: 40px;
              text-align: center;
              background: #fef2f2;
              border: 1px solid #fecaca;
              border-radius: 8px;
              color: #991b1b;
            }

            .three-scene-error h3 {
              margin: 0 0 10px 0;
              font-size: 18px;
            }

            .three-scene-error p {
              margin: 0;
              font-size: 14px;
            }
          `}</style>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function LazyThreeScene({
  stadium,
  sections,
  obstructions,
  date,
  time,
  fallback,
  onLoad,
  onError,
  preload = false,
}: LazyThreeSceneProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (preload) {
      setShouldLoad(true);
      return;
    }

    // Use Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setShouldLoad(true);
          }
        });
      },
      {
        rootMargin: '100px', // Start loading 100px before coming into view
        threshold: 0.01,
      }
    );

    // Create a placeholder element to observe
    const placeholder = document.getElementById(`three-scene-${stadium.id}`);
    if (placeholder) {
      observer.observe(placeholder);
    }

    return () => {
      if (placeholder) {
        observer.unobserve(placeholder);
      }
      observer.disconnect();
    };
  }, [stadium.id, preload]);

  // Handle successful load
  useEffect(() => {
    if (shouldLoad && onLoad) {
      // Give it a moment for the component to actually load
      const timer = setTimeout(onLoad, 100);
      return () => clearTimeout(timer);
    }
  }, [shouldLoad, onLoad]);

  if (!shouldLoad) {
    return (
      <div
        id={`three-scene-${stadium.id}`}
        className="three-scene-placeholder"
        style={{
          width: '100%',
          height: '400px',
          background: '#f3f4f6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#6b7280' }}>3D view will load when scrolled into view</p>
      </div>
    );
  }

  return (
    <ThreeSceneErrorBoundary onError={onError}>
      <Suspense fallback={fallback || <ThreeSceneLoader />}>
        <StadiumSunPathViewer
          stadium={stadium}
          sections={sections}
          obstructions={obstructions}
          initialDate={date || new Date()}
          initialTime={time || '13:00'}
        />
      </Suspense>
    </ThreeSceneErrorBoundary>
  );
}

// Preload Three.js bundle
export function preloadThreeBundle() {
  // Start loading the Three.js chunk in the background
  import(/* webpackChunkName: "three-stadium" */ './StadiumSunPathViewer').catch(() => {
    // Silently fail preload
  });
}

// Hook to preload Three.js when idle
export function useThreePreload() {
  useEffect(() => {
    // Use requestIdleCallback if available
    if ('requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(() => {
        preloadThreeBundle();
      });

      return () => {
        if ('cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(handle);
        }
      };
    } else {
      // Fallback to setTimeout
      const timer = setTimeout(() => {
        preloadThreeBundle();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);
}