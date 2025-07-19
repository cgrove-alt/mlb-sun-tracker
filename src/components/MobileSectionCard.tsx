import React from 'react';
import { StadiumSection } from '../data/stadiumSections';
import './MobileSectionCard.css';

interface MobileSectionCardProps {
  section: StadiumSection;
  sunExposure: number;
  inSun: boolean;
  onClick?: () => void;
}

export const MobileSectionCard: React.FC<MobileSectionCardProps> = ({
  section,
  sunExposure,
  inSun,
  onClick
}) => {
  const getSunIcon = () => {
    if (sunExposure === 0) return '🌑';
    if (sunExposure < 25) return '🌘';
    if (sunExposure < 50) return '🌗';
    if (sunExposure < 75) return '🌖';
    return '☀️';
  };

  const getSunDescription = () => {
    if (sunExposure === 0) return 'Fully shaded';
    if (sunExposure < 25) return 'Mostly shaded';
    if (sunExposure < 50) return 'Partial sun';
    if (sunExposure < 75) return 'Mostly sunny';
    return 'Full sun';
  };

  const getSunClass = () => {
    if (sunExposure === 0) return 'shade-full';
    if (sunExposure < 25) return 'shade-most';
    if (sunExposure < 50) return 'sun-partial';
    if (sunExposure < 75) return 'sun-most';
    return 'sun-full';
  };

  return (
    <button 
      className={`mobile-section-card ${getSunClass()}`}
      onClick={onClick}
      aria-label={`Section ${section.id}, ${getSunDescription()}`}
    >
      <div className="mobile-section-header">
        <div className="mobile-section-info">
          <h3 className="mobile-section-name">Section {section.id}</h3>
          <p className="mobile-section-level">{section.level.charAt(0).toUpperCase() + section.level.slice(1)} Level</p>
        </div>
        <div className="mobile-section-sun">
          <span className="mobile-section-sun-icon">{getSunIcon()}</span>
          <span className="mobile-section-sun-percent">{Math.round(sunExposure)}%</span>
        </div>
      </div>
      
      <div className="mobile-section-details">
        <div className="mobile-section-detail">
          <span className="mobile-section-detail-label">Sun exposure</span>
          <span className="mobile-section-detail-value">{getSunDescription()}</span>
        </div>
        {section.price && (
          <div className="mobile-section-detail">
            <span className="mobile-section-detail-label">Price Tier</span>
            <span className="mobile-section-detail-value">{section.price.charAt(0).toUpperCase() + section.price.slice(1)}</span>
          </div>
        )}
      </div>

      <div className="mobile-section-visual">
        <div className="mobile-section-sun-bar">
          <div 
            className="mobile-section-sun-fill" 
            style={{ width: `${sunExposure}%` }}
          />
        </div>
      </div>
    </button>
  );
};