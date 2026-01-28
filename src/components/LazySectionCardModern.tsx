import React, { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import type { StadiumSection } from '../data/stadiumSectionTypes';
import type { RowShadowData } from '../utils/sunCalculator';
import { CloudIcon, PartlyCloudyIcon, SunIcon, FireIcon, FieldLevelIcon, LowerLevelIcon, ClubLevelIcon, UpperLevelIcon, CrownIcon, ValuePriceIcon, ModeratePriceIcon, PremiumPriceIcon, LuxuryPriceIcon, UmbrellaIcon, ChevronDownIcon, ChevronUpIcon } from './Icons';
import { formatPercentageForScreenReader, announceToScreenReader } from '../utils/accessibility';
import { RowDetailView } from './RowDetailView/RowDetailView';
import { WorldCupBadge } from './WorldCupBadge';

interface LazySectionCardProps {
  section: StadiumSection;
  sunExposure: number;
  inSun: boolean;
  index: number;
  timeInSun?: number;
  rowData?: RowShadowData[];
  stadiumId?: string;
  worldCupMatchCount?: number;
  worldCupCountry?: 'USA' | 'Mexico' | 'Canada';
  comparisonMode?: boolean;
  isSelected?: boolean;
  onToggleSelection?: (sectionId: string) => void;
  /** Show persistent expand/collapse indicator chevron */
  showExpandIndicator?: boolean;
  /** Highlight this card (for diagram sync) */
  isHighlighted?: boolean;
  /** Callback when card is clicked for selection (diagram sync) */
  onCardSelect?: (sectionId: string) => void;
}

const LazySectionCardModernComponent: React.FC<LazySectionCardProps> = ({
  section,
  sunExposure,
  inSun,
  index,
  timeInSun,
  rowData,
  stadiumId,
  worldCupMatchCount,
  worldCupCountry,
  comparisonMode = false,
  isSelected = false,
  onToggleSelection,
  showExpandIndicator = false,
  isHighlighted = false,
  onCardSelect,
}) => {
  const [intersectionRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.01,
    rootMargin: '200px',
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const expandedContentRef = useRef<HTMLDivElement>(null);
  const haptic = useHapticFeedback();
  const roundedExposure = Math.round(sunExposure);

  useEffect(() => {
    if (isIntersecting && !isLoaded) {
      setIsLoaded(true);
    }
  }, [isIntersecting, isLoaded]);

  const getSunExposureIcon = (exposure: number) => {
    // Larger icons for better visibility (32px instead of 24px)
    if (exposure === 0) return <CloudIcon size={32} />;
    if (exposure < 25) return <PartlyCloudyIcon size={32} />;
    if (exposure < 50) return <SunIcon size={32} color="#f59e0b" />;
    if (exposure < 75) return <SunIcon size={32} color="#f97316" />;
    return <FireIcon size={32} color="#dc2626" />;
  };

  const getPriceIcon = (price?: 'value' | 'moderate' | 'premium' | 'luxury') => {
    if (!price) return null;
    const iconSize = 16;
    switch (price) {
      case 'value':
        return <ValuePriceIcon size={iconSize} color="#059669" />;
      case 'moderate':
        return <ModeratePriceIcon size={iconSize} color="#3b82f6" />;
      case 'premium':
        return <PremiumPriceIcon size={iconSize} color="#f59e0b" />;
      case 'luxury':
        return <LuxuryPriceIcon size={iconSize} color="#dc2626" />;
    }
  };

  const getPriceBadgeClass = (price?: 'value' | 'moderate' | 'premium' | 'luxury') => {
    if (!price) return 'bg-gray-100 text-gray-700 border-gray-300';
    switch (price) {
      case 'value':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'moderate':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'premium':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'luxury':
        return 'bg-red-100 text-red-700 border-red-300';
    }
  };


  const getSunExposureColorClass = (exposure: number): string => {
    if (exposure === 0) return 'from-gray-100 to-gray-200 border-gray-300';
    if (exposure < 25) return 'from-blue-100 to-sky-100 border-blue-300';
    if (exposure < 50) return 'from-amber-100 to-yellow-100 border-amber-300';
    if (exposure < 75) return 'from-orange-100 to-amber-100 border-orange-300';
    return 'from-red-100 to-orange-100 border-red-300';
  };

  const handleClick = (e: React.MouseEvent) => {
    // Don't handle click if it's on the checkbox
    if (comparisonMode && onToggleSelection) {
      return; // Let checkbox handle the event
    }

    // Notify parent of card selection (for diagram sync)
    if (onCardSelect) {
      onCardSelect(section.id);
    }

    if (rowData && rowData.length > 0) {
      // Store scroll position before expansion
      const currentScrollY = window.scrollY;
      const cardTop = intersectionRef.current?.getBoundingClientRect().top || 0;

      setIsExpanded(!isExpanded);
      haptic.light();

      // Preserve scroll position after expansion
      if (!isExpanded) {
        requestAnimationFrame(() => {
          const newCardTop = intersectionRef.current?.getBoundingClientRect().top || 0;
          const scrollAdjustment = newCardTop - cardTop;
          window.scrollTo(0, currentScrollY + scrollAdjustment);
        });
      }

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

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleSelection) {
      onToggleSelection(section.id);
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

  // Determine if card has expandable content
  const hasExpandableContent = rowData && rowData.length > 0;
  const shouldShowExpandIndicator = showExpandIndicator || hasExpandableContent;

  return (
    <div
      ref={intersectionRef}
      className={`
        group relative overflow-hidden rounded-2xl transition-all duration-300 ease-in-out
        ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-30 translate-y-4'}
        ${getSunExposureColorClass(roundedExposure)}
        bg-gradient-to-br hover:shadow-card-hover hover:-translate-y-1 cursor-pointer
        backdrop-blur-sm border-[3px] shadow-lg
        ${isExpanded ? 'ring-4 ring-accent-300 shadow-2xl' : ''}
        ${isHighlighted ? 'ring-4 ring-blue-500 shadow-2xl scale-[1.02] z-10' : ''}
      `}
      data-exposure={roundedExposure}
      data-section={section.id}
      data-section-id={section.id}
      data-highlighted={isHighlighted}
      role={hasExpandableContent ? 'button' : 'article'}
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as unknown as React.MouseEvent);
        }
      }}
      aria-label={`Section ${section.name}, ${formatPercentageForScreenReader(roundedExposure)}, ${section.level} level${section.covered ? ', covered section' : ''}${isHighlighted ? ', currently selected' : ''}`}
      aria-expanded={hasExpandableContent ? isExpanded : undefined}
    >
      {/* Glass morphism overlay effect */}
      <div className="absolute inset-0 bg-white/30 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {isLoaded ? (
        <div className="relative p-5 space-y-3">
          {/* Comparison mode checkbox */}
          {comparisonMode && onToggleSelection && (
            <div className="absolute top-3 right-3 z-10">
              <button
                onClick={handleCheckboxClick}
                className={`
                  w-8 h-8 rounded-md border-2 flex items-center justify-center
                  transition-all min-w-[44px] min-h-[44px] md:min-w-[32px] md:min-h-[32px]
                  ${isSelected
                    ? 'bg-blue-600 border-blue-600'
                    : 'bg-white border-gray-300 hover:border-blue-400'
                  }
                `}
                aria-label={isSelected ? `Deselect section ${section.name}` : `Select section ${section.name}`}
                aria-pressed={isSelected}
              >
                {isSelected && (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M16 6L8 14L4 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            </div>
          )}

          {/* Header with section name and sun indicator */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-accent-600 transition-colors">
                  {section.name}
                </h3>
                {/* Expand indicator chevron */}
                {shouldShowExpandIndicator && (
                  <span
                    className={`
                      inline-flex items-center justify-center w-6 h-6 rounded-full
                      bg-gray-200/70 text-gray-600 transition-all duration-300
                      group-hover:bg-accent-100 group-hover:text-accent-600
                      ${isExpanded ? 'rotate-180' : 'rotate-0'}
                    `}
                    aria-hidden="true"
                  >
                    <ChevronDownIcon size={16} />
                  </span>
                )}
              </div>
              {section.covered && (
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-700">
                  <UmbrellaIcon size={16} color="#059669" />
                  <span className="font-medium text-green-700">Covered</span>
                </div>
              )}
            </div>

            {/* Sun exposure indicator with larger, more prominent display */}
            <div className="flex flex-col items-center gap-2 min-w-[90px]">
              <div className="p-3 rounded-xl bg-white/60 shadow-md group-hover:scale-110 transition-transform duration-200">
                {getSunExposureIcon(sunExposure)}
              </div>
              <div className="text-center">
                <div className="text-4xl font-extrabold text-gray-900 leading-none">
                  {roundedExposure}
                  <span className="text-2xl">%</span>
                </div>
                <div className="text-xs text-gray-600 font-medium mt-0.5">in sun</div>
                <span className="sr-only">{formatPercentageForScreenReader(roundedExposure)} of game in sun</span>
              </div>
            </div>
          </div>

          {/* Badges - Level badge, Price badge, and World Cup badge */}
          <div className="flex flex-wrap gap-2">
            {/* Level Badge */}
            <span className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2
              ${section.level === 'field' ? 'bg-purple-100 text-purple-800 border-purple-300' :
                section.level === 'lower' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                section.level === 'club' ? 'bg-green-100 text-green-800 border-green-300' :
                section.level === 'upper' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                section.level === 'suite' ? 'bg-pink-100 text-pink-800 border-pink-300' :
                'bg-gray-100 text-gray-800 border-gray-300'}
            `}>
              {section.level === 'field' && <FieldLevelIcon size={16} />}
              {section.level === 'lower' && <LowerLevelIcon size={16} />}
              {section.level === 'club' && <ClubLevelIcon size={16} />}
              {section.level === 'upper' && <UpperLevelIcon size={16} />}
              {section.level === 'suite' && <CrownIcon size={16} />}
              <span>{section.level.charAt(0).toUpperCase() + section.level.slice(1)} Level</span>
            </span>

            {/* Price Badge */}
            {section.price && (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 ${getPriceBadgeClass(section.price)}`}>
                {getPriceIcon(section.price)}
                <span>{section.price.charAt(0).toUpperCase() + section.price.slice(1)}</span>
              </span>
            )}

            {/* World Cup Badge */}
            <WorldCupBadge
              stadiumId={stadiumId}
              matchCount={worldCupMatchCount}
              variant="small"
              showMatchCount={false}
              country={worldCupCountry}
            />
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

          {/* View Row Details button - Enhanced with icon and better styling */}
          {rowData && rowData.length > 0 && (
            <div className="mt-3">
              <button
                className="w-full px-4 py-3 text-sm font-semibold text-accent-700 bg-accent-50 rounded-xl hover:bg-accent-100 active:bg-accent-200 transition-all border-2 border-accent-300 hover:border-accent-400 flex items-center justify-center gap-2 min-h-[44px]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick(e as any);
                }}
                aria-expanded={isExpanded}
                aria-label={isExpanded ? 'Hide row details' : 'View row details'}
              >
                <span>{isExpanded ? 'Hide' : 'View'} Row Details</span>
                {isExpanded ? <ChevronUpIcon size={18} /> : <ChevronDownIcon size={18} />}
              </button>
            </div>
          )}

          {/* Expanded row breakdown with smooth animation */}
          <div
            ref={expandedContentRef}
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
            aria-hidden={!isExpanded}
          >
            {isExpanded && rowData && (
              <div className="mt-4 -mx-5 -mb-5 px-5 pb-5 pt-4 bg-white/70 border-t-2 border-gray-300 animate-fadeIn">
                <RowDetailView
                  sectionId={section.id}
                  sectionName={section.name}
                  rows={rowData}
                  onClose={() => setIsExpanded(false)}
                />
              </div>
            )}
          </div>

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
    prevProps.rowData === nextProps.rowData &&
    prevProps.isHighlighted === nextProps.isHighlighted &&
    prevProps.showExpandIndicator === nextProps.showExpandIndicator &&
    prevProps.isSelected === nextProps.isSelected
  );
});