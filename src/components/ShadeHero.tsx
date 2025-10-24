'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MLB_STADIUMS } from '../data/stadiums';
import './ShadeHero.css';

interface ShadeLevel {
  label: string;
  icon: string;
  color: string;
  description: string;
}

const SHADE_LEVELS: ShadeLevel[] = [
  { label: 'Fully Shaded', icon: '☁️', color: '#059669', description: '100% shade throughout game' },
  { label: 'Mostly Shaded', icon: '🌤️', color: '#10b981', description: '75%+ of game in shade' },
  { label: 'Partial Shade', icon: '⛅', color: '#eab308', description: '25-75% shade coverage' },
  { label: 'Full Sun', icon: '☀️', color: '#ef4444', description: 'Less than 25% shade' },
];

const POPULAR_STADIUMS = [
  { id: 'dodgers', name: 'Dodger Stadium', shadedSections: 42 },
  { id: 'yankees', name: 'Yankee Stadium', shadedSections: 38 },
  { id: 'giants', name: 'Oracle Park', shadedSections: 35 },
  { id: 'redsox', name: 'Fenway Park', shadedSections: 28 },
  { id: 'cubs', name: 'Wrigley Field', shadedSections: 31 },
];

const GAME_TIMES = [
  { value: '13:00', label: '1:00 PM', popular: true },
  { value: '19:00', label: '7:00 PM', popular: true },
  { value: '10:00', label: '10:00 AM' },
  { value: '16:00', label: '4:00 PM' },
];

export function ShadeHero() {
  const router = useRouter();
  const [selectedStadium, setSelectedStadium] = useState('');
  const [selectedTime, setSelectedTime] = useState('13:00');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showQuickResults, setShowQuickResults] = useState(false);

  const handleInstantShadeSearch = () => {
    if (!selectedStadium) return;

    setIsSearching(true);
    // Navigate directly to stadium page with shade view
    router.push(`/stadium/${selectedStadium}?time=${selectedTime}&view=shade`);
  };

  const handleQuickStadiumSelect = (stadiumId: string) => {
    setSelectedStadium(stadiumId);
    router.push(`/stadium/${stadiumId}?time=${selectedTime}&view=shade`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setShowQuickResults(query.length > 0);
  };

  const filteredStadiums = MLB_STADIUMS.filter(stadium =>
    stadium.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stadium.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

        {/* Instant Shade Search Bar */}
        <div className="shade-search-section">
          <div className="shade-search-wrapper">
            <div className="shade-search-inputs">
              <div className="stadium-search-input">
                <input
                  type="text"
                  placeholder="Type stadium or team name..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="shade-input"
                  aria-label="Search for stadium"
                />
                {showQuickResults && (
                  <div className="quick-results-dropdown">
                    {filteredStadiums.slice(0, 5).map(stadium => (
                      <button
                        key={stadium.id}
                        onClick={() => handleQuickStadiumSelect(stadium.id)}
                        className="quick-result-item"
                      >
                        <span className="stadium-name">{stadium.name}</span>
                        <span className="team-name">{stadium.team}</span>
                        <span className="shade-indicator">→</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="time-selector"
                aria-label="Select game time"
              >
                {GAME_TIMES.map(time => (
                  <option key={time.value} value={time.value}>
                    {time.label} {time.popular && '⭐'}
                  </option>
                ))}
              </select>

              <button
                onClick={handleInstantShadeSearch}
                disabled={!selectedStadium && !searchQuery}
                className="find-shade-button"
                aria-label="Find shaded seats"
              >
                {isSearching ? 'Finding Shade...' : 'Find Shaded Seats →'}
              </button>
            </div>
          </div>

          {/* Shade Level Legend */}
          <div className="shade-legend">
            {SHADE_LEVELS.map(level => (
              <div key={level.label} className="shade-level-item">
                <span className="shade-icon">{level.icon}</span>
                <span className="shade-label" style={{ color: level.color }}>
                  {level.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Stadiums Quick Access */}
        <div className="popular-stadiums">
          <h3 className="popular-title">Popular Stadiums with Shaded Seats</h3>
          <div className="stadium-grid">
            {POPULAR_STADIUMS.map(stadium => (
              <button
                key={stadium.id}
                onClick={() => handleQuickStadiumSelect(stadium.id)}
                className="stadium-card"
              >
                <div className="stadium-card-content">
                  <h4 className="stadium-card-name">{stadium.name}</h4>
                  <div className="shaded-sections-count">
                    <span className="shade-icon">🌤️</span>
                    <span>{stadium.shadedSections} shaded sections</span>
                  </div>
                  <span className="view-shade-cta">View Shade Map →</span>
                </div>
              </button>
            ))}
          </div>
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