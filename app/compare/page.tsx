import { Metadata } from 'next';
import { Suspense } from 'react';
import ComparePageClient from './ComparePageClient';
import { LoadingSpinner } from '../../src/components/LoadingSpinner';

export const metadata: Metadata = {
  title: 'Compare Seats | MLB Sun Tracker',
  description: 'Compare up to 4 seats side-by-side to find the perfect seat for your game',
  openGraph: {
    title: 'Compare Seats | MLB Sun Tracker',
    description: 'Compare up to 4 seats side-by-side to find the perfect seat for your game',
    type: 'website',
  },
};

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-screen">
          <LoadingSpinner message="Loading comparison..." />
        </div>
      }
    >
      <ComparePageClient />
    </Suspense>
  );
}
