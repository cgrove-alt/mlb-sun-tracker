import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { StadiumSection } from '../data/stadiumSections';
import { CloudIcon, PartlyCloudyIcon, SunIcon, FireIcon } from './Icons';

interface LazySectionCardProps {
  section: StadiumSection;
  sunExposure: number;
  inSun: boolean;
  index: number;
}

const LazySectionCardComponent: React.FC<LazySectionCardProps> = ({
  section,
  sunExposure,
  inSun,
  index,
}) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: '200px',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const haptic = useHapticFeedback();
  const roundedExposure = Math.round(sunExposure);

  useEffect(() => {
    if (isIntersecting && !isLoaded) {
      setIsLoaded(true);
    }
  }, [isIntersecting, isLoaded]);

  const getSunExposureIcon = (exposure: number) => {
    if (exposure === 0) return <CloudIcon size={20} />;
    if (exposure < 25) return <PartlyCloudyIcon size={20} />;
    if (exposure < 50) return <SunIcon size={20} color="#f59e0b" />;
    if (exposure < 75) return <SunIcon size={20} color="#f97316" />;
    return <FireIcon size={20} color="#dc2626" />;
  };

  const getSunExposureDescription = (exposure: number): string => {
    if (exposure === 0) return 'Fully shaded';
    if (exposure < 25) return 'Mostly shaded';
    if (exposure < 50) return 'Partially sunny';
    if (exposure < 75) return 'Mostly sunny';
    return 'Full sun exposure';
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
        opacity: isLoaded ? 1 : 0.3,
        transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.2s ease, transform 0.2s ease',
      }}
    >
      {isLoaded ? (
        <>
          <div className="section-header">
            <h3>{section.name}</h3>
            <div className="sun-indicator">
              <span className="sun-icon" aria-hidden="true">{getSunExposureIcon(sunExposure)}</span>
              <span className="exposure-text">
                {roundedExposure}% sun
                <span className="sr-only"> - {getSunExposureDescription(sunExposure)}</span>
              </span>
              <span className="exposure-description" aria-hidden="true">
                {getSunExposureDescription(sunExposure)}
              </span>
            </div>
          </div>
          <div className="section-meta">
            <span className="section-level" aria-label={`Seating level: ${section.level}`}>
              {section.level === 'field' ? 'Field Level' : 
               section.level === 'lower' ? 'Lower Level' : 
               section.level === 'club' ? 'Club Level' : 
               section.level === 'upper' ? 'Upper Level' : 
               section.level === 'suite' ? 'Suite Level' : section.level}
            </span>
            {section.price && (
              <span className={`price-tier ${section.price}`} aria-label={`Price tier: ${section.price}`}>
                {section.price.charAt(0).toUpperCase() + section.price.slice(1)}
              </span>
            )}
          </div>
          <div className="section-direction" aria-label={`Section orientation: ${Math.round(section.baseAngle)} to ${Math.round(section.baseAngle + section.angleSpan)} degrees`}>
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

export const LazySectionCard = React.memo(LazySectionCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.section.id === nextProps.section.id &&
    prevProps.sunExposure === nextProps.sunExposure &&
    prevProps.inSun === nextProps.inSun &&
    prevProps.index === nextProps.index
  );
});