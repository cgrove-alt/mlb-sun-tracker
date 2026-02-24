'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { HomePageSkeleton } from '../src/components/SkeletonScreens';

// Dynamically import the app only when it's about to be visible
const UnifiedApp = dynamic(() => import('../src/UnifiedApp'), {
  ssr: false,
  loading: () => <HomePageSkeleton />,
});

export default function LazyApp() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only load the app when the container is about to become visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        // Start loading when the element is 500px away from viewport
        rootMargin: '500px',
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {shouldLoad ? <UnifiedApp /> : <HomePageSkeleton />}
    </div>
  );
}
