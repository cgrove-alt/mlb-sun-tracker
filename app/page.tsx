'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import LoadingSpinner from '../components/LoadingSpinner';

// Dynamically import the main app component to avoid SSR issues
const MLBSunTrackerApp = dynamic(() => import('../components/MLBSunTrackerApp'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function Home() {
  return (
    <main>
      <Suspense fallback={<LoadingSpinner />}>
        <MLBSunTrackerApp />
      </Suspense>
      <PWAInstallPrompt />
    </main>
  );
}