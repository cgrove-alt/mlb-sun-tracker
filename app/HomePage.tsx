'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import { VENUE_COUNT, MLB_COUNT, MILB_COUNT, NFL_COUNT } from '../src/data/venueCount';
import { HomePageSkeleton } from '../src/components/SkeletonScreens';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import HomepageSchema from './HomepageSchema';
import Link from 'next/link';

// Use the unified App component that supports multiple leagues
const App = dynamic(() => import('../src/UnifiedApp'), {
  ssr: false,
  loading: () => <HomePageSkeleton />,
});

// Below-the-fold, non-critical: defer so it never competes with initial paint.
const PWAInstallPrompt = dynamic(() => import('../components/PWAInstallPrompt'), {
  ssr: false,
});

export default function HomePage() {
  const [showApp, setShowApp] = useState(false);

  const handleCTAClick = () => {
    setShowApp(true);
    // After the app reveals, land the user directly on the stadium picker and
    // focus it so the next step is obvious — not the top of a section that can
    // look empty. Falls back to the app section if the dynamic app hasn't
    // finished mounting yet (focus is then simply skipped, no harm).
    setTimeout(() => {
      const venueInput = document.getElementById('venue-select');
      const target = venueInput?.closest('.control-group') || document.getElementById('app-section');
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      venueInput?.focus({ preventScroll: true });
    }, 200);
  };

  return (
    <>
      <HomepageSchema />
      <div>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-headline h1 break-words md:break-normal">
              Find Seats in the Shade
            </h1>
            <p className="hero-subheadline max-w-prose">
              Avoid the sun and enjoy the game in comfort at any MLB, NFL, or MiLB stadium
            </p>
            <button 
              onClick={handleCTAClick}
              className="hero-cta-button"
            >
              Select Your Stadium
            </button>
          </div>
        </section>

        {/*
          This section used to be `className="sr-only"` — the venue counts, the
          methodology summary and the popular-venue links were written for
          crawlers and screen readers but hidden from sighted users, leaving the
          homepage as just a headline, one line of copy and a button. It is real
          content that answers "what is this and does it cover my team", so it
          is now visible to everyone. The markup is unchanged, only the
          presentation.
        */}
        <section className="home-intro" aria-labelledby="home-intro-title">
          <h2 id="home-intro-title" className="home-intro__title">
            Find Shaded Seats at MLB, MiLB &amp; NFL Stadiums
          </h2>
          <p className="home-intro__lead">
            The Shadium provides sun-position context and seating information for {VENUE_COUNT} venues across Major League
            Baseball (all {MLB_COUNT} ballparks), Minor League Baseball ({MILB_COUNT} parks), and the NFL ({NFL_COUNT} stadiums).
            Pick your stadium and game time to see the available evidence and its measurement limits.
          </p>

          {/* What the tool actually accounts for — i.e. why its answer differs
              from the usual "just sit on the third-base side" advice. */}
          <ul className="home-features">
            <li className="home-features__item">
              <span className="home-features__icon" aria-hidden="true">🧭</span>
              <span>
                <strong>Park-specific orientation.</strong> Direction differs by venue and its
                recorded precision is disclosed rather than treated as exact.
              </span>
            </li>
            <li className="home-features__item">
              <span className="home-features__icon" aria-hidden="true">🕐</span>
              <span>
                <strong>Your actual first pitch.</strong> Sun position is computed for the real game
                time in the stadium&apos;s own timezone, so a 1:05pm start and a 7:10pm start give
                different answers.
              </span>
            </li>
            <li className="home-features__item">
              <span className="home-features__icon" aria-hidden="true">🏟️</span>
              <span>
                <strong>Geometry confidence.</strong> Source-backed section identity is kept separate
                from modeled rows, roofs, decks, and overhangs. Unvalidated seat-level results are withheld.
              </span>
            </li>
            <li className="home-features__item">
              <span className="home-features__icon" aria-hidden="true">🌤️</span>
              <span>
                <strong>Game-day weather.</strong> Forecast cloud cover is folded in, because an
                overcast afternoon changes what a &quot;sunny seat&quot; actually means.
              </span>
            </li>
          </ul>

          <div className="home-intro__grid">
            <div className="home-intro__col">
              <h3 className="home-intro__subtitle">Popular venue shade guides</h3>
              <ul className="home-intro__links">
                <li><Link href="/stadium/yankees">Are my seats shaded at Yankee Stadium? (MLB)</Link></li>
                <li><Link href="/stadium/dodgers">Find shaded seats at Dodger Stadium (MLB)</Link></li>
                <li><Link href="/stadium/metlife-stadium-giants">Shaded sections at MetLife Stadium (NFL)</Link></li>
                <li><Link href="/stadium/las-vegas-aviators">Las Vegas Ballpark shade finder (MiLB)</Link></li>
                <li><Link href="/stadium/sofi-stadium-rams">SoFi Stadium sun exposure guide (NFL)</Link></li>
              </ul>
            </div>

            <div className="home-intro__col">
              <h3 className="home-intro__subtitle">How it works</h3>
              <p>
                Choose a stadium and game time to see sun angle, orientation context, roof status,
                weather, and the field-level data confidence. <Link href="/how-it-works">Read the full methodology</Link>.
              </p>
            </div>
          </div>
        </section>

        <div id="app-section" className={showApp ? 'app-visible' : 'app-hidden'}>
          <ErrorBoundary level="section">
            <Suspense fallback={<HomePageSkeleton />}>
              <App />
            </Suspense>
          </ErrorBoundary>
        </div>
        <PWAInstallPrompt />
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 2rem;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 800px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 24px;
          padding: 3rem 2rem;
          color: white;
          animation: fadeInUp 1s ease-out;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          text-align: center;
        }

        .hero-headline {
          font-size: clamp(2.5rem, 5vw, 4.5rem);
          font-weight: 700;
          margin-bottom: 1.5rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .hero-subheadline {
          font-size: clamp(1.125rem, 2.5vw, 1.375rem);
          margin-bottom: 3rem;
          opacity: 0.95;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 400;
          line-height: 1.6;
        }

        .hero-cta-button {
          background: white;
          color: #0f766e;
          border: none;
          padding: 1rem 2.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          letter-spacing: -0.01em;
        }

        .hero-cta-button:hover {
          transform: translateY(-2px);
          background: #f8fafc;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.15), 0 4px 6px -2px rgba(0, 0, 0, 0.08);
        }

        .hero-cta-button:active {
          transform: translateY(0) scale(1);
        }

        #app-section {
          transition: opacity 0.5s ease-in-out, transform 0.5s ease-in-out;
        }

        .app-hidden {
          opacity: 0;
          transform: translateY(20px);
          display: none;
        }

        .app-visible {
          opacity: 1;
          transform: translateY(0);
          display: block;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        /* Floating animation for subtle movement */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        /* Add floating particles effect */
        .hero-section::after {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: float 20s ease-in-out infinite;
          opacity: 0.3;
          z-index: 0;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
          /* Disable animations on mobile to prevent shimmering */
          .hero-section {
            animation: none;
            background-size: 100% 100%;
            background-position: 50% 50%;
          }
          
          /* Hide floating particles on mobile */
          .hero-section::after {
            display: none;
          }
          
          /* Optimize backdrop filter for mobile */
          .hero-content {
            padding: 2rem 1.5rem;
            border-radius: 20px;
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            /* Disable entrance animation on mobile */
            animation: none;
            /* Add hardware acceleration */
            transform: translateZ(0);
            -webkit-transform: translateZ(0);
            backface-visibility: hidden;
            -webkit-backface-visibility: hidden;
          }
          
          .hero-headline {
            font-size: clamp(2rem, 5vw, 3rem);
          }
          
          .hero-cta-button {
            padding: 0.875rem 2rem;
            font-size: 1rem;
          }
        }
        
        /* Tablets - reduce animation complexity */
        @media (min-width: 769px) and (max-width: 1024px) {
          .hero-section {
            animation-duration: 20s;
          }
          
          .hero-section::after {
            animation: none;
            opacity: 0.2;
          }
        }
        
        /* Accessibility: reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-content { animation: none; }
          .hero-cta-button { transition: none; }
          .hero-cta-button::after { display: none; }
          #app-section { transition: none; }
          .hero-section { animation: none; }
          .hero-section::after { animation: none; }
        }
      `}</style>
    </>
  );
}
