'use client';

import { StadiumGameDropdownSelector } from './StadiumGameDropdownSelector';
import './ShadeHero.css';

export function ShadeHero() {

  return (
    <section className="shade-hero">
      <div className="shade-hero-container">
        {/* Main Headline */}
        <div className="shade-hero-header">
          <h1 className="shade-hero-title">
            Find Your Perfect <span className="shade-emphasis">Shaded Seat</span>
          </h1>
          <p className="shade-hero-subtitle">
            Instantly discover which seats are in the shade at any MLB stadium
          </p>
        </div>

        {/* Stadium + Game Dropdown Selector (2026 Games) */}
        <div className="game-selector-section">
          <h3 className="selector-section-title">Select Your 2026 Game</h3>
          <StadiumGameDropdownSelector />
        </div>

        {/* Value Proposition */}
        <div className="value-props">
          <div className="value-prop-item">
            <span className="value-icon">⚡</span>
            <h4>Instant Results</h4>
            <p>See shaded seats in under 3 seconds</p>
          </div>
          <div className="value-prop-item">
            <span className="value-icon">🎯</span>
            <h4>Accurate Data</h4>
            <p>Real-time sun calculations for any game time</p>
          </div>
          <div className="value-prop-item">
            <span className="value-icon">🏟️</span>
            <h4>All MLB Stadiums</h4>
            <p>Complete coverage of all 30 ballparks</p>
          </div>
        </div>
      </div>
    </section>
  );
}