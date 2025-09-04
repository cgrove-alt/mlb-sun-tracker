'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
// PWAInstallPrompt disabled
// import PWAInstallPrompt from '../components/PWAInstallPrompt';
import { LoadingSpinner } from '../src/components/LoadingSpinner';
import HomepageSchema from './HomepageSchema';
import Link from 'next/link';

// Use the unified App component that supports multiple leagues
const App = dynamic(() => import('../src/UnifiedApp'), {
  ssr: false,
  loading: () => <LoadingSpinner />,
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
                className="hero-cta-button"
              >
                Select Your Stadium
              </button>
            </div>
          </div>
        </section>

        {/* SEO-optimized content section */}
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

        <div id="app-section" className={showApp ? 'app-visible' : 'app-hidden'}>
          <Suspense fallback={<LoadingSpinner />}>
            <App />
          </Suspense>
        </div>
        {/* PWAInstallPrompt disabled */}
        {/* <PWAInstallPrompt /> */}
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
          /* Removed background-attachment: fixed for smoother scrolling */
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.2);
          z-index: 1;
        }

        .hero-overlay {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1200px;
          padding: 2rem;
          text-align: center;
        }

        .hero-content {
          color: white;
          animation: fadeInUp 1s ease-out;
        }

        .hero-headline {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 800;
          margin-bottom: 1.5rem;
          text-shadow: 2px 4px 8px rgba(0, 0, 0, 0.5);
          line-height: 1.2;
        }

        .hero-subheadline {
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          margin-bottom: 2.5rem;
          opacity: 1;
          text-shadow: 2px 3px 6px rgba(0, 0, 0, 0.5);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          font-weight: 500;
        }

        .hero-cta-button {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
          color: white;
          border: none;
          padding: 1.25rem 3rem;
          font-size: 1.25rem;
          font-weight: 600;
          border-radius: 50px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .hero-cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(255, 107, 107, 0.4);
          background: linear-gradient(135deg, #ff8e53 0%, #ff6b6b 100%);
        }

        .hero-cta-button:active {
          transform: translateY(0);
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
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Accessibility: reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-content { animation: none; }
          .hero-cta-button { transition: none; }
          #app-section { transition: none; }
        }
      `}</style>
    </>
  );
}