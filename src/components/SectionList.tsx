import React, { useState, useEffect, useRef } from 'react';
import { SeatingSectionSun } from '../utils/sunCalculations';
import { preferencesStorage } from '../utils/preferences';
import { Tooltip } from './Tooltip';
import { useHapticFeedback } from '../hooks/useHapticFeedback';
import './SectionList.css';

interface SectionListProps {
  sections: SeatingSectionSun[];
  loading?: boolean;
}

export const SectionList: React.FC<SectionListProps> = ({
  sections,
  loading = false
}) => {
  console.log('SectionList rendering with sections:', sections.length);
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
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Improve scroll performance with passive event listeners
  useEffect(() => {
    const element = sectionListRef.current;
    if (!element) return;

    const handleTouchStart = () => {
      // Passive listener - no preventDefault
    };

    const handleTouchMove = () => {
      // Passive listener - no preventDefault  
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
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

  const getSunExposureIcon = (exposure: number): string => {
    if (exposure === 0) return '🌫️';
    if (exposure < 25) return '⛅';
    if (exposure < 50) return '🌤️';
    if (exposure < 75) return '☀️';
    return '🔥';
  };

  const getLevelIcon = (level: string): string => {
    switch (level) {
      case 'field': return '⚾';
      case 'lower': return '🎫';
      case 'club': return '🥂';
      case 'upper': return '🎪';
      case 'suite': return '👑';
      default: return '🏟️';
    }
  };

  const getPriceIcon = (price?: string): string => {
    switch (price) {
      case 'value': return '💵';
      case 'moderate': return '💶';
      case 'premium': return '💷';
      case 'luxury': return '💎';
      default: return '💰';
    }
  };

  // Filter sections based on debounced search term
  const filteredSections = sections.filter(sectionData => {
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

  const sortedSections = [...filteredSections].sort((a, b) => {
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
        <div className="loading-spinner" role="status" aria-live="polite">
          <div className="spinner"></div>
          <p>Calculating sun exposure for all sections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-list" role="region" aria-label="Stadium sections list" ref={sectionListRef}>
      <div className="section-list-header">
        <div className="list-title">
          <h3 id="sections-title">📋 Stadium Sections</h3>
          <div className="section-summary" aria-live="polite">
            <span className="summary-item sunny">
              ☀️ {sunnyCount} sunny
            </span>
            <span className="summary-item shady">
              🌫️ {shadyCount} shaded
            </span>
            {debouncedSearchTerm && (
              <span className="summary-item search-results">
                🔍 {filteredSections.length} of {sections.length} shown
              </span>
            )}
          </div>
        </div>
        
        <div className="search-and-sort">
          <div className="search-section">
            <label htmlFor="section-search" className="search-label">
              🔍 Search sections:
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
                ✕
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
        <div className="section-grid" role="list" aria-labelledby="sections-title">
          {sortedSections.map((sectionData, index) => {
            const { section, sunExposure, inSun } = sectionData;
            const roundedExposure = Math.round(sunExposure);
            
            return (
              <div 
                key={`${section.id}-${index}`}
                className="section-card"
                data-exposure={roundedExposure}
                data-section={section.id}
                role="listitem"
                tabIndex={0}
                aria-label={`Section ${section.name}, ${roundedExposure}% sun exposure, ${section.level} level${section.covered ? ', covered' : ''}`}
              >
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};