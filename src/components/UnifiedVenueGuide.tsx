'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UnifiedVenue } from '../data/unifiedVenues';
import { SunIcon, CloudIcon, MapPinIcon } from './Icons';
import './StadiumGuide.css';

interface UnifiedVenueGuideProps {
  venue: UnifiedVenue;
  sections: any[];
}

interface WeatherData {
  temperature: number;
  conditions: string;
  cloudCover: number;
}

const UnifiedVenueGuide: React.FC<UnifiedVenueGuideProps> = ({ venue, sections }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedTime, setSelectedTime] = useState('13:00');
  const [averageWeather, setAverageWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Simulate weather data based on venue location and sport
    const monthlyAverages: Record<number, WeatherData> = {
      3: { temperature: 65, conditions: 'Partly Cloudy', cloudCover: 30 },
      4: { temperature: 72, conditions: 'Clear', cloudCover: 15 },
      5: { temperature: 78, conditions: 'Clear', cloudCover: 10 },
      6: { temperature: 85, conditions: 'Clear', cloudCover: 5 },
      7: { temperature: 87, conditions: 'Clear', cloudCover: 10 },
      8: { temperature: 82, conditions: 'Partly Cloudy', cloudCover: 20 },
      9: { temperature: 73, conditions: 'Partly Cloudy', cloudCover: 25 },
    };
    
    setAverageWeather(monthlyAverages[selectedMonth] || monthlyAverages[6]);
  }, [selectedMonth]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Get sport-specific game times
  const getGameTimes = () => {
    const sport = venue.sport || venue.venueType;
    switch (sport) {
      case 'football':
        return [
          { value: '13:00', label: '1:00 PM' },
          { value: '16:00', label: '4:00 PM' },
          { value: '20:00', label: '8:00 PM' },
        ];
      default: // baseball
        return [
          { value: '12:00', label: '12:00 PM' },
          { value: '13:00', label: '1:00 PM' },
          { value: '19:00', label: '7:00 PM' },
        ];
    }
  };

  const gameTimes = getGameTimes();

  const bestShadedSections = sections
    .filter(section => section.covered || section.level === 'upper')
    .slice(0, 5);

  // Get sport-specific content
  const getSportSpecificContent = () => {
    const sport = venue.sport || venue.venueType;
    switch (sport) {
      case 'football':
        return {
          gameTypeLabel: 'NFL games',
          durationLabel: '3+ hours',
          shadeImportance: 'important for early season games and sunny afternoon kickoffs',
          bestShadeAdvice: 'Upper deck and covered club sections provide the best shade during afternoon games'
        };
      default:
        return {
          gameTypeLabel: 'MLB games',
          durationLabel: '3+ hours', 
          shadeImportance: 'essential for day games and afternoon starts',
          bestShadeAdvice: 'Upper deck and third base side typically offer the most shade'
        };
    }
  };

  const sportContent = getSportSpecificContent();

  // Get seasonal considerations based on sport
  const getSeasonalAdvice = () => {
    const baseAdvice = [];
    const sport = venue.sport || venue.venueType;
    
    if (sport === 'football') {
      baseAdvice.push('Early season (September-October): High sun exposure risk during day games');
      baseAdvice.push('Late season (December-January): Sun exposure less of a concern');
      baseAdvice.push('Playoff games: Weather protection becomes more important than shade');
    } else {
      baseAdvice.push('Summer games (June-August): Highest sun exposure risk');
      baseAdvice.push('Day games: Choose shaded sections to avoid 3+ hours in direct sun');
      baseAdvice.push('Evening games: Sun exposure decreases after 6 PM');
    }
    
    return baseAdvice;
  };

  return (
    <div className="stadium-guide">
      <nav className="breadcrumb">
        <Link href="/">Home</Link>
        <span> › </span>
        <Link href={`/league/${venue.league.toLowerCase()}`}>{venue.league}</Link>
        <span> › </span>
        <span>{venue.name}</span>
      </nav>

      <header className="stadium-header">
        <h1>Shaded Seats at {venue.name}</h1>
        <p className="stadium-subtitle">
          Find the Best Seats in the Shade for {venue.team} {sportContent.gameTypeLabel}
        </p>
        <div className="stadium-meta">
          <span className="team">{venue.team}</span>
          {venue.alternateTeams && venue.alternateTeams.length > 0 && (
            <span className="alternate-teams">
              Also: {venue.alternateTeams.join(', ')}
            </span>
          )}
          <span className="location">
            <MapPinIcon size={16} />
            {venue.city}, {venue.state}
          </span>
          <span className="league-badge">{venue.league} • {venue.sport || venue.venueType}</span>
          <span className="roof-type">
            {venue.roof === 'fixed' ? '🏢 Fixed Roof' : 
             venue.roof === 'retractable' ? '🏟️ Retractable Roof' : 
             '☀️ Open Air'}
          </span>
        </div>
      </header>

      <section className="quick-facts">
        <h2>Venue Quick Facts</h2>
        <div className="facts-grid">
          <div className="fact-card">
            <h3>Capacity</h3>
            <p>{venue.capacity.toLocaleString()} seats</p>
          </div>
          <div className="fact-card">
            <h3>Orientation</h3>
            <p>{venue.orientation}° from North</p>
          </div>
          <div className="fact-card">
            <h3>Surface</h3>
            <p>{venue.surface || 'Various'}</p>
          </div>
          <div className="fact-card">
            <h3>Best Shade Time</h3>
            <p>{venue.roof !== 'open' ? 'All Day (Covered)' : 'After 3 PM'}</p>
          </div>
          {venue.opened && (
            <div className="fact-card">
              <h3>Opened</h3>
              <p>{venue.opened}</p>
            </div>
          )}
        </div>
      </section>

      <section className="shade-simulator">
        <h2>Shade Pattern Simulator</h2>
        <p>See how shade changes throughout the season and day for {venue.sport || venue.venueType} games:</p>
        
        <div className="simulator-controls">
          <div className="control-group">
            <label htmlFor="month-select">Month:</label>
            <select 
              id="month-select"
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {months.map((month, index) => {
                // Show relevant months based on sport
                const sport = venue.sport || venue.venueType;
                const isRelevantMonth = sport === 'football' 
                  ? (index >= 8 || index <= 1) // Sep-Feb
                  : (index >= 3 && index <= 9); // Apr-Oct for baseball
                
                return (
                  <option key={index} value={index} disabled={!isRelevantMonth}>
                    {month} {!isRelevantMonth && '(Off-season)'}
                  </option>
                );
              })}
            </select>
          </div>
          
          <div className="control-group">
            <label htmlFor="time-select">Game Time:</label>
            <select 
              id="time-select"
              value={selectedTime} 
              onChange={(e) => setSelectedTime(e.target.value)}
            >
              {gameTimes.map(time => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {averageWeather && (
          <div className="weather-preview">
            <h3>Typical {months[selectedMonth]} Conditions</h3>
            <div className="weather-stats">
              <span><SunIcon size={20} /> {averageWeather.temperature}°F</span>
              <span><CloudIcon size={20} /> {averageWeather.conditions}</span>
              <span>Cloud Cover: {averageWeather.cloudCover}%</span>
            </div>
          </div>
        )}
      </section>

      {bestShadedSections.length > 0 && (
        <section className="best-sections">
          <h2>Best Shaded Sections</h2>
          <p>These sections typically offer the most shade coverage during {sportContent.gameTypeLabel}:</p>
          
          <div className="sections-grid">
            {bestShadedSections.map(section => (
              <div key={section.id} className="section-card">
                <h3>{section.name}</h3>
                <div className="section-details">
                  <span className="level">{section.level} level</span>
                  {section.covered && <span className="covered">✓ Covered</span>}
                  <span className="price">{section.price || 'varies'}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="sport-specific-advice">
        <h2>{(venue.sport || venue.venueType).charAt(0).toUpperCase() + (venue.sport || venue.venueType).slice(1)} Shade Strategy</h2>
        <div className="advice-grid">
          <div className="advice-card">
            <h3>Game Duration</h3>
            <p>
              {(venue.sport || venue.venueType).charAt(0).toUpperCase() + (venue.sport || venue.venueType).slice(1)} games last {sportContent.durationLabel}, 
              making shade {sportContent.shadeImportance}.
            </p>
          </div>
          
          <div className="advice-card">
            <h3>Best Shade Sections</h3>
            <p>{sportContent.bestShadeAdvice}</p>
          </div>
          
          <div className="advice-card">
            <h3>Seasonal Considerations</h3>
            <ul>
              {getSeasonalAdvice().map((advice, index) => (
                <li key={index}>{advice}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {venue.roof === 'open' && (
        <section className="sun-safety">
          <h2>Sun Safety at {venue.name}</h2>
          <div className="safety-grid">
            <div className="safety-card">
              <h3>🧴 Sun Protection</h3>
              <ul>
                <li>Apply sunscreen 30 minutes before game time</li>
                <li>Reapply every 2 hours during long {venue.sport || venue.venueType} games</li>
                <li>Bring a hat and sunglasses</li>
                <li>Consider UV-protective clothing</li>
              </ul>
            </div>

            <div className="safety-card">
              <h3>💧 Stay Hydrated</h3>
              <ul>
                <li>Drink water regularly throughout the game</li>
                <li>Avoid excessive alcohol in direct sun</li>
                <li>Seek shade during timeouts/breaks</li>
                <li>Watch for signs of heat exhaustion</li>
              </ul>
            </div>

            <div className="safety-card">
              <h3>🏃 Shade Breaks</h3>
              <ul>
                <li>Use covered concourses during halftime/innings</li>
                <li>Visit air-conditioned team stores</li>
                <li>Find shaded standing areas</li>
                <li>Move to shaded sections if available</li>
              </ul>
            </div>
          </div>
        </section>
      )}

      <section className="cta-section">
        <div className="cta-content">
          <h2>Plan Your Visit to {venue.name}</h2>
          <p>
            Ready to find the perfect shaded seats for your next {venue.team} game? 
            Use our real-time sun tracker to see exactly which sections will be shaded.
          </p>
          <Link href={`/?venue=${venue.id}`} className="cta-button">
            Check Real-Time Shade →
          </Link>
        </div>
      </section>

      <section className="related-content">
        <h2>More Resources</h2>
        <div className="resources-grid">
          <Link href={`/league/${venue.league.toLowerCase()}`} className="resource-card">
            <h3>All {venue.league} Venues</h3>
            <p>Compare shade options across all {venue.league} stadiums</p>
          </Link>
          <Link href="/guide/how-to-find-shaded-seats" className="resource-card">
            <h3>How to Find Shaded Seats</h3>
            <p>Complete guide to finding shade at any sports venue</p>
          </Link>
          <Link href="/faq" className="resource-card">
            <h3>Frequently Asked Questions</h3>
            <p>Get answers about shade, sun safety, and more</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default UnifiedVenueGuide;