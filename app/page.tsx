'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import LoadingSpinner from '../components/LoadingSpinner';
import HomepageSchema from './HomepageSchema';

// Use the full App component
const App = dynamic(() => import('../src/App'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function Home() {
  return (
    <>
      <HomepageSchema />
      <main>
        <Suspense fallback={<LoadingSpinner />}>
          <App />
        </Suspense>
        <PWAInstallPrompt />
      </main>
    </>
  );
}