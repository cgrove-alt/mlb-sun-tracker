'use client';

import dynamic from 'next/dynamic';
import { VENUE_COUNT, MLB_COUNT, MILB_COUNT, NFL_COUNT } from '../src/data/venueCount';
import HomepageSchema from './HomepageSchema';
import Link from 'next/link';
import ShadeFinder, { type FinderPark } from '../src/components/ShadeFinder/ShadeFinder';

// Below-the-fold, non-critical: defer so it never competes with initial paint.
const PWAInstallPrompt = dynamic(() => import('../components/PWAInstallPrompt'), {
  ssr: false,
});

export default function HomePage({ parks }: { parks: FinderPark[] }) {
  return (
    <>
      <HomepageSchema />
      <div>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-headline h1 break-words md:break-normal">
              Will your seats be in the shade?
            </h1>
            <p className="hero-subheadline max-w-prose">
              Pick your ballpark and game to see every section in sun or shade, inning by inning.
            </p>
          </div>
        </section>

        <section className="home-finder" aria-label="Find shaded seats">
          <ShadeFinder parks={parks} />
          <p className="home-finder__other">
            Going to an NFL or minor league game? <Link href="/seats-shade-finder">Use the full stadium finder</Link>.
          </p>
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
            The Shadium covers {VENUE_COUNT} venues across Major League Baseball (all {MLB_COUNT} ballparks), Minor League
            Baseball ({MILB_COUNT} parks), and the NFL ({NFL_COUNT} stadiums). For every MLB ballpark, pick your game to see
            which sections are in the shade, from first pitch to the final out.
          </p>

          {/* What the tool actually accounts for — i.e. why its answer differs
              from the usual "just sit on the third-base side" advice. */}
          <ul className="home-features">
            <li className="home-features__item">
              <span className="home-features__icon" aria-hidden="true">🧭</span>
              <span>
                <strong>Each ballpark&apos;s real layout.</strong> Every park faces its own direction,
                measured from aerial photos, and the map uses its real seating sections.
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
                <strong>Decks and roofs count.</strong> Rows under an upper deck or roof are shaded
                even at noon, and every answer says how sure we are.
              </span>
            </li>
            <li className="home-features__item">
              <span className="home-features__icon" aria-hidden="true">🌤️</span>
              <span>
                <strong>The whole game, not just first pitch.</strong> Shade moves as the sun drops,
                so each section shows sun or shade every half hour, labelled by inning.
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
                Pick a ballpark and a game. We work out where the sun is for each half hour of the
                game and which rows their own stand, deck or roof keeps out of it. <Link href="/how-it-works">How it works</Link>.
              </p>
            </div>
          </div>
        </section>

        <PWAInstallPrompt />
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          background: #0c447c;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 32px 16px 20px;
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
          padding: 0;
          color: white;
          text-align: center;
        }

        .hero-headline {
          font-size: clamp(1.75rem, 6vw, 3rem);
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.75rem;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .hero-subheadline {
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          color: #ffffff;
          margin-bottom: 0;
          opacity: 0.95;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 400;
          line-height: 1.6;
        }

        .home-finder {
          background: #ffffff;
          padding: 8px 0 24px;
        }
        .home-finder__other {
          max-width: 640px;
          margin: 0 auto;
          padding: 0 16px;
          font-size: 14px;
          color: #4b5563;
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
