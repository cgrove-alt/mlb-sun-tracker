'use client';

import { Suspense, useState, lazy } from 'react';
import dynamic from 'next/dynamic';
import { LoadingSpinner } from '../src/components/LoadingSpinner';
import HomepageSchema from './HomepageSchema';
import Link from 'next/link';

// Lazy load the app component with better loading state
const App = lazy(() => 
  import('../src/UnifiedApp').then(module => ({
    default: module.default
  }))
);

// Preload the app component when user hovers over CTA
const preloadApp = () => {
  import('../src/UnifiedApp');
};

export default function HomePageOptimized() {
  const [showApp, setShowApp] = useState(false);

  const handleCTAClick = () => {
    setShowApp(true);
    // Use RAF for smoother scrolling on mobile
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const appElement = document.getElementById('app-section');
        if (appElement) {
          appElement.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  };

  return (
    <>
      <HomepageSchema />
      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-headline h1 break-words md:break-normal">
                Find Your Perfect Shaded Seats
              </h1>
              <p className="hero-subheadline max-w-prose">
                Avoid the sun and enjoy the game in comfort at any MLB, NFL, or MiLB stadium
              </p>
              <button 
                onClick={handleCTAClick}
                onMouseEnter={preloadApp}
                onTouchStart={preloadApp}
                className="hero-cta-button"
                aria-label="Open stadium selector"
              >
                Select Your Stadium
              </button>
            </div>
          </div>
        </section>

        {/* SEO-optimized content section */}
        <div className="sr-only">
          <h2>Find Shaded Seats at MLB Stadiums - Are My Seats in the Shade?</h2>
          <p>
            Wondering "are my seats in the shade?" or "are my seats shaded?" at your favorite MLB stadium? 
            The Shadium helps you find the best shaded seats at all 30 MLB ballparks. Our real-time sun 
            tracking technology shows you exactly which sections will be in the shade during any game time.
          </p>
          
          <h3>Check If Your Seats Are Shaded at These MLB Stadiums</h3>
          <ul>
            <li><Link href="/stadium/yankees">Are my seats shaded at Yankee Stadium?</Link></li>
            <li><Link href="/stadium/dodgers">Find shaded seats at Dodger Stadium</Link></li>
            <li><Link href="/stadium/redsox">Shaded sections at Fenway Park</Link></li>
            <li><Link href="/stadium/cubs">Are my Wrigley Field seats in the shade?</Link></li>
            <li><Link href="/stadium/giants">Shaded seats at Oracle Park San Francisco</Link></li>
          </ul>
          
          <h3>How to Know If Your Seats Are in the Shade</h3>
          <p>
            Simply select your stadium and game time to see which sections are shaded. Our advanced 
            calculations consider sun angle, stadium orientation, roof coverage, and time of day to 
            show you exactly where the shade will be during your game.
          </p>
        </div>

        {showApp && (
          <div id="app-section" className="app-visible">
            <Suspense fallback={
              <div className="app-loading">
                <LoadingSpinner />
                <p>Loading stadium selector...</p>
              </div>
            }>
              <App />
            </Suspense>
          </div>
        )}
      </main>

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-content {
          text-align: center;
          color: white;
          padding: 2rem;
          max-width: 800px;
          width: 100%;
          z-index: 1;
          position: relative;
        }

        .hero-headline {
          font-size: clamp(2rem, 5vw, 4rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-subheadline {
          font-size: clamp(1rem, 2.5vw, 1.5rem);
          margin-bottom: 2.5rem;
          opacity: 0.95;
          font-weight: 300;
          line-height: 1.4;
        }

        .hero-cta-button {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
          color: white;
          border: none;
          padding: 1rem 2.5rem;
          font-size: 1.25rem;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
          min-height: 60px;
          touch-action: manipulation;
        }

        .hero-cta-button:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(255, 107, 107, 0.4);
          background: linear-gradient(135deg, #ff8e53 0%, #ff6b6b 100%);
        }

        .hero-cta-button:active {
          transform: translateY(-1px);
        }

        .app-visible {
          animation: fadeIn 0.5s ease-in;
          min-height: 100vh;
          padding: 2rem 0;
        }

        .app-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
          gap: 1rem;
        }

        .app-loading p {
          color: #666;
          font-size: 1.1rem;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            min-height: 100vh;
          }

          .hero-content {
            padding: 1.5rem;
          }

          .hero-cta-button {
            padding: 1rem 2rem;
            font-size: 1.1rem;
            min-height: 56px;
            width: 100%;
            max-width: 300px;
          }

          .app-visible {
            padding: 1rem 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-cta-button {
            transition: none;
          }
          
          .app-visible {
            animation: none;
          }
        }
      `}</style>
    </>
  );
}