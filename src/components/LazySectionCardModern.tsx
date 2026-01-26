import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import type { RowShadowData } from '../utils/sunCalculator';
import { CloudIcon, PartlyCloudyIcon, SunIcon, FireIcon, FieldLevelIcon, LowerLevelIcon, ClubLevelIcon, UpperLevelIcon, CrownIcon } from './Icons';
import { formatPercentageForScreenReader, announceToScreenReader } from '../utils/accessibility';
import { RowBreakdownView } from './RowBreakdownView';

interface LazySectionCardProps {
  section: StadiumSection;
  sunExposure: number;
  inSun: boolean;
  index: number;
  timeInSun?: number;
  rowData?: RowShadowData[];
}

const LazySectionCardModernComponent: React.FC<LazySectionCardProps> = ({
  section,
  sunExposure,
  inSun,
  index,
  timeInSun,
  rowData,
}) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: '200px',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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


  const getSunExposureColorClass = (exposure: number): string => {
    if (exposure === 0) return 'from-gray-100 to-gray-200 border-gray-300';
    if (exposure < 25) return 'from-blue-100 to-sky-100 border-blue-300';
    if (exposure < 50) return 'from-amber-100 to-yellow-100 border-amber-300';
    if (exposure < 75) return 'from-orange-100 to-amber-100 border-orange-300';
    return 'from-red-100 to-orange-100 border-red-300';
  };

  const handleClick = () => {
    if (rowData && rowData.length > 0) {
      setIsExpanded(!isExpanded);
      haptic.light();
      const announcement = isExpanded
        ? `Collapsed row details for section ${section.name}`
        : `Expanded row details for section ${section.name}`;
      announceToScreenReader(announcement, 'polite');
    } else {
      haptic.light();
      const announcement = `Selected section ${section.name}. ${formatPercentageForScreenReader(roundedExposure)}`;
      announceToScreenReader(announcement, 'polite');
    }
  };

  // Calculate row summary
  const getRowSummary = () => {
    if (!rowData || rowData.length === 0) return null;

    // Sort by coverage descending to get best rows
    const sortedByCoverage = [...rowData].sort((a, b) => b.coverage - a.coverage);
    const bestRows = sortedByCoverage.slice(0, Math.min(5, rowData.length));
    const worstRows = sortedByCoverage.slice(-Math.min(5, rowData.length)).reverse();

    return {
      bestRows: bestRows.map(r => r.rowNumber).join(', '),
      worstRows: worstRows.map(r => r.rowNumber).join(', '),
      totalRows: rowData.length,
    };
  };

  const rowSummary = getRowSummary();

  return (
    <div
      ref={ref}
      className={`
        group relative overflow-hidden rounded-2xl transition-all duration-300
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4'}
        ${getSunExposureColorClass(roundedExposure)}
        bg-gradient-to-br hover:shadow-card-hover hover:-translate-y-1 cursor-pointer
        backdrop-blur-sm border-[3px] shadow-lg
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
        <div className="relative p-5 space-y-3">
          {/* Header with section name and sun indicator */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-accent-600 transition-colors">
                {section.name}
              </h3>
            </div>

            {/* Sun exposure indicator with animation */}
            <div className="flex flex-col items-center gap-1">
              <div className="p-2 rounded-xl bg-white/50 shadow-sm group-hover:animate-pulse-slow">
                {getSunExposureIcon(sunExposure)}
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {roundedExposure}%
                <span className="sr-only"> of game in sun</span>
              </span>
            </div>
          </div>

          {/* Level badge - always shown */}
          <div className="flex flex-wrap gap-2">
            <span className={`
              inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium
              ${section.level === 'field' ? 'bg-purple-100 text-purple-700' :
                section.level === 'lower' ? 'bg-blue-100 text-blue-700' :
                section.level === 'club' ? 'bg-green-100 text-green-700' :
                section.level === 'upper' ? 'bg-amber-100 text-amber-700' :
                section.level === 'suite' ? 'bg-pink-100 text-pink-700' :
                'bg-gray-100 text-gray-700'}
            `}>
              {section.level === 'field' && <FieldLevelIcon size={14} />}
              {section.level === 'lower' && <LowerLevelIcon size={14} />}
              {section.level === 'club' && <ClubLevelIcon size={14} />}
              {section.level === 'upper' && <UpperLevelIcon size={14} />}
              {section.level === 'suite' && <CrownIcon size={14} />}
              <span>{section.level.charAt(0).toUpperCase() + section.level.slice(1)} Level</span>
            </span>
          </div>

          {/* Row summary if available */}
          {rowSummary && (
            <div className="mt-2 text-xs text-gray-700 space-y-1 bg-white/40 rounded-lg p-2">
              <div>
                <span className="font-medium">Best shade rows:</span> {rowSummary.bestRows}
              </div>
              <div>
                <span className="font-medium">Most sun rows:</span> {rowSummary.worstRows}
              </div>
            </div>
          )}

          {/* View Row Details button */}
          {rowData && rowData.length > 0 && (
            <div className="mt-2">
              <button
                className="w-full px-3 py-2 text-sm font-medium text-accent-700 bg-accent-50 rounded-lg hover:bg-accent-100 transition-colors border border-accent-200"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Hide row details' : 'View row details'}
              >
                {isExpanded ? 'Hide Row Details' : 'View Row Details'}
              </button>
            </div>
          )}

          {/* Expanded row breakdown */}
          {isExpanded && rowData && (
            <div className="mt-4 -mx-5 -mb-5 px-5 pb-5 pt-4 bg-white/60 border-t border-gray-200">
              <RowBreakdownView
                sectionId={section.id}
                sectionName={section.name}
                rows={rowData}
                onClose={() => setIsExpanded(false)}
              />
            </div>
          )}

          {/* Animated hover indicator */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-400 to-accent-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </div>
      ) : (
        <div className="p-5 space-y-3">
          {/* Skeleton with shimmer effect */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="h-6 bg-gray-200 rounded-lg skeleton-shimmer" style={{ width: '60%' }} />
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-xl skeleton-shimmer" />
          </div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded-full skeleton-shimmer" style={{ width: '80px' }} />
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
    prevProps.index === nextProps.index &&
    prevProps.rowData === nextProps.rowData
  );
});