import React, { useState, useEffect, useRef, useMemo } from 'react';
import { SeatingSectionSun } from '../utils/sunCalculations';
import { preferencesStorage } from '../utils/preferences';
import { Tooltip } from './Tooltip';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import { LazySectionCard } from './LazySectionCard';
import { VirtualSectionList } from './VirtualSectionList';
import { ListIcon, SearchIcon, SunIcon, CloudIcon, CloseIcon, BaseballIcon, TicketIcon, CrownIcon, StadiumIcon, FieldLevelIcon, LowerLevelIcon, ClubLevelIcon, UpperLevelIcon, ValuePriceIcon, ModeratePriceIcon, PremiumPriceIcon, LuxuryPriceIcon, MoneyIcon, PartlyCloudyIcon, FireIcon } from './Icons';
import { LoadingSpinner } from './LoadingSpinner';
import './SectionList.css';

interface SectionListProps {
  sections: SeatingSectionSun[];
  loading?: boolean;
  calculationProgress?: { completed: number; total: number } | null;
}

export const SectionList: React.FC<SectionListProps> = ({
  sections,
  loading = false,
  calculationProgress
}) => {
  const [sortBy, setSortBy] = useState<'name' | 'exposure' | 'level' | 'price'>(() => {
    return preferencesStorage.get('sortBy', 'exposure');
  });
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(() => {
    return preferencesStorage.get('sortOrder', 'desc');
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>('');
  const haptic = useHapticFeedback();
  const sectionListRef = useRef<HTMLDivElement>(null);

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

  // Filter sections based on debounced search term
  const filteredSections = useMemo(() => {
    return sections.filter(sectionData => {
      if (!debouncedSearchTerm) return true;
      
      const term = debouncedSearchTerm.toLowerCase();
      const section = sectionData.section;
      
      return (
        section.name.toLowerCase().includes(term) ||
        section.id.toLowerCase().includes(term) ||
        section.level.toLowerCase().includes(term) ||
        (section.price && section.price.toLowerCase().includes(term))
      );
    });
  }, [sections, debouncedSearchTerm]);

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
            {debouncedSearchTerm && (
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
      ) : (
        <div className="section-list-container" role="list" aria-labelledby="sections-title">
          {sortedSections.length > 20 ? (
            // Use virtual scrolling for large lists
            <VirtualSectionList
              sections={sortedSections}
              height={600}
              itemHeight={260}
              width="100%"
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