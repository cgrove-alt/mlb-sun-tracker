// Server Component - Statically generated at build time
import { Suspense } from 'react';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { HomePageSkeleton } from '../src/components/SkeletonScreens';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import HomepageSchema from './HomepageSchema';
import HomePageClient from './HomePageClient';
import VenueDataProvider from '../components/VenueDataProvider';

export default function HomePage() {
  return (
    <>
      <HomepageSchema />
      <main>
        {/* Client wrapper handles desktop/mobile layout and interactions */}
        <HomePageClient />

        {/* Fallback: Mobile venue selector from server
            The client component will hide this on desktop via CSS */}
        <div id="mobile-venue-provider" className="desktop-hidden">
          <ErrorBoundary level="section">
            <Suspense fallback={<HomePageSkeleton />}>
              <VenueDataProvider />
            </Suspense>
          </ErrorBoundary>
        </div>

        <PWAInstallPrompt />
      </main>

      {/* Global styles for desktop/mobile visibility */}
      <style>{`
        @media (min-width: 1024px) {
          .desktop-hidden {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
