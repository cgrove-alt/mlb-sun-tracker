import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import { CloudIcon, PartlyCloudyIcon, SunIcon, FireIcon } from './Icons';
import { Tooltip } from './Tooltip';
import { formatPercentageForScreenReader, announceToScreenReader } from '../utils/accessibility';

interface LazySectionCardProps {
  section: StadiumSection;
  sunExposure: number;
  inSun: boolean;
  index: number;
  timeInSun?: number;
}

const LazySectionCardModernComponent: React.FC<LazySectionCardProps> = ({
  section,
  sunExposure,
  inSun,
  index,
  timeInSun,
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
    if (exposure === 0) return <CloudIcon size={24} />;
    if (exposure < 25) return <PartlyCloudyIcon size={24} />;
    if (exposure < 50) return <SunIcon size={24} color="#f59e0b" />;
    if (exposure < 75) return <SunIcon size={24} color="#f97316" />;
    return <FireIcon size={24} color="#dc2626" />;
  };

  const getSunExposureDescription = (exposure: number, minutes?: number): string => {
    if (exposure === 0) return 'No sun during game';
    if (exposure < 25) return minutes ? `Sun for ~${Math.round(minutes)} min` : 'Minimal sun';
    if (exposure < 50) return minutes ? `Sun for ~${Math.round(minutes)} min` : 'Some sun';
    if (exposure < 75) return minutes ? `Sun for ~${Math.round(minutes)} min` : 'Mostly sun';
    return minutes ? `Sun for ~${Math.round(minutes)} min` : 'Full sun';
  };

  const getSunExposureColorClass = (exposure: number): string => {
    if (exposure === 0) return 'from-gray-50 to-gray-100 border-gray-200';
    if (exposure < 25) return 'from-blue-50 to-sky-50 border-blue-200';
    if (exposure < 50) return 'from-amber-50 to-yellow-50 border-amber-200';
    if (exposure < 75) return 'from-orange-50 to-amber-50 border-orange-200';
    return 'from-red-50 to-orange-50 border-red-200';
  };

  const handleClick = () => {
    haptic.light();
    const announcement = `Selected section ${section.name}. ${formatPercentageForScreenReader(roundedExposure)}`;
    announceToScreenReader(announcement, 'polite');
  };

  return (
    <div 
      ref={ref}
      className={`
        group relative overflow-hidden rounded-2xl border-2 transition-all duration-300
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4'}
        ${getSunExposureColorClass(roundedExposure)}
        bg-gradient-to-br hover:shadow-card-hover hover:-translate-y-1 cursor-pointer
        backdrop-blur-sm
      `}
      data-exposure={roundedExposure}
      data-section={section.id}
      role="listitem"
      tabIndex={0}
      onClick={handleClick}
      aria-label={`Section ${section.name}, ${formatPercentageForScreenReader(roundedExposure)}, ${section.level} level${section.covered ? ', covered section' : ''}`}
    >
      {/* Glass morphism overlay effect */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {isLoaded ? (
        <div className="relative p-5 space-y-4">
          {/* Header with section name and sun indicator */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-accent-600 transition-colors">
                {section.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-gray-500">
                  {Math.round(section.baseAngle)}°-{Math.round(section.baseAngle + section.angleSpan)}°
                </span>
              </div>
            </div>
            
            {/* Sun exposure indicator with animation */}
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-xl bg-white/50 shadow-sm group-hover:animate-pulse-slow">
                {getSunExposureIcon(sunExposure)}
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {roundedExposure}%
                <span className="sr-only"> of game in sun - {getSunExposureDescription(sunExposure, timeInSun)}</span>
              </span>
            </div>
          </div>

          {/* Sun exposure description */}
          <p className="text-sm text-gray-600 font-medium">
            {getSunExposureDescription(sunExposure, timeInSun)}
          </p>

          {/* Meta information with badges */}
          <div className="flex flex-wrap gap-2">
            {/* Level badge */}
            <span className={`
              inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
              ${section.level === 'field' ? 'bg-purple-100 text-purple-700' : 
                section.level === 'lower' ? 'bg-blue-100 text-blue-700' : 
                section.level === 'club' ? 'bg-green-100 text-green-700' : 
                section.level === 'upper' ? 'bg-amber-100 text-amber-700' : 
                section.level === 'suite' ? 'bg-pink-100 text-pink-700' : 
                'bg-gray-100 text-gray-700'}
            `}>
              {section.level === 'field' ? '⚾ Field Level' : 
               section.level === 'lower' ? '🏟️ Lower Level' : 
               section.level === 'club' ? '🎫 Club Level' : 
               section.level === 'upper' ? '🔝 Upper Level' : 
               section.level === 'suite' ? '✨ Suite Level' : section.level}
            </span>

            {/* Covered indicator */}
            {section.covered && (
              <Tooltip content="This section has a roof or overhang providing protection from sun and rain">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-700 cursor-help">
                  🏛️ Covered
                </span>
              </Tooltip>
            )}

            {/* Price tier */}
            {section.price && (
              <span className={`
                inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                ${section.price === 'premium' ? 'bg-yellow-100 text-yellow-800' :
                  section.price === 'moderate' ? 'bg-sky-100 text-sky-700' :
                  'bg-gray-100 text-gray-700'}
              `}>
                {section.price === 'premium' ? '💎' : section.price === 'moderate' ? '💵' : '💸'} {section.price.charAt(0).toUpperCase() + section.price.slice(1)}
              </span>
            )}
          </div>

          {/* Animated hover indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 to-accent-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </div>
      ) : (
        <div className="p-5 space-y-4">
          {/* Skeleton with shimmer effect */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded-lg skeleton-shimmer" style={{ width: '60%' }} />
              <div className="h-4 bg-gray-200 rounded-lg skeleton-shimmer" style={{ width: '40%' }} />
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-xl skeleton-shimmer" />
          </div>
          <div className="h-4 bg-gray-200 rounded-lg skeleton-shimmer" style={{ width: '80%' }} />
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full skeleton-shimmer" style={{ width: '80px' }} />
            <div className="h-6 bg-gray-200 rounded-full skeleton-shimmer" style={{ width: '60px' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export const LazySectionCardModern = React.memo(LazySectionCardModernComponent, (prevProps, nextProps) => {
  return (
    prevProps.section.id === nextProps.section.id &&
    prevProps.sunExposure === nextProps.sunExposure &&
    prevProps.inSun === nextProps.inSun &&
    prevProps.index === nextProps.index
  );
});