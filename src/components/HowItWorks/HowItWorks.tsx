'use client';

import React from 'react';
import { StadiumIcon, ClockIcon, ShadeIcon } from '../Icons';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: 1,
      icon: StadiumIcon,
      title: 'Select Your Stadium',
      description: 'Choose from 250+ MLB, NFL, MiLB, and World Cup venues with row-level data'
    },
    {
      number: 2,
      icon: ClockIcon,
      title: 'Choose Game Time',
      description: 'Pick your game date and time to see real-time sun position calculations'
    },
    {
      number: 3,
      icon: ShadeIcon,
      title: 'Find Your Shade',
      description: 'Get detailed shade coverage for every section and row, with pricing insights'
    }
  ];

  return (
    <section className="how-it-works-section">
      <div className="how-it-works-container">
        <div className="section-header">
          <h2 className="section-title">How It Works</h2>
          <p className="section-description">
            Find the perfect shaded seats in three simple steps
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <div key={step.number} className="step-card">
              <div className="step-icon-wrapper">
                <div className="step-number">{step.number}</div>
                <div className="step-icon">
                  <step.icon size={32} color="white" />
                </div>
              </div>

              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="step-connector" aria-hidden="true">
                  <svg width="60" height="24" viewBox="0 0 60 24" fill="none">
                    <path
                      d="M0 12h54m0 0l-6-6m6 6l-6 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="methodology-link">
          <p>
            Our advanced calculations use real-time sun position, 3D stadium models, and precise obstruction geometry.{' '}
            <a href="/faq" className="learn-more-link">
              Learn more about our methodology →
            </a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .how-it-works-section {
          padding: 5rem 2rem;
          background: linear-gradient(to bottom, #f8fafc 0%, #ffffff 100%);
        }

        .how-it-works-container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          margin-bottom: 1rem;
          color: #0f172a;
          letter-spacing: -0.02em;
        }

        .section-description {
          font-size: clamp(1rem, 2vw, 1.25rem);
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }

        .steps-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          position: relative;
          margin-bottom: 4rem;
        }

        .step-card {
          position: relative;
          background: white;
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease;
          border: 1px solid rgba(15, 118, 110, 0.1);
        }

        .step-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
          border-color: rgba(15, 118, 110, 0.3);
        }

        .step-icon-wrapper {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .step-number {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.875rem;
          box-shadow: 0 2px 8px rgba(15, 118, 110, 0.3);
          z-index: 2;
        }

        .step-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #0f766e 0%, #0891b2 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(15, 118, 110, 0.2);
        }

        .step-content {
          text-align: left;
        }

        .step-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.75rem;
          color: #0f172a;
        }

        .step-description {
          font-size: 1rem;
          line-height: 1.6;
          color: #64748b;
        }

        .step-connector {
          position: absolute;
          top: 50%;
          right: -2rem;
          transform: translate(50%, -50%);
          color: #cbd5e1;
          z-index: 1;
        }

        .methodology-link {
          text-align: center;
          padding: 2rem;
          background: rgba(15, 118, 110, 0.05);
          border-radius: 16px;
          border: 1px solid rgba(15, 118, 110, 0.1);
        }

        .methodology-link p {
          font-size: 1rem;
          color: #475569;
          margin: 0;
          line-height: 1.6;
        }

        .learn-more-link {
          color: #0f766e;
          font-weight: 600;
          text-decoration: none;
          transition: color 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .learn-more-link:hover {
          color: #0891b2;
          text-decoration: underline;
        }

        /* Tablet responsive */
        @media (max-width: 1024px) {
          .steps-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .step-connector {
            display: none;
          }

          .step-card {
            display: flex;
            gap: 2rem;
            align-items: flex-start;
          }

          .step-icon-wrapper {
            flex-shrink: 0;
            margin-bottom: 0;
          }

          .step-content {
            flex: 1;
          }
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .how-it-works-section {
            padding: 3rem 1.5rem;
          }

          .section-header {
            margin-bottom: 3rem;
          }

          .steps-grid {
            gap: 2rem;
          }

          .step-card {
            flex-direction: column;
            padding: 1.5rem;
          }

          .step-icon {
            width: 64px;
            height: 64px;
          }

          .step-icon :global(svg) {
            width: 28px;
            height: 28px;
          }

          .step-number {
            width: 28px;
            height: 28px;
            font-size: 0.75rem;
          }

          .step-title {
            font-size: 1.25rem;
          }

          .step-description {
            font-size: 0.9375rem;
          }

          .methodology-link {
            padding: 1.5rem;
          }

          .methodology-link p {
            font-size: 0.9375rem;
          }
        }

        /* Accessibility: reduce motion */
        @media (prefers-reduced-motion: reduce) {
          .step-card {
            transition: none;
          }

          .step-card:hover {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
