import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { StadiumSection } from '../data/stadiumSections';

interface LazySectionCardProps {
  section: StadiumSection;
  sunExposure: number;
  inSun: boolean;
  index: number;
}

export const LazySectionCard: React.FC<LazySectionCardProps> = ({
  section,
  sunExposure,
  inSun,
  index,
}) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const haptic = useHapticFeedback();
  const roundedExposure = Math.round(sunExposure);

  useEffect(() => {
    if (isIntersecting && !isLoaded) {
      // Simulate loading delay for smooth appearance
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isIntersecting, isLoaded]);

  const getSunExposureIcon = (exposure: number): string => {
    if (exposure === 0) return '🌫️';
    if (exposure < 25) return '⛅';
    if (exposure < 50) return '🌤️';
    if (exposure < 75) return '☀️';
    return '🔥';
  };

  const handleClick = () => {
    haptic.light();
    // Add your click handler logic here
  };

  return (
    <div 
      ref={ref}
      className={`section-card ${isLoaded ? 'loaded' : 'loading'}`}
      data-exposure={roundedExposure}
      data-section={section.id}
      role="listitem"
      tabIndex={0}
      onClick={handleClick}
      aria-label={`Section ${section.name}, ${roundedExposure}% sun exposure, ${section.level} level${section.covered ? ', covered' : ''}`}
      style={{
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
      }}
    >
      {isLoaded ? (
        <>
          <div className="section-header">
            <h3>{section.name}</h3>
            <div className="sun-indicator">
              <span className="sun-icon">{getSunExposureIcon(sunExposure)}</span>
              <span className="exposure-text">{roundedExposure}% sun</span>
            </div>
          </div>
          <div className="section-meta">
            <span className="section-level">
              {section.level === 'field' ? 'Field Level' : 
               section.level === 'lower' ? 'Lower Level' : 
               section.level === 'club' ? 'Club Level' : 
               section.level === 'upper' ? 'Upper Level' : 
               section.level === 'suite' ? 'Suite Level' : section.level}
            </span>
            {section.price && (
              <span className={`price-tier ${section.price}`}>
                {section.price.charAt(0).toUpperCase() + section.price.slice(1)}
              </span>
            )}
          </div>
          <div className="section-direction">
            {Math.round(section.baseAngle)}°-{Math.round(section.baseAngle + section.angleSpan)}°
          </div>
        </>
      ) : (
        <div className="section-skeleton">
          <div className="skeleton-header"></div>
          <div className="skeleton-meta"></div>
          <div className="skeleton-direction"></div>
        </div>
      )}
    </div>
  );
};