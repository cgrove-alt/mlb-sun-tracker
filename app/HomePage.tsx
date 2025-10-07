'use client';

import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import PWAInstallPrompt from '../components/PWAInstallPrompt';
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
        <PWAInstallPrompt />
      </main>

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          min-height: 600px;
          background: linear-gradient(170deg, #0f766e 0%, #0ea5e9 50%, #fbbf24 100%);
          background-size: 200% 200%;
          animation: gradientShift 15s ease infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 2rem;
          /* Performance optimization */
          will-change: background-position;
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
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
          background: #0f766e;
          color: white;
          border: 2px solid transparent;
          padding: 1rem 2.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          text-transform: none;
          letter-spacing: -0.01em;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          position: relative;
          overflow: hidden;
        }
        
        .hero-cta-button::before {
          content: '🏟️';
          font-size: 1.25rem;
        }
        
        .hero-cta-button::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }

        .hero-cta-button:hover {
          transform: translateY(-2px) scale(1.02);
          background: #14b8a6;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        .hero-cta-button:hover::after {
          width: 300px;
          height: 300px;
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