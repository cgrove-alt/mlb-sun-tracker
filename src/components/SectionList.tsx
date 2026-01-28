import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { SeatingSectionSun } from '../utils/sunCalculations';
import { preferencesStorage } from '../utils/preferences';
import { Tooltip } from './Tooltip';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { LazySectionCardModern as LazySectionCard } from './LazySectionCardModern';
import { ListIcon, SearchIcon, SunIcon, CloudIcon, CloseIcon, BaseballIcon, TicketIcon, CrownIcon, StadiumIcon, FieldLevelIcon, LowerLevelIcon, ClubLevelIcon, UpperLevelIcon, ValuePriceIcon, ModeratePriceIcon, PremiumPriceIcon, LuxuryPriceIcon, MoneyIcon, PartlyCloudyIcon, FireIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';
import SectionFilters, { SectionFilterValues } from './SectionFilters/SectionFilters';
import { SectionComparison } from './SectionComparison/SectionComparison';
import type { SectionShadowData } from '../utils/sunCalculator';
import VirtualScroll from './VirtualScroll';
import './SectionList.css';

interface SectionListProps {
  sections: SeatingSectionSun[];
  loading?: boolean;
  calculationProgress?: { completed: number; total: number } | null;
  showFilters?: boolean;
  rowData?: SectionShadowData[] | null;
  showRowToggle?: boolean;
  stadiumId?: string;
  worldCupMatchCount?: number;
  worldCupCountry?: 'USA' | 'Mexico' | 'Canada';
  /** ID of section to highlight (for diagram sync) */
  highlightedSectionId?: string | null;
  /** Callback when a section card is selected */
  onSectionSelect?: (sectionId: string) => void;
}

export const SectionList: React.FC<SectionListProps> = ({
  sections,
  loading = false,
  calculationProgress,
  showFilters = false,
  rowData = null,
  showRowToggle = false,
  stadiumId,
  worldCupMatchCount,
  worldCupCountry,
  highlightedSectionId = null,
  onSectionSelect,
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'exposure' | 'level' | 'price'>(() => {
    return preferencesStorage.get('sortBy', 'exposure');
  });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    return preferencesStorage.get('sortOrder', 'desc');
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<SectionFilterValues>(() => {
    // Initialize filters from URL params
    if (typeof window === 'undefined') {
      return {
        maxSunExposure: undefined,
        sectionType: [],
        priceRange: []
      };
    }

    const params = new URLSearchParams(window.location.search);
    const maxSunParam = params.get('maxSun');
    const sectionTypeParam = params.get('sectionType');
    const priceRangeParam = params.get('priceRange');

    return {
      maxSunExposure: maxSunParam ? parseInt(maxSunParam) : undefined,
      sectionType: sectionTypeParam ? sectionTypeParam.split(',').filter(Boolean) : [],
      priceRange: priceRangeParam ? priceRangeParam.split(',').filter(Boolean) : []
    };
  });
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [showRowLevel, setShowRowLevel] = useState(false);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [selectedSections, setSelectedSections] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);
  const haptic = useHapticFeedback();
  const sectionListRef = useRef<HTMLDivElement>(null);

  // Initialize comparison mode from URL params
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const compareSections = params.get('compare');

    if (compareSections) {
      const sectionIds = compareSections.split(',').filter(Boolean);
      if (sectionIds.length > 0) {
        setSelectedSections(new Set(sectionIds));
        setComparisonMode(true);
        setShowComparison(true);
      }
    }
  }, []);

  // Update URL when comparison selections change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);

    if (selectedSections.size > 0 && comparisonMode) {
      params.set('compare', Array.from(selectedSections).join(','));
    } else {
      params.delete('compare');
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
  }, [selectedSections, comparisonMode]);

  // Update URL when filters change
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);

    // Preserve comparison params
    const compareParam = params.get('compare');

    // Clear all filter params first
    params.delete('maxSun');
    params.delete('sectionType');
    params.delete('priceRange');

    // Add filter params if they have values
    if (filters.maxSunExposure !== undefined && filters.maxSunExposure !== 100) {
      params.set('maxSun', filters.maxSunExposure.toString());
    }

    if (filters.sectionType.length > 0) {
      params.set('sectionType', filters.sectionType.join(','));
    }

    if (filters.priceRange.length > 0) {
      params.set('priceRange', filters.priceRange.join(','));
    }

    // Restore comparison params
    if (compareParam && comparisonMode) {
      params.set('compare', compareParam);
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;

    window.history.replaceState({}, '', newUrl);
  }, [filters, comparisonMode]);

  // Helper to find row data for a section
  const getRowDataForSection = useCallback((sectionId: string) => {
    if (!rowData) return undefined;
    const sectionRowData = rowData.find(rd => rd.sectionId === sectionId);
    return sectionRowData?.rows;
  }, [rowData]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 150); // 150ms delay for faster response

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
      // Guard against malformed data - section must exist with valid id
      if (!section || !section.id) return false;
      const exposure = sectionData.sunExposure;

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

      // Sun exposure filter
      if (filters.maxSunExposure !== undefined && filters.maxSunExposure !== 100) {
        if (exposure > filters.maxSunExposure) return false;
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

  const handleKeyDown = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };

  const handleToggleComparisonMode = () => {
    haptic.light();
    setComparisonMode(!comparisonMode);
    if (comparisonMode) {
      // Clear selections when exiting comparison mode
      setSelectedSections(new Set());
      setShowComparison(false);
    }
  };

  const handleToggleSelection = (sectionId: string) => {
    haptic.light();
    setSelectedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        // Limit to 4 sections
        if (newSet.size >= 4) {
          // Remove the oldest selection (first item)
          const firstId = Array.from(newSet)[0];
          newSet.delete(firstId);
        }
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleShowComparison = () => {
    haptic.light();
    setShowComparison(true);
  };

  const handleCloseComparison = () => {
    haptic.light();
    setShowComparison(false);
  };

  const handleRemoveFromComparison = (sectionId: string) => {
    setSelectedSections(prev => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      // Close comparison if no sections left
      if (newSet.size === 0) {
        setShowComparison(false);
      }
      return newSet;
    });
  };

  const sunnyCount = filteredSections.filter(s => s.inSun).length;
  const shadyCount = filteredSections.length - sunnyCount;

  // Get selected section data for comparison
  const selectedSectionData = useMemo(() => {
    return sections.filter(s => s.section?.id && selectedSections.has(s.section.id));
  }, [sections, selectedSections]);

  // Use virtual scrolling for better performance on mobile with many sections
  const useVirtualScrolling = sortedSections.length > 60;

  // Render a single section card (used by both normal and virtual rendering)
  const renderSectionCard = useCallback((sectionData: SeatingSectionSun, index: number) => {
    // Guard against malformed data
    if (!sectionData.section?.id) return null;
    return (
      <LazySectionCard
        key={`${sectionData.section.id}-${index}`}
        section={sectionData.section}
        sunExposure={sectionData.sunExposure}
        inSun={sectionData.inSun}
        index={index}
        timeInSun={sectionData.timeInSun}
        rowData={showRowLevel ? getRowDataForSection(sectionData.section.id) : undefined}
        stadiumId={stadiumId}
        worldCupMatchCount={worldCupMatchCount}
        worldCupCountry={worldCupCountry}
        comparisonMode={comparisonMode}
        isSelected={selectedSections.has(sectionData.section.id)}
        onToggleSelection={handleToggleSelection}
        showExpandIndicator={true}
        isHighlighted={highlightedSectionId === sectionData.section.id}
        onCardSelect={onSectionSelect}
      />
    );
  }, [showRowLevel, getRowDataForSection, stadiumId, worldCupMatchCount, worldCupCountry, comparisonMode, selectedSections, handleToggleSelection, highlightedSectionId, onSectionSelect]);

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
            {(debouncedSearchTerm || (filters.maxSunExposure !== undefined && filters.maxSunExposure !== 100) || filters.sectionType.length > 0 || filters.priceRange.length > 0) && (
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
        
        {/* Comparison mode toggle */}
        <div className="comparison-mode-bar" style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <button
            onClick={handleToggleComparisonMode}
            className={`px-4 py-2 rounded-lg font-medium transition-all min-h-[44px] ${
              comparisonMode
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={comparisonMode}
            aria-label={comparisonMode ? 'Exit comparison mode' : 'Enter comparison mode'}
          >
            {comparisonMode ? '✓ Comparison Mode' : 'Compare Sections'}
          </button>

          {comparisonMode && (
            <>
              <span className="text-sm text-gray-600">
                {selectedSections.size === 0
                  ? 'Select 2-4 sections to compare'
                  : `${selectedSections.size} section${selectedSections.size > 1 ? 's' : ''} selected (max 4)`}
              </span>
              {selectedSections.size >= 2 && (
                <button
                  onClick={handleShowComparison}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all min-h-[44px]"
                  aria-label="Show section comparison"
                >
                  Compare Now ({selectedSections.size})
                </button>
              )}
              {selectedSections.size > 0 && (
                <button
                  onClick={() => {
                    haptic.light();
                    setSelectedSections(new Set());
                  }}
                  className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors min-h-[44px]"
                  aria-label="Clear all selections"
                >
                  Clear All
                </button>
              )}
            </>
          )}
        </div>

        {/* Row-level toggle */}
        {showRowToggle && rowData && rowData.length > 0 && (
          <div className="row-level-toggle" style={{ padding: '12px 0', borderBottom: '1px solid #e5e7eb' }}>
            <button
              onClick={() => {
                haptic.light();
                setShowRowLevel(!showRowLevel);
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                showRowLevel
                  ? 'bg-accent-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={showRowLevel}
              aria-label={showRowLevel ? 'Switch to section view' : 'Switch to row-level view'}
            >
              {showRowLevel ? 'Viewing Row Details' : 'Show Row Details'}
            </button>
            <span className="ml-3 text-sm text-gray-600">
              {showRowLevel ? 'Expand sections to see row-by-row shade data' : 'Click to enable detailed row-level view'}
            </span>
          </div>
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
      ) : useVirtualScrolling ? (
        <div className="section-list-container" role="list" aria-labelledby="sections-title">
          <VirtualScroll
            items={sortedSections}
            itemHeight={350}
            renderItem={(sectionData, index) => (
              <div className="section-grid-virtual-item">
                {renderSectionCard(sectionData, index)}
              </div>
            )}
            containerHeight={typeof window !== 'undefined' ? Math.min(window.innerHeight - 400, 800) : 600}
            overscan={3}
            getItemKey={(sectionData, index) => `${sectionData.section.id}-${index}`}
            className="section-virtual-scroll"
            style={{ width: '100%' }}
          />
        </div>
      ) : (
        <div className="section-list-container" role="list" aria-labelledby="sections-title">
          <div className="section-grid">
            {sortedSections.map((sectionData, index) => renderSectionCard(sectionData, index))}
          </div>
        </div>
      )}

      {/* Section Comparison Modal */}
      {showComparison && selectedSectionData.length >= 2 && (
        <SectionComparison
          selectedSections={selectedSectionData}
          onClose={handleCloseComparison}
          onRemoveSection={handleRemoveFromComparison}
        />
      )}
    </div>
  );
};

// Memoize SectionList to prevent unnecessary re-renders
export default React.memo(SectionList);