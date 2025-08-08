'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Stadium } from '../data/stadiums';
import { StadiumSection } from '../data/stadiumSections';
import { StadiumAmenities, StadiumAmenity } from '../data/stadiumAmenities';
import { StadiumSchema, StadiumShadeGuideSchema } from './StadiumSchema';
import { stadiumHistories } from '../data/stadiumDetails';
import { WeatherPatternChart } from './WeatherPatternChart';
import { SunIcon, CloudIcon, DropletIcon, MapPinIcon, ClockIcon } from './Icons';
import { SectionShadeSEO } from './SectionShadeSEO';
import { StadiumShadeQuestions } from './StadiumShadeQuestions';
import { TableOfContents } from './TableOfContents';
import { CollapsibleSection } from './CollapsibleSection';
import './StadiumGuide.css';

interface StadiumGuideProps {
  stadium: Stadium;
  sections: StadiumSection[];
  amenities: StadiumAmenities | null;
}

interface WeatherData {
  temperature: number;
  conditions: string;
  cloudCover: number;
}

const StadiumGuide: React.FC<StadiumGuideProps> = ({ stadium, sections, amenities }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedTime, setSelectedTime] = useState('13:00'); // 1 PM default
  const [averageWeather, setAverageWeather] = useState<WeatherData | null>(null);
  const guideContentRef = useRef<HTMLDivElement>(null);

  // Simulate fetching historical weather data
  useEffect(() => {
    // In a real app, this would fetch from an API
    const monthlyAverages: Record<number, WeatherData> = {
      3: { temperature: 65, conditions: 'Partly Cloudy', cloudCover: 30 }, // April
      4: { temperature: 72, conditions: 'Clear', cloudCover: 15 }, // May
      5: { temperature: 78, conditions: 'Clear', cloudCover: 10 }, // June
      6: { temperature: 85, conditions: 'Clear', cloudCover: 5 }, // July
      7: { temperature: 87, conditions: 'Clear', cloudCover: 10 }, // August
      8: { temperature: 82, conditions: 'Partly Cloudy', cloudCover: 20 }, // September
      9: { temperature: 73, conditions: 'Partly Cloudy', cloudCover: 25 }, // October
    };
    
    setAverageWeather(monthlyAverages[selectedMonth] || monthlyAverages[6]);
  }, [selectedMonth]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const gameTimes = [
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '14:00', label: '2:00 PM' },
    { value: '15:00', label: '3:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '19:00', label: '7:00 PM' },
  ];

  const bestShadedSections = sections
    .filter(section => section.covered || section.level === 'upper')
    .slice(0, 5);

  const sunscreenStations = amenities?.amenities.filter(a => a.type === 'sunscreen_kiosk') || [];
  const familyAmenities = amenities?.amenities.filter(a => 
    a.type === 'family_area' || 
    a.type === 'nursing_station' ||
    a.details.familyRestroom
  ) || [];

  return (
    <>
      <StadiumSchema stadium={stadium} />
      <StadiumShadeGuideSchema stadium={stadium} />
      
      <div className="guide-page stadium-guide-wrapper">
        <TableOfContents containerRef={guideContentRef} />
        <div className="stadium-guide" ref={guideContentRef}>
        <nav className="breadcrumb">
          <Link href="/">Home</Link>
          <span> › </span>
          <span>{stadium.name}</span>
        </nav>

        <header className="stadium-header">
          <h1>Shaded Seats at {stadium.name}</h1>
          <p className="stadium-subtitle">Find the Best Seats in the Shade for {stadium.team} Games</p>
          <div className="stadium-meta">
            <span className="team">{stadium.team}</span>
            <span className="location">
              <MapPinIcon size={16} />
              {stadium.city}, {stadium.state}
            </span>
            <span className="roof-type">
              {stadium.roof === 'fixed' ? '🏢 Fixed Roof' : 
               stadium.roof === 'retractable' ? '🏟️ Retractable Roof' : 
               '☀️ Open Air'}
            </span>
          </div>

          {/* Quick jump bar */}
          <div className="quick-jump">
            <a href="#facts">Quick Facts</a>
            <a href="#simulator">Shade Simulator</a>
            <a href="#best-sections">Best Sections</a>
            <a href="#faq">FAQ</a>
            <a href="#amenities">Amenities</a>
          </div>
        </header>

        <section id="facts">
        <CollapsibleSection title="Stadium Quick Facts" defaultOpen={true} level="h2">
          <div className="facts-grid">
            <div className="fact-card">
              <h3>Capacity</h3>
              <p>{stadium.capacity.toLocaleString()} seats</p>
            </div>
            <div className="fact-card">
              <h3>Orientation</h3>
              <p>{stadium.orientation}° from North</p>
            </div>
            <div className="fact-card">
              <h3>Best Shade Time</h3>
              <p>{stadium.roof !== 'open' ? 'All Day (Covered)' : 'After 3 PM'}</p>
            </div>
            <div className="fact-card">
              <h3>Sunscreen Stations</h3>
              <p>{sunscreenStations.length} locations</p>
            </div>
          </div>
        </CollapsibleSection>
        </section>

        <section id="simulator">
        <CollapsibleSection title="Shade Pattern Simulator" defaultOpen={true} level="h2">
          <p>See how shade changes throughout the season and day:</p>
          
          <div className="simulator-controls">
            <div className="control-group">
              <label htmlFor="month-select">Month:</label>
              <select 
                id="month-select"
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
              >
                {months.map((month, index) => (
                  <option key={index} value={index} disabled={index < 3 || index > 9}>
                    {month}
                  </option>
                ))}
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
          
          <WeatherPatternChart stadiumId={stadium.id} city={stadium.city} />
        </CollapsibleSection>
        </section>

        {/* Are My Seats Shaded FAQ */}
        <section id="faq">
          <StadiumShadeQuestions stadium={stadium} />
        </section>
        
        <section id="best-sections">
        <CollapsibleSection title="Best Shaded Sections" defaultOpen={true} level="h2">
          <p>These sections typically offer the most shade coverage:</p>
          
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
        </CollapsibleSection>
        </section>

        {stadium.roof === 'open' && (
          <CollapsibleSection title={`Sun Safety at ${stadium.name}`} defaultOpen={false} level="h2">
            
            <div className="safety-grid">
              <div className="safety-card">
                <h3>🧴 Sunscreen Stations</h3>
                {sunscreenStations.length > 0 ? (
                  <ul>
                    {sunscreenStations.map(station => (
                      <li key={station.id}>
                        {station.name} - Near {station.location.section || `Section ${Math.floor(station.location.angle / 10)}`}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Bring your own sunscreen - no stations available</p>
                )}
              </div>

              <div className="safety-card">
                <h3>💧 Stay Hydrated</h3>
                <ul>
                  <li>Water fountains on every level</li>
                  <li>Bring empty water bottles to fill</li>
                  <li>Hydration breaks every 2-3 innings</li>
                </ul>
              </div>

              <div className="safety-card">
                <h3>🏃 Shade Breaks</h3>
                <ul>
                  <li>Covered concourses on all levels</li>
                  <li>Air-conditioned team stores</li>
                  <li>Shaded standing areas behind sections</li>
                </ul>
              </div>
            </div>
          </CollapsibleSection>
                )}
 
         {stadiumHistories[stadium.id] && (
          <CollapsibleSection title="Stadium History & Shade Evolution" defaultOpen={false} level="h2">
            <div className="history-content">
              <div className="history-main">
                <p className="opened-date">Opened in {stadiumHistories[stadium.id].opened}</p>
                
                {stadiumHistories[stadium.id].previousNames && stadiumHistories[stadium.id].previousNames!.length > 0 && (
                  <div className="previous-names">
                    <h3>Previously Known As</h3>
                    <ul>
                      {stadiumHistories[stadium.id].previousNames!.map((name, idx) => (
                        <li key={idx}>{name}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {stadiumHistories[stadium.id].shadeFeatures && stadiumHistories[stadium.id].shadeFeatures!.length > 0 && (
                  <div className="shade-evolution">
                    <h3>Shade Improvements Over Time</h3>
                    <div className="timeline">
                      {stadiumHistories[stadium.id].shadeFeatures!.map((feature, idx) => (
                        <div key={idx} className="timeline-item">
                          <span className="year">{feature.year}</span>
                          <span className="feature">{feature.feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stadiumHistories[stadium.id].renovations && stadiumHistories[stadium.id].renovations!.length > 0 && (
                  <div className="renovations">
                    <h3>Major Renovations</h3>
                    <div className="timeline">
                      {stadiumHistories[stadium.id].renovations!.map((renovation, idx) => (
                        <div key={idx} className="timeline-item">
                          <span className="year">{renovation.year}</span>
                          <span className="description">{renovation.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {stadiumHistories[stadium.id].funFacts && stadiumHistories[stadium.id].funFacts!.length > 0 && (
                  <div className="fun-facts">
                    <h3>Did You Know?</h3>
                    <ul>
                      {stadiumHistories[stadium.id].funFacts!.map((fact, idx) => (
                        <li key={idx}>{fact}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CollapsibleSection>
        )}

        <CollapsibleSection title="Local Fan Tips" defaultOpen={false} level="h2">
          <div className="tips-container">
            <div className="tip">
              <h3>Best Entry Gate</h3>
              <p>Use the {stadium.orientation > 180 ? 'third base' : 'first base'} gate for quicker access to shaded sections.</p>
            </div>
            <div className="tip">
              <h3>Parking Shade</h3>
              <p>Arrive early for shaded parking spots in the {stadium.roof === 'open' ? 'covered garage' : 'any lot (stadium is covered)'}.</p>
            </div>
            <div className="tip">
              <h3>Pre-Game Shade</h3>
              <p>The {stadium.city} area has great shaded spots at nearby restaurants and bars for pre-game gatherings.</p>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title={`Finding Shaded Seats at ${stadium.name}`} defaultOpen={false} level="h2">
          <p>
            When searching for shaded seats at {stadium.name}, timing is everything. 
            {stadium.roof === 'open' ? 
              ` This open-air stadium in ${stadium.city} experiences varying sun exposure throughout the day. ` :
              stadium.roof === 'retractable' ?
              ` With its retractable roof, ${stadium.name} can provide complete shade when closed, but when open, sun exposure varies by section. ` :
              ` Thanks to its fixed roof, all seats at ${stadium.name} are protected from direct sunlight. `
            }
            The Shadium's real-time shade calculator helps you find the best shaded seats at {stadium.name} for any game time.
          </p>
          
          <h3>Best Shaded Seats at {stadium.name} by Game Time</h3>
          <ul>
            <li><strong>Day Games (12-3 PM):</strong> {stadium.roof !== 'open' ? 'All seats are shaded' : 'Upper deck sections and third base side offer the most shade'}</li>
            <li><strong>Afternoon Games (3-6 PM):</strong> {stadium.roof !== 'open' ? 'All seats remain shaded' : 'First base side begins to get shade as sun moves west'}</li>
            <li><strong>Evening Games (6 PM+):</strong> {stadium.roof !== 'open' ? 'Complete shade coverage' : 'Most sections have shade except far outfield'}</li>
          </ul>
          
          <h3>Tips for Avoiding Sun at {stadium.name}</h3>
          <p>
            To stay cool and avoid sun exposure during {stadium.team} games:
          </p>
          <ul>
            <li>Choose upper deck seats for maximum shade coverage during day games</li>
            <li>Sit on the third base side for afternoon shade</li>
            <li>Consider club level seats which often have overhead coverage</li>
            <li>Arrive early to claim shaded standing room areas</li>
            <li>Bring sunscreen and reapply every 2 hours for uncovered seats</li>
          </ul>
          
          <h3>Covered Seating Options at {stadium.name}</h3>
          <p>
            {stadium.roof === 'fixed' || stadium.roof === 'retractable' ?
              `All seats at ${stadium.name} can be covered when the roof is closed. ` :
              `While ${stadium.name} doesn't have a roof, several sections offer overhead coverage including club levels and premium seating areas. `
            }
            Use The Shadium to check which sections have permanent overhead coverage and which rely on the sun angle for shade.
          </p>
        </CollapsibleSection>

        <section className="cta-section">
          <h2>Plan Your Visit to {stadium.name}</h2>
          <p>
            Ready to find the perfect shaded seats for your next {stadium.team} game? 
            Use our real-time sun tracker to see exactly which sections will be shaded.
          </p>
          <Link href={`/?stadium=${stadium.id}`} className="cta-button">
            Check Real-Time Shade →
          </Link>
        </section>

        <section className="related-content">
          <h2>More Resources</h2>
          <div className="resources-grid">
            <Link href="/guide/how-to-find-shaded-seats" className="resource-card">
              <h3>How to Find Shaded Seats</h3>
              <p>Complete guide to finding shade at any MLB stadium</p>
            </Link>
            <Link href="/guide/best-shaded-seats-mlb" className="resource-card">
              <h3>Best Shaded Seats at Every Stadium</h3>
              <p>Compare shade options across all 30 MLB parks</p>
            </Link>
            <Link href="/faq" className="resource-card">
              <h3>Frequently Asked Questions</h3>
              <p>Get answers about shade, sun safety, and more</p>
            </Link>
          </div>
        </section>
        </div>
      </div>
      
      {/* SEO content for "are my seats in the shade" queries */}
      <SectionShadeSEO stadium={stadium} />
    </>
  );
};

export default StadiumGuide;