import React, { useState, useEffect } from 'react';
import { SeatingSectionSun } from '../utils/sunCalculations';
import { preferencesStorage } from '../utils/preferences';
import { Tooltip } from './Tooltip';
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

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

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
    <div className="section-list" role="region" aria-label="Stadium sections list">
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
                onClick={() => setSearchTerm('')}
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
        <div className="sections-grid" role="list" aria-labelledby="sections-title">
          {sortedSections.map((sectionData, index) => {
            const { section, sunExposure, inSun } = sectionData;
            
            return (
              <div 
                key={`${section.id}-${index}`}
                className={`section-card ${inSun ? 'sunny' : 'shady'} ${section.covered ? 'covered' : ''}`}
                role="listitem"
                tabIndex={0}
                aria-label={`Section ${section.name}, ${Math.round(sunExposure)}% sun exposure, ${section.level} level${section.covered ? ', covered' : ''}`}
              >
                <div className="section-header">
                  <h4 className="section-name">{section.name}</h4>
                  <div className="section-badges">
                    {section.covered && (
                      <span className="badge covered-badge" aria-label="Covered section">🏛️ Covered</span>
                    )}
                    <span className={`badge level-badge level-${section.level}`} aria-label={`${section.level} level seating`}>
                      {getLevelIcon(section.level)} {section.level}
                    </span>
                  </div>
                </div>
                
                <div className="section-details">
                  <div className="sun-exposure">
                    <div className="exposure-bar-container">
                      <div className="exposure-label">
                        <span className="exposure-icon" aria-hidden="true">
                          {getSunExposureIcon(sunExposure)}
                        </span>
                        <span className="exposure-text">
                          <Tooltip content="The percentage of time this section receives direct sunlight during the game, considering weather conditions">
                            <span>{Math.round(sunExposure)}% sun exposure</span>
                          </Tooltip>
                          {sunExposure < 90 && inSun && (
                            <Tooltip content="Weather conditions are reducing the sun exposure for this section">
                              <span className="weather-adjusted" aria-label="Weather-adjusted sun exposure">
                                🌤️
                              </span>
                            </Tooltip>
                          )}
                        </span>
                      </div>
                      <div className="exposure-bar" role="progressbar" aria-valuenow={sunExposure} aria-valuemin={0} aria-valuemax={100} aria-label={`${Math.round(sunExposure)}% sun exposure`}>
                        <div 
                          className="exposure-fill"
                          style={{ 
                            width: `${sunExposure}%`,
                            backgroundColor: getSunExposureColor(sunExposure)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="section-meta">
                    {section.price && (
                      <span className={`price-indicator price-${section.price}`} aria-label={`${section.price} price range`}>
                        <span aria-hidden="true">{getPriceIcon(section.price)}</span> {section.price}
                      </span>
                    )}
                    
                    <Tooltip content="The compass direction range this section faces (0° = North, 90° = East, 180° = South, 270° = West). This helps determine sun exposure timing.">
                      <span className="angle-info" aria-label={`Angle range from ${Math.round(section.baseAngle)} to ${Math.round(section.baseAngle + section.angleSpan)} degrees`}>
                        <span aria-hidden="true">📐</span> {Math.round(section.baseAngle)}°-{Math.round(section.baseAngle + section.angleSpan)}°
                      </span>
                    </Tooltip>
                  </div>
                  
                  {section.rows && (
                    <div className="row-count" aria-label={`Approximately ${section.rows} rows`}>
                      <span aria-hidden="true">🪑</span> ~{section.rows} rows
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};