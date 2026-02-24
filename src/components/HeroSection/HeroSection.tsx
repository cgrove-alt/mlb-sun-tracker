'use client';

import React from 'react';
import { SearchIcon } from '../Icons';

interface HeroSectionProps {
  onGetStarted?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted }) => {
  return (
    <section className="hero-section">
      <div className="hero-background">
        <div className="hero-gradient"></div>
        <div className="hero-particles"></div>
      </div>

      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-icon">☀️</span>
          <span className="badge-text">250+ Stadiums | Row-Level Accuracy | Real-Time Sun Tracking</span>
        </div>

        <h1 className="hero-headline">
          Find Your Shade.<br />Enjoy the Game.
        </h1>

        <p className="hero-subheadline">
          The most accurate stadium shade finder for MLB, NFL, MiLB, and World Cup 2026.
          Know exactly which seats will be in the shade before you buy.
        </p>

        <div className="hero-cta-group">
          <button
            onClick={() => {
              if (onGetStarted) {
                onGetStarted();
              } else {
                // Default behavior: scroll to app section
                const appElement = document.getElementById('app-section');
                if (appElement) {
                  appElement.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
            className="hero-cta-primary"
            aria-label="Get started finding shaded seats"
          >
            <SearchIcon size={20} color="currentColor" />
            <span>Find Your Shade</span>
          </button>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <div className="stat-number">250+</div>
            <div className="stat-label">Stadiums</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">Row-Level</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-number">Real-Time</div>
            <div className="stat-label">Sun Tracking</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          width: 100%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 2rem 1rem;
        }

        .hero-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .hero-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #0f766e 0%, #0891b2 50%, #0c4a6e 100%);
        }

        .hero-particles {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: float 25s ease-in-out infinite;
          opacity: 0.4;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-20px);
            opacity: 0.6;
          }
        }

        .hero-content {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 900px;
          text-align: center;
          color: white;
          animation: fadeInUp 0.8s ease-out;
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

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 0.625rem 1.25rem;
          border-radius: 9999px;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          animation: fadeInUp 0.8s ease-out 0.1s both;
        }

        .badge-icon {
          font-size: 1.125rem;
        }

        .badge-text {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hero-headline {
          font-size: clamp(2.5rem, 6vw, 5rem);
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
          text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          animation: fadeInUp 0.8s ease-out 0.2s both;
        }

        .hero-subheadline {
          font-size: clamp(1.125rem, 2.5vw, 1.5rem);
          line-height: 1.6;
          margin-bottom: 3rem;
          opacity: 0.95;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          font-weight: 400;
          animation: fadeInUp 0.8s ease-out 0.3s both;
        }

        .hero-cta-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-bottom: 4rem;
          animation: fadeInUp 0.8s ease-out 0.4s both;
        }

        .hero-cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.625rem;
          background: white;
          color: #0f766e;
          border: none;
          padding: 1rem 2.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          min-height: 44px;
        }

        .hero-cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
          background: #f8fafc;
        }

        .hero-cta-primary:active {
          transform: translateY(-1px);
        }

        .hero-stats {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          animation: fadeInUp 0.8s ease-out 0.5s both;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: clamp(1.25rem, 3vw, 1.75rem);
          font-weight: 700;
          margin-bottom: 0.25rem;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .stat-label {
          font-size: clamp(0.75rem, 1.5vw, 0.875rem);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.9;
          font-weight: 500;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.3);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .hero-section {
            min-height: 100vh;
            padding: 1.5rem 1rem;
          }

          .hero-particles {
            display: none;
          }

          .hero-badge {
            padding: 0.5rem 1rem;
            margin-bottom: 1.5rem;
          }

          .badge-text {
            font-size: 0.625rem;
          }

          .hero-headline {
            margin-bottom: 1rem;
          }

          .hero-subheadline {
            margin-bottom: 2rem;
            font-size: 1rem;
          }

          .hero-cta-group {
            margin-bottom: 3rem;
            flex-direction: column;
            align-items: stretch;
          }

          .hero-cta-primary {
            width: 100%;
            justify-content: center;
          }

          .hero-stats {
            gap: 1rem;
            flex-wrap: wrap;
          }

          .stat-divider {
            display: none;
          }

          .stat-item {
            flex: 1;
            min-width: 80px;
          }
        }

        /* Accessibility: reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-content,
          .hero-badge,
          .hero-headline,
          .hero-subheadline,
          .hero-cta-group,
          .hero-stats {
            animation: none;
          }

          .hero-particles {
            animation: none;
          }

          .hero-cta-primary {
            transition: none;
          }

          .hero-cta-primary:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
