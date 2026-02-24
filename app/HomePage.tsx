'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { HomePageSkeleton } from '../src/components/SkeletonScreens';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import HomepageSchema from './HomepageSchema';
import Link from 'next/link';

// Use the unified App component that supports multiple leagues
const App = dynamic(() => import('../src/UnifiedApp'), {
  ssr: false,
  loading: () => <HomePageSkeleton />,
});

export default function HomePage() {
  const [showApp, setShowApp] = useState(false);

  const handleCTAClick = () => {
    setShowApp(true);
    setTimeout(() => {
      const appElement = document.getElementById('app-section');
      if (appElement) {
        appElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <>
      <HomepageSchema />
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-headline h1 break-words md:break-normal">
              Find Your Shade
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

        {/* Featured stadiums - visible SSR content for SEO and fast FCP */}
        {!showApp && (
          <section className="featured-section">
            <h2 className="featured-heading">Popular Stadiums</h2>
            <p className="featured-subtext">
              Find the best shaded seats at over 250 MLB, NFL, and MiLB venues
            </p>
            <div className="featured-grid">
              {[
                { id: 'yankees', name: 'Yankee Stadium', team: 'New York Yankees', league: 'MLB' },
                { id: 'dodgers', name: 'Dodger Stadium', team: 'Los Angeles Dodgers', league: 'MLB' },
                { id: 'cubs', name: 'Wrigley Field', team: 'Chicago Cubs', league: 'MLB' },
                { id: 'redsox', name: 'Fenway Park', team: 'Boston Red Sox', league: 'MLB' },
                { id: 'giants', name: 'Oracle Park', team: 'San Francisco Giants', league: 'MLB' },
                { id: 'rangers', name: 'Globe Life Field', team: 'Texas Rangers', league: 'MLB' },
              ].map(s => (
                <Link key={s.id} href={`/stadium/${s.id}`} className="featured-card">
                  <span className="featured-league">{s.league}</span>
                  <h3 className="featured-name">{s.name}</h3>
                  <p className="featured-team">{s.team}</p>
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button onClick={handleCTAClick} className="hero-cta-button" style={{ background: '#0f766e', color: 'white' }}>
                Browse All Stadiums
              </button>
            </div>
          </section>
        )}

        <div id="app-section" className={showApp ? 'app-visible' : 'app-hidden'}>
          <ErrorBoundary level="section">
            <Suspense fallback={<HomePageSkeleton />}>
              <App />
            </Suspense>
          </ErrorBoundary>
        </div>
        <PWAInstallPrompt />
      </main>

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
        
        /* Featured stadiums section */
        .featured-section {
          max-width: 1100px;
          margin: 0 auto;
          padding: 4rem 2rem;
        }

        .featured-heading {
          font-size: clamp(1.5rem, 3vw, 2rem);
          font-weight: 700;
          text-align: center;
          margin-bottom: 0.5rem;
          color: #0B1220;
        }

        .featured-subtext {
          text-align: center;
          color: #334155;
          margin-bottom: 2rem;
          font-size: 1.05rem;
        }

        .featured-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }

        .featured-card {
          display: block;
          padding: 1.25rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: box-shadow 0.2s, transform 0.2s;
        }

        .featured-card:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }

        .featured-league {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          color: #0f766e;
          background: #f0fdfa;
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          margin-bottom: 0.5rem;
        }

        .featured-name {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 0.25rem 0;
          color: #0B1220;
        }

        .featured-team {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        /* Accessibility: reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-content { animation: none; }
          .hero-cta-button { transition: none; }
          .hero-cta-button::after { display: none; }
          #app-section { transition: none; }
          .hero-section { animation: none; }
          .hero-section::after { animation: none; }
          .featured-card { transition: none; }
        }
      `}</style>
    </>
  );
}