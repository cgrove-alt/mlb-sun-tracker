'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { HeroSection } from '../src/components/HeroSection/HeroSection';
import { HowItWorks } from '../src/components/HowItWorks/HowItWorks';
import { WorldCupShowcase } from '../src/components/WorldCupShowcase/WorldCupShowcase';
import { DesktopShadeApp, DesktopShadeAppRef } from '../src/components/DesktopShadeApp';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import Link from 'next/link';

interface HomePageClientProps {
  /** Minimum width for desktop layout */
  desktopBreakpoint?: number;
}

export default function HomePageClient({
  desktopBreakpoint = 1024
}: HomePageClientProps) {
  const desktopAppRef = useRef<DesktopShadeAppRef>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check if screen is desktop width
  useEffect(() => {
    setMounted(true);

    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= desktopBreakpoint);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, [desktopBreakpoint]);

  // Handle "Find Your Shade" button click
  const handleGetStarted = useCallback(() => {
    if (isDesktop && desktopAppRef.current) {
      // Desktop: scroll to and focus the venue selector
      desktopAppRef.current.scrollToSelector();
    } else {
      // Mobile/fallback: scroll to app section
      const appElement = document.getElementById('app-section');
      if (appElement) {
        appElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [isDesktop]);

  // Prevent hydration mismatch by not rendering layout-specific content until mounted
  if (!mounted) {
    return (
      <>
        {/* Hero Section - Always render */}
        <HeroSection />

        {/* How It Works */}
        <HowItWorks />

        {/* World Cup Showcase */}
        <WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />

        {/* SEO Content - Server rendered */}
        <div className="sr-only">
          <h2>Find Shaded Seats at MLB, MiLB & NFL Stadiums - Are My Seats in the Shade?</h2>
          <p>
            Wondering &quot;are my seats in the shade?&quot; or &quot;are my seats shaded?&quot; at your favorite sports venue?
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

        {/* Placeholder for app section */}
        <div id="app-section" style={{ minHeight: '400px' }} />
      </>
    );
  }

  return (
    <>
      {/* Hero Section with Get Started handler */}
      <HeroSection onGetStarted={handleGetStarted} />

      {/* How It Works */}
      <HowItWorks />

      {/* World Cup Showcase */}
      <WorldCupShowcase openingMatchDate={new Date('2026-06-11T12:00:00-07:00')} />

      {/* SEO Content - Server rendered */}
      <div className="sr-only">
        <h2>Find Shaded Seats at MLB, MiLB & NFL Stadiums - Are My Seats in the Shade?</h2>
        <p>
          Wondering &quot;are my seats in the shade?&quot; or &quot;are my seats shaded?&quot; at your favorite sports venue?
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

      {/* App Section - Desktop uses DesktopShadeApp */}
      <div id="app-section">
        {isDesktop ? (
          <ErrorBoundary level="section">
            <DesktopShadeApp ref={desktopAppRef} />
          </ErrorBoundary>
        ) : (
          /* Mobile users see the existing card-based selector - VenueDataProvider
             is still rendered by the server, we just need to include it here for mobile */
          <div id="mobile-venue-selector">
            {/* Mobile content will be handled by VenueDataProvider from server */}
          </div>
        )}
      </div>
    </>
  );
}
