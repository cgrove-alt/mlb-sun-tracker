import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SeatingSectionSun } from '../utils/sunCalculations';
import { preferencesStorage } from '../utils/preferences';
import { Tooltip } from './Tooltip';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { LazySectionCardModern as LazySectionCard } from './LazySectionCardModern';
import { VirtualSectionList } from './VirtualSectionList';
import { ListIcon, SearchIcon, SunIcon, CloudIcon, CloseIcon, BaseballIcon, TicketIcon, CrownIcon, StadiumIcon, FieldLevelIcon, LowerLevelIcon, ClubLevelIcon, UpperLevelIcon, ValuePriceIcon, ModeratePriceIcon, PremiumPriceIcon, LuxuryPriceIcon, MoneyIcon, PartlyCloudyIcon, FireIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';
import SectionFilters, { SectionFilterValues } from './SectionFilters/SectionFilters';
import './SectionList.css';

interface SectionListProps {
  sections: SeatingSectionSun[];
  loading?: boolean;
  calculationProgress?: { completed: number; total: number } | null;
  showFilters?: boolean;
}

export const SectionList: React.FC<SectionListProps> = ({
  sections,
  loading = false,
  calculationProgress,
  showFilters = false
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'exposure' | 'level' | 'price'>(() => {
    return preferencesStorage.get('sortBy', 'exposure');
  });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    return preferencesStorage.get('sortOrder', 'desc');
  });
  const [viewMode, setViewMode] = useState<'quick' | 'detailed'>(() => {
    return preferencesStorage.get('sectionViewMode', 'quick');
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [containerHeight, setContainerHeight] = useState<number>(600);
  const [filters, setFilters] = useState<SectionFilterValues>({
    shadeLevel: [],
    sectionType: [],
    priceRange: []
  });
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const haptic = useHapticFeedback();
  const sectionListRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 150); // 150ms delay for faster response

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Calculate container height based on viewport
  const calculateContainerHeight = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const topOffset = rect.top;
      // Use remaining viewport height minus some padding
      const calculatedHeight = Math.max(400, viewportHeight - topOffset - 100);
      setContainerHeight(calculatedHeight);
    }
  }, []);

  // Update container height on mount and resize
  useEffect(() => {
    calculateContainerHeight();
    window.addEventListener('resize', calculateContainerHeight);
    return () => window.removeEventListener('resize', calculateContainerHeight);
  }, [calculateContainerHeight]);

  // Improve scroll performance with passive event listeners
  useEffect(() => {
    const element = sectionListRef.current;
    if (!element) return;

    // Add passive listeners for better touch performance
    const options = { passive: true };
    
    // These listeners are added as passive to improve scrolling performance
    // They don't need to prevent default behavior
    const handleWheel = () => {};
    const handleTouchStart = () => {};
    const handleTouchMove = () => {};

    element.addEventListener('wheel', handleWheel, options);
    element.addEventListener('touchstart', handleTouchStart, options);
    element.addEventListener('touchmove', handleTouchMove, options);

    return () => {
      element.removeEventListener('wheel', handleWheel);
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const getSunExposureColor = (exposure: number): string => {
    if (exposure === 0) return '#6c757d'; // Gray for no sun
    if (exposure < 25) return '#28a745'; // Green for low sun
    if (exposure < 50) return '#ffc107'; // Yellow for medium sun
    if (exposure < 75) return '#fd7e14'; // Orange for high sun
    return '#dc3545'; // Red for very high sun
  };

  const getSunExposureIcon = (exposure: number) => {
    if (exposure === 0) return <CloudIcon size={20} />;
    if (exposure < 25) return <PartlyCloudyIcon size={20} />;
    if (exposure < 50) return <SunIcon size={20} color="#f59e0b" />;
    if (exposure < 75) return <SunIcon size={20} color="#f97316" />;
    return <FireIcon size={20} color="#dc2626" />;
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'field': return <FieldLevelIcon size={20} />;
      case 'lower': return <LowerLevelIcon size={20} />;
      case 'club': return <ClubLevelIcon size={20} />;
      case 'upper': return <UpperLevelIcon size={20} />;
      case 'suite': return <CrownIcon size={20} />;
      default: return <StadiumIcon size={20} />;
    }
  };

  const getPriceIcon = (price?: string) => {
    switch (price) {
      case 'value': return <ValuePriceIcon size={20} />;
      case 'moderate': return <ModeratePriceIcon size={20} />;
      case 'premium': return <PremiumPriceIcon size={20} />;
      case 'luxury': return <LuxuryPriceIcon size={20} />;
      default: return <MoneyIcon size={20} />;
    }
  };

  // Filter sections based on debounced search term and filters
  const filteredSections = useMemo(() => {
    return sections.filter(sectionData => {
      const section = sectionData.section;
      
      // Text search filter
      if (debouncedSearchTerm) {
        const term = debouncedSearchTerm.toLowerCase();
        const matchesSearch = 
          section.name.toLowerCase().includes(term) ||
          section.id.toLowerCase().includes(term) ||
          section.level.toLowerCase().includes(term) ||
          (section.price && section.price.toLowerCase().includes(term));
        
        if (!matchesSearch) return false;
      }
      
      // Shade level filter
      if (filters.shadeLevel.length > 0) {
        const exposure = sectionData.sunExposure;
        let matchesShade = false;
        
        for (const level of filters.shadeLevel) {
          switch (level) {
            case 'fully-shaded':
              if (exposure === 0) matchesShade = true;
              break;
            case 'mostly-shaded':
              if (exposure > 0 && exposure <= 25) matchesShade = true;
              break;
            case 'partial-shade':
              if (exposure > 25 && exposure <= 75) matchesShade = true;
              break;
            case 'mostly-sunny':
              if (exposure > 75 && exposure < 100) matchesShade = true;
              break;
            case 'full-sun':
              if (exposure === 100) matchesShade = true;
              break;
          }
        }
        
        if (!matchesShade) return false;
      }
      
      // Section type filter
      if (filters.sectionType.length > 0) {
        let matchesType = false;
        
        for (const type of filters.sectionType) {
          if (type === 'covered' && section.covered) {
            matchesType = true;
          } else if (type === section.level) {
            matchesType = true;
          }
        }
        
        if (!matchesType) return false;
      }
      
      // Price range filter
      if (filters.priceRange.length > 0) {
        if (!section.price || !filters.priceRange.includes(section.price)) {
          return false;
        }
      }
      
      return true;
    });
  }, [sections, debouncedSearchTerm, filters]);

  const sortedSections = useMemo(() => {
    return [...filteredSections].sort((a, b) => {
    let aValue: any, bValue: any;
    
    switch (sortBy) {
      case 'name':
        aValue = a.section.name;
        bValue = b.section.name;
        break;
      case 'exposure':
        aValue = a.sunExposure;
        bValue = b.sunExposure;
        break;
      case 'level':
        aValue = a.section.level;
        bValue = b.section.level;
        break;
      case 'price':
        const priceOrder = { value: 1, moderate: 2, premium: 3, luxury: 4 };
        aValue = priceOrder[a.section.price || 'moderate'];
        bValue = priceOrder[b.section.price || 'moderate'];
        break;
      default:
        return 0;
    }
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortOrder === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    return sortOrder === 'asc' 
      ? aValue - bValue
      : bValue - aValue;
    });
  }, [filteredSections, sortBy, sortOrder]);

  const handleSort = (newSortBy: 'name' | 'exposure' | 'level' | 'price') => {
    haptic.light();
    let newSortOrder: 'asc' | 'desc';

    if (sortBy === newSortBy) {
      newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      newSortOrder = 'desc';
    }

    setSortBy(newSortBy);
    setSortOrder(newSortOrder);

    // Save sorting preferences to localStorage
    preferencesStorage.update('sortBy', newSortBy);
    preferencesStorage.update('sortOrder', newSortOrder);
  };

  const handleViewModeChange = (newViewMode: 'quick' | 'detailed') => {
    haptic.medium();
    setViewMode(newViewMode);
    preferencesStorage.update('sectionViewMode', newViewMode);
  };

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const sunnyCount = filteredSections.filter(s => s.inSun).length;
  const shadyCount = filteredSections.length - sunnyCount;

  if (loading) {
    return (
      <div className="section-list loading">
        <LoadingSpinner 
          size="medium" 
          message={
            calculationProgress 
              ? `Calculating sun exposure... ${calculationProgress.completed}/${calculationProgress.total} sections`
              : "Calculating sun exposure for all sections..."
          }
        />
      </div>
    );
  }

  return (
    <div className="section-list" role="region" aria-label="Stadium sections list" ref={sectionListRef}>
      <div className="section-list-header">
        <div className="list-title">
          <h3 id="sections-title"><ListIcon size={20} /> Stadium Sections</h3>
          <div className="section-summary" aria-live="polite">
            <span className="summary-item sunny">
              <SunIcon size={16} /> {sunnyCount} sunny
            </span>
            <span className="summary-item shady">
              <CloudIcon size={16} /> {shadyCount} shaded
            </span>
            {(debouncedSearchTerm || filters.shadeLevel.length > 0 || filters.sectionType.length > 0 || filters.priceRange.length > 0) && (
              <span className="summary-item search-results">
                <SearchIcon size={16} /> {filteredSections.length} of {sections.length} shown
              </span>
            )}
          </div>
          <div className="exposure-info">
            <Tooltip content="Percentage shows how much time during the game this section will be in direct sunlight. For example, 50% means sun for about 1.5 hours of a 3-hour game.">
              <span className="info-text">
                <span className="info-icon">ℹ</span> What do the percentages mean?
              </span>
            </Tooltip>
          </div>
        </div>
        
        {showFilters && (
          <SectionFilters
            filters={filters}
            onChange={setFilters}
            isExpanded={filtersExpanded}
            onToggleExpand={() => setFiltersExpanded(!filtersExpanded)}
          />
        )}
        
        <div className="search-and-sort">
          <div className="search-section">
            <label htmlFor="section-search" className="search-label">
              <SearchIcon size={16} /> Search sections:
            </label>
            <input
              id="section-search"
              type="text"
              className="search-input"
              placeholder="Search by name, level, or price..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search stadium sections"
            />
            {searchTerm && (
              <button
                className="search-clear-btn"
                onClick={() => {
                  haptic.light();
                  setSearchTerm('');
                }}
                onKeyDown={(e) => handleKeyDown(e, () => setSearchTerm(''))}
                aria-label="Clear search"
                title="Clear search"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="view-mode-controls" role="toolbar" aria-label="View mode options">
            <span className="sort-label" id="view-mode-label">View:</span>
            <button
              className={`sort-btn ${viewMode === 'quick' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('quick')}
              onKeyDown={(e) => handleKeyDown(e, () => handleViewModeChange('quick'))}
              aria-label="Quick view - show essential information only"
              aria-pressed={viewMode === 'quick'}
              title="Quick View - Essential info only"
            >
              <ListIcon size={16} /> Quick
            </button>
            <button
              className={`sort-btn ${viewMode === 'detailed' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('detailed')}
              onKeyDown={(e) => handleKeyDown(e, () => handleViewModeChange('detailed'))}
              aria-label="Detailed view - show all information"
              aria-pressed={viewMode === 'detailed'}
              title="Detailed View - All info"
            >
              <StadiumIcon size={16} /> Detailed
            </button>
          </div>

          <div className="sort-controls" role="toolbar" aria-label="Section sorting options">
            <span className="sort-label" id="sort-label">Sort by:</span>
            <button
              className={`sort-btn ${sortBy === 'exposure' ? 'active' : ''}`}
              onClick={() => handleSort('exposure')}
              onKeyDown={(e) => handleKeyDown(e, () => handleSort('exposure'))}
              aria-label={`Sort by sun exposure ${sortBy === 'exposure' ? (sortOrder === 'desc' ? 'descending' : 'ascending') : ''}`}
              aria-pressed={sortBy === 'exposure'}
            >
              Sun {sortBy === 'exposure' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              className={`sort-btn ${sortBy === 'name' ? 'active' : ''}`}
              onClick={() => handleSort('name')}
              onKeyDown={(e) => handleKeyDown(e, () => handleSort('name'))}
              aria-label={`Sort by section name ${sortBy === 'name' ? (sortOrder === 'desc' ? 'descending' : 'ascending') : ''}`}
              aria-pressed={sortBy === 'name'}
            >
              Name {sortBy === 'name' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              className={`sort-btn ${sortBy === 'level' ? 'active' : ''}`}
              onClick={() => handleSort('level')}
              onKeyDown={(e) => handleKeyDown(e, () => handleSort('level'))}
              aria-label={`Sort by seating level ${sortBy === 'level' ? (sortOrder === 'desc' ? 'descending' : 'ascending') : ''}`}
              aria-pressed={sortBy === 'level'}
            >
              Level {sortBy === 'level' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
            <button
              className={`sort-btn ${sortBy === 'price' ? 'active' : ''}`}
              onClick={() => handleSort('price')}
              onKeyDown={(e) => handleKeyDown(e, () => handleSort('price'))}
              aria-label={`Sort by price range ${sortBy === 'price' ? (sortOrder === 'desc' ? 'descending' : 'ascending') : ''}`}
              aria-pressed={sortBy === 'price'}
            >
              Price {sortBy === 'price' && (sortOrder === 'desc' ? '↓' : '↑')}
            </button>
          </div>
        </div>
      </div>

      {filteredSections.length === 0 ? (
        <div className="no-sections" role="status" aria-live="polite">
          {debouncedSearchTerm ? (
            <>
              <p>No sections found matching "{debouncedSearchTerm}".</p>
              <p>Try a different search term or clear the search to see all sections.</p>
            </>
          ) : (
            <>
              <p>No sections match your filter criteria.</p>
              <p>Try adjusting your filters to see more results.</p>
            </>
          )}
        </div>
      ) : (
        <div className="section-list-container" role="list" aria-labelledby="sections-title" ref={containerRef}>
          {sortedSections.length > 15 ? (
            // Use virtual scrolling for large lists
            <VirtualSectionList
              sections={sortedSections}
              height={containerHeight}
              itemHeight={260}
              width="100%"
              defaultExpanded={viewMode === 'detailed'}
            />
          ) : (
            // Use regular rendering for small lists
            <div className="section-grid">
              {sortedSections.map((sectionData, index) => (
                <LazySectionCard
                  key={`${sectionData.section.id}-${index}`}
                  section={sectionData.section}
                  sunExposure={sectionData.sunExposure}
                  inSun={sectionData.inSun}
                  index={index}
                  timeInSun={sectionData.timeInSun}
                  defaultExpanded={viewMode === 'detailed'}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Memoize SectionList to prevent unnecessary re-renders
export default React.memo(SectionList);