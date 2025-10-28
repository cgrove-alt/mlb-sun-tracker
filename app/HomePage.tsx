'use client';

import PWAInstallPrompt from '../components/PWAInstallPrompt';
import HomepageSchema from './HomepageSchema';
import Link from 'next/link';
import { ShadeHero } from '../src/components/ShadeHero';

export default function HomePage() {
  return (
    <>
      <HomepageSchema />
      <main className="homepage">
        {/* Shade-First Hero Section for Intuitive Shade Discovery */}
        <ShadeHero />

        {/* How It Works Section */}
        <section className="how-it-works">
          <div className="how-it-works-container">
            <h2 className="how-it-works-title">How It Works</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3>Select Stadium</h3>
                <p>Choose from all 30 MLB stadiums</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3>Pick Game Time</h3>
                <p>See shade for your specific game time</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3>Find Your Seat</h3>
                <p>Browse seats by shade level, view, and accessibility</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features">
          <div className="features-container">
            <h2 className="features-title">Seat-Level Precision</h2>
            <p className="features-subtitle">
              Every seat mapped with exact sun exposure data
            </p>
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">🎯</span>
                <h3>Individual Seat Data</h3>
                <p>See sun exposure for every single seat, not just sections</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⏰</span>
                <h3>Time-Based Accuracy</h3>
                <p>Real-time calculations based on exact game time</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">🔍</span>
                <h3>Advanced Filtering</h3>
                <p>Filter by shade level, accessibility, view quality, and more</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">♿</span>
                <h3>Accessibility Info</h3>
                <p>Find wheelchair accessible seats with shade coverage</p>
              </div>
            </div>
          </div>
        </section>

        {/* SEO-optimized content section */}
        <div className="sr-only">
          <h2>Find Shaded Seats at MLB Stadiums - Are My Seats in the Shade?</h2>
          <p>
            Wondering "are my seats in the shade?" or "are my seats shaded?" at your favorite ballpark?
            The Shadium helps you find the best shaded seats at all 30 MLB stadiums with seat-level precision.
            Our real-time sun tracking technology shows you exactly which seats will be in the shade during
            any game time.
          </p>

          <h3>Check If Your Seats Are Shaded at These Popular MLB Stadiums</h3>
          <ul>
            <li><Link href="/stadium/yankees">Are my seats shaded at Yankee Stadium?</Link></li>
            <li><Link href="/stadium/dodgers">Find shaded seats at Dodger Stadium</Link></li>
            <li><Link href="/stadium/giants">Oracle Park shade finder</Link></li>
            <li><Link href="/stadium/redsox">Fenway Park sun exposure guide</Link></li>
            <li><Link href="/stadium/cubs">Wrigley Field shaded seats</Link></li>
          </ul>

          <h3>How to Know If Your Seats Are in the Shade</h3>
          <p>
            Simply select your stadium from our database of all 30 MLB ballparks and choose your
            game time to see which individual seats are shaded. Our advanced calculations consider sun angle,
            stadium orientation, roof coverage, and time of day to show you exactly where the shade will be
            during your game at the seat level.
          </p>
        </div>

        <PWAInstallPrompt />

        <style jsx>{`
          .homepage {
            min-height: 100vh;
            background: linear-gradient(to bottom, #ffffff, #f9fafb);
          }

          .how-it-works {
            padding: 4rem 2rem;
            background: white;
          }

          .how-it-works-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .how-it-works-title {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 3rem;
          }

          .steps-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
          }

          .step-card {
            text-align: center;
            padding: 2rem;
            background: #f9fafb;
            border-radius: 12px;
            transition: transform 0.2s;
          }

          .step-card:hover {
            transform: translateY(-4px);
          }

          .step-number {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 60px;
            height: 60px;
            background: #3b82f6;
            color: white;
            font-size: 1.5rem;
            font-weight: 700;
            border-radius: 50%;
            margin-bottom: 1rem;
          }

          .step-card h3 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 0.5rem;
          }

          .step-card p {
            font-size: 1rem;
            color: #6b7280;
          }

          .features {
            padding: 4rem 2rem;
            background: #f9fafb;
          }

          .features-container {
            max-width: 1200px;
            margin: 0 auto;
          }

          .features-title {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 700;
            color: #111827;
            margin-bottom: 0.5rem;
          }

          .features-subtitle {
            text-align: center;
            font-size: 1.25rem;
            color: #6b7280;
            margin-bottom: 3rem;
          }

          .features-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 2rem;
          }

          .feature-card {
            padding: 2rem;
            background: white;
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            transition: box-shadow 0.2s;
          }

          .feature-card:hover {
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .feature-icon {
            font-size: 2.5rem;
            display: block;
            margin-bottom: 1rem;
          }

          .feature-card h3 {
            font-size: 1.125rem;
            font-weight: 600;
            color: #111827;
            margin-bottom: 0.5rem;
          }

          .feature-card p {
            font-size: 0.875rem;
            color: #6b7280;
            line-height: 1.5;
          }

          @media (max-width: 768px) {
            .how-it-works,
            .features {
              padding: 3rem 1rem;
            }

            .how-it-works-title,
            .features-title {
              font-size: 2rem;
            }
          }
        `}</style>
      </main>
    </>
  );
}