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

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="container-narrow">
            <h2>How It Works</h2>
            <div className="steps-grid">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-icon">🏟️</div>
                <h3>Select Your Stadium</h3>
                <p>Choose from 250+ MLB, MiLB, and NFL venues across North America</p>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-icon">☀️</div>
                <h3>Pick Game Time</h3>
                <p>Select a real game or any custom date and time</p>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-icon">🎯</div>
                <h3>Find Perfect Seats</h3>
                <p>Get real-time shade analysis for every section</p>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Stadiums Preview */}
        <section className="popular-preview">
          <div className="container-narrow">
            <h2>Popular Stadium Guides</h2>
            <p className="section-subtitle">Explore detailed shade guides for fan-favorite venues</p>
            <div className="preview-grid">
              <Link href="/stadium/yankees" className="preview-card">
                <div className="preview-header">
                  <h3>Yankee Stadium</h3>
                  <span className="league-badge">MLB</span>
                </div>
                <p className="team-name">New York Yankees</p>
                <div className="preview-stats">
                  <span className="stat">☀️ Open Air</span>
                  <span className="stat">🛡️ Covered Sections</span>
                </div>
                <span className="view-guide-link">View Shade Guide →</span>
              </Link>

              <Link href="/stadium/dodgers" className="preview-card">
                <div className="preview-header">
                  <h3>Dodger Stadium</h3>
                  <span className="league-badge">MLB</span>
                </div>
                <p className="team-name">Los Angeles Dodgers</p>
                <div className="preview-stats">
                  <span className="stat">☀️ Open Air</span>
                  <span className="stat">🌄 Great Views</span>
                </div>
                <span className="view-guide-link">View Shade Guide →</span>
              </Link>

              <Link href="/stadium/cubs" className="preview-card">
                <div className="preview-header">
                  <h3>Wrigley Field</h3>
                  <span className="league-badge">MLB</span>
                </div>
                <p className="team-name">Chicago Cubs</p>
                <div className="preview-stats">
                  <span className="stat">☀️ Open Air</span>
                  <span className="stat">🏛️ Historic</span>
                </div>
                <span className="view-guide-link">View Shade Guide →</span>
              </Link>
            </div>
            <div className="view-all-link">
              <Link href="/stadiums">View All 250+ Venues →</Link>
            </div>
          </div>
        </section>

        {/* Why Shadium Section */}
        <section className="why-shadium">
          <div className="container-narrow">
            <h2>Why Use The Shadium?</h2>
            <p className="lead-text">
              Wondering "are my seats in the shade?" The Shadium uses real-time sun tracking to show you exactly which sections will be shaded during your game. No more guessing, no more uncomfortable sun exposure.
            </p>

            <div className="benefits-grid">
              <div className="benefit">
                <div className="benefit-icon">⚡</div>
                <h3>Real-Time Calculations</h3>
                <p>Advanced sun position algorithms calculate shade for any date, time, and stadium</p>
              </div>
              <div className="benefit">
                <div className="benefit-icon">🎯</div>
                <h3>Section-Level Detail</h3>
                <p>Every section analyzed with sun exposure percentage and timing</p>
              </div>
              <div className="benefit">
                <div className="benefit-icon">🏟️</div>
                <h3>250+ Venues</h3>
                <p>All 30 MLB ballparks, 120 MiLB stadiums, and 32 NFL venues covered</p>
              </div>
              <div className="benefit">
                <div className="benefit-icon">📱</div>
                <h3>Mobile Optimized</h3>
                <p>Perfect for on-the-go planning and game day decisions</p>
              </div>
            </div>
          </div>
        </section>

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
          height: 60vh;
          min-height: 500px;
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

        /* Container Styles */
        .container-narrow {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        /* How It Works Section */
        .how-it-works {
          padding: 4rem 0;
          background: white;
        }

        .how-it-works h2 {
          text-align: center;
          font-size: clamp(2rem, 4vw, 2.5rem);
          margin-bottom: 3rem;
          color: #1a237e;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-top: 2rem;
        }

        .step {
          text-align: center;
          padding: 2rem;
          background: #f8f9fa;
          border-radius: 16px;
          position: relative;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .step:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
        }

        .step-number {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 2rem;
          height: 2rem;
          background: #0f766e;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
        }

        .step-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .step h3 {
          color: #1a237e;
          font-size: 1.25rem;
          margin-bottom: 0.75rem;
        }

        .step p {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        /* Popular Preview Section */
        .popular-preview {
          padding: 4rem 0;
          background: #f8f9fa;
        }

        .popular-preview h2 {
          text-align: center;
          font-size: clamp(2rem, 4vw, 2.5rem);
          margin-bottom: 0.5rem;
          color: #1a237e;
        }

        .section-subtitle {
          text-align: center;
          color: #666;
          font-size: 1.125rem;
          margin-bottom: 3rem;
        }

        .preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .preview-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          display: flex;
          flex-direction: column;
        }

        .preview-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border-color: #0f766e;
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
        }

        .preview-header h3 {
          color: #1a237e;
          font-size: 1.25rem;
          margin: 0;
          font-weight: 600;
        }

        .league-badge {
          background: #0f766e;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .team-name {
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 1rem;
        }

        .preview-stats {
          display: flex;
          gap: 0.75rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .preview-stats .stat {
          background: #f0f4ff;
          padding: 0.375rem 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
          color: #1a237e;
        }

        .view-guide-link {
          color: #0f766e;
          font-weight: 600;
          font-size: 0.95rem;
          margin-top: auto;
        }

        .view-all-link {
          text-align: center;
          margin-top: 2rem;
        }

        .view-all-link a {
          color: #0f766e;
          font-weight: 600;
          font-size: 1.125rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .view-all-link a:hover {
          color: #14b8a6;
          text-decoration: underline;
        }

        /* Why Shadium Section */
        .why-shadium {
          padding: 4rem 0;
          background: white;
        }

        .why-shadium h2 {
          text-align: center;
          font-size: clamp(2rem, 4vw, 2.5rem);
          margin-bottom: 1rem;
          color: #1a237e;
        }

        .lead-text {
          text-align: center;
          color: #666;
          font-size: 1.125rem;
          line-height: 1.7;
          max-width: 800px;
          margin: 0 auto 3rem;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 2rem;
        }

        .benefit {
          text-align: center;
          padding: 1.5rem;
        }

        .benefit-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .benefit h3 {
          color: #1a237e;
          font-size: 1.125rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .benefit p {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.6;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .container-narrow {
            padding: 0 1.5rem;
          }

          .how-it-works,
          .popular-preview,
          .why-shadium {
            padding: 3rem 0;
          }

          .steps-grid {
            gap: 1.5rem;
          }

          .step {
            padding: 1.5rem;
          }

          .preview-grid,
          .benefits-grid {
            gap: 1.5rem;
          }
        }
      `}</style>
    </>
  );
}