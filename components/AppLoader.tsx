'use client';

import dynamic from 'next/dynamic';
import { HomePageSkeleton } from '../src/components/SkeletonScreens';

// Client-side only dynamic import for UnifiedApp
const App = dynamic(() => import('../src/UnifiedApp'), {
  ssr: false,
  loading: () => <HomePageSkeleton />,
});

export default function AppLoader() {
  return <App />;
}
