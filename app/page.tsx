'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import LoadingSpinner from '../components/LoadingSpinner';

// TEMPORARY: Using minimal app to debug freeze issue
// const App = dynamic(() => import('../src/App'), {
//   ssr: false,
//   loading: () => <LoadingSpinner />,
// });
const App = dynamic(() => import('../src/AppMinimal'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
});

export default function Home() {
  return (
    <main>
      <Suspense fallback={<LoadingSpinner />}>
        <App />
      </Suspense>
      <PWAInstallPrompt />
    </main>
  );
}