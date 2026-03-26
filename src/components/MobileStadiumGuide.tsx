'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Stadium } from '../data/stadiums';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import { StadiumAmenities } from '../data/stadiumAmenities';
import { stadiumHistories } from '../data/stadiumDetails';
import { SunIcon, CloudIcon, DropletIcon, MapPinIcon, ClockIcon, InfoIcon } from './Icons';
import { SectionShadeSEO } from './SectionShadeSEO';
import { StadiumShadeQuestions } from './StadiumShadeQuestions';
import { TableOfContents } from './TableOfContents';
import { CollapsibleSection } from './CollapsibleSection';
import { EnhancedSunFilter, SunFilterCriteria } from './EnhancedSunFilter';
import StadiumTitleBlock from './StadiumTitleBlock';
import { StadiumTitleData } from './StadiumTitleBlock';
import './MobileStadiumGuide.css';

interface MobileStadiumGuideProps {
  stadium: Stadium;
  sections: StadiumSection[];
  amenities: StadiumAmenities | null;
}

interface WeatherData {
  temperature: number;
  conditions: string;
  cloudCover: number;
}

const MobileStadiumGuide: React.FC<MobileStadiumGuideProps> = ({ stadium, sections, amenities }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedTime, setSelectedTime] = useState('13:00');
  const [averageWeather, setAverageWeather] = useState<WeatherData | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [filterCriteria, setFilterCriteria] = useState<SunFilterCriteria>({});
  const [filteredSections, setFilteredSections] = useState(sections);
  const guideContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  // Filter sections based on criteria
  useEffect(() => {
    let filtered = [...sections];
    
    if (filterCriteria.sunPreference) {
      if (filterCriteria.sunPreference === 'shade') {
        filtered = filtered.filter(s => s.covered || s.level === 'upper');
      } else if (filterCriteria.sunPreference === 'sun') {
        filtered = filtered.filter(s => !s.covered && s.level !== 'upper');
      }
    }
    
    if (filterCriteria.levels && filterCriteria.levels.length > 0) {
      filtered = filtered.filter(s => filterCriteria.levels?.includes(s.level));
    }
    
    if (filterCriteria.priceRange && filterCriteria.priceRange.length > 0) {
      filtered = filtered.filter(s => s.price && filterCriteria.priceRange?.includes(s.price));
    }
    
    setFilteredSections(filtered);
  }, [filterCriteria, sections]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const gameTimes = [
    { value: '12:00', label: '12:00 PM' },
    { value: '13:00', label: '1:00 PM' },
    { value: '16:00', label: '4:00 PM' },
    { value: '19:00', label: '7:00 PM' },
  ];

  const bestShadedSections = filteredSections
    .filter(section => section.covered || section.level === 'upper')
    .slice(0, 5);

  const sunscreenStations = amenities?.amenities.filter(a => a.type === 'sunscreen_kiosk') || [];
  const familyAmenities = amenities?.amenities.filter(a => 
    a.type === 'family_area' || 
    a.type === 'nursing_station' ||
    a.details.familyRestroom
  ) || [];

  const stadiumHistory = stadiumHistories[stadium.id];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  // Prepare data for StadiumTitleBlock
  const titleData: StadiumTitleData = {
    purpose: 'shade-guide',
    stadium: {
      name: stadium.name,
      id: stadium.id
    },
    team: {
      name: stadium.team,
      league: 'MLB'
    },
    quickFacts: {
      location: {
        city: stadium.city,
        state: stadium.state
      },
      capacity: stadium.capacity,
      orientation: stadium.orientation,
      roofType: stadium.roof,
      yearBuilt: stadiumHistory?.opened
    }
  };

  return (
    <div className="mobile-stadium-guide" ref={guideContentRef}>
      <StadiumTitleBlock
        data={titleData}
        showBreadcrumb={true}
        compact={true}
      />

      {/* Table of Contents for Mobile */}
      <TableOfContents containerRef={guideContentRef} />

      {/* Quick Facts Card */}
      <div className="mobile-card">
        <h2>Quick Facts</h2>
        <div className="quick-facts-grid">
          <div className="fact-item">
            <MapPinIcon size={20} />
            <span>{stadium.city}, {stadium.state}</span>
          </div>
          <div className="fact-item">
            <SunIcon size={20} />
            <span>Orientation: {stadium.orientation}°</span>
          </div>
          {stadium.roofHeight && (
            <div className="fact-item special">
              <span>✨ Enhanced Shade Calculations</span>
            </div>
          )}
        </div>
      </div>

      {/* Section Filter */}
      <EnhancedSunFilter
        onFilterChange={setFilterCriteria}
        disabled={false}
        isMobile={true}
      />

      {/* Best Shaded Sections */}
      <div className="mobile-card">
        <h2>Best Shaded Sections</h2>
        <div className="shaded-sections-list">
          {bestShadedSections.map(section => (
            <div key={section.id} className="shaded-section-item">
              <div className="section-header" onClick={() => toggleSection(section.id)}>
                <h3>{section.name}</h3>
                <span className="expand-icon">{expandedSection === section.id ? '−' : '+'}</span>
              </div>
              {expandedSection === section.id && (
                <div className="section-details">
                  <p>Level: {section.level}</p>
                  {section.price && <p>Price Tier: {section.price}</p>}
                  {section.covered && <p className="covered-badge">✓ Covered</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Weather Patterns */}
      <div className="mobile-card">
        <h2>Typical Weather</h2>
        <div className="weather-selector">
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="mobile-select"
          >
            {[3, 4, 5, 6, 7, 8, 9].map(month => (
              <option key={month} value={month}>{months[month]}</option>
            ))}
          </select>
        </div>
        {averageWeather && (
          <div className="weather-info">
            <div className="weather-stat">
              <SunIcon size={24} />
              <span>{averageWeather.temperature}°F</span>
            </div>
            <div className="weather-stat">
              <CloudIcon size={24} />
              <span>{averageWeather.conditions}</span>
            </div>
            <div className="weather-stat">
              <DropletIcon size={24} />
              <span>{averageWeather.cloudCover}% clouds</span>
            </div>
          </div>
        )}
      </div>

      {/* Are My Seats Shaded FAQ */}
      <StadiumShadeQuestions stadium={stadium} />
      
      {/* Sun Protection Tips */}
      <div className="mobile-card">
        <h2>Sun Protection Tips</h2>
        <ul className="tips-list">
          <li>Arrive early to find shaded concourse areas</li>
          <li>Bring sunscreen and reapply every 2 hours</li>
          <li>Wear a hat with a wide brim</li>
          <li>Consider UV-protective clothing</li>
          {sunscreenStations.length > 0 && (
            <li className="special-tip">
              <InfoIcon size={16} />
              Free sunscreen available at {sunscreenStations.length} locations
            </li>
          )}
        </ul>
      </div>

      {/* Stadium History */}
      {stadiumHistory && (
        <div className="mobile-card">
          <h2>Stadium Information</h2>
          <div className="stadium-info">
            <p className="info-item">
              <strong>Opened:</strong> {stadiumHistory.opened}
            </p>
            {stadiumHistory.previousNames && stadiumHistory.previousNames.length > 0 && (
              <p className="info-item">
                <strong>Previous Names:</strong> {stadiumHistory.previousNames.join(', ')}
              </p>
            )}
          </div>
          {stadiumHistory.shadeFeatures && stadiumHistory.shadeFeatures.length > 0 && (
            <div className="shade-features">
              <h3>Shade Features</h3>
              <ul>
                {stadiumHistory.shadeFeatures.map((item, index) => (
                  <li key={index}>
                    <strong>{item.year}:</strong> {item.feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stadiumHistory.funFacts && stadiumHistory.funFacts.length > 0 && (
            <div className="fun-facts">
              <h3>Fun Facts</h3>
              <ul>
                {stadiumHistory.funFacts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Family Amenities */}
      {familyAmenities.length > 0 && (
        <div className="mobile-card">
          <h2>Family Amenities</h2>
          <div className="amenities-list">
            {familyAmenities.map(amenity => (
              <div key={amenity.id} className="amenity-item">
                <h4>{amenity.name}</h4>
                <p>Level: {amenity.level}</p>
                {amenity.location.section && <p>Near Section: {amenity.location.section}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="mobile-cta-section">
        <Link href={`/?stadium=${stadium.id}`} className="cta-button">
          Check Sun Exposure for a Game
        </Link>
        <p className="cta-text">
          Get real-time sun tracking for any {stadium.team} game
        </p>
      </div>
      
      {/* SEO content for "are my seats in the shade" queries */}
      <SectionShadeSEO stadium={stadium} />
    </div>
  );
};

export default MobileStadiumGuide;