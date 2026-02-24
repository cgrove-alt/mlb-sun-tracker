// Server Component - Statically generated at build time
import { Suspense } from 'react';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { HomePageSkeleton } from '../src/components/SkeletonScreens';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import HomepageSchema from './HomepageSchema';
import Link from 'next/link';
import { HeroSection } from '../src/components/HeroSection/HeroSection';
import { HowItWorks } from '../src/components/HowItWorks/HowItWorks';
import { WorldCupShowcase } from '../src/components/WorldCupShowcase/WorldCupShowcase';
import VenueDataProvider from '../components/VenueDataProvider';

export default function HomePage() {
  return (
    <>
      <HomepageSchema />
      <main>
        {/* Hero Section - Client Component but minimal JS */}
        <HeroSection />

        {/* How It Works - Can be Server Component */}
        <HowItWorks />

        {/* World Cup Showcase - Can be Server Component */}
        <WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />

        {/* SEO Content - Server rendered */}
        <div className="sr-only">
          <h2>Find Shaded Seats at MLB, MiLB & NFL Stadiums - Are My Seats in the Shade?</h2>
          <p>
            Wondering "are my seats in the shade?" or "are my seats shaded?" at your favorite sports venue?
            The Shadium helps you find the best shaded seats at over 250 stadiums including all 30 MLB ballparks,
            120 MiLB stadiums, and 32 NFL venues. Our real-time sun tracking technology shows you exactly which
            sections will be in the shade during any game time.
          </p>

          <h3>Check If Your Seats Are Shaded at These Popular Venues</h3>
          <ul>
            <li><Link href="/stadium/yankees">Are my seats shaded at Yankee Stadium? (MLB)</Link></li>
            <li><Link href="/stadium/dodgers">Find shaded seats at Dodger Stadium (MLB)</Link></li>
            <li><Link href="/venue/metlife-stadium">Shaded sections at MetLife Stadium (NFL)</Link></li>
            <li><Link href="/venue/las-vegas-ballpark">Las Vegas Ballpark shade finder (MiLB)</Link></li>
            <li><Link href="/venue/sofi-stadium">SoFi Stadium sun exposure guide (NFL)</Link></li>
          </ul>

          <h3>How to Know If Your Seats Are in the Shade</h3>
          <p>
            Simply select your stadium from our database of 250+ MLB, MiLB, and NFL venues and choose your
            game time to see which sections are shaded. Our advanced calculations consider sun angle, stadium
            orientation, roof coverage, and time of day to show you exactly where the shade will be during your game.
          </p>
        </div>

        {/* Venue Selector - Server fetches data, client handles interaction */}
        <div id="app-section">
          <ErrorBoundary level="section">
            <Suspense fallback={<HomePageSkeleton />}>
              <VenueDataProvider />
            </Suspense>
          </ErrorBoundary>
        </div>

        <PWAInstallPrompt />
      </main>
    </>
  );
}
