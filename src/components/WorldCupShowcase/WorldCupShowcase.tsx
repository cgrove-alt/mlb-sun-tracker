'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeftIcon, ChevronRightIcon, MapPinIcon } from '../Icons';

interface WorldCupShowcaseProps {
  openingMatchDate?: Date;
}

interface VenueCard {
  id: string;
  name: string;
  city: string;
  country: string;
  countryFlag: string;
  matches: number;
}

const FEATURED_VENUES: VenueCard[] = [
  { id: 'metlife-stadium-wc', name: 'MetLife Stadium', city: 'New York/New Jersey', country: 'USA', countryFlag: '🇺🇸', matches: 8 },
  { id: 'sofi-stadium-wc', name: 'SoFi Stadium', city: 'Los Angeles', country: 'USA', countryFlag: '🇺🇸', matches: 8 },
  { id: 'att-stadium-wc', name: 'AT&T Stadium', city: 'Dallas', country: 'USA', countryFlag: '🇺🇸', matches: 9 },
  { id: 'estadio-azteca-wc', name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', countryFlag: '🇲🇽', matches: 6 },
  { id: 'bc-place-wc', name: 'BC Place', city: 'Vancouver', country: 'Canada', countryFlag: '🇨🇦', matches: 7 },
  { id: 'hard-rock-stadium-wc', name: 'Hard Rock Stadium', city: 'Miami', country: 'USA', countryFlag: '🇺🇸', matches: 7 },
];

export const WorldCupShowcase: React.FC<WorldCupShowcaseProps> = ({
  openingMatchDate = new Date('2026-06-11T12:00:00-07:00')
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Countdown timer
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const targetTime = openingMatchDate.getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [openingMatchDate]);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % FEATURED_VENUES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const handlePrevious = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + FEATURED_VENUES.length) % FEATURED_VENUES.length);
  }, []);

  const handleNext = useCallback(() => {
    setIsAutoPlaying(false);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % FEATURED_VENUES.length);
  }, []);

  const handleDotClick = useCallback((index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  }, []);

  const currentVenue = FEATURED_VENUES[currentIndex];

  return (
    <section className="worldcup-showcase-section">
      <div className="worldcup-showcase-background">
        <div className="worldcup-gradient"></div>
      </div>

      <div className="worldcup-showcase-container">
        <div className="worldcup-badge">
          <span className="badge-icon">⚽</span>
          <span className="badge-text">FIFA World Cup 2026</span>
        </div>

        <h2 className="worldcup-headline">
          Find the Best Shaded Seats at All 16 World Cup Venues
        </h2>

        <p className="worldcup-description">
          USA • Mexico • Canada | 104 Matches | 16 Stadiums | Row-Level Shade Analysis
        </p>

        {/* Countdown Timer */}
        <div className="countdown-timer">
          <div className="countdown-label">Opening Match Countdown</div>
          <div className="countdown-grid">
            <div className="countdown-item">
              <div className="countdown-number">{timeLeft.days}</div>
              <div className="countdown-unit">Days</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="countdown-unit">Hours</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="countdown-unit">Minutes</div>
            </div>
            <div className="countdown-separator">:</div>
            <div className="countdown-item">
              <div className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="countdown-unit">Seconds</div>
            </div>
          </div>
        </div>

        {/* Venue Carousel */}
        <div className="venue-carousel">
          <button
            className="carousel-button carousel-button-prev"
            onClick={handlePrevious}
            aria-label="Previous venue"
          >
            <ChevronLeftIcon size={24} color="white" />
          </button>

          <div className="venue-card">
            <div className="venue-flag">{currentVenue.countryFlag}</div>
            <div className="venue-content">
              <h3 className="venue-name">{currentVenue.name}</h3>
              <div className="venue-location">
                <MapPinIcon size={16} color="rgba(255, 255, 255, 0.8)" />
                <span>{currentVenue.city}, {currentVenue.country}</span>
              </div>
              <div className="venue-matches">{currentVenue.matches} Matches</div>
            </div>
          </div>

          <button
            className="carousel-button carousel-button-next"
            onClick={handleNext}
            aria-label="Next venue"
          >
            <ChevronRightIcon size={24} color="white" />
          </button>
        </div>

        {/* Carousel Dots */}
        <div className="carousel-dots">
          {FEATURED_VENUES.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to venue ${index + 1}`}
            />
          ))}
        </div>

        {/* CTAs */}
        <div className="worldcup-cta-group">
          <Link href="/worldcup2026" className="worldcup-cta-primary">
            Explore All 16 Venues
          </Link>
          <Link href="/worldcup2026/schedule" className="worldcup-cta-secondary">
            View Match Schedule
          </Link>
        </div>

        {/* Stats Highlights */}
        <div className="worldcup-stats">
          <div className="stat-card">
            <div className="stat-number">16</div>
            <div className="stat-label">Stadiums</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">104</div>
            <div className="stat-label">Matches</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">3</div>
            <div className="stat-label">Countries</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .worldcup-showcase-section {
          position: relative;
          padding: 5rem 2rem;
          overflow: hidden;
        }

        .worldcup-showcase-background {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 0;
        }

        .worldcup-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
        }

        .worldcup-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.15) 100%);
        }

        .worldcup-showcase-container {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          text-align: center;
          color: white;
        }

        .worldcup-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          padding: 0.625rem 1.25rem;
          border-radius: 9999px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }

        .badge-icon {
          font-size: 1.25rem;
        }

        .badge-text {
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .worldcup-headline {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 700;
          margin-bottom: 1rem;
          line-height: 1.2;
          max-width: 900px;
          margin-left: auto;
          margin-right: auto;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
          letter-spacing: -0.02em;
        }

        .worldcup-description {
          font-size: clamp(1rem, 2vw, 1.25rem);
          margin-bottom: 3rem;
          opacity: 0.95;
          font-weight: 400;
        }

        /* Countdown Timer */
        .countdown-timer {
          margin-bottom: 3rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .countdown-label {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
          opacity: 0.9;
          font-weight: 600;
        }

        .countdown-grid {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .countdown-item {
          flex: 1;
          max-width: 100px;
        }

        .countdown-number {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.5rem;
          font-variant-numeric: tabular-nums;
        }

        .countdown-unit {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.8;
        }

        .countdown-separator {
          font-size: 2rem;
          font-weight: 300;
          opacity: 0.6;
          margin: 0 0.25rem;
        }

        /* Venue Carousel */
        .venue-carousel {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
          padding: 2rem 0;
        }

        .carousel-button {
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          width: 48px;
          height: 48px;
          min-width: 48px;
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          color: white;
        }

        .carousel-button:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: scale(1.1);
        }

        .carousel-button:active {
          transform: scale(0.95);
        }

        .venue-card {
          flex: 1;
          max-width: 500px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          transition: all 0.3s ease;
          animation: fadeIn 0.5s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .venue-flag {
          font-size: 4rem;
          margin-bottom: 1rem;
        }

        .venue-content {
          text-align: center;
        }

        .venue-name {
          font-size: 1.75rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }

        .venue-location {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 1rem;
          opacity: 0.9;
          margin-bottom: 0.75rem;
        }

        .venue-matches {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.8;
          font-weight: 600;
        }

        .carousel-dots {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
          margin-bottom: 3rem;
        }

        .carousel-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0;
        }

        .carousel-dot.active {
          width: 32px;
          border-radius: 4px;
          background: white;
        }

        .carousel-dot:hover {
          background: rgba(255, 255, 255, 0.7);
        }

        /* CTAs */
        .worldcup-cta-group {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 3rem;
        }

        .worldcup-cta-primary,
        .worldcup-cta-secondary {
          padding: 1rem 2rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          text-decoration: none;
          transition: all 0.2s ease;
          display: inline-block;
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .worldcup-cta-primary {
          background: white;
          color: #6366f1;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        }

        .worldcup-cta-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
        }

        .worldcup-cta-secondary {
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .worldcup-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-3px);
        }

        /* Stats */
        .worldcup-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          max-width: 700px;
          margin: 0 auto;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 1.5rem 1rem;
          transition: all 0.2s ease;
        }

        .stat-card:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.9;
          font-weight: 500;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .worldcup-showcase-section {
            padding: 3rem 1.5rem;
          }

          .worldcup-headline {
            margin-bottom: 0.75rem;
          }

          .worldcup-description {
            margin-bottom: 2rem;
            font-size: 0.9375rem;
          }

          .countdown-timer {
            padding: 1.5rem 1rem;
            margin-bottom: 2rem;
          }

          .countdown-grid {
            gap: 0.5rem;
          }

          .countdown-number {
            font-size: 1.75rem;
          }

          .countdown-separator {
            font-size: 1.5rem;
          }

          .venue-carousel {
            gap: 1rem;
            padding: 1rem 0;
          }

          .carousel-button {
            width: 40px;
            height: 40px;
            min-width: 40px;
            min-height: 40px;
          }

          .carousel-button :global(svg) {
            width: 20px;
            height: 20px;
          }

          .venue-card {
            padding: 2rem 1.5rem;
          }

          .venue-flag {
            font-size: 3rem;
          }

          .venue-name {
            font-size: 1.5rem;
          }

          .worldcup-cta-group {
            flex-direction: column;
            align-items: stretch;
            margin-bottom: 2rem;
          }

          .worldcup-cta-primary,
          .worldcup-cta-secondary {
            width: 100%;
          }

          .worldcup-stats {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }

          .stat-card {
            padding: 1rem 0.5rem;
          }

          .stat-number {
            font-size: 2rem;
          }

          .stat-label {
            font-size: 0.75rem;
          }
        }

        /* Accessibility: reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .venue-card {
            animation: none;
          }

          .carousel-button,
          .worldcup-cta-primary,
          .worldcup-cta-secondary,
          .stat-card {
            transition: none;
          }

          .carousel-button:hover,
          .stat-card:hover {
            transform: none;
          }

          .worldcup-cta-primary:hover,
          .worldcup-cta-secondary:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
};

export default WorldCupShowcase;
